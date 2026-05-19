import { create } from "zustand"
import type { Notification } from "@/types"
import { getNotifications, markAsRead, markAllAsRead } from "@/services/notifications"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: (userId: string) => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: (userId: string) => Promise<void>
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true })
    try {
      const notifications = await getNotifications(userId)
      const unreadCount = notifications.filter((n) => !n.read).length
      set({ notifications, unreadCount, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  markNotificationAsRead: async (id: string) => {
    await markAsRead(id)
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllNotificationsAsRead: async (userId: string) => {
    await markAllAsRead(userId)
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },
}))
