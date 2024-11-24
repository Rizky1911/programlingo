'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  //Code, 
  Heart,
  HeartCrack,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const lesson = {
  instruction: "Kode print() membutuhkan karakter tanda kurung buka dan tutup.",
  codeSnippet: "print[] \"Level Up!\"[]",
  options: ["(", ")"],
  correctAnswer: ["(", ")"]
}

export default function SyntaxLearningPage() {
  const [lives, setLives] = useState(5)
  const [progress, setProgress] = useState(50)
  const [userAnswer, setUserAnswer] = useState(["", ""])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showBrokenHeart, setShowBrokenHeart] = useState(false)

  const handleOptionClick = (option: string) => {
    const index = userAnswer.indexOf('')
    if (index !== -1) {
      // If there's an empty slot, fill it
      const newAnswer = [...userAnswer]
      newAnswer[index] = option
      setUserAnswer(newAnswer)
    } else {
      // If all slots are filled, do nothing
      return
    }
  }

  const handleAnswerClick = (index: number) => {
    const newAnswer = [...userAnswer]
    newAnswer[index] = ''
    setUserAnswer(newAnswer)
  }

  const handleCheck = () => {
    const correct = userAnswer.every((ans, index) => ans === lesson.correctAnswer[index])
    setIsCorrect(correct)
    if (!correct) {
      setLives(lives - 1)
      setShowBrokenHeart(true)
    } else {
      setProgress(Math.min(progress + 10, 100))
    }
  }

  useEffect(() => {
    if (showBrokenHeart) {
      const timer = setTimeout(() => {
        setShowBrokenHeart(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showBrokenHeart])

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

      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {showBrokenHeart ? (
              <HeartCrack className="h-6 w-6 text-red-500 animate-pulse" />
            ) : (
              <Heart className="h-6 w-6 text-red-500" />
            )}
            <span className="font-bold">{lives}</span>
          </div>
          <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
            <HelpCircle className="h-5 w-5 mr-2" />
            Stuck?
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Progress value={progress} className="flex-grow" />
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg mb-4">{lesson.instruction}</p>
          <p className="font-semibold mb-2">Lengkapi Kode Berikut</p>
          <div className="bg-[#1e1e1e] text-white p-4 rounded-md font-mono text-lg mb-4">
            {lesson.codeSnippet.split('[]').map((part, index) => (
              <span key={index}>
                {part}
                {index < lesson.codeSnippet.split('[]').length - 1 && (
                  <Button
                    variant="ghost"
                    className={`inline-block w-6 h-6 p-0 mx-1 text-center text-gray-300 border ${
                      userAnswer[index] ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700'
                    }`}
                    onClick={() => handleAnswerClick(index)}
                  >
                    {userAnswer[index]}
                  </Button>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {lesson.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleOptionClick(option)}
              disabled={userAnswer.includes(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        <Button 
          className="w-full" 
          onClick={handleCheck}
          disabled={userAnswer.some(ans => ans === '')}
        >
          Check
        </Button>

        {isCorrect !== null && (
          <div className={`mt-4 p-4 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'Benar! Kerja Bagus!' : 'Salah. Coba Lagi!'}
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow mt-8">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 CodeMaster. All rights reserved.
          </p>
          <nav className="flex space-x-4">
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
              Help
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}