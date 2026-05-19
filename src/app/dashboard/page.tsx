"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  CheckSquare,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { ActivityChart } from "@/components/dashboard/ActivityChart"
import { RecentTasks } from "@/components/dashboard/RecentTasks"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"
import { useAuthStore } from "@/store/useAuthStore"
import { useTasks } from "@/hooks/useTasks"
import { useEvents } from "@/hooks/useEvents"
import { useRealtime } from "@/hooks/useRealtime"
import { Skeleton } from "@/components/ui/skeleton"

const weeklyData = [
  { day: "Пн", tasks: 3, events: 1 },
  { day: "Вт", tasks: 5, events: 0 },
  { day: "Ср", tasks: 2, events: 2 },
  { day: "Чт", tasks: 4, events: 1 },
  { day: "Пт", tasks: 6, events: 0 },
  { day: "Сб", tasks: 1, events: 3 },
  { day: "Вс", tasks: 0, events: 1 },
]

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore()
  const { tasks, stats, isLoading: tasksLoading } = useTasks()
  const { events, isLoading: eventsLoading } = useEvents()

  useRealtime()

  useEffect(() => {
    useAuthStore.getState().fetchUser()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
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
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Привет, <span className="gradient-text">{user?.full_name?.split(" ")[0] || "Студент"}</span>! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Вот что происходит в вашем кампусе сегодня
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Всего заданий"
                value={stats.total}
                description={`${stats.completed} выполнено`}
                icon={CheckSquare}
                trend={12}
                color="coral"
                index={0}
              />
              <StatsCard
                title="Мероприятия"
                value={events.filter((e) => new Date(e.start_date) > new Date()).length}
                description="Предстоящие"
                icon={Calendar}
                trend={8}
                color="turquoise"
                index={1}
              />
              <StatsCard
                title="Сообщения"
                value={0}
                description="Новых сообщений"
                icon={MessageSquare}
                color="amber"
                index={2}
              />
              <StatsCard
                title="Прогресс"
                value={`${stats.completionRate}%`}
                description="Выполнение заданий"
                icon={TrendingUp}
                trend={stats.completionRate > 50 ? 5 : -3}
                color="emerald"
                index={3}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityChart data={weeklyData} />
              </div>
              <div>
                <RecentTasks tasks={tasks} />
              </div>
            </div>

            <div className="mt-6">
              <UpcomingEvents events={events} />
            </div>

            {/* Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">В процессе</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-2xl bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-coral-500" />
                  <div>
                    <p className="text-sm font-medium">В ожидании</p>
                    <p className="text-2xl font-bold text-coral-600">{stats.pending}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">Выполнено</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
