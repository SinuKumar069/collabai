import mongoose, { Schema, Document, Model, Types, mongo } from "mongoose";

export interface TaskDocument extends Document {
    title: string;
    description: string;
    project: Types.ObjectId;
    assignee?: Types.ObjectId;
    createdBy: Types.ObjectId;
    status: "todo" | "in-progress" | "review" | "done";
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<TaskDocument>(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Task description is required"],
            trim: true,
            maxLength: [1000, "Description cannot exceed 1000 characters"],
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project reference is required"],
            index: true,
        },
        assignee: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator reference is required"],
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "review", "done"],
            default: "todo",
            index: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: {
            type: Date,
        },
        createdAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, doc) => {
                const { __v, ...rest } = doc;
                return rest;
            },
        },
    }
);

TaskSchema.index({ project: 1, status: 1 });

TaskSchema.virtual("isOverdue").get(function (this: TaskDocument) {
    if (!this.dueDate || this.status === "done") return false;
    return new Date() > this.dueDate;
})

TaskSchema.methods.markComplete = async function () {
    this.status = "done";
    this.completedAt = new Date();
    return this.save();
};

const TaskModel: Model<TaskDocument> =
    mongoose.models.Task || mongoose.model<TaskDocument>("Task", TaskSchema);


export default TaskModel;