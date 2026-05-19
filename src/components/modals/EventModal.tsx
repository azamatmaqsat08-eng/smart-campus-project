"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, MapPin, Users, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Event } from "@/types"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (event: Partial<Event>) => void
  event?: Event | null
}

const categories = [
  "Учеба",
  "Спорт",
  "Культура",
  "Наука",
  "Волонтерство",
  "Развлечения",
  "Другое",
]

export function EventModal({ isOpen, onClose, onSubmit, event }: EventModalProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    category: event?.category || "Учеба",
    start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : "",
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
    max_participants: event?.max_participants || undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold">
                {event ? "Редактировать мероприятие" : "Новое мероприятие"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Название</label>
                <Input
                  placeholder="Название мероприятия"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Описание</label>
                <textarea
                  placeholder="Описание мероприятия"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400/50 focus-visible:border-coral-400 transition-all min-h-[80px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Место
                  </label>
                  <Input
                    placeholder="Место проведения"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <Users className="h-4 w-4" /> Макс. участников
                  </label>
                  <Input
                    type="number"
                    placeholder="Неограничено"
                    value={formData.max_participants || ""}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Категория
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.category === cat
                          ? "bg-gradient-main text-white shadow-glow"
                          : "bg-accent text-muted-foreground hover:bg-accent/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Начало
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Окончание
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-gradient-main">
                  {event ? "Сохранить" : "Создать"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
