"use client"

import { motion } from "framer-motion"
import { User, Mail, BookOpen, Users, Camera, Save } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/useAuthStore"
import { getInitials } from "@/lib/utils"

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8">Профиль</h1>

            <Card className="border-0 shadow-glass mb-6">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-slate-700 shadow-lg">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user?.full_name || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold">{user?.full_name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      <span className="px-3 py-1 rounded-full bg-coral-100 dark:bg-coral-900/30 text-coral-700 dark:text-coral-300 text-sm font-medium">
                        {user?.specialty}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-turquoise-100 dark:bg-turquoise-900/30 text-turquoise-700 dark:text-turquoise-300 text-sm font-medium">
                        {user?.group}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-glass">
              <CardHeader>
                <CardTitle className="text-lg">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                      <User className="h-4 w-4 text-coral-400" /> ФИО
                    </label>
                    <Input value={user?.full_name} disabled className="rounded-xl bg-muted" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-coral-400" /> Email
                    </label>
                    <Input value={user?.email} disabled className="rounded-xl bg-muted" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-turquoise-400" /> Специальность
                    </label>
                    <Input value={user?.specialty} disabled className="rounded-xl bg-muted" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Users className="h-4 w-4 text-turquoise-400" /> Группа
                    </label>
                    <Input value={user?.group} disabled className="rounded-xl bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}