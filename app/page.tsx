'use client'

import { ChatLayout } from "@/components/chat-layout";
import { LoginPage } from "@/components/login-page";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { isAuthenticated, login, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />
  }

  return <ChatLayout />
}
