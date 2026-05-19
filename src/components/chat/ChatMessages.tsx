"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, formatDate } from "@/lib/utils"
import type { Message, User } from "@/types"

interface ChatMessagesProps {
  messages: Message[]
  currentUser: User | null
  roomName: string
  onSendMessage: (content: string) => void
  isLoading?: boolean
}

export function ChatMessages({ messages, currentUser, roomName, onSendMessage, isLoading }: ChatMessagesProps) {
  const [newMessage, setNewMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    onSendMessage(newMessage.trim())
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-background/30">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h3 className="font-semibold">{roomName}</h3>
        <span className="text-xs text-muted-foreground">
          {messages.length} сообщений
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwn = message.sender_id === currentUser?.id
              const showAvatar = index === 0 || messages[index - 1]?.sender_id !== message.sender_id

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  {showAvatar && !isOwn ? (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.sender?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {getInitials(message.sender?.full_name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8" />
                  )}
                  <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                    {showAvatar && !isOwn && (
                      <span className="text-xs text-muted-foreground mb-1">
                        {message.sender?.full_name}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isOwn
                          ? "bg-gradient-main text-white rounded-br-md"
                          : "bg-accent rounded-bl-md"
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-xl text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Напишите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-xl"
            disabled={isLoading}
          />
          <Button type="button" variant="ghost" size="icon" className="rounded-xl text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            className="rounded-xl bg-gradient-main hover:opacity-90"
            disabled={!newMessage.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
