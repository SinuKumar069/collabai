import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectModel from "@/models/ProjectModel";
import dbConnect from "@/lib/db";
import { Types } from "mongoose";

// GET: Fetch single project by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
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

        const project = await ProjectModel.findById(params.id)
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Check if user has access (owner or member)
        const hasAccess =
            project.owner._id.toString() === session.user.id ||
            project.members.some(
                (member: any) => member._id.toString() === session.user.id
            );

        if (!hasAccess) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, project }, { status: 200 });
    } catch (error) {
        console.error("Fetch project error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PUT: Update project
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
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

        const project = await ProjectModel.findById(params.id);

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Only owner can update
        if (project.owner.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Only owner can update this project" },
                { status: 403 }
            );
        }

        const { name, description, status, members } = await request.json();

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            params.id,
            { name, description, status, members },
            { new: true, runValidators: true }
        )
            .populate("owner", "name email")
            .populate("members", "name email");

        return NextResponse.json(
            { success: true, project: updatedProject },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update project error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE: Delete project
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
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

        const project = await ProjectModel.findById(params.id);

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Only owner can delete
        if (project.owner.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Only owner can delete this project" },
                { status: 403 }
            );
        }

        await ProjectModel.findByIdAndDelete(params.id);

        return NextResponse.json(
            { success: true, message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete project" },
            { status: 500 }
        );
    }
}