import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          🏋️ Built With Science
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Science-Based Workout Tracker
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Complete workout app with 3/4/5-day programs, exercise variations, intelligent load progression, and offline-first design for the gym.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/programs">Choose Program</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-6">
        <Card className="group transition-colors hover:border-blue-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Choose from 3, 4, or 5-day science-based workout programs designed for optimal results.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="group transition-colors hover:border-green-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Smart Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Pre-loaded with your last sets. Track weight, reps, RPE with intelligent progression suggestions.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="group transition-colors hover:border-purple-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎥 Exercise Variations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Up to 5 variations per exercise with tutorial videos and quick guides.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="group transition-colors hover:border-orange-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📱 Offline Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Works completely offline in the gym. Syncs automatically when back online.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
