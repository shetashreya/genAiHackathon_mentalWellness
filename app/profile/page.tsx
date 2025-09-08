"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, User, Trophy, Target, Award, TrendingUp, Settings, Edit3 } from "lucide-react"

interface UserProfile {
  nickname: string
  age: string
  email: string
  aboutMe: string
  avatar: string
  preferences: {
    affirmationStyle: string
    notifications: {
      moodReminder: boolean
      waterReminder: boolean
      postureReminder: boolean
      bedtimeRoutine: boolean
    }
  }
  goals: string[]
}

interface WellnessStats {
  totalMoodEntries: number
  currentStreak: number
  longestStreak: number
  waterIntakeAverage: number
  completedResources: number
  level: number
  totalPoints: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    nickname: "",
    age: "",
    email: "",
    aboutMe: "",
    avatar: "",
    preferences: {
      affirmationStyle: "motivational",
      notifications: {
        moodReminder: true,
        waterReminder: true,
        postureReminder: true,
        bedtimeRoutine: true,
      },
    },
    goals: [],
  })
  const [stats, setStats] = useState<WellnessStats>({
    totalMoodEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    waterIntakeAverage: 0,
    completedResources: 0,
    level: 1,
    totalPoints: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [newGoal, setNewGoal] = useState("")

  useEffect(() => {
    loadProfileData()
    calculateStats()
  }, [])

  const loadProfileData = () => {
    // Load user data
    const userData = localStorage.getItem("mindfulai_user")
    if (userData) {
      const user = JSON.parse(userData)
      setProfile((prev) => ({
        ...prev,
        nickname: user.nickname || "",
        preferences: {
          ...prev.preferences,
          affirmationStyle: user.affirmationStyle || "motivational",
        },
      }))
    }

    // Load profile data
    const profileData = localStorage.getItem("mindfulai_profile")
    if (profileData) {
      setProfile(JSON.parse(profileData))
    }
  }

  const calculateStats = () => {
    // Calculate mood entries
    const moodEntries = JSON.parse(localStorage.getItem("mindfulai_mood_entries") || "[]")

    // Calculate streak
    const progress = JSON.parse(localStorage.getItem("mindfulai_progress") || "{}")

    // Calculate water intake average
    const waterData = JSON.parse(localStorage.getItem("mindfulai_water_intake") || "{}")

    // Calculate completed resources
    const completedResources = JSON.parse(localStorage.getItem("mindfulai_completed_resources") || "[]")

    setStats({
      totalMoodEntries: moodEntries.length,
      currentStreak: progress.currentStreak || 0,
      longestStreak: progress.longestStreak || 0,
      waterIntakeAverage: waterData.count || 0,
      completedResources: completedResources.length,
      level: progress.level || 1,
      totalPoints: progress.totalPoints || 0,
    })
  }

  const saveProfile = () => {
    localStorage.setItem("mindfulai_profile", JSON.stringify(profile))

    // Update user data with new preferences
    const userData = {
      nickname: profile.nickname,
      preferences: [],
      affirmationStyle: profile.preferences.affirmationStyle,
    }
    localStorage.setItem("mindfulai_user", JSON.stringify(userData))

    setIsEditing(false)
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setProfile((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }))
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }))
  }

  const achievements = [
    {
      id: "first_checkin",
      name: "First Steps",
      description: "Completed your first mood check-in",
      unlocked: stats.totalMoodEntries > 0,
    },
    {
      id: "week_streak",
      name: "Week Warrior",
      description: "Maintained a 7-day streak",
      unlocked: stats.longestStreak >= 7,
    },
    {
      id: "hydration_hero",
      name: "Hydration Hero",
      description: "Consistently tracking water intake",
      unlocked: stats.waterIntakeAverage >= 6,
    },
    {
      id: "resource_explorer",
      name: "Resource Explorer",
      description: "Completed 5 wellness resources",
      unlocked: stats.completedResources >= 5,
    },
    { id: "level_up", name: "Level Up", description: "Reached level 3", unlocked: stats.level >= 3 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/30 bg-card/90 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
              <p className="text-muted-foreground">Manage your wellness journey and preferences</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
              className={isEditing ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Photo & Basic Info */}
            <Card className="shadow-warm border-primary/20 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <User className="w-6 h-6" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-warm">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-background" />
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-accent hover:bg-accent/80"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Basic Info Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nickname" className="text-caramel">
                      Nickname
                    </Label>
                    <Input
                      id="nickname"
                      value={profile.nickname}
                      onChange={(e) => setProfile((prev) => ({ ...prev, nickname: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-mocha/50 border-caramel/20 text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-caramel">
                      Age
                    </Label>
                    <Input
                      id="age"
                      value={profile.age}
                      onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-mocha/50 border-caramel/20 text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-caramel">
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-mocha/50 border-caramel/20 text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aboutMe" className="text-caramel">
                      About Me
                    </Label>
                    <Textarea
                      id="aboutMe"
                      value={profile.aboutMe}
                      onChange={(e) => setProfile((prev) => ({ ...prev, aboutMe: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Share your wellness goals or anything about yourself..."
                      className="bg-mocha/50 border-caramel/20 text-foreground"
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={saveProfile} className="w-full bg-gradient-to-r from-primary to-secondary">
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Personalization Settings */}
            <Card className="shadow-warm border-amber/20 bg-gradient-to-br from-mocha/50 to-amber/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber">
                  <Settings className="w-6 h-6" />
                  Personalization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-caramel">Affirmation Style</Label>
                  <select
                    value={profile.preferences.affirmationStyle}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, affirmationStyle: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-mocha/50 border border-caramel/20 rounded-md text-foreground"
                  >
                    <option value="motivational">Motivational</option>
                    <option value="calming">Calming</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-caramel">Notification Preferences</Label>
                  {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </span>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setProfile((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: { ...prev.preferences.notifications, [key]: checked },
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Wellness Stats */}
          <div className="space-y-6">
            <Card className="shadow-warm border-secondary/20 bg-gradient-to-br from-secondary/10 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-secondary">
                  <TrendingUp className="w-6 h-6" />
                  Wellness Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-mocha/30 rounded-xl">
                    <div className="text-2xl font-bold text-caramel">{stats.level}</div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                  <div className="text-center p-4 bg-mocha/30 rounded-xl">
                    <div className="text-2xl font-bold text-amber">{stats.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-caramel">Mood Entries</span>
                      <span className="text-muted-foreground">{stats.totalMoodEntries}</span>
                    </div>
                    <Progress value={Math.min((stats.totalMoodEntries / 30) * 100, 100)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-caramel">Current Streak</span>
                      <span className="text-muted-foreground">{stats.currentStreak} days</span>
                    </div>
                    <Progress value={Math.min((stats.currentStreak / 30) * 100, 100)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-caramel">Resources Completed</span>
                      <span className="text-muted-foreground">{stats.completedResources}</span>
                    </div>
                    <Progress value={Math.min((stats.completedResources / 20) * 100, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Achievements */}
            <Card className="shadow-warm border-gold/20 bg-gradient-to-br from-mocha/50 to-gold/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gold">
                  <Target className="w-6 h-6" />
                  Personal Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a new goal..."
                      className="bg-mocha/50 border-caramel/20"
                    />
                    <Button onClick={addGoal} size="sm" className="bg-gold text-background">
                      Add
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {profile.goals.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No goals set yet. Add some to track your progress!</p>
                  ) : (
                    profile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-mocha/30 rounded-lg">
                        <span className="text-sm text-foreground">{goal}</span>
                        {isEditing && (
                          <Button
                            onClick={() => removeGoal(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-6">
            <Card className="shadow-warm border-accent/20 bg-gradient-to-br from-accent/10 to-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent">
                  <Trophy className="w-6 h-6" />
                  Achievements
                </CardTitle>
                <CardDescription>Your wellness milestones and badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-caramel/20 to-amber/20 border-caramel/30"
                        : "bg-mocha/20 border-border/20 opacity-60"
                    }`}
                    whileHover={achievement.unlocked ? { scale: 1.02 } : {}}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.unlocked ? "bg-caramel text-background" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${achievement.unlocked ? "text-caramel" : "text-muted-foreground"}`}
                        >
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="mt-2 bg-caramel/20 text-caramel">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
