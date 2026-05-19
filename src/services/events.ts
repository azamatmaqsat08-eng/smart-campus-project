"use client"

import { createClient } from "@/lib/supabase/client"
import type { Event, EventRegistration } from "@/types"

const supabase = createClient()

export async function getEvents(filters?: {
  category?: string
  search?: string
  upcoming?: boolean
}) {
  let query = supabase.from("events").select("*, organizer:users(full_name)")

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.upcoming) {
    query = query.gte("start_date", new Date().toISOString())
  }

  query = query.order("start_date", { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data as (Event & { organizer: { full_name: string } })[]
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*, organizer:users(full_name, avatar_url)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createEvent(event: Omit<Event, "id" | "created_at" | "updated_at" | "current_participants">) {
  const { data, error } = await supabase
    .from("events")
    .insert({ ...event, current_participants: 0 })
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase
    .from("events")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) throw error
}

export async function registerForEvent(eventId: string, userId: string) {
  const { data, error } = await supabase
    .from("event_registrations")
    .insert({ event_id: eventId, user_id: userId })
    .select()
    .single()

  if (error) throw error

  // Update participant count
  await supabase.rpc("increment_participants", { event_id: eventId })

  return data as EventRegistration
}

export async function unregisterFromEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId)

  if (error) throw error

  await supabase.rpc("decrement_participants", { event_id: eventId })
}

export async function getUserRegistrations(userId: string) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("user_id", userId)

  if (error) throw error
  return data.map((r) => r.event_id)
}
