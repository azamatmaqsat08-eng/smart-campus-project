"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  MessageSquare,
  Newspaper,
  BarChart3,
  Shield,
  Users,
} from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/tasks", label: "Задания", icon: CheckSquare },
  { href: "/events", label: "Мероприятия", icon: Calendar },
  { href: "/chat", label: "Чат", icon: MessageSquare },
  { href: "/news", label: "Новости", icon: Newspaper },
]

const adminLinks = [
  { href: "/admin", label: "Админ панель", icon: Shield },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/admin/users", label: "Пользователи", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const isAdmin = user?.role === "admin"

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="flex-1 py-6 px-3">
        <nav className="space-y-1">
          {mainLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative",
                  active
                    ? "text-coral-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="absolute inset-0 rounded-xl bg-coral-50 dark:bg-coral-900/20 border border-coral-200/50 dark:border-coral-800/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {isAdmin && (
          <>
            <div className="mt-8 mb-4 px-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Администрирование
              </p>
            </div>
            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative",
                      active
                        ? "text-turquoise-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeAdmin"
                        className="absolute inset-0 rounded-xl bg-turquoise-50 dark:bg-turquoise-900/20 border border-turquoise-200/50 dark:border-turquoise-800/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </>
        )}
      </div>

      {/* Bottom info */}
      <div className="p-4 border-t border-border/50">
        <div className="rounded-xl bg-gradient-to-r from-coral-50 to-turquoise-50 dark:from-coral-900/20 dark:to-turquoise-900/20 p-4">
          <p className="text-xs font-medium text-foreground">Smart Campus v1.0</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Платформа для студентов
          </p>
        </div>
      </div>
    </aside>
  )
}
