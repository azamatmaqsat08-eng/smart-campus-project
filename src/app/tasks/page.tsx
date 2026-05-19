"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2,
  CheckSquare,
  Clock,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TaskModal } from "@/components/modals/TaskModal"
import { useAuthStore } from "@/store/useAuthStore"
import { useTasks } from "@/hooks/useTasks"
import { createTask, updateTask, deleteTask } from "@/services/tasks"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import type { Task } from "@/types"
import toast from "react-hot-toast"

const statusConfig = {
  pending: { label: "В ожидании", icon: Clock, color: "warning" as const },
  in_progress: { label: "В процессе", icon: AlertCircle, color: "default" as const },
  completed: { label: "Выполнено", icon: CheckSquare, color: "success" as const },
  overdue: { label: "Просрочено", icon: AlertCircle, color: "destructive" as const },
}

const priorityConfig = {
  low: { label: "Низкий", color: "bg-emerald-100 text-emerald-700" },
  medium: { label: "Средний", color: "bg-amber-100 text-amber-700" },
  high: { label: "Высокий", color: "bg-coral-100 text-coral-700" },
}

export default function TasksPage() {
  const { user } = useAuthStore()
  const { tasks, isLoading, fetchTasks } = useTasks()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask({
        ...taskData,
        user_id: user!.id,
      } as any)
      toast.success("Задание создано!")
      fetchTasks()
    } catch (error: any) {
      toast.error(error.message || "Ошибка создания")
    }
  }

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return
    try {
      await updateTask(editingTask.id, taskData)
      toast.success("Задание обновлено!")
      fetchTasks()
      setEditingTask(null)
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления")
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Удалить задание?")) return
    try {
      await deleteTask(id)
      toast.success("Задание удалено!")
      fetchTasks()
    } catch (error: any) {
      toast.error(error.message || "Ошибка удаления")
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    try {
      await updateTask(task.id, { status: newStatus })
      fetchTasks()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

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
                <h1 className="text-3xl font-bold">Задания</h1>
                <p className="text-muted-foreground mt-1">
                  Управляйте своими учебными заданиями
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingTask(null)
                  setIsModalOpen(true)
                }}
                className="rounded-xl bg-gradient-main shadow-glow"
              >
                <Plus className="h-4 w-4 mr-2" /> Новое задание
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск заданий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="">Все статусы</option>
                  <option value="pending">В ожидании</option>
                  <option value="in_progress">В процессе</option>
                  <option value="completed">Выполнено</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-xl border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="">Все приоритеты</option>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortBy(sortBy === "created_at" ? "deadline" : "created_at")}
                  className="rounded-xl"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tasks Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-16">
                <CheckSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium">Нет заданий</h3>
                <p className="text-muted-foreground">Создайте свое первое задание</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => {
                    const status = statusConfig[task.status]
                    const StatusIcon = status.icon
                    const priority = priorityConfig[task.priority]
                    const isOverdue = new Date(task.deadline) < new Date() && task.status !== "completed"

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`group hover-lift border-0 shadow-glass ${
                          task.status === "completed" ? "opacity-70" : ""
                        } ${isOverdue ? "ring-2 ring-coral-400/30" : ""}`}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <button
                                onClick={() => handleToggleStatus(task)}
                                className={`p-2 rounded-xl transition-all ${
                                  task.status === "completed"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-accent text-muted-foreground hover:bg-coral-100 hover:text-coral-500"
                                }`}
                              >
                                <CheckSquare className="h-5 w-5" />
                              </button>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg"
                                  onClick={() => {
                                    setEditingTask(task)
                                    setIsModalOpen(true)
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-coral-500"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <h3 className={`font-semibold mb-1 ${
                              task.status === "completed" ? "line-through text-muted-foreground" : ""
                            }`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {task.description}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs">
                                {task.subject}
                              </Badge>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${priority.color}`}>
                                {priority.label}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </span>
                              <span className={isOverdue ? "text-coral-500 font-medium" : ""}>
                                {formatRelativeTime(task.deadline)}
                              </span>
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  )
}
