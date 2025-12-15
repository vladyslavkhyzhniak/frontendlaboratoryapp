"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const email = e.target["name"].value;
    const password = e.target["password"].value;
    
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            if (returnUrl) {
              router.push(returnUrl);
            } else {
              router.push("/");
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(getErrorMessage(errorCode));
            setLoading(false);
          });
      })
      .catch((error) => {
        setError("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
        setLoading(false);
      });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Nieprawidłowy adres email.";
      case "auth/user-disabled":
        return "Konto użytkownika zostało wyłączone.";
      case "auth/user-not-found":
        return "Nie znaleziono użytkownika z tym adresem email.";
      case "auth/wrong-password":
        return "Nieprawidłowe hasło.";
      case "auth/invalid-credential":
        return "Nieprawidłowe dane logowania.";
      default:
        return "Wystąpił błąd podczas logowania. Spróbuj ponownie.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Zaloguj się
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Lub{" "}
            <Link
              href="/user/register"
              className="font-medium text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              zarejestruj nowe konto
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Adres email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="email"
                  name="name"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                  placeholder="twoj@email.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Hasło
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span>Logowanie...</span>
              ) : (
                <>
                  <FiLogIn className="mr-2 h-5 w-5" />
                  Zaloguj się
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

