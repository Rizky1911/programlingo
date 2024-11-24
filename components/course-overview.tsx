'use client'

import { useState } from 'react'
import Link from 'next/link'
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronDown,
  ChevronUp,
  Code,
  FileText,
  Lock,
} from "lucide-react"

const lessons = [
  { id: 1, title: "Dasar-dasr Python", xp: 10, locked: false, quiz: false },
  { id: 2, title: "Quiz", xp: 10, locked: false, quiz: true },
  { id: 3, title: "Statements", xp: 10, locked: true, quiz: true },
  { id: 4, title: "Variables dan Data Types", xp: 15, locked: true, quiz: false },
]

export default function CourseOverviewPage() {
  const [isExpanded, setIsExpanded] = useState(true)

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
            <Button variant="ghost">My Courses</Button>
            <Button variant="ghost">Community</Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header> */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Belajar Python</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Mempelajari bahasa pemrograman Python dari awal sampai akhir
            </p>
            <Progress value={33} className="mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">33% complete</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <button
              className="w-full px-6 py-4 flex items-center justify-between text-left"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                <span className="text-xl font-semibold">Konsep Dasar</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {isExpanded && (
              <div className="px-6 py-4">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      {lesson.locked ? (
                        <Lock className="h-5 w-5 mr-3 text-gray-400" />
                      ) : (
                        <FileText className="h-5 w-5 mr-3 text-blue-500" />
                      )}
                      <span className={`font-medium ${lesson.locked ? 'text-gray-400' : ''}`}>
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-4">XP +{lesson.xp}</span>
                      {!lesson.locked && (lesson.quiz ? (
                        <Button size="sm">
                          <Link href="/quiz">Take Quiz</Link>
                        </Button>
                        ) : (
                        <Button size="sm">
                          <Link href="/learn">Learn</Link>
                        </Button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      
    </div>
  )
}