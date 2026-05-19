"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckSquare, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types"
import { formatRelativeTime } from "@/lib/utils"

interface RecentTasksProps {
  tasks: Task[]
}

const statusConfig = {
  pending: { label: "В ожидании", icon: Clock, color: "warning" as const },
  in_progress: { label: "В процессе", icon: AlertCircle, color: "default" as const },
  completed: { label: "Выполнено", icon: CheckSquare, color: "success" as const },
  overdue: { label: "Просрочено", icon: AlertCircle, color: "destructive" as const },
}

const priorityConfig = {
  low: "secondary",
  medium: "default",
  high: "destructive",
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const recentTasks = tasks.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card className="border-0 shadow-glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Последние задания</CardTitle>
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="gap-1">
              Все <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Нет заданий</p>
            </div>
          ) : (
            recentTasks.map((task, index) => {
              const status = statusConfig[task.status]
              const StatusIcon = status.icon
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors cursor-pointer group"
                >
                  <div className={`p-2 rounded-lg bg-${status.color === "default" ? "coral" : status.color === "success" ? "emerald" : status.color === "warning" ? "amber" : "coral"}-100`}>
                    <StatusIcon className={`h-4 w-4 text-${status.color === "default" ? "coral" : status.color === "success" ? "emerald" : status.color === "warning" ? "amber" : "coral"}-500`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-coral-500 transition-colors">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.subject} • {formatRelativeTime(task.deadline)}
                    </p>
                  </div>
                  <Badge variant={priorityConfig[task.priority]} className="text-[10px]">
                    {task.priority === "low" ? "Низкий" : task.priority === "medium" ? "Средний" : "Высокий"}
                  </Badge>
                </motion.div>
              )
            })
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
