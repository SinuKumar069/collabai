"use client";

import { useState } from "react";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  isOwner?: boolean;
}

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  isOwner = false,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localTask, setLocalTask] = useState(task);

  const statusColors: Record<string, string> = {
    todo: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    "in-progress": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    review: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    done: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  const priorityColors: Record<string, string> = {
    low: "text-gray-400",
    medium: "text-yellow-400",
    high: "text-red-400",
  };

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (!onUpdate) return;
    try {
      await onUpdate(task._id, { status: newStatus });
      setLocalTask((prev: Task) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm("Delete this task?")) return;
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setIsDeleting(false);
    }
  };

  const isOverdue =
    localTask.dueDate &&
    new Date(localTask.dueDate) < new Date() &&
    localTask.status !== "done";

  return (
    <div className="group relative p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-100 truncate">
            {localTask.title}
          </h4>
          {localTask.assignee && (
            <p className="text-xs text-gray-400 mt-1">
              Assigned to:{" "}
              <span className="text-gray-300">{localTask.assignee.name}</span>
            </p>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${statusColors[localTask.status]}`}
        >
          {localTask.status.replace("-", " ")}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
        {localTask.description}
      </p>

      {/* Meta Row */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <span
            className={`flex items-center gap-1 ${priorityColors[localTask.priority]}`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {localTask.priority}
          </span>

          {/* Due Date */}
          {localTask.dueDate && (
            <span className={isOverdue ? "text-red-400 font-medium" : ""}>
              {isOverdue && "⚠️ "}
              Due: {new Date(localTask.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Created By */}
        {localTask.createdBy && <span>by {localTask.createdBy.name}</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        {/* Status Quick-Change */}
        {onUpdate && (
          <select
            value={localTask.status}
            onChange={(e) =>
              handleStatusChange(e.target.value as Task["status"])
            }
            className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        )}

        {/* Delete Button (Owner Only) */}
        {isOwner && onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-auto px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {/* Hover Edit Indicator */}
      {isOwner && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded"
          >
            ✏️
          </button>
        </div>
      )}
    </div>
  );
}
