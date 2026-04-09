import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectModel from "@/models/ProjectModel";
import dbConnect from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        await dbConnect();

        const projects = await ProjectModel.find({
            $or: [
                { owner: session.user.id },
                { members: session.user.id },
            ],
        }) 
            .populate("owner", "name email")
            .populate("members", "name email")
            .sort({ createdAt: -1 });
            
            return NextResponse.json({ success: true, projects }, { status: 200 });
    } catch (error) {
        console.error("Fetch projects error", error);
        return NextResponse.json(
            { success: false , message: "Failed to fetch projects" },
            { status: 500 },
        );
    }
}


export async function POST(request: Request ) {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        await dbConnect();

        const { name, description, members } = await request.json();

        if(!name || !description) {
            return NextResponse.json(
                { success: false, message: "Name and description are required"},
                { status: 400 }
            );
        }

        const project = await ProjectModel.create({
            name,
            description,
            owner: session.user.id,
            members: members || [],
        });

        return NextResponse.json(
            { success: true, project},
            { status: 201 }
        );
    } catch (error) {
        console.error("Create project error", error);
        return NextResponse.json(
            { success: false, message: "Failed to create project"},
            { status: 500 },
        )
    }
}