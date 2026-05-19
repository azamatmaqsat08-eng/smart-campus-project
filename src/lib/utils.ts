import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return "только что"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн. назад`
  return formatDate(date)
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function generateAvatarColor(name: string): string {
  const colors = [
    "bg-coral-400",
    "bg-turquoise-400",
    "bg-blue-400",
    "bg-purple-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-rose-400",
    "bg-indigo-400",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
