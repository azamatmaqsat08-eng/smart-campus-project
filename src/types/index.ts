export interface User {
  id: string
  email: string
  full_name: string
  specialty: string
  group: string
  avatar_url?: string
  bio?: string
  role: "student" | "admin"
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  subject: string
  deadline: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  priority: "low" | "medium" | "high"
  user_id: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  location: string
  category: string
  start_date: string
  end_date: string
  max_participants?: number
  current_participants: number
  image_url?: string
  organizer_id: string
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  registered_at: string
}

export interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id?: string
  room_id?: string
  type: "direct" | "group"
  created_at: string
  sender?: User
}

export interface ChatRoom {
  id: string
  name: string
  type: "direct" | "group"
  participants: string[]
  last_message?: Message
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "task" | "event" | "message" | "system"
  read: boolean
  user_id: string
  link?: string
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  image_url?: string
  author_id: string
  published_at: string
  created_at: string
}

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  upcomingEvents: number
  unreadMessages: number
  taskCompletionRate: number
  weeklyActivity: { day: string; tasks: number; events: number }[]
}
