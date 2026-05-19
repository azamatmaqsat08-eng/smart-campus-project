"use client"

import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types"

const supabase = createClient()

export async function signUp(email: string, password: string, userData: Partial<User>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.full_name,
        specialty: userData.specialty,
        group: userData.group,
      },
    },
  })

  if (error) throw error

  // Create user profile in public.users table
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      full_name: userData.full_name,
      specialty: userData.specialty,
      group: userData.group,
      role: "student",
    })

    if (profileError) throw profileError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile as User | null
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)

  if (error) throw error
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName)

  await updateProfile(userId, { avatar_url: publicUrl })

  return publicUrl
}
