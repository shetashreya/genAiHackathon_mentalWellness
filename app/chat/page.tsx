"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AiChat } from "@/components/ai-chat"
import { ChatSuggestions } from "@/components/chat-suggestions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { type UserProgress, updateProgress, getDefaultProgress } from "@/lib/gamification"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ nickname: string } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [progress, setProgress] = useState<UserProgress>(getDefaultProgress())

  useEffect(() => {
    // Check if user is onboarded
    const onboarded = localStorage.getItem("mindfulai_onboarded")
    if (!onboarded) {
      router.push("/onboarding")
      return
    }

    // Load user data
    const userData = localStorage.getItem("mindfulai_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load progress
    const savedProgress = localStorage.getItem("mindfulai_progress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }

    if (savedProgress) {
      const currentProgress = JSON.parse(savedProgress)
      const updatedProgress = updateProgress(currentProgress, "chat_session", 3)
      setProgress(updatedProgress)
      localStorage.setItem("mindfulai_progress", JSON.stringify(updatedProgress))
    }
  }, [router])

  const handleSuggestionClick = (suggestion: string) => {
    setShowSuggestions(false)
    // The suggestion will be handled by the AiChat component
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">AI Companion Chat</h1>
              <p className="text-sm text-muted-foreground">
                Your safe space for conversation and support • Level {progress.level}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {showSuggestions ? (
          <div className="max-w-4xl mx-auto">
            <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            <div className="text-center mt-8">
              <Button onClick={() => setShowSuggestions(false)}>Start Free Conversation</Button>
            </div>
          </div>
        ) : (
          <AiChat userName={user.nickname} />
        )}
      </main>
    </div>
  )
}
