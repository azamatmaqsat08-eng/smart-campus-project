"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { getEvents, getUserRegistrations } from "@/services/events"
import type { Event } from "@/types"

export function useEvents() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState<Event[]>([])
  const [userRegistrations, setUserRegistrations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEvents = useCallback(async (filters?: {
    category?: string
    search?: string
    upcoming?: boolean
  }) => {
    setIsLoading(true)
    try {
      const data = await getEvents(filters)
      setEvents(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUserRegistrations = useCallback(async () => {
    if (!user) return
    try {
      const data = await getUserRegistrations(user.id)
      setUserRegistrations(data)
    } catch (error) {
      console.error("Failed to fetch registrations:", error)
    }
  }, [user])

  useEffect(() => {
    fetchEvents()
    fetchUserRegistrations()
  }, [fetchEvents, fetchUserRegistrations])

  return { events, userRegistrations, isLoading, fetchEvents, fetchUserRegistrations }
}
