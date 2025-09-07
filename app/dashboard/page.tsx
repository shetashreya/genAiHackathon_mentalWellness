"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodCheckin } from "@/components/mood-checkin"
import { MoodHistory } from "@/components/mood-history"
import { ResourceLibrary } from "@/components/resource-library"
import { ResourceViewer } from "@/components/resource-viewer"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { AchievementNotification } from "@/components/achievement-notification"
import { StreakCelebration } from "@/components/streak-celebration"
import { Heart, MessageCircle, BookOpen, Calendar, Menu, Trophy } from "lucide-react"
import type { WellnessResource } from "@/lib/resources"
import { type UserProgress, type Achievement, updateProgress, getDefaultProgress } from "@/lib/gamification"

interface MoodEntry {
  date: string
  overall: number
  energy: number
  stress: number
  emotions: string[]
  notes?: string
}

interface UserData {
  nickname: string
  preferences: string[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [showMoodCheckin, setShowMoodCheckin] = useState(false)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedResource, setSelectedResource] = useState<WellnessResource | null>(null)
  const [progress, setProgress] = useState<UserProgress>(getDefaultProgress())
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)

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

    // Load mood entries
    const entries = localStorage.getItem("mindfulai_mood_entries")
    if (entries) {
      setMoodEntries(JSON.parse(entries))
    }

    // Load progress
    const savedProgress = localStorage.getItem("mindfulai_progress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [router])

  const handleMoodSubmit = (moodData: any) => {
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      ...moodData,
    }

    const updatedEntries = [...moodEntries, newEntry]
    setMoodEntries(updatedEntries)
    localStorage.setItem("mindfulai_mood_entries", JSON.stringify(updatedEntries))

    const updatedProgress = updateProgress(progress, "mood_checkin", 5)
    setProgress(updatedProgress)
    localStorage.setItem("mindfulai_progress", JSON.stringify(updatedProgress))

    // Check for streak celebration
    if (updatedProgress.currentStreak > progress.currentStreak && updatedProgress.currentStreak % 7 === 0) {
      setShowStreakCelebration(true)
    }

    setShowMoodCheckin(false)
  }

  const handleMoodSkip = () => {
    setShowMoodCheckin(false)
  }

  const handleResourceComplete = (resourceId: string, notes?: string) => {
    // Save completed resource
    const completed = JSON.parse(localStorage.getItem("mindfulai_completed_resources") || "[]")
    const updatedCompleted = [...completed, resourceId]
    localStorage.setItem("mindfulai_completed_resources", JSON.stringify(updatedCompleted))

    // Save resource notes if provided
    if (notes) {
      const resourceNotes = JSON.parse(localStorage.getItem("mindfulai_resource_notes") || "{}")
      resourceNotes[resourceId] = {
        notes,
        completedAt: new Date().toISOString(),
      }
      localStorage.setItem("mindfulai_resource_notes", JSON.stringify(resourceNotes))
    }

    const updatedProgress = updateProgress(progress, "resource_completed", 10)
    setProgress(updatedProgress)
    localStorage.setItem("mindfulai_progress", JSON.stringify(updatedProgress))

    setSelectedResource(null)
  }

  const handleAchievementUnlocked = (achievement: Achievement) => {
    setNewAchievement(achievement)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (showMoodCheckin) {
    return <MoodCheckin onSubmit={handleMoodSubmit} onSkip={handleMoodSkip} />
  }

  if (selectedResource) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <ResourceViewer
            resource={selectedResource}
            onBack={() => setSelectedResource(null)}
            onComplete={handleResourceComplete}
          />
        </div>
      </div>
    )
  }

  if (showStreakCelebration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <StreakCelebration streak={progress.currentStreak} onContinue={() => setShowStreakCelebration(false)} />
        </div>
      </div>
    )
  }

  const hasCheckedInToday = moodEntries.some(
    (entry) => new Date(entry.date).toDateString() === new Date().toDateString(),
  )

  // Get recent moods for personalization
  const recentMoods = moodEntries
    .slice(-7) // Last 7 entries
    .flatMap((entry) => entry.emotions)

  return (
    <div className="min-h-screen bg-background">
      {/* Achievement Notification */}
      <AchievementNotification achievement={newAchievement} onDismiss={() => setNewAchievement(null)} />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Welcome back, {user.nickname}!</h1>
                <p className="text-sm text-muted-foreground">
                  Level {progress.level} • {progress.currentStreak} day streak
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {[
              { id: "overview", label: "Overview", icon: Heart },
              { id: "progress", label: "Progress", icon: Trophy },
              { id: "mood", label: "Mood Tracking", icon: Calendar },
              { id: "chat", label: "AI Companion", icon: MessageCircle },
              { id: "resources", label: "Resources", icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setShowMoodCheckin(true)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {hasCheckedInToday ? "Update Check-in" : "Daily Check-in"}
                      </CardTitle>
                      <CardDescription>
                        {hasCheckedInToday ? "Update how you're feeling" : "Track your mood today"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/chat")}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Chat with AI</CardTitle>
                      <CardDescription>Talk to your AI companion</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("resources")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Wellness Resources</CardTitle>
                      <CardDescription>Explore helpful content</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Mood Overview */}
            <MoodHistory entries={moodEntries} />
          </div>
        )}

        {activeTab === "progress" && <ProgressDashboard onAchievementUnlocked={handleAchievementUnlocked} />}

        {activeTab === "mood" && <MoodHistory entries={moodEntries} />}

        {activeTab === "chat" && (
          <Card>
            <CardHeader>
              <CardTitle>AI Companion Chat</CardTitle>
              <CardDescription>Your personal AI companion for mental wellness support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Ready to chat with your AI companion? Start a conversation in a dedicated, distraction-free
                  environment.
                </p>
                <Button onClick={() => router.push("/chat")} size="lg">
                  Start Chatting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "resources" && (
          <ResourceLibrary
            userPreferences={user.preferences}
            recentMoods={recentMoods}
            onResourceSelect={setSelectedResource}
          />
        )}
      </main>
    </div>
  )
}
