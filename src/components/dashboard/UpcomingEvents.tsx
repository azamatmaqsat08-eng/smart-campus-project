"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Event } from "@/types"
import { formatDate } from "@/lib/utils"

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const upcomingEvents = events
    .filter((e) => new Date(e.start_date) > new Date())
    .slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <Card className="border-0 shadow-glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Ближайшие мероприятия</CardTitle>
          <Link href="/events">
            <Button variant="ghost" size="sm" className="gap-1">
              Все <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Нет предстоящих мероприятий</p>
            </div>
          ) : (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/events/${event.id}`}>
                  <div className="flex gap-4 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-all hover:shadow-md">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-coral-400 to-turquoise-400 flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold">
                        {new Date(event.start_date).getDate()}
                      </span>
                      <span className="text-[10px] uppercase">
                        {new Date(event.start_date).toLocaleString("ru", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate group-hover:text-coral-500 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.current_participants}
                          {event.max_participants && `/${event.max_participants}`}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mt-2 text-[10px]">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
