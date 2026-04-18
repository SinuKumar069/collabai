"use client";

import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Task } from "@/types/task";

interface TaskListProps {
  projectId: string;
  isOwner?: boolean;
}

export default function TaskList({
  projectId,
  isOwner = false,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | Task["status"]>("all");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setTasks(data.tasks || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleCreateTask = async (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const statusCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white/5 border border-white/10 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Tasks</h3>
          <p className="text-sm text-gray-400">
            {tasks.length} total • {statusCounts["todo"]} todo
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {showForm ? "Cancel" : "+ Add Task"}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <TaskForm
            projectId={projectId}
            onSuccess={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "todo", "in-progress", "review", "done"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                filter === status
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
              }`}
            >
              {status === "all" ? "All" : status.replace("-", " ")}
              {status !== "all" && (
                <span className="ml-1 text-gray-500">
                  ({statusCounts[status]})
                </span>
              )}
            </button>
          ),
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && !error && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">
            {filter === "all"
              ? "No tasks yet. Create one to get started!"
              : `No ${filter.replace("-", " ")} tasks.`}
          </p>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onUpdate={isOwner ? handleUpdateTask : undefined}
            onDelete={isOwner ? handleDeleteTask : undefined}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
}
