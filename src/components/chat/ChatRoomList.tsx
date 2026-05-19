"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import type { ChatRoom } from "@/types"

interface ChatRoomListProps {
  rooms: ChatRoom[]
  selectedRoomId: string | null
  onSelectRoom: (roomId: string) => void
  onCreateRoom: () => void
}

export function ChatRoomList({ rooms, selectedRoomId, onSelectRoom, onCreateRoom }: ChatRoomListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full w-full md:w-80 border-r border-border/50 bg-background/50">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Чаты</h2>
          <Button variant="ghost" size="icon" onClick={onCreateRoom} className="rounded-xl">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {filteredRooms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Нет чатов</p>
              </motion.div>
            ) : (
              filteredRooms.map((room, index) => (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                    selectedRoomId === room.id
                      ? "bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800"
                      : "hover:bg-accent"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={undefined} />
                    <AvatarFallback>{getInitials(room.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      selectedRoomId === room.id ? "text-coral-500" : ""
                    }`}>
                      {room.name}
                    </p>
                    {room.last_message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {room.last_message.content}
                      </p>
                    )}
                  </div>
                  {room.last_message && (
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {formatRelativeTime(room.last_message.created_at)}
                    </span>
                  )}
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
