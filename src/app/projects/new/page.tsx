"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.name.length < 3) {
      setError("Project name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (formData.description.length < 10) {
      setError("Project description must be at least 10 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/projects/${data.project._id}`);
      } else {
        setError(data.message || "Failed to create project");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#020617]">
        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          {/* Subtle Logo Branding */}
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] mb-4">
            <span className="text-white font-bold text-sm tracking-tighter">
              CA
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50">
            Create New Project
          </h2>
          <p className="text-slate-400 font-medium">
            Start building something amazing
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Project Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Website Redesign"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Description
                </label>
                <textarea
                  required
                  placeholder="Describe what this project is about..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/auth/dashboard"
                className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 font-bold py-3 rounded-xl hover:bg-slate-800 transition-all text-center text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-50 text-slate-950 font-bold py-3 rounded-xl hover:bg-blue-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
