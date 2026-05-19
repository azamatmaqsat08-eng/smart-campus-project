"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { getTasks, getTaskStats } from "@/services/tasks"
import type { Task } from "@/types"

export function useTasks() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    completionRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = useCallback(async (filters?: {
    status?: string
    priority?: string
    search?: string
    sortBy?: string
  }) => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await getTasks(user.id, filters)
      setTasks(data)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const fetchStats = useCallback(async () => {
    if (!user) return
    try {
      const data = await getTaskStats(user.id)
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch task stats:", error)
    }
  }, [user])

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [fetchTasks, fetchStats])

  return { tasks, stats, isLoading, fetchTasks, fetchStats }
}
