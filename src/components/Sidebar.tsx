"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  BedDouble,
  CalendarCheck,
  Globe2,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "User Management", icon: Users, href: "/dashboard/users" },
    { name: "Room Management", icon: BedDouble, href: "/dashboard/rooms" },
    { name: "Reservations", icon: CalendarCheck, href: "/dashboard/reservations" },
    { name: "Agents / OTA", icon: Globe2, href: "/dashboard/agents" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const isActive = (href: string) =>
    pathname.replace(/\/+$/, "") === href.replace(/\/+$/, "");

  return (
    <aside className="hidden sm:flex flex-col gap-6 bg-white border-r border-gray-200 w-56 p-4 fixed top-0 left-0 h-full z-20 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
   
        <span className="text-lg font-semibold text-gray-700">Baybridge</span>
      </div>

      <nav className="flex flex-col gap-1 w-full">
        {navItems.map(({ name, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all ${
                active
                  ? "bg-green-50 text-green-700 border border-green-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-green-600" : "text-gray-500"}`} />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
