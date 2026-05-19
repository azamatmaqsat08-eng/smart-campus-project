"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Search, Shield, User, Mail, Calendar } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { getInitials, formatDate } from "@/lib/utils"
import type { User as UserType } from "@/types"

const supabase = createClient()

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.group?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-main shadow-glow">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Пользователи</h1>
              </div>
              <p className="text-muted-foreground">Управление пользователями платформы</p>
            </div>

            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск пользователей..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 rounded-xl" />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium">Нет пользователей</h3>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border/50 shadow-glass overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Пользователь</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Группа</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Роль</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Дата регистрации</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className="border-b border-border/30 hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="text-xs">{getInitials(user.full_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.full_name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm">{user.group || "—"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className={user.role === "admin" ? "bg-gradient-main text-white" : ""}>
                              {user.role === "admin" ? <><Shield className="h-3 w-3 mr-1" /> Админ</> : <><User className="h-3 w-3 mr-1" /> Студент</>}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(user.created_at)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
