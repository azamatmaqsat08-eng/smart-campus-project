"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Users,
  CheckSquare,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"

const COLORS = ["#FF6B6B", "#2EC4B6", "#F59E0B", "#10B981", "#8B5CF6"]

export default function AdminAnalyticsPage() {
  const [userGrowth] = useState([
    { month: "Янв", users: 45, tasks: 120 },
    { month: "Фев", users: 62, tasks: 145 },
    { month: "Мар", users: 78, tasks: 180 },
    { month: "Апр", users: 95, tasks: 210 },
    { month: "Май", users: 120, tasks: 250 },
    { month: "Июн", users: 145, tasks: 300 },
  ])

  const [taskStats] = useState([
    { status: "Выполнено", count: 180, color: "#10B981" },
    { status: "В процессе", count: 85, color: "#F59E0B" },
    { status: "В ожидании", count: 65, color: "#FF6B6B" },
    { status: "Просрочено", count: 20, color: "#EF4444" },
  ])

  const [eventCategories] = useState([
    { name: "Учеба", value: 35 },
    { name: "Спорт", value: 20 },
    { name: "Культура", value: 15 },
    { name: "Наука", value: 18 },
    { name: "Другое", value: 12 },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-main shadow-glow">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Аналитика</h1>
              </div>
              <p className="text-muted-foreground">Статистика и метрики платформы</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-0 shadow-glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-coral-400" />
                    Рост пользователей
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                      <Legend />
                      <Line type="monotone" dataKey="users" name="Пользователи" stroke="#FF6B6B" strokeWidth={3} dot={{ fill: "#FF6B6B", r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="tasks" name="Задания" stroke="#2EC4B6" strokeWidth={3} dot={{ fill: "#2EC4B6", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-turquoise-400" />
                    Распределение заданий
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={taskStats} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="status">
                        {taskStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-glass mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-400" />
                  Категории мероприятий
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={eventCategories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                    <Bar dataKey="value" name="Количество" radius={[0, 8, 8, 0]} maxBarSize={30}>
                      {eventCategories.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Среднее время выполнения", value: "3.2 дня", icon: Activity, color: "coral" },
                { label: "Конверсия регистраций", value: "68%", icon: Users, color: "turquoise" },
                { label: "Активность в чатах", value: "245 сообщ/день", icon: TrendingUp, color: "amber" },
              ].map((metric, index) => (
                <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                  <Card className="border-0 shadow-glass">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${metric.color === "coral" ? "bg-coral-100 text-coral-500" : metric.color === "turquoise" ? "bg-turquoise-100 text-turquoise-500" : "bg-amber-100 text-amber-500"}`}>
                          <metric.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                          <p className="text-xl font-bold">{metric.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
