"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { FiUser, FiMail, FiImage, FiMapPin } from "react-icons/fi";

export default function ProfileForm() {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");
        setPhotoURL(user.photoURL || "");

        try {
          const snapshot = await getDoc(doc(db, "users", user.uid));
          
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data?.address) {
              setCity(data.address.city || "");
              setStreet(data.address.street || "");
              setZipCode(data.address.zipCode || "");
            }
          }
        } catch (err) {
          console.error("Błąd podczas pobierania danych użytkownika:", err);
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      await setDoc(doc(db, "users", user?.uid), {
        address: {
          city: city,
          street: street,
          zipCode: zipCode
        }
      }, { merge: true });

      console.log("Profile updated");
    } catch (e) {
      if (e.code === 'permission-denied') {
        setError("Brak uprawnień do zapisu danych.");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-zinc-600 dark:text-zinc-400">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Profil użytkownika
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Zaktualizuj swoje dane profilowe
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Nazwa wyświetlana
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  disabled={isFetching}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent disabled:opacity-50 disabled:cursor-wait"
                  placeholder="Twoja nazwa"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Adres email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  readOnly
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Adres zdjęcia profilowego
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiImage className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  disabled={isFetching}
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent disabled:opacity-50 disabled:cursor-wait"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
               <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4 flex items-center">
                  <FiMapPin className="mr-2" /> Dane Adresowe
                  {isFetching && <span className="ml-2 text-xs font-normal text-zinc-500">(Pobieranie...)</span>}
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Ulica i numer
                    </label>
                    <input
                      id="street"
                      name="street"
                      type="text"
                      disabled={isFetching}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent disabled:opacity-50 disabled:cursor-wait"
                      placeholder="ul. Sezamkowa 1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Kod pocztowy
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        disabled={isFetching}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent disabled:opacity-50 disabled:cursor-wait"
                        placeholder="00-001"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Miasto
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        disabled={isFetching}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent disabled:opacity-50 disabled:cursor-wait"
                        placeholder="Warszawa"
                      />
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || isFetching}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span>Zapisywanie...</span>
              ) : (
                <>
                  <FiUser className="mr-2 h-5 w-5" />
                  Zapisz zmiany
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}