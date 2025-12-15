import Link from "next/link";
import { FiHome, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FiAlertCircle className="w-24 h-24 text-zinc-400 dark:text-zinc-600" />
        </div>
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Strona nie została znaleziona
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          <FiHome className="w-5 h-5" />
          Powrót do strony głównej
        </Link>
      </div>
    </div>
  );
}

