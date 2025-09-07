"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Star } from "lucide-react"
import {
  type UserProgress,
  type Achievement,
  getPointsForNextLevel,
  checkAchievements,
  achievements,
  getDefaultProgress,
} from "@/lib/gamification"

interface ProgressDashboardProps {
  onAchievementUnlocked?: (achievement: Achievement) => void
}

export function ProgressDashboard({ onAchievementUnlocked }: ProgressDashboardProps) {
  const [progress, setProgress] = useState<UserProgress>(getDefaultProgress())
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("mindfulai_progress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  useEffect(() => {
    // Check for new achievements
    const newAchievements = checkAchievements(progress)
    if (newAchievements.length > 0) {
      const updatedProgress = {
        ...progress,
        achievementsUnlocked: [...progress.achievementsUnlocked, ...newAchievements.map((a) => a.id)],
        totalPoints: progress.totalPoints + newAchievements.reduce((sum, a) => sum + a.reward.points, 0),
      }

      setProgress(updatedProgress)
      setRecentAchievements(newAchievements)
      localStorage.setItem("mindfulai_progress", JSON.stringify(updatedProgress))

      newAchievements.forEach((achievement) => {
        onAchievementUnlocked?.(achievement)
      })
    }
  }, [progress]) // Updated to include all dependencies

  const pointsToNextLevel = getPointsForNextLevel(progress.totalPoints)
  const currentLevelPoints =
    progress.totalPoints -
    (progress.level === 1
      ? 0
      : [0, 50, 150, 300, 500, 750][Math.min(progress.level - 1, 5)] || 750 + (progress.level - 6) * 300)
  const nextLevelPoints = pointsToNextLevel + currentLevelPoints

  const weeklyProgress = {
    moodCheckins: (progress.weeklyGoals.moodCheckins.current / progress.weeklyGoals.moodCheckins.target) * 100,
    chatSessions: (progress.weeklyGoals.chatSessions.current / progress.weeklyGoals.chatSessions.target) * 100,
    resourcesCompleted:
      (progress.weeklyGoals.resourcesCompleted.current / progress.weeklyGoals.resourcesCompleted.target) * 100,
  }

  const unlockedAchievements = achievements.filter((a) => progress.achievementsUnlocked.includes(a.id))

  return (
    <div className="space-y-6">
      {/* Level and Points */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                Level {progress.level}
              </CardTitle>
              <CardDescription>
                {progress.totalPoints} points • {pointsToNextLevel} points to next level
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">day streak</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {progress.level + 1}</span>
              <span>
                {currentLevelPoints}/{nextLevelPoints}
              </span>
            </div>
            <Progress value={(currentLevelPoints / nextLevelPoints) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Weekly Goals
          </CardTitle>
          <CardDescription>Track your wellness activities this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mood Check-ins</span>
                <span>
                  {progress.weeklyGoals.moodCheckins.current}/{progress.weeklyGoals.moodCheckins.target}
                </span>
              </div>
              <Progress value={weeklyProgress.moodCheckins} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Chat Sessions</span>
                <span>
                  {progress.weeklyGoals.chatSessions.current}/{progress.weeklyGoals.chatSessions.target}
                </span>
              </div>
              <Progress value={weeklyProgress.chatSessions} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Resources Completed</span>
                <span>
                  {progress.weeklyGoals.resourcesCompleted.current}/{progress.weeklyGoals.resourcesCompleted.target}
                </span>
              </div>
              <Progress value={weeklyProgress.resourcesCompleted} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary">{progress.moodCheckins}</div>
            <div className="text-sm text-muted-foreground">Mood Check-ins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary">{progress.chatSessions}</div>
            <div className="text-sm text-muted-foreground">Chat Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary">{progress.resourcesCompleted}</div>
            <div className="text-sm text-muted-foreground">Resources Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary">{progress.longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              New Achievements!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-semibold">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  <Badge className="ml-auto">+{achievement.reward.points} points</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </CardTitle>
          <CardDescription>Your wellness journey milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const isUnlocked = progress.achievementsUnlocked.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isUnlocked ? "bg-green-50 border-green-200" : "bg-muted/50 border-border"
                  }`}
                >
                  <span className={`text-2xl ${isUnlocked ? "" : "grayscale opacity-50"}`}>{achievement.icon}</span>
                  <div className="flex-1">
                    <div className={`font-semibold ${isUnlocked ? "text-green-800" : "text-muted-foreground"}`}>
                      {achievement.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  {isUnlocked && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Unlocked
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
