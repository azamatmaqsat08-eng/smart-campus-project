"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetPassword } from "@/services/auth"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSent(true)
      toast.success("Инструкции отправлены на email")
    } catch (error: any) {
      toast.error(error.message || "Ошибка отправки")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-main shadow-glow mb-4"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text">Smart Campus</h1>
        </div>

        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
          {isSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-semibold">Проверьте почту</h2>
              <p className="text-sm text-muted-foreground">
                Мы отправили инструкции по восстановлению пароля на {email}
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="rounded-xl mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Вернуться к входу
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Восстановление пароля</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Введите email, и мы отправим вам инструкции
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="student@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-main hover:opacity-90 h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    "Отправить инструкции"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm text-coral-500 hover:text-coral-600 font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Вернуться к входу
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
