"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/auth/dashboard");
    }
  }, [status, router]);

  if (status === "authenticated") return null;

  return (
    <div className="bg-[#020617] text-slate-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent -z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            COLLABAI v1.0 IS LIVE
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] max-w-4xl mx-auto">
            Next-gen Collaboration, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-700">
              Accelerated by AI.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            The intelligent workspace where teams ship software faster.
            Real-time project management meets AI-driven insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-slate-50 text-slate-950 rounded-full font-bold text-lg hover:bg-blue-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Start Building Free
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-slate-900 border border-slate-800 text-slate-50 rounded-full font-bold text-lg hover:bg-slate-800 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 border-t border-slate-900/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-600/20 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-50">
                AI-Powered Insights
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Get intelligent summaries of team progress and predictive
                blockers powered by GPT-4 integration.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-600/20 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-50">
                Real-Time Sync
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Socket-driven updates ensure your team stays aligned without a
                single page refresh.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-600/20 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-50">
                Analytics Forge
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Beautiful, data-driven dashboards with Redis-cached performance
                for instant project health checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto rounded-[40px] p-12 bg-gradient-to-b from-slate-900 to-[#020617] border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to orchestrate?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join the elite teams building the next big thing with CollabAI. Free
            for teams up to 5 members.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]"
          >
            Create Your Workspace
          </Link>
        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="py-12 border-t border-slate-900 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg" />
            <span className="font-bold tracking-tight text-slate-200">
              CollabAI
            </span>
          </div>
          <p className="text-slate-600 text-sm italic font-mono">
            // Built for the future of engineering.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <Link href="#" className="hover:text-slate-200">
              Docs
            </Link>
            <Link href="#" className="hover:text-slate-200">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-200">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
