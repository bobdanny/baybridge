import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar"; // Client component
import MobileNav from "@/components/MobileNav"; // Client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Leelaprasad Admin",
  description: "Admin dashboard for Leelaprasad Coffee Ecommerce.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="min-h-screen flex flex-col relative">
          <Sidebar /> {/* Client sidebar */}
          <div className="flex-1 sm:ml-56 flex flex-col">
            <header className="p-4 sm:p-5 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">Baybridge Admin</h1>
             
            </header>

            <main className="p-4 sm:p-6 pb-20">{children}</main>
          </div>
          <MobileNav /> {/* Client mobile nav */}
        </div>
      </body>
    </html>
  );
}
