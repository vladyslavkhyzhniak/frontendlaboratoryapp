"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "@/lib/AuthContext";

export default function VerifyEmail() {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || "");
      signOut(getAuth());
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Weryfikacja adresu email
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Email nie został zweryfikowany. Zweryfikuj klikając na link w wiadomości email wysłanej na adres{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">
              {userEmail || user?.email}
            </span>
          </p>
        </div>
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Sprawdź swoją skrzynkę pocztową i kliknij w link weryfikacyjny. Po weryfikacji będziesz mógł się zalogować.
          </p>
        </div>
      </div>
    </div>
  );
}

