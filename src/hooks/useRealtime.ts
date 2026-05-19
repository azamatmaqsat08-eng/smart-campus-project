"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useNotificationStore } from "@/store/useNotificationStore"
import { subscribeToNotifications } from "@/services/notifications"
import toast from "react-hot-toast"

export function useRealtime() {
  const { user } = useAuthStore()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!user) return

    const subscription = subscribeToNotifications(user.id, (notification) => {
      addNotification(notification)
      toast(notification.title, {
        icon: notification.type === "task" ? "📋" : notification.type === "event" ? "📅" : "💬",
        duration: 4000,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user, addNotification])
}
