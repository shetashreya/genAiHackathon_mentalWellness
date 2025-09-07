"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const suggestions = [
    {
      category: "Getting Started",
      items: [
        "I'm feeling overwhelmed with school/work",
        "I've been having trouble sleeping lately",
        "I'm struggling with anxiety",
        "I feel lonely and disconnected",
      ],
    },
    {
      category: "Daily Check-in",
      items: [
        "How can I manage stress better?",
        "I need help with my mood today",
        "I'm having relationship difficulties",
        "I want to talk about my goals",
      ],
    },
    {
      category: "Coping Strategies",
      items: [
        "Can you teach me breathing exercises?",
        "I need motivation to get through today",
        "Help me practice positive thinking",
        "I want to learn mindfulness techniques",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Not sure where to start?</h3>
        <p className="text-muted-foreground">
          Here are some conversation starters to help you connect with your AI companion.
        </p>
      </div>

      {suggestions.map((category) => (
        <Card key={category.category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category.category}</CardTitle>
            <CardDescription>Click any suggestion to start the conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.items.map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  className="h-auto p-3 text-left justify-start text-wrap bg-transparent"
                  onClick={() => onSuggestionClick(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
