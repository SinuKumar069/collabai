import mongoose, { Schema, Document, Model, Types } from "mongoose";


export interface ProjectDocument extends Document {
    name: string;
    description: string;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    status: "active" | "completed" | "archived";
    createdAt: Date;
    updatedAt: Date;
}


const ProjectSchema = new Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            maxLength: [100, "Project name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true,
            maxLength: [1000, "Project description cannot exceed 1000 characters"],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Project owner is required"]
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["active", "completed", "archived"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const ProjectModel: Model<ProjectDocument> =
    mongoose.models.Project || mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default ProjectModel;    