export default function Footer() {
  return (
    <footer className="fixed bottom-0 right-0 left-64 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        © {new Date().getFullYear()} Frontend Laboratory App. All rights reserved.
      </p>
    </footer>
  );
}

