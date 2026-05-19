"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  CheckSquare,
  Calendar,
  MessageSquare,
  Info,
  CheckCircle,
  Trash2,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/useAuthStore"
import { useNotificationStore } from "@/store/useNotificationStore"
import { formatRelativeTime } from "@/lib/utils"

const typeConfig = {
  task: { icon: CheckSquare, color: "coral", label: "Задание" },
  event: { icon: Calendar, color: "turquoise", label: "Мероприятие" },
  message: { icon: MessageSquare, color: "amber", label: "Сообщение" },
  system: { icon: Info, color: "slate", label: "Система" },
}

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const { notifications, fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useNotificationStore()

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id)
    }
  }, [user, fetchNotifications])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Уведомления</h1>
                <p className="text-muted-foreground mt-1">
                  {notifications.filter((n) => !n.read).length} непрочитанных
                </p>
              </div>
              {user && (
                <Button
                  variant="outline"
                  onClick={() => markAllNotificationsAsRead(user.id)}
                  className="rounded-xl"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Прочитать все
                </Button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium">Нет уведомлений</h3>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const config = typeConfig[notification.type]
                  const Icon = config.icon

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`border-0 shadow-glass cursor-pointer transition-all hover:shadow-lg ${
                          !notification.read ? "bg-coral-50/50 dark:bg-coral-900/10" : ""
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${
                            notification.type === "task" ? "bg-coral-100 text-coral-500" :
                            notification.type === "event" ? "bg-turquoise-100 text-turquoise-500" :
                            notification.type === "message" ? "bg-amber-100 text-amber-500" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? "text-coral-500" : ""}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-coral-400" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground mt-1">
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
