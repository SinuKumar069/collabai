import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TaskModel from "@/models/TaskModel";
import ProjectModel from "@/models/ProjectModel";
import dbConnect from "@/lib/db";

// GET: Fetch single task by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { id } = await params;
        const task = await TaskModel.findById(id)
            .populate("assignee", "name email")
            .populate("createdBy", "name email")
            .populate("project", "name owner members");

        if (!task) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        // Verify access via project
        const project = task.project as any;
        const hasAccess =
            project.owner.toString() === session.user.id ||
            project.members.some((m: any) => m.toString() === session.user.id);

        if (!hasAccess) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, task }, { status: 200 });
    } catch (error) {
        console.error("Fetch task error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

// PUT: Update task
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { id } = await params;
        const task = await TaskModel.findById(id).populate("project");

        if (!task) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        // Verify access via project
        const project = task.project as any;
        const hasAccess =
            project.owner.toString() === session.user.id ||
            project.members.some((m: any) => m.toString() === session.user.id);

        if (!hasAccess) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        const { title, description, status, assignee, priority, dueDate } =
            await request.json();

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { title, description, status, assignee, priority, dueDate },
            { new: true, runValidators: true }
        )
            .populate("assignee", "name email")
            .populate("createdBy", "name email");

        return NextResponse.json(
            { success: true, task: updatedTask },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update task error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update task" },
            { status: 500 }
        );
    }
}

// DELETE: Delete task
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { id } = await params;
        const task = await TaskModel.findById(id).populate("project");

        if (!task) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        // Verify access via project
        const project = task.project as any;
        const hasAccess =
            project.owner.toString() === session.user.id ||
            project.members.some((m: any) => m.toString() === session.user.id);

        if (!hasAccess) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        await TaskModel.findByIdAndDelete(id);

        return NextResponse.json(
            { success: true, message: "Task deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete task error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete task" },
            { status: 500 }
        );
    }
}