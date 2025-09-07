// Gamification system for mental wellness journey

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "mood" | "chat" | "resources" | "streaks" | "milestones"
  requirement: {
    type: "count" | "streak" | "milestone" | "completion"
    target: number
    metric: string
  }
  reward: {
    points: number
    badge: string
  }
  unlockedAt?: string
}

export interface UserProgress {
  level: number
  totalPoints: number
  currentStreak: number
  longestStreak: number
  moodCheckins: number
  chatSessions: number
  resourcesCompleted: number
  achievementsUnlocked: string[]
  lastActivity: string
  weeklyGoals: {
    moodCheckins: { target: number; current: number }
    chatSessions: { target: number; current: number }
    resourcesCompleted: { target: number; current: number }
  }
}

export const achievements: Achievement[] = [
  {
    id: "first-checkin",
    title: "First Step",
    description: "Completed your first mood check-in",
    icon: "🌱",
    category: "mood",
    requirement: { type: "count", target: 1, metric: "mood_checkins" },
    reward: { points: 10, badge: "Beginner" },
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "7 days of consistent mood tracking",
    icon: "🔥",
    category: "streaks",
    requirement: { type: "streak", target: 7, metric: "daily_checkins" },
    reward: { points: 50, badge: "Consistent" },
  },
  {
    id: "first-chat",
    title: "Breaking the Ice",
    description: "Had your first conversation with your AI companion",
    icon: "💬",
    category: "chat",
    requirement: { type: "count", target: 1, metric: "chat_sessions" },
    reward: { points: 15, badge: "Communicator" },
  },
  {
    id: "resource-explorer",
    title: "Resource Explorer",
    description: "Completed 5 wellness resources",
    icon: "📚",
    category: "resources",
    requirement: { type: "count", target: 5, metric: "resources_completed" },
    reward: { points: 30, badge: "Explorer" },
  },
  {
    id: "month-milestone",
    title: "Monthly Milestone",
    description: "30 days of using MindfulAI",
    icon: "🏆",
    category: "milestones",
    requirement: { type: "milestone", target: 30, metric: "days_active" },
    reward: { points: 100, badge: "Dedicated" },
  },
  {
    id: "mood-master",
    title: "Mood Master",
    description: "Completed 50 mood check-ins",
    icon: "🎯",
    category: "mood",
    requirement: { type: "count", target: 50, metric: "mood_checkins" },
    reward: { points: 75, badge: "Master" },
  },
  {
    id: "wellness-champion",
    title: "Wellness Champion",
    description: "Completed 20 wellness resources",
    icon: "⭐",
    category: "resources",
    requirement: { type: "count", target: 20, metric: "resources_completed" },
    reward: { points: 100, badge: "Champion" },
  },
  {
    id: "super-streak",
    title: "Super Streak",
    description: "30 days of consistent activity",
    icon: "🚀",
    category: "streaks",
    requirement: { type: "streak", target: 30, metric: "daily_checkins" },
    reward: { points: 150, badge: "Superstar" },
  },
]

export interface WellnessChallenge {
  id: string
  title: string
  description: string
  duration: number // days
  goals: {
    moodCheckins?: number
    chatSessions?: number
    resourcesCompleted?: number
    specificResources?: string[]
  }
  reward: {
    points: number
    badge: string
    title: string
  }
  startDate?: string
  progress?: {
    moodCheckins: number
    chatSessions: number
    resourcesCompleted: number
  }
}

export const weeklyChallenge: WellnessChallenge[] = [
  {
    id: "mindful-week",
    title: "Mindful Week",
    description: "Focus on mindfulness and self-awareness this week",
    duration: 7,
    goals: {
      moodCheckins: 5,
      resourcesCompleted: 3,
      specificResources: ["breathing-4-7-8", "progressive-muscle-relaxation"],
    },
    reward: {
      points: 75,
      badge: "Mindful",
      title: "Mindfulness Explorer",
    },
  },
  {
    id: "connection-week",
    title: "Connection Week",
    description: "Build stronger connections with yourself and others",
    duration: 7,
    goals: {
      chatSessions: 4,
      resourcesCompleted: 2,
      specificResources: ["social-connection"],
    },
    reward: {
      points: 60,
      badge: "Connected",
      title: "Connection Builder",
    },
  },
  {
    id: "growth-week",
    title: "Growth Week",
    description: "Focus on personal growth and positive habits",
    duration: 7,
    goals: {
      moodCheckins: 7,
      chatSessions: 3,
      resourcesCompleted: 4,
    },
    reward: {
      points: 100,
      badge: "Growth",
      title: "Growth Seeker",
    },
  },
]

export function calculateLevel(points: number): number {
  // Level progression: 0-49 (Level 1), 50-149 (Level 2), 150-299 (Level 3), etc.
  if (points < 50) return 1
  if (points < 150) return 2
  if (points < 300) return 3
  if (points < 500) return 4
  if (points < 750) return 5
  return Math.floor((points - 750) / 300) + 6
}

export function getPointsForNextLevel(currentPoints: number): number {
  const currentLevel = calculateLevel(currentPoints)
  const levelThresholds = [0, 50, 150, 300, 500, 750]

  if (currentLevel <= 5) {
    return levelThresholds[currentLevel] - currentPoints
  }

  const nextThreshold = 750 + (currentLevel - 5) * 300
  return nextThreshold - currentPoints
}

export function checkAchievements(progress: UserProgress): Achievement[] {
  const newAchievements: Achievement[] = []

  achievements.forEach((achievement) => {
    if (progress.achievementsUnlocked.includes(achievement.id)) return

    let isUnlocked = false

    switch (achievement.requirement.type) {
      case "count":
        switch (achievement.requirement.metric) {
          case "mood_checkins":
            isUnlocked = progress.moodCheckins >= achievement.requirement.target
            break
          case "chat_sessions":
            isUnlocked = progress.chatSessions >= achievement.requirement.target
            break
          case "resources_completed":
            isUnlocked = progress.resourcesCompleted >= achievement.requirement.target
            break
        }
        break
      case "streak":
        if (achievement.requirement.metric === "daily_checkins") {
          isUnlocked = progress.currentStreak >= achievement.requirement.target
        }
        break
      case "milestone":
        if (achievement.requirement.metric === "days_active") {
          const daysSinceStart = Math.floor(
            (Date.now() - new Date(progress.lastActivity).getTime()) / (1000 * 60 * 60 * 24),
          )
          isUnlocked = daysSinceStart >= achievement.requirement.target
        }
        break
    }

    if (isUnlocked) {
      newAchievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
    }
  })

  return newAchievements
}

export function updateProgress(
  currentProgress: UserProgress,
  action: "mood_checkin" | "chat_session" | "resource_completed",
  points = 0,
): UserProgress {
  const today = new Date().toDateString()
  const lastActivityDate = new Date(currentProgress.lastActivity).toDateString()

  // Update streak
  let newStreak = currentProgress.currentStreak
  if (today !== lastActivityDate) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (lastActivityDate === yesterday.toDateString()) {
      newStreak += 1
    } else {
      newStreak = 1
    }
  }

  const updatedProgress: UserProgress = {
    ...currentProgress,
    currentStreak: newStreak,
    longestStreak: Math.max(currentProgress.longestStreak, newStreak),
    totalPoints: currentProgress.totalPoints + points,
    level: calculateLevel(currentProgress.totalPoints + points),
    lastActivity: new Date().toISOString(),
  }

  // Update specific metrics
  switch (action) {
    case "mood_checkin":
      updatedProgress.moodCheckins += 1
      updatedProgress.weeklyGoals.moodCheckins.current += 1
      break
    case "chat_session":
      updatedProgress.chatSessions += 1
      updatedProgress.weeklyGoals.chatSessions.current += 1
      break
    case "resource_completed":
      updatedProgress.resourcesCompleted += 1
      updatedProgress.weeklyGoals.resourcesCompleted.current += 1
      break
  }

  return updatedProgress
}

export function getDefaultProgress(): UserProgress {
  return {
    level: 1,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    moodCheckins: 0,
    chatSessions: 0,
    resourcesCompleted: 0,
    achievementsUnlocked: [],
    lastActivity: new Date().toISOString(),
    weeklyGoals: {
      moodCheckins: { target: 5, current: 0 },
      chatSessions: { target: 3, current: 0 },
      resourcesCompleted: { target: 2, current: 0 },
    },
  }
}
