"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: number
  color: "coral" | "turquoise" | "amber" | "emerald"
  index: number
}

const colorVariants = {
  coral: "from-coral-400/20 to-coral-500/10 text-coral-500",
  turquoise: "from-turquoise-400/20 to-turquoise-500/10 text-turquoise-500",
  amber: "from-amber-400/20 to-amber-500/10 text-amber-500",
  emerald: "from-emerald-400/20 to-emerald-500/10 text-emerald-500",
}

const iconBgVariants = {
  coral: "bg-coral-400/10 text-coral-500",
  turquoise: "bg-turquoise-400/10 text-turquoise-500",
  amber: "bg-amber-400/10 text-amber-500",
  emerald: "bg-emerald-400/10 text-emerald-500",
}

export function StatsCard({ title, value, description, icon: Icon, trend, color, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="relative overflow-hidden group hover-lift cursor-pointer border-0 shadow-glass">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorVariants[color]} opacity-50`} />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {trend !== undefined && (
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium ${trend >= 0 ? "text-emerald-500" : "text-coral-500"}`}>
                    {trend >= 0 ? "+" : ""}{trend}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs прошлая неделя</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${iconBgVariants[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
