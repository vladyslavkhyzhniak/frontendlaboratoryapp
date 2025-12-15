"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiUser, 
  FiLock,
  FiLogOut 
} from "react-icons/fi";

const menuItems = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/user/profile", label: "Profile", icon: FiUser },
  // { href: "/user/changepassword", label: "Change Password", icon: FiLock },
  // { href: "/user/signout", label: "Sign Out", icon: FiLogOut },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 dark:bg-black border-r border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-semibold text-white">Menu</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

