"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Flag, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Partial<Task>) => void
  task?: Task | null
}

export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: task?.title || "",
    description: task?.description || "",
    subject: task?.subject || "",
    deadline: task?.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
    priority: task?.priority || "medium",
    status: task?.status || "pending",
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
            className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold">
                {task ? "Редактировать задание" : "Новое задание"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Название</label>
                <Input
                  placeholder="Название задания"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Описание</label>
                <textarea
                  placeholder="Описание задания"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400/50 focus-visible:border-coral-400 transition-all min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Предмет
                  </label>
                  <Input
                    placeholder="Предмет"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Дедлайн
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Flag className="h-4 w-4" /> Приоритет
                </label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.priority === priority
                          ? priority === "low"
                            ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400"
                            : priority === "medium"
                            ? "bg-amber-100 text-amber-700 ring-2 ring-amber-400"
                            : "bg-coral-100 text-coral-700 ring-2 ring-coral-400"
                          : "bg-accent text-muted-foreground hover:bg-accent/80"
                      }`}
                    >
                      {priority === "low" ? "Низкий" : priority === "medium" ? "Средний" : "Высокий"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-gradient-main">
                  {task ? "Сохранить" : "Создать"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
