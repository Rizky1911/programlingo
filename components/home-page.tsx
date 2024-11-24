'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  //BookOpen, 
  //Code, 
  Trophy, 
 // User, 
  BarChart, 
  Clock,
  Calendar
} from "lucide-react"
import { useSession } from 'next-auth/react'

// Mock data
const user = {
  name: "Jane Doe",
  username: "jane_coder",
  avatar: "/placeholder.svg?height=40&width=40",
  xp: 1250,
  level: 5
}

const courses = [
  { id: 1, name: "Python Fundamentals", progress: 75 },
  { id: 2, name: "JavaScript Basics", progress: 40 },
  { id: 3, name: "React for Beginners", progress: 10 },
]

const learningHistory = [
  { date: "2024-03-15", course: "Python Fundamentals", duration: 45 },
  { date: "2024-03-14", course: "JavaScript Basics", duration: 30 },
  { date: "2024-03-13", course: "Python Fundamentals", duration: 60 },
]

const leaderboard = [
  { rank: 1, name: "Alex Johnson", xp: 2500 },
  { rank: 2, name: "Sarah Lee", xp: 2350 },
  { rank: 3, name: "Mike Chen", xp: 2200 },
  { rank: 4, name: "Emily Davis", xp: 2100 },
  { rank: 5, name: "Chris Taylor", xp: 2000 },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('progress')
  const userSession = useSession()

  const userData = userSession.data?.user
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6" />
            <span className="text-lg font-bold">CodeMaster</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Courses</Button>
            <Button variant="ghost">Community</Button>
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header> */}

      <main className="max-w-7xl flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{userData?.name ? userData.name.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData?.name ? userData.name : "Guest"}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{userData?.email ? userData.email : "Guest@mail.com"}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold">Level {user.level}</p>
                <p className="text-gray-500 dark:text-gray-400">{user.xp} XP</p>
                <Progress value={user.xp % 1000 / 10} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === 'progress' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('progress')}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Course Progress
                </Button>
                <Button 
                  variant={activeTab === 'history' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('history')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Learning History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'progress' && (
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{course.name}</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  {learningHistory.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{entry.course}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.date} - {entry.duration} minutes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaderboard.map(entry => (
                  <div key={entry.rank} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {entry.rank}
                    </div>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{entry.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}