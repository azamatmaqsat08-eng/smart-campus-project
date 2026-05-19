import { create } from "zustand"
import type { User } from "@/types"
import { getCurrentUser, signOut } from "@/services/auth"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  fetchUser: async () => {
    try {
      const user = await getCurrentUser()
      set({ user, isAuthenticated: !!user, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  logout: async () => {
    await signOut()
    set({ user: null, isAuthenticated: false, isLoading: false })
  },
}))
