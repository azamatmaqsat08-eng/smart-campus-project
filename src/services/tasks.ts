"use client"

import { createClient } from "@/lib/supabase/client"
import type { Task } from "@/types"

const supabase = createClient()

export async function getTasks(userId?: string, filters?: {
  status?: string
  priority?: string
  search?: string
  sortBy?: string
}) {
  let query = supabase.from("tasks").select("*")

  if (userId) {
    query = query.eq("user_id", userId)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.priority) {
    query = query.eq("priority", filters.priority)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.sortBy) {
    query = query.order(filters.sortBy, { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) throw error
  return data as Task[]
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single()

  if (error) throw error
  return data as Task
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Task
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id)
  if (error) throw error
}

export async function getTaskStats(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("status")
    .eq("user_id", userId)

  if (error) throw error

  const total = data.length
  const completed = data.filter((t) => t.status === "completed").length
  const pending = data.filter((t) => t.status === "pending").length
  const inProgress = data.filter((t) => t.status === "in_progress").length

  return {
    total,
    completed,
    pending,
    inProgress,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}
