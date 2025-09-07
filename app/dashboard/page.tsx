"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodCheckin } from "@/components/mood-checkin"
import { MoodHistory } from "@/components/mood-history"
import { ResourceLibrary } from "@/components/resource-library"
import { ResourceViewer } from "@/components/resource-viewer"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { AchievementNotification } from "@/components/achievement-notification"
import { StreakCelebration } from "@/components/streak-celebration"
import { Heart, MessageCircle, BookOpen, Calendar, Sparkles, Trophy, Leaf, Sun } from "lucide-react"
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
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <AchievementNotification achievement={newAchievement} onDismiss={() => setNewAchievement(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/30 bg-card/90 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-warm hover-glow">
                  <Heart className="w-6 h-6 text-background" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="w-2 h-2 text-accent-foreground" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-sans">Welcome back, {user.nickname}!</h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-secondary">Level {progress.level}</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <Sun className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">{progress.currentStreak} day streak</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-warm bg-card/50 border-primary/20 hover:bg-primary/10 hover-glow"
              >
                <Leaf className="w-4 h-4 text-primary" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Overview", icon: Heart },
              { id: "progress", label: "Progress", icon: Trophy },
              { id: "mood", label: "Mood", icon: Calendar },
              { id: "chat", label: "AI Companion", icon: MessageCircle },
              { id: "resources", label: "Resources", icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === id
                    ? "text-background shadow-warm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="text-sm font-medium relative z-10">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card
                    className="cursor-pointer shadow-warm hover-glow transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-muted/30"
                    onClick={() => setShowMoodCheckin(true)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-warm">
                          <Calendar className="w-7 h-7 text-background" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-primary">
                            {hasCheckedInToday ? "Update Check-in" : "Daily Check-in"}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {hasCheckedInToday ? "Update how you're feeling" : "Track your mood today"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card
                    className="cursor-pointer shadow-warm hover-glow transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-muted/30"
                    onClick={() => router.push("/chat")}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-warm">
                          <MessageCircle className="w-7 h-7 text-background" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-primary">Chat with AI</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            Talk to your AI companion
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card
                    className="cursor-pointer shadow-warm hover-glow transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-muted/30"
                    onClick={() => setActiveTab("resources")}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center shadow-warm">
                          <BookOpen className="w-7 h-7 text-background" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-primary">Wellness Resources</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            Explore helpful content
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              </div>

              {/* Mood Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <MoodHistory entries={moodEntries} />
              </motion.div>
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressDashboard onAchievementUnlocked={handleAchievementUnlocked} />
            </motion.div>
          )}

          {activeTab === "mood" && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MoodHistory entries={moodEntries} />
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-warm border-primary/20 bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle className="text-primary">AI Companion Chat</CardTitle>
                  <CardDescription>Your personal AI companion for mental wellness support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Ready to chat with your AI companion? Start a conversation in a dedicated, distraction-free
                      environment.
                    </p>
                    <Button
                      onClick={() => router.push("/chat")}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary text-background hover:shadow-warm transition-all duration-300"
                    >
                      Start Chatting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResourceLibrary
                userPreferences={user.preferences}
                recentMoods={recentMoods}
                onResourceSelect={setSelectedResource}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
