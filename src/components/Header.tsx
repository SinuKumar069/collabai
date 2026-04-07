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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CA</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">CollabAI</span>
                        </Link>
                    </div>

                    <nav className="flex items-center space-x-4">
                        {status === "loading" ? (
                            <span className="text-sm text-gray-500">Loading...</span>
                        ) : session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/projects"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Projects
                                </Link>
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                                    <span className="text-sm text-gray-600">
                                        {session.user?.name || session.user?.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
