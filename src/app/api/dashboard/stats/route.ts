import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TaskModel from "@/models/TaskModel";
import ProjectModel from "@/models/ProjectModel";
import { getDashboardStats, setDashboardStats } from "@/lib/cache";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" }, { status: 401 },
        );
    }

    const userId = session.user.id;

    const cached = await getDashboardStats(userId);
    if (cached) {
        return NextResponse.json(cached);
    }

    const [totalTasks, completedTasks, activeProjects] = await Promise.all([
        TaskModel.countDocuments({ createdBy: userId }),
        TaskModel.countDocuments({ createdBy: userId, status: "done" }),
        ProjectModel.countDocuments({
            $or: [{ owner: userId }, { members: userId }],
            status: { $ne: "archived" }
        }),
    ]);

    const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    const stats = { totalTasks, completedTasks, completionRate, activeProjects };

    await setDashboardStats(userId, stats);

    return NextResponse.json(stats);
}

