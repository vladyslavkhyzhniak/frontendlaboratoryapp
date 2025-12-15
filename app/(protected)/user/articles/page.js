"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { FiFileText, FiCalendar, FiAlertCircle } from "react-icons/fi";

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!user) return;

      try {
        setLoading(true);
        

        const articlesRef = collection(db, "articles");

        const currentUserRef = doc(db, "users", user.uid);

        const q = query(
          articlesRef, 
          where("user", "==", currentUserRef)
        );


        const querySnapshot = await getDocs(q);

        const articlesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArticles(articlesData);
      } catch (err) {
        console.error("Błąd pobierania artykułów:", err);
        setError("Nie udało się pobrać artykułów. Sprawdź konsolę i reguły bezpieczeństwa.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
        Musisz być zalogowany, aby zobaczyć swoje artykuły.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Moje Artykuły
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Lista artykułów przypisanych do Twojego konta (na podstawie pola 'user').
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-zinc-500 animate-pulse">Ładowanie artykułów...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center text-red-700 dark:text-red-200">
          <FiAlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
          <FiFileText className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">Brak artykułów</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Nie znaleziono artykułów powiązanych z Twoim kontem.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                {article.title || "Bez tytułu"}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-3">
                {article.content || "Brak treści..."}
              </p>
              
              <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-700">
                <FiCalendar className="mr-2" />
                {article.date?.seconds 
                  ? new Date(article.date.seconds * 1000).toLocaleDateString() 
                  : "Data nieznana"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}