"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MoodEntry {
  date: string
  overall: number
  energy: number
  stress: number
  emotions: string[]
  notes?: string
}

interface MoodHistoryProps {
  entries: MoodEntry[]
}

export function MoodHistory({ entries }: MoodHistoryProps) {
  const getRecentTrend = (values: number[]) => {
    if (values.length < 2) return "stable"
    const recent = values.slice(-3)
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    const previous = values.slice(-6, -3)
    if (previous.length === 0) return "stable"
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length

    if (avg > prevAvg + 0.5) return "improving"
    if (avg < prevAvg - 0.5) return "declining"
    return "stable"
  }

  const overallTrend = getRecentTrend(entries.map((e) => e.overall))
  const energyTrend = getRecentTrend(entries.map((e) => e.energy))
  const stressTrend = getRecentTrend(entries.map((e) => e.stress))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "bg-green-100 text-green-800"
      case "declining":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Wellness Trends</CardTitle>
          <CardDescription>How you've been feeling over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Overall Mood</p>
                <p className="text-2xl font-bold">{entries.length > 0 ? entries[entries.length - 1].overall : 0}/10</p>
              </div>
              <Badge className={getTrendColor(overallTrend)}>
                {getTrendIcon(overallTrend)}
                <span className="ml-1 capitalize">{overallTrend}</span>
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Energy Level</p>
                <p className="text-2xl font-bold">{entries.length > 0 ? entries[entries.length - 1].energy : 0}/10</p>
              </div>
              <Badge className={getTrendColor(energyTrend)}>
                {getTrendIcon(energyTrend)}
                <span className="ml-1 capitalize">{energyTrend}</span>
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Stress Level</p>
                <p className="text-2xl font-bold">{entries.length > 0 ? entries[entries.length - 1].stress : 0}/10</p>
              </div>
              <Badge
                className={getTrendColor(
                  stressTrend === "improving" ? "declining" : stressTrend === "declining" ? "improving" : "stable",
                )}
              >
                {getTrendIcon(
                  stressTrend === "improving" ? "declining" : stressTrend === "declining" ? "improving" : "stable",
                )}
                <span className="ml-1 capitalize">
                  {stressTrend === "improving" ? "decreasing" : stressTrend === "declining" ? "increasing" : "stable"}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
          <CardDescription>Your mood entries from the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries
              .slice(-7)
              .reverse()
              .map((entry, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Mood: {entry.overall}/10</Badge>
                      <Badge variant="outline">Energy: {entry.energy}/10</Badge>
                      <Badge variant="outline">Stress: {entry.stress}/10</Badge>
                    </div>
                  </div>
                  {entry.emotions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-2">Emotions:</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.emotions.map((emotion, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            {entries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No mood entries yet. Complete your first check-in to start tracking your wellness journey!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
