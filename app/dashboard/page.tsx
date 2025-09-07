"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoodCheckin } from "@/components/mood-checkin"
import { MoodHistory } from "@/components/mood-history"
import { ResourceLibrary } from "@/components/resource-library"
import { ResourceViewer } from "@/components/resource-viewer"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { AchievementNotification } from "@/components/achievement-notification"
import { StreakCelebration } from "@/components/streak-celebration"
import {
  Heart,
  MessageCircle,
  BookOpen,
  Calendar,
  Sparkles,
  Trophy,
  Sun,
  Droplets,
  Speech as Stretch,
  Moon,
  Target,
  Smile,
  Wind,
  Play,
  Pause,
} from "lucide-react"
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
  const [dailyAffirmation, setDailyAffirmation] = useState("")
  const [journalingPrompt, setJournalingPrompt] = useState("")
  const [waterIntake, setWaterIntake] = useState(0)
  const [showBreathingExercise, setShowBreathingExercise] = useState(false)
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [showSleepRoutine, setShowSleepRoutine] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState("")

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

    const savedWaterIntake = localStorage.getItem("mindfulai_water_intake")
    if (savedWaterIntake) {
      const waterData = JSON.parse(savedWaterIntake)
      const today = new Date().toDateString()
      if (waterData.date === today) {
        setWaterIntake(waterData.count)
      }
    }

    // Generate daily content
    generateDailyContent()

    // Check if evening for sleep routine
    const hour = new Date().getHours()
    setShowSleepRoutine(hour >= 20 || hour <= 6)
  }, [router])

  const generateDailyContent = () => {
    const affirmations = [
      "You are capable of amazing things today.",
      "Your feelings are valid and you deserve kindness.",
      "Every small step forward is progress worth celebrating.",
      "You have the strength to handle whatever comes your way.",
      "Your mental health matters and you're taking great care of yourself.",
    ]

    const prompts = [
      "What's one thing you're grateful for right now?",
      "Describe a moment today when you felt proud of yourself.",
      "What would you tell a friend who's going through what you're experiencing?",
      "What's one small thing that brought you joy recently?",
      "How do you want to feel by the end of today?",
    ]

    const challenges = [
      "5-Day Focus Boost: Practice 5 minutes of mindfulness daily",
      "Gratitude Week: Write down 3 things you're grateful for each day",
      "Movement Challenge: Take a 10-minute walk daily",
      "Sleep Better: Follow a consistent bedtime routine for 7 days",
      "Digital Detox: Spend 30 minutes phone-free before bed",
    ]

    const today = new Date().toDateString()
    const savedDate = localStorage.getItem("mindfulai_daily_content_date")

    if (savedDate !== today) {
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]

      setDailyAffirmation(randomAffirmation)
      setJournalingPrompt(randomPrompt)
      setCurrentChallenge(randomChallenge)

      localStorage.setItem("mindfulai_daily_content_date", today)
      localStorage.setItem("mindfulai_daily_affirmation", randomAffirmation)
      localStorage.setItem("mindfulai_daily_prompt", randomPrompt)
      localStorage.setItem("mindfulai_current_challenge", randomChallenge)
    } else {
      setDailyAffirmation(localStorage.getItem("mindfulai_daily_affirmation") || affirmations[0])
      setJournalingPrompt(localStorage.getItem("mindfulai_daily_prompt") || prompts[0])
      setCurrentChallenge(localStorage.getItem("mindfulai_current_challenge") || challenges[0])
    }
  }

  const handleWaterIntake = () => {
    const newCount = waterIntake + 1
    setWaterIntake(newCount)

    const today = new Date().toDateString()
    localStorage.setItem(
      "mindfulai_water_intake",
      JSON.stringify({
        date: today,
        count: newCount,
      }),
    )
  }

  const startBreathingExercise = () => {
    setBreathingActive(true)
    setBreathingCount(0)
    setBreathingPhase("inhale")

    const breathingCycle = () => {
      setBreathingPhase("inhale")
      setTimeout(() => setBreathingPhase("hold"), 4000)
      setTimeout(() => setBreathingPhase("exhale"), 8000)
      setTimeout(() => {
        setBreathingCount((prev) => prev + 1)
        if (breathingCount < 5) {
          breathingCycle()
        } else {
          setBreathingActive(false)
        }
      }, 12000)
    }

    breathingCycle()
  }

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

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/30 bg-card/90 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-8">
          <motion.div
            className="text-center space-y-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-warm">
                <Heart className="w-8 h-8 text-background" />
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <Sparkles className="w-6 h-6 text-accent" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-sans">
              Hi {user?.nickname}, how are you feeling today?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome to your personal wellness space. Take a moment to check in with yourself and explore the tools
              designed just for you.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 bg-card/50 rounded-full px-4 py-2 border border-primary/20">
                <Trophy className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-secondary">Level {progress.level}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 rounded-full px-4 py-2 border border-accent/20">
                <Sun className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">{progress.currentStreak} day streak</span>
              </div>
            </div>
          </motion.div>
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
              {/* Top Section: Mood Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <Card className="shadow-warm hover-glow border-primary/20 bg-gradient-to-br from-card to-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <Calendar className="w-6 h-6" />
                      Daily Mood Check-in
                    </CardTitle>
                    <CardDescription>
                      {hasCheckedInToday ? "Update how you're feeling" : "Track your mood today"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setShowMoodCheckin(true)}
                      className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:shadow-warm"
                      size="lg"
                    >
                      {hasCheckedInToday ? "Update Check-in" : "Start Check-in"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-warm border-accent/20 bg-gradient-to-br from-accent/10 to-secondary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-accent">
                      <Smile className="w-6 h-6" />
                      Daily Affirmation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-foreground italic">"{dailyAffirmation}"</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Center Grid: Main Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div whileHover={{ scale: 1.02, y: -4 }}>
                  <Card
                    className="cursor-pointer shadow-warm hover-glow border-primary/20 bg-gradient-to-br from-card to-muted/30"
                    onClick={() => router.push("/chat")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-warm">
                          <MessageCircle className="w-7 h-7 text-background" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-primary">AI Companion</CardTitle>
                          <CardDescription>Chat with your supportive AI friend</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>

                <Card className="shadow-warm border-secondary/20 bg-gradient-to-br from-secondary/10 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-secondary">
                      <BookOpen className="w-6 h-6" />
                      Journaling Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{journalingPrompt}</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Start Writing
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-warm border-accent/20 bg-gradient-to-br from-accent/10 to-secondary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-accent">
                      <Wind className="w-6 h-6" />
                      Quick Stress Relief
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setShowBreathingExercise(true)}
                      className="w-full bg-gradient-to-r from-accent to-secondary text-background"
                    >
                      Start Breathing Exercise
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Grid: Wellness Nudges & Growth */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-warm border-blue-400/20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-base">
                      <Droplets className="w-5 h-5" />
                      Water Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{waterIntake}/8 glasses</span>
                        <Button onClick={handleWaterIntake} size="sm" variant="outline">
                          +1
                        </Button>
                      </div>
                      <Progress value={(waterIntake / 8) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-warm border-green-400/20 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 text-base">
                      <Stretch className="w-5 h-5" />
                      Posture Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">Time for a stretch break?</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Stretch Now
                    </Button>
                  </CardContent>
                </Card>

                {showSleepRoutine && (
                  <Card className="shadow-warm border-purple-400/20 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-base">
                        <Moon className="w-5 h-5" />
                        Sleep Routine
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">Ready for bedtime?</p>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        Start Routine
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card className="shadow-warm border-orange-400/20 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-base">
                      <Target className="w-5 h-5" />
                      Growth Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">{currentChallenge}</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
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

      <AnimatePresence>
        {showBreathingExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBreathingExercise(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-md w-full shadow-warm border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-primary">Breathing Exercise</h3>
                <div className="relative">
                  <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center"
                    animate={{
                      scale: breathingPhase === "inhale" ? 1.2 : breathingPhase === "exhale" ? 0.8 : 1,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                  >
                    <Wind className="w-12 h-12 text-background" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium capitalize text-primary">{breathingPhase}</p>
                  <p className="text-sm text-muted-foreground">Cycle {breathingCount + 1} of 6</p>
                </div>
                <div className="flex gap-3">
                  {!breathingActive ? (
                    <Button
                      onClick={startBreathingExercise}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={() => setBreathingActive(false)} variant="outline" className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={() => setShowBreathingExercise(false)} variant="outline">
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
