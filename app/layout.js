import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Frontend Laboratory App",
  description: "Frontend Laboratory Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-16 pb-16 px-6 overflow-y-auto">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
