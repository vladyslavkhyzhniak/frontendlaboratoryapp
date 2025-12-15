"use client";

import Link from "next/link";
import { FiUser, FiLogIn } from "react-icons/fi";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-end px-6 z-10">
      <nav className="flex items-center gap-4">
        <Link
          href="/user/register"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <FiUser className="w-4 h-4" />
          <span>Register</span>
        </Link>
        <Link
          href="/user/signin"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          <FiLogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      </nav>
    </header>
  );
}

