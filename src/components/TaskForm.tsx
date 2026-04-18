"use client";

import { useState } from "react";
import { Task } from "@/types/task";

interface TaskFormProps {
  projectId: string;
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
  initialData?: Partial<Task>;
  isEditing?: boolean;
}

export default function TaskForm({
  projectId,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
}: TaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    assignee: initialData?.assignee?._id || "",
    priority: initialData?.priority || ("medium" as Task["priority"]),
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/tasks/${initialData?._id}` : "/api/tasks";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          project: projectId,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save task");
      }

      onSuccess?.(data.task);

      // Reset form if creating new
      if (!isEditing) {
        setFormData({
          title: "",
          description: "",
          assignee: "",
          priority: "medium",
          dueDate: "",
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Design homepage mockup"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="What needs to be done?"
        />
      </div>

      {/* Assignee & Priority Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Assign To
          </label>
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) =>
              setFormData({ ...formData, assignee: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="User ID or email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as Task["priority"],
              })
            }
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#020617] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Task"
              : "Create Task"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
