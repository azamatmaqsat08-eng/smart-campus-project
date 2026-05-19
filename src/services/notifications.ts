"use client"

import { createClient } from "@/lib/supabase/client"
import type { Notification } from "@/types"

const supabase = createClient()

export async function getNotifications(userId: string, unreadOnly = false) {
  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (unreadOnly) {
    query = query.eq("read", false)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Notification[]
}

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)

  if (error) throw error
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false)

  if (error) throw error
}

export async function createNotification(notification: Omit<Notification, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single()

  if (error) throw error
  return data as Notification
}

export function subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Notification)
      }
    )
    .subscribe()
}
