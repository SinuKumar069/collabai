"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  owner: { name: string; email: string };
  members: { name: string; email: string }[];
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (response.ok) setProjects(data.projects);
      else setError(data.message || "Failed to fetch projects");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "archived":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-900 border border-slate-800 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">
            Dashboard
          </h1>
          <p className="text-slate-400 font-medium">
            Welcome back,{" "}
            <span className="text-blue-400">
              {session?.user?.name || session?.user?.email}
            </span>
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-slate-950 bg-slate-50 rounded-full hover:bg-blue-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          + Create New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-12 h-12 bg-blue-500 rounded-full blur-xl" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Total Projects
          </p>
          <p className="text-3xl font-bold text-slate-50 mt-2">
            {projects.length}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-12 h-12 bg-emerald-500 rounded-full blur-xl" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Active Now
          </p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            {projects.filter((p) => p.status === "active").length}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Projects Logic */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-50">Empty Space</h3>
          <p className="text-slate-400 mt-1 max-w-xs text-center">
            Your innovative ideas haven't started yet. Let's create something
            great.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-50 group-hover:text-blue-400 transition-colors truncate">
                      {project.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
                  {project.description}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-950">
                      {project.owner.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-slate-400 tracking-tight">
                      {project.owner.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 italic">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/projects/${project._id}`}
                className="block w-full py-3 text-center text-xs font-bold text-slate-400 group-hover:text-slate-50 group-hover:bg-blue-600/10 transition-all border-t border-slate-800/50"
              >
                Enter Workspace →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
