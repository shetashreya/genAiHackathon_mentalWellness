export interface WellnessResource {
  id: string
  title: string
  description: string
  category: "meditation" | "breathing" | "journaling" | "education" | "activities" | "sleep"
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  content: {
    type: "guided" | "article" | "exercise" | "prompt"
    steps?: string[]
    text?: string
    audioUrl?: string
  }
  moodTargets: string[] // Which moods this resource helps with
  preferenceTargets: string[] // Which user preferences this addresses
}

export const wellnessResources: WellnessResource[] = [
  {
    id: "breathing-4-7-8",
    title: "4-7-8 Breathing Technique",
    description: "A simple breathing exercise to reduce anxiety and promote relaxation",
    category: "breathing",
    duration: "5 minutes",
    difficulty: "beginner",
    tags: ["anxiety", "stress", "quick", "anywhere"],
    content: {
      type: "guided",
      steps: [
        "Sit comfortably with your back straight",
        "Place the tip of your tongue against your upper teeth",
        "Exhale completely through your mouth",
        "Close your mouth and inhale through your nose for 4 counts",
        "Hold your breath for 7 counts",
        "Exhale through your mouth for 8 counts",
        "Repeat this cycle 3-4 times",
      ],
    },
    moodTargets: ["anxious", "stressed", "overwhelmed"],
    preferenceTargets: ["Stress & Anxiety", "Sleep Issues"],
  },
  {
    id: "gratitude-journal",
    title: "Daily Gratitude Practice",
    description: "Reflect on positive moments to boost mood and perspective",
    category: "journaling",
    duration: "10 minutes",
    difficulty: "beginner",
    tags: ["gratitude", "positivity", "reflection", "daily"],
    content: {
      type: "prompt",
      text: "Take a moment to reflect on your day and write about:\n\n1. Three things you're grateful for today (big or small)\n2. One person who made your day better\n3. A moment when you felt proud of yourself\n4. Something beautiful you noticed today\n5. One thing you're looking forward to tomorrow",
    },
    moodTargets: ["sad", "negative", "neutral"],
    preferenceTargets: ["Mood Support", "Self-Confidence"],
  },
  {
    id: "progressive-muscle-relaxation",
    title: "Progressive Muscle Relaxation",
    description: "Release physical tension and mental stress through guided muscle relaxation",
    category: "meditation",
    duration: "15 minutes",
    difficulty: "beginner",
    tags: ["relaxation", "tension", "body", "stress"],
    content: {
      type: "guided",
      steps: [
        "Lie down comfortably or sit in a chair",
        "Close your eyes and take three deep breaths",
        "Start with your toes - tense them for 5 seconds, then relax",
        "Move to your calves - tense and relax",
        "Continue with your thighs, abdomen, hands, arms, shoulders",
        "Tense your face muscles, then relax",
        "Notice the difference between tension and relaxation",
        "Take a few moments to enjoy the relaxed feeling",
      ],
    },
    moodTargets: ["stressed", "tense", "overwhelmed"],
    preferenceTargets: ["Stress & Anxiety", "Sleep Issues"],
  },
  {
    id: "anxiety-understanding",
    title: "Understanding Anxiety: What's Normal?",
    description: "Learn about anxiety, its symptoms, and healthy coping strategies",
    category: "education",
    duration: "8 minutes",
    difficulty: "beginner",
    tags: ["anxiety", "education", "coping", "normal"],
    content: {
      type: "article",
      text: "Anxiety is a normal human emotion that everyone experiences. It's your body's natural response to stress or perceived threats.\n\n**What is Normal Anxiety?**\n- Feeling nervous before a test or presentation\n- Worrying about important decisions\n- Being concerned about safety in new situations\n\n**When Anxiety Becomes Concerning:**\n- Interferes with daily activities\n- Causes physical symptoms like rapid heartbeat\n- Leads to avoiding normal activities\n- Persists even when there's no clear threat\n\n**Healthy Coping Strategies:**\n1. Deep breathing exercises\n2. Regular physical activity\n3. Talking to trusted friends or family\n4. Practicing mindfulness\n5. Maintaining a regular sleep schedule\n\n**Remember:** It's okay to feel anxious sometimes. You're not alone, and there are many ways to manage these feelings.",
    },
    moodTargets: ["anxious", "worried", "confused"],
    preferenceTargets: ["Stress & Anxiety", "Academic Pressure"],
  },
  {
    id: "mood-boosting-activities",
    title: "5-Minute Mood Boosters",
    description: "Quick activities to lift your spirits when you're feeling down",
    category: "activities",
    duration: "5 minutes",
    difficulty: "beginner",
    tags: ["mood", "quick", "energy", "positivity"],
    content: {
      type: "exercise",
      steps: [
        "Choose one activity that appeals to you right now:",
        "• Listen to your favorite upbeat song and dance",
        "• Step outside and take 10 deep breaths of fresh air",
        "• Text a friend or family member something positive",
        "• Do 10 jumping jacks or stretch your arms overhead",
        "• Look at photos that make you smile",
        "• Write down one thing you accomplished today",
        "• Drink a glass of water mindfully, focusing on the taste",
        "• Give yourself a compliment out loud",
      ],
    },
    moodTargets: ["sad", "low", "unmotivated"],
    preferenceTargets: ["Mood Support", "Self-Confidence"],
  },
  {
    id: "sleep-hygiene",
    title: "Better Sleep Habits",
    description: "Simple changes to improve your sleep quality and feel more rested",
    category: "sleep",
    duration: "12 minutes",
    difficulty: "beginner",
    tags: ["sleep", "habits", "routine", "rest"],
    content: {
      type: "article",
      text: "Good sleep is essential for mental health and overall well-being. Here are evidence-based tips to improve your sleep:\n\n**Before Bedtime (1-2 hours):**\n- Dim the lights in your room\n- Put away phones, tablets, and computers\n- Try reading, gentle stretching, or listening to calm music\n- Avoid caffeine, large meals, and intense exercise\n\n**Create a Sleep-Friendly Environment:**\n- Keep your room cool (60-67°F)\n- Use blackout curtains or an eye mask\n- Consider white noise or earplugs\n- Make sure your mattress and pillows are comfortable\n\n**Establish a Routine:**\n- Go to bed and wake up at the same time daily\n- Create a relaxing bedtime ritual\n- If you can't fall asleep in 20 minutes, get up and do a quiet activity\n\n**During the Day:**\n- Get natural sunlight exposure, especially in the morning\n- Stay active, but not close to bedtime\n- Limit daytime naps to 20-30 minutes\n\n**Remember:** It may take time to see improvements. Be patient with yourself as you develop new habits.",
    },
    moodTargets: ["tired", "restless", "irritable"],
    preferenceTargets: ["Sleep Issues", "Stress & Anxiety"],
  },
  {
    id: "social-connection",
    title: "Building Meaningful Connections",
    description: "Strategies to strengthen relationships and combat loneliness",
    category: "education",
    duration: "10 minutes",
    difficulty: "intermediate",
    tags: ["relationships", "social", "connection", "loneliness"],
    content: {
      type: "article",
      text: "Human connection is vital for mental health. Here's how to build and maintain meaningful relationships:\n\n**Starting Conversations:**\n- Ask open-ended questions about interests or experiences\n- Share something genuine about yourself\n- Listen actively and show genuine interest\n- Find common ground or shared experiences\n\n**Deepening Existing Relationships:**\n- Schedule regular check-ins with friends and family\n- Be vulnerable and share your authentic self\n- Offer support during difficult times\n- Create shared experiences and memories\n\n**When You Feel Lonely:**\n- Remember that loneliness is temporary and normal\n- Reach out to one person, even with a simple message\n- Join groups or activities aligned with your interests\n- Volunteer for causes you care about\n- Practice self-compassion\n\n**Online vs. In-Person Connection:**\n- Both have value, but prioritize face-to-face when possible\n- Use technology to enhance, not replace, real connections\n- Be mindful of social media's impact on your mood\n\n**Quality Over Quantity:**\n- A few close relationships are better than many superficial ones\n- It's normal for friendships to evolve and change\n- Focus on people who support and encourage you",
    },
    moodTargets: ["lonely", "isolated", "sad"],
    preferenceTargets: ["Social Connections", "Relationship Concerns"],
  },
]

export function getPersonalizedRecommendations(
  userPreferences: string[],
  recentMoods: string[],
  completedResources: string[] = [],
): WellnessResource[] {
  // Filter out already completed resources
  const availableResources = wellnessResources.filter((resource) => !completedResources.includes(resource.id))

  // Score resources based on relevance
  const scoredResources = availableResources.map((resource) => {
    let score = 0

    // Match user preferences
    const preferenceMatches = resource.preferenceTargets.filter((target) => userPreferences.includes(target)).length
    score += preferenceMatches * 3

    // Match recent moods
    const moodMatches = resource.moodTargets.filter((target) => recentMoods.includes(target.toLowerCase())).length
    score += moodMatches * 2

    // Boost beginner resources for new users
    if (resource.difficulty === "beginner") {
      score += 1
    }

    return { resource, score }
  })

  // Sort by score and return top recommendations
  return scoredResources
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.resource)
}

export function getResourcesByCategory(category: WellnessResource["category"]): WellnessResource[] {
  return wellnessResources.filter((resource) => resource.category === category)
}

export function searchResources(query: string): WellnessResource[] {
  const lowercaseQuery = query.toLowerCase()
  return wellnessResources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.description.toLowerCase().includes(lowercaseQuery) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
