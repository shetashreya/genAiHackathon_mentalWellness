"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Search, BookOpen, Heart, Brain, Moon, Activity, Sparkles } from "lucide-react"
import {
  type WellnessResource,
  getPersonalizedRecommendations,
  getResourcesByCategory,
  searchResources,
} from "@/lib/resources"

interface ResourceLibraryProps {
  userPreferences: string[]
  recentMoods: string[]
  onResourceSelect: (resource: WellnessResource) => void
}

export function ResourceLibrary({ userPreferences, recentMoods, onResourceSelect }: ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [completedResources, setCompletedResources] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("recommended")

  useEffect(() => {
    // Load completed resources from localStorage
    const completed = localStorage.getItem("mindfulai_completed_resources")
    if (completed) {
      setCompletedResources(JSON.parse(completed))
    }
  }, [])

  const personalizedResources = getPersonalizedRecommendations(userPreferences, recentMoods, completedResources)
  const searchResults = searchQuery ? searchResources(searchQuery) : []

  const categories = [
    { id: "meditation", label: "Meditation", icon: Heart, color: "bg-green-100 text-green-700" },
    { id: "breathing", label: "Breathing", icon: Activity, color: "bg-blue-100 text-blue-700" },
    { id: "journaling", label: "Journaling", icon: BookOpen, color: "bg-purple-100 text-purple-700" },
    { id: "education", label: "Education", icon: Brain, color: "bg-orange-100 text-orange-700" },
    { id: "activities", label: "Activities", icon: Sparkles, color: "bg-pink-100 text-pink-700" },
    { id: "sleep", label: "Sleep", icon: Moon, color: "bg-indigo-100 text-indigo-700" },
  ] as const

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const ResourceCard = ({ resource }: { resource: WellnessResource }) => {
    const isCompleted = completedResources.includes(resource.id)
    const categoryInfo = categories.find((cat) => cat.id === resource.category)

    return (
      <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isCompleted ? "opacity-75" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {categoryInfo && (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryInfo.color}`}>
                  <categoryInfo.icon className="w-5 h-5" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="text-sm">{resource.description}</CardDescription>
              </div>
            </div>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {resource.duration}
            </div>
            <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            onClick={() => onResourceSelect(resource)}
            className="w-full"
            variant={isCompleted ? "outline" : "default"}
          >
            {isCompleted ? "Review Again" : "Start Activity"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search wellness resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No resources found for "{searchQuery}"</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Content */}
      {!searchQuery && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personalized for You</h3>
              <p className="text-muted-foreground mb-6">
                Based on your preferences and recent mood patterns, here are resources that might help you right now.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => {
                const categoryResources = getResourcesByCategory(category.id)
                return (
                  <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${category.color}`}
                      >
                        <category.icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold mb-2">{category.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryResources.length} resource{categoryResources.length !== 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">All Wellness Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getResourcesByCategory("meditation")
                  .concat(
                    getResourcesByCategory("breathing"),
                    getResourcesByCategory("journaling"),
                    getResourcesByCategory("education"),
                    getResourcesByCategory("activities"),
                    getResourcesByCategory("sleep"),
                  )
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
