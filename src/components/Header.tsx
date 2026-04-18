"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all">
                <span className="text-white font-bold text-xs tracking-tighter">
                  CA
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-50 group-hover:text-blue-400 transition-colors">
                CollabAI
              </span>
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="flex items-center space-x-1">
            {status === "loading" ? (
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-md" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/dashboard"
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors rounded-md hover:bg-slate-800/50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors rounded-md hover:bg-slate-800/50"
                >
                  Projects
                </Link>

                <div className="h-6 w-1px bg-slate-800 mx-2" />

                <div className="flex items-center gap-4 pl-2">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-medium text-slate-200">
                      {session.user?.name || "User"}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Pro Plan
                    </span>
                  </div>

                  {/* User Avatar Placeholder */}
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors border border-slate-800 px-3 py-1.5 rounded-lg hover:border-red-900/30 hover:bg-red-900/10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-bold text-slate-950 bg-slate-50 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105"
                >
                  Get started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
