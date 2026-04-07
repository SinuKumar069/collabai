import { NextResponse } from "next/server";
import User from "@/models/User"
import dbConnect from "@/lib/db";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password, name } = await request.json();

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if(existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists"},
                { status: 400 }
            );
        } 

        const user = await User.create({
            email: email.toLowerCase(),
            password,
            name,
        });

        return NextResponse.json(
            { success: true, userId: user._id.toString() },
            { status: 201 } 
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, message: "Registration failed"},
            { status: 500 }
        );
    }
}
