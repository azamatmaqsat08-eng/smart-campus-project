"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EventModal } from "@/components/modals/EventModal"
import { useAuthStore } from "@/store/useAuthStore"
import { useEvents } from "@/hooks/useEvents"
import {
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from "@/services/events"
import { formatDate } from "@/lib/utils"
import type { Event } from "@/types"
import toast from "react-hot-toast"

const categories = [
  { value: "", label: "Все категории" },
  { value: "Учеба", label: "Учеба" },
  { value: "Спорт", label: "Спорт" },
  { value: "Культура", label: "Культура" },
  { value: "Наука", label: "Наука" },
  { value: "Волонтерство", label: "Волонтерство" },
  { value: "Развлечения", label: "Развлечения" },
]

export default function EventsPage() {
  const { user } = useAuthStore()
  const { events, userRegistrations, isLoading, fetchEvents, fetchUserRegistrations } = useEvents()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || event.category === categoryFilter
    const matchesUpcoming = !showUpcomingOnly || new Date(event.start_date) > new Date()
    return matchesSearch && matchesCategory && matchesUpcoming
  })

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      await createEvent({
        ...eventData,
        organizer_id: user!.id,
      } as any)
      toast.success("Мероприятие создано!")
      fetchEvents()
    } catch (error: any) {
      toast.error(error.message || "Ошибка создания")
    }
  }

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    if (!editingEvent) return
    try {
      await updateEvent(editingEvent.id, eventData)
      toast.success("Мероприятие обновлено!")
      fetchEvents()
      setEditingEvent(null)
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления")
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Удалить мероприятие?")) return
    try {
      await deleteEvent(id)
      toast.success("Мероприятие удалено!")
      fetchEvents()
    } catch (error: any) {
      toast.error(error.message || "Ошибка удаления")
    }
  }

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId, user!.id)
      toast.success("Вы зарегистрированы!")
      fetchEvents()
      fetchUserRegistrations()
    } catch (error: any) {
      toast.error(error.message || "Ошибка регистрации")
    }
  }

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterFromEvent(eventId, user!.id)
      toast.success("Регистрация отменена")
      fetchEvents()
      fetchUserRegistrations()
    } catch (error: any) {
      toast.error(error.message || "Ошибка")
    }
  }

  const isRegistered = (eventId: string) => userRegistrations.includes(eventId)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Мероприятия</h1>
                <p className="text-muted-foreground mt-1">
                  Находите и регистрируйтесь на интересные события
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingEvent(null)
                  setIsModalOpen(true)
                }}
                className="rounded-xl bg-gradient-main shadow-glow"
              >
                <Plus className="h-4 w-4 mr-2" /> Создать мероприятие
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск мероприятий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-input bg-background px-4 py-2 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <Button
                  variant={showUpcomingOnly ? "default" : "outline"}
                  onClick={() => setShowUpcomingOnly(!showUpcomingOnly)}
                  className="rounded-xl"
                >
                  <Clock className="h-4 w-4 mr-2" /> Предстоящие
                </Button>
              </div>
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium">Нет мероприятий</h3>
                <p className="text-muted-foreground">Создайте первое мероприятие</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => {
                    const isPast = new Date(event.end_date) < new Date()
                    const isFull = event.max_participants && event.current_participants >= event.max_participants

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="group hover-lift border-0 shadow-glass overflow-hidden">
                          {/* Image placeholder */}
                          <div className="h-40 bg-gradient-to-br from-coral-100 to-turquoise-100 dark:from-coral-900/30 dark:to-turquoise-900/30 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Calendar className="h-12 w-12 text-coral-400/50" />
                            </div>
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                                {event.category}
                              </Badge>
                            </div>
                            {isRegistered(event.id) && (
                              <div className="absolute top-3 right-3">
                                <Badge variant="success" className="bg-emerald-500 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Регистрация
                                </Badge>
                              </div>
                            )}
                          </div>

                          <CardContent className="p-5">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-coral-500 transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {event.description}
                            </p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {formatDate(event.start_date)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {event.current_participants}
                                {event.max_participants && ` / ${event.max_participants}`} участников
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {!isPast && !isFull && (
                                <Button
                                  variant={isRegistered(event.id) ? "outline" : "default"}
                                  className={`flex-1 rounded-xl ${
                                    !isRegistered(event.id) ? "bg-gradient-main" : ""
                                  }`}
                                  onClick={() =>
                                    isRegistered(event.id)
                                      ? handleUnregister(event.id)
                                      : handleRegister(event.id)
                                  }
                                >
                                  {isRegistered(event.id) ? (
                                    <><XCircle className="h-4 w-4 mr-2" /> Отменить</>
                                  ) : (
                                    <><CheckCircle className="h-4 w-4 mr-2" /> Зарегистрироваться</>
                                  )}
                                </Button>
                              )}
                              {user?.id === event.organizer_id && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl"
                                    onClick={() => {
                                      setEditingEvent(event)
                                      setIsModalOpen(true)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl text-coral-500"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
      />
    </div>
  )
}
