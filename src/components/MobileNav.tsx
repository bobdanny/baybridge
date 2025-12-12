"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BedDouble,
  CalendarCheck,
  Globe2,
  Settings,
  MoreHorizontal,
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { name: "Users", icon: Users, href: "/dashboard/users" },
    { name: "Rooms", icon: BedDouble, href: "/dashboard/rooms" },
    { name: "Reservations", icon: CalendarCheck, href: "/dashboard/reservations" },
    { name: "Agents / OTA", icon: Globe2, href: "/dashboard/agents" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const isActive = (href: string) =>
    pathname.replace(/\/+$/, "") === href.replace(/\/+$/, "");

  return (
    <>
      {/* Bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-lg z-30">
        {navItems.slice(0, 3).map(({ name, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={name}
              href={href}
              className={`flex flex-col items-center text-xs ${
                active ? "text-green-700" : "text-gray-500"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              {name}
            </Link>
          );
        })}

        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center text-xs ${
            showMore ? "text-green-700" : "text-gray-500"
          }`}
        >
          <MoreHorizontal className="w-6 h-6 mb-1" />
          More
        </button>
      </nav>

      {/* Dropdown menu */}
      {showMore && (
        <div className="sm:hidden fixed bottom-14 left-0 w-full bg-white border-t border-gray-200 shadow-xl z-40">
          <nav className="flex flex-col divide-y divide-gray-200">
            {navItems.slice(3).map(({ name, icon: Icon, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    active
                      ? "text-green-700 bg-green-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
