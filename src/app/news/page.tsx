"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Newspaper, Calendar, User } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import type { NewsItem } from "@/types"

const supabase = createClient()

const categories = [
  { value: "", label: "Все" },
  { value: "Учеба", label: "Учеба" },
  { value: "События", label: "События" },
  { value: "Объявления", label: "Объявления" },
]

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*, author:users(full_name)")
        .order("published_at", { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error("Failed to fetch news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Новости кампуса</h1>
              <p className="text-muted-foreground mt-1">
                Будьте в курсе последних событий
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск новостей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-input bg-background px-4 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium">Нет новостей</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover-lift border-0 shadow-glass overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-coral-100 to-turquoise-100 dark:from-coral-900/30 dark:to-turquoise-900/30 flex items-center justify-center flex-shrink-0">
                            <Newspaper className="h-8 w-8 text-coral-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(item.published_at)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 hover:text-coral-500 transition-colors cursor-pointer">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.content}
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {(item as any).author?.full_name || "Администратор"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
