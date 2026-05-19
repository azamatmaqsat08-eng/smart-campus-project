"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { ChatRoomList } from "@/components/chat/ChatRoomList"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { useAuthStore } from "@/store/useAuthStore"
import { getChatRooms, getMessages, sendMessage, subscribeToMessages } from "@/services/messages"
import type { ChatRoom, Message } from "@/types"
import toast from "react-hot-toast"

export default function ChatPage() {
  const { user } = useAuthStore()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchRooms = useCallback(async () => {
    if (!user) return
    try {
      const data = await getChatRooms(user.id)
      setRooms(data)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    }
  }, [user])

  const fetchMessages = useCallback(async (roomId: string) => {
    setIsLoading(true)
    try {
      const data = await getMessages(roomId)
      setMessages(data)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  useEffect(() => {
    if (!selectedRoomId) return
    fetchMessages(selectedRoomId)

    const subscription = subscribeToMessages(selectedRoomId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [selectedRoomId, fetchMessages])

  const handleSendMessage = async (content: string) => {
    if (!selectedRoomId || !user) return
    try {
      await sendMessage({
        content,
        sender_id: user.id,
        room_id: selectedRoomId,
        type: "group",
      })
    } catch (error: any) {
      toast.error(error.message || "Ошибка отправки")
    }
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden">
          <ChatRoomList
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            onCreateRoom={() => toast("Создание чата в разработке")}
          />

          {selectedRoomId ? (
            <ChatMessages
              messages={messages}
              currentUser={user}
              roomName={selectedRoom?.name || "Чат"}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-coral-100 to-turquoise-100 dark:from-coral-900/30 dark:to-turquoise-900/30 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-coral-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Выберите чат</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Выберите чат из списка слева, чтобы начать общение
                </p>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
