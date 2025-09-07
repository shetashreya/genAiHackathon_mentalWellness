import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Shield, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">MindfulAI</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/onboarding">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Your Safe Space for Mental Wellness
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Connect with an AI companion that understands, listens without judgment, and helps you navigate your
              mental health journey with complete confidentiality.
            </p>
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <a href="/onboarding">Start Your Journey</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose MindfulAI?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>100% Confidential</CardTitle>
                <CardDescription>
                  Anonymous sign-up with no personal information required. Your privacy is our priority.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI Companion</CardTitle>
                <CardDescription>
                  Chat with an empathetic AI trained to provide emotional support and coping strategies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Personalized Resources</CardTitle>
                <CardDescription>
                  Get curated self-help content, guided meditations, and wellness activities tailored to you.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Wellness Journey?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of young people who have found support, understanding, and growth through MindfulAI.
              </p>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href="/onboarding">Get Started - It's Free</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground">
            MindfulAI is not a replacement for professional mental health care. If you're in crisis, please contact your
            local emergency services or mental health helpline.
          </p>
        </div>
      </footer>
    </div>
  )
}
