"use client"

import { createClient } from "@/lib/supabase/client"
import type { Message, ChatRoom } from "@/types"

const supabase = createClient()

export async function getChatRooms(userId: string) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*, participants:chat_room_participants(user_id)")
    .eq("participants.user_id", userId)

  if (error) throw error
  return data as ChatRoom[]
}

export async function getMessages(roomId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:users(full_name, avatar_url)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as (Message & { sender: { full_name: string; avatar_url?: string } })[]
}

export async function sendMessage(message: Omit<Message, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single()

  if (error) throw error
  return data as Message
}

export async function createChatRoom(name: string, participants: string[], type: "direct" | "group" = "group") {
  const { data: room, error } = await supabase
    .from("chat_rooms")
    .insert({ name, type })
    .select()
    .single()

  if (error) throw error

  const participantInserts = participants.map((userId) => ({
    room_id: room.id,
    user_id: userId,
  }))

  await supabase.from("chat_room_participants").insert(participantInserts)

  return room as ChatRoom
}

export function subscribeToMessages(roomId: string, callback: (message: Message) => void) {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
}

export function subscribeToChatRooms(userId: string, callback: () => void) {
  return supabase
    .channel("chat_rooms")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      () => {
        callback()
      }
    )
    .subscribe()
}
