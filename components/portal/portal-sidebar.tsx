"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CalendarCheck, FileText, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Overview", href: "/portal", icon: LayoutDashboard },
  { label: "Attendance", href: "/portal/attendance", icon: CalendarCheck },
  { label: "Invoices", href: "/portal/invoices", icon: FileText },
];

export function PortalSidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 min-h-screen border-r bg-sidebar flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          Collision
        </Link>
        <p className="text-xs text-muted-foreground mt-1 ml-9">Member Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = path === item.href || (item.href !== "/portal" && path.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t flex items-center justify-between">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
