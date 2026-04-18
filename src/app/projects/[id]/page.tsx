"use client";

import TaskList from "@/components/TaskList";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee?: { name: string; email: string };
  createdBy: { name: string; email: string };
  dueDate?: string;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  owner: { name: string; email: string };
  members: { name: string; email: string }[];
  createdAt: string;
}

interface CreateTaskData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee?: string;
}

export default function ProjectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/tasks?ProjectId=${projectId}`),
      ]);

      const projectData = await projectRes.json();
      const tasksData = await tasksRes.json();

      if (projectRes.ok) {
        setProject(projectData.project);
      } else {
        setError(projectData.message || "Failed to fetch project");
      }

      if (tasksRes.ok) {
        setTasks(tasksData.tasks);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated" && projectId) {
      fetchData();
    }
  }, [status, router, projectId, fetchData]);

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        router.push("/auth/dashboard");
      } else {
        setError(data.message || "Failed to delete project");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.filter((t) => t._id !== taskId));
      } else {
        setError(data.message || "Failed to delete task");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "review":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "done":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-slate-400 bg-slate-500/10";
      case "medium":
        return "text-blue-400 bg-blue-500/10";
      case "high":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-slate-400";
    }
  };

  const filteredTasks = filterStatus === "all"
    ? tasks
    : tasks.filter((t) => t.status === filterStatus);

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link
              href="/auth/dashboard"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-50">{project?.name}</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">{project?.description}</p>
          <div className="flex items-center gap-2 pt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                project?.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : project?.status === "completed"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}
            >
              {project?.status}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Created {project ? new Date(project.createdAt).toLocaleDateString() : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateTask(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-950 bg-slate-50 rounded-full hover:bg-blue-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
          {project?.owner.email === session?.user?.email && (
            <button
              onClick={handleDeleteProject}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">To Do</p>
          <p className="text-2xl font-bold text-slate-50 mt-1">{tasksByStatus.todo}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{tasksByStatus["in-progress"]}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Review</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{tasksByStatus.review}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Done</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{tasksByStatus.done}</p>
        </div>
      </div>

      {/* Members */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Team Members</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white">
              {project?.owner.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{project?.owner.name}</p>
              <p className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Owner</p>
            </div>
          </div>
          {project?.members.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">{member.name}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Member</p>
              </div>
            </div>
          ))}
          {project?.members.length === 0 && (
            <p className="text-xs text-slate-500 italic">No additional members</p>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            filterStatus === "all"
              ? "text-blue-400 border-blue-500"
              : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilterStatus("todo")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            filterStatus === "todo"
              ? "text-slate-400 border-slate-500"
              : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          To Do ({tasksByStatus.todo})
        </button>
        <button
          onClick={() => setFilterStatus("in-progress")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            filterStatus === "in-progress"
              ? "text-blue-400 border-blue-500"
              : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          In Progress ({tasksByStatus["in-progress"]})
        </button>
        <button
          onClick={() => setFilterStatus("review")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            filterStatus === "review"
              ? "text-purple-400 border-purple-500"
              : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          Review ({tasksByStatus.review})
        </button>
        <button
          onClick={() => setFilterStatus("done")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            filterStatus === "done"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          Done ({tasksByStatus.done})
        </button>
      </div>

      {/* Task List */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-4 text-slate-500">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-50">No tasks yet</h3>
          <p className="text-slate-400 text-sm mt-1">Create your first task to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="group bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-50 truncate">{task.title}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {task.assignee && (
                      <span className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                          {task.assignee.name.charAt(0)}
                        </div>
                        {task.assignee.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value as Task["status"])}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600/50 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowCreateTask(false)}
          onSuccess={(newTask) => {
            setTasks([newTask, ...tasks]);
            setShowCreateTask(false);
          }}
        />
      )}
    </div>
  );
}

// Create Task Modal Component
function CreateTaskModal({
  projectId,
  onClose,
  onSuccess,
}: {
  projectId: string;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.title.length < 3) {
      setError("Task title must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (formData.description.length < 10) {
      setError("Task description must be at least 10 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          project: projectId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.task);
      } else {
        setError(data.message || "Failed to create task");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-50">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Task Title
            </label>
            <input
              required
              type="text"
              placeholder="e.g., Implement user authentication"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Description
            </label>
            <textarea
              required
              placeholder="Describe what needs to be done..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-400 font-bold py-3 rounded-xl hover:bg-slate-800 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-50 text-slate-950 font-bold py-3 rounded-xl hover:bg-blue-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)] text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
