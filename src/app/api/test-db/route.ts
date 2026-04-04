import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    console.log("🔍 Testing database connection...");
    await dbConnect();
    
    return NextResponse.json(
      { 
        success: true, 
        message: "✓ Connected to MongoDB",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("✗ Database connection test failed:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to connect to MongoDB",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}