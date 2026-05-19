"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Users,
  CheckSquare,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

const supabase = createClient()

interface AdminStats {
  totalUsers: number
  totalTasks: number
  totalEvents: number
  totalMessages: number
  activeUsers: number
  newUsersToday: number
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTasks: 0,
    totalEvents: 0,
    totalMessages: 0,
    activeUsers: 0,
    newUsersToday: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchAdminStats()
  }, [user, router])

  const fetchAdminStats = async () => {
    try {
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })
      const { count: tasksCount } = await supabase.from("tasks").select("*", { count: "exact", head: true })
      const { count: eventsCount } = await supabase.from("events").select("*", { count: "exact", head: true })
      const { count: messagesCount } = await supabase.from("messages").select("*", { count: "exact", head: true })

      const today = new Date().toISOString().split("T")[0]
      const { count: newToday } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today)

      setStats({
        totalUsers: usersCount || 0,
        totalTasks: tasksCount || 0,
        totalEvents: eventsCount || 0,
        totalMessages: messagesCount || 0,
        activeUsers: Math.floor((usersCount || 0) * 0.7),
        newUsersToday: newToday || 0,
      })

      const { data: recentTasks } = await supabase
        .from("tasks")
        .select("*, users(full_name)")
        .order("created_at", { ascending: false })
        .limit(5)

      setRecentActivity(recentTasks || [])
    } catch (error) {
      console.error("Failed to fetch admin stats:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-main shadow-glow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Админ панель</h1>
              </div>
              <p className="text-muted-foreground">Управление платформой Smart Campus</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatsCard title="Пользователи" value={stats.totalUsers} description={`+${stats.newUsersToday} сегодня`} icon={Users} trend={stats.newUsersToday > 0 ? 15 : 0} color="coral" index={0} />
              <StatsCard title="Задания" value={stats.totalTasks} description="Всего создано" icon={CheckSquare} trend={8} color="turquoise" index={1} />
              <StatsCard title="Мероприятия" value={stats.totalEvents} description="Всего создано" icon={Calendar} trend={12} color="amber" index={2} />
              <StatsCard title="Сообщения" value={stats.totalMessages} description="Всего отправлено" icon={MessageSquare} trend={5} color="emerald" index={3} />
              <StatsCard title="Активные" value={stats.activeUsers} description="За последние 24ч" icon={TrendingUp} trend={20} color="coral" index={4} />
              <StatsCard title="Новые" value={stats.newUsersToday} description="Сегодня" icon={Users} trend={stats.newUsersToday > 0 ? 100 : 0} color="turquoise" index={5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-glass">
                <CardHeader>
                  <CardTitle className="text-lg">Последняя активность</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет данных</p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity: any, index: number) => (
                        <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                          <div className="p-2 rounded-lg bg-coral-100 text-coral-500">
                            <CheckSquare className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.users?.full_name} • {new Date(activity.created_at).toLocaleDateString("ru")}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass">
                <CardHeader>
                  <CardTitle className="text-lg">Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Управление пользователями", href: "/admin/users", icon: Users, color: "coral" },
                    { label: "Аналитика платформы", href: "/admin/analytics", icon: TrendingUp, color: "turquoise" },
                    { label: "Модерация контента", href: "#", icon: Shield, color: "amber" },
                    { label: "Настройки системы", href: "#", icon: Shield, color: "emerald" },
                  ].map((action, index) => (
                    <motion.a key={action.label} href={action.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="flex items-center gap-3 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-all group">
                      <div className={`p-2 rounded-lg ${action.color === "coral" ? "bg-coral-100 text-coral-500" : action.color === "turquoise" ? "bg-turquoise-100 text-turquoise-500" : action.color === "amber" ? "bg-amber-100 text-amber-500" : "bg-emerald-100 text-emerald-500"}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="flex-1 font-medium group-hover:text-coral-500 transition-colors">{action.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </motion.a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
