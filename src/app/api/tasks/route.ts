import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TaskModel from "@/models/TaskModel";
import ProjectModel from "@/models/ProjectModel";
import dbConnect from "@/lib/db";
import { invalidateDashboardStats } from '@/lib/cache'; // ✅ Keep this - cache invalidation stays in handlers

// ✅ GET: Plain handler (rate limiting handled by middleware.ts)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorised" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json(
                { success: false, message: "ProjectId is required" },
                { status: 400 }
            );
        }

        // Verify user has access to the project
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        const hasAccess =
            project.owner.toString() === session.user.id ||
            project.members.some((m: any) => m.toString() === session.user.id);

        if (!hasAccess) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        // Fetch tasks for this project
        const tasks = await TaskModel.find({ project: projectId })
            .populate("assignee", "name email")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, tasks }, { status: 200 });

    } catch (error) {
        console.error("Fetch tasks error", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

// ✅ POST: Plain handler + cache invalidation (rate limiting handled by middleware.ts)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { title, description, project, assignee, priority, dueDate } =
            await request.json();

        // Validate required fields
        if (!title || !description || !project) {
            return NextResponse.json(
                { success: false, message: "title, description, and project are required" },
                { status: 400 }
            );
        }

        // Verify user has access to the project
        const projectDoc = await ProjectModel.findById(project);
        if (!projectDoc) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        const hasAccess =
            projectDoc.owner.toString() === session.user.id ||
            projectDoc.members.some((m: any) => m.toString() === session.user.id);

        if (!hasAccess) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        // Create task
        const task = await TaskModel.create({
            title,
            description,
            project,
            assignee: assignee || null,
            createdBy: session.user.id,
            priority: priority || "medium",
            dueDate: dueDate || null,
        });

        // ✅ Invalidate dashboard cache after successful mutation
        await invalidateDashboardStats(session.user.id);

        const populatedTask = await TaskModel.findById(task._id)
            .populate("assignee", "name email")
            .populate("createdBy", "name email");

        return NextResponse.json(
            { success: true, task: populatedTask },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create task error", error);
        return NextResponse.json(
            { success: false, message: "Failed to create task" },
            { status: 500 }
        );
    }
}