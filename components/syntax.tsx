'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Heart, HelpCircle, ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Question = {
  id: string
  type: 'explanation' | 'fill-in-blank-choice' | 'fill-in-blank-type' | 'multiple-choice'
  likes: number
  title: string
  subtitle?: string
  content: string
  image?: {
    src: string
    alt: string
    width: number
    height: number
  }
  code?: string
  blanks?: {
    id: string
    answer: string
    choices?: string[]
  }[]
  choices?: string[]
  correctAnswer?: string
}

const questions: Question[] = [
  {
    id: '1',
    type: 'explanation',
    likes: 5,
    title: 'Understanding the Coding Process',
    content: `Coding consists of 3 steps:
      
- Writing
- Executing (or running)
- Fixing errors (or debugging)

In this lesson, you'll start step 3: identifying and fixing errors.`,
    image: {
      src: '/debugging-cycle.png',
      alt: 'Debugging Cycle Diagram',
      width: 500,
      height: 300
    }
  },
  {
    id: '2',
    type: 'fill-in-blank-choice',
    likes: 5,
    title: 'Kode print() membutuhkan karakter tanda kurung buka dan tutup.',
    subtitle: 'Lengkapi Kode Berikut',
    content: 'Choose the correct brackets',
    code: 'print[] "Level Up!"[]',
    blanks: [
      { id: 'left', answer: '(', choices: ['(', '[', '{'] },
      { id: 'right', answer: ')', choices: [')', ']', '}'] }
    ]
  },
  {
    id: '3',
    type: 'fill-in-blank-type',
    likes: 5,
    title: 'Complete the code below to add a comment and declare a variable using the snake case style',
    subtitle: 'Fill in the blanks',
    content: 'Type the correct characters',
    code: '[]Using snake case\ncredit[]score = 700',
    blanks: [
      { id: 'comment', answer: '#' },
      { id: 'snake', answer: '_' }
    ]
  },
  {
    id: '4',
    type: 'multiple-choice',
    likes: 5,
    title: 'Naming Conventions',
    content: 'What would you call a variable that stores a user id?',
    choices: ['user/id', 'user_id', 'user#id', 'user*id'],
    correctAnswer: 'user_id'
  }
]

export default function SyntaxLearning() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedState = localStorage.getItem('syntaxLearningState')
    if (savedState) {
      const { index, answers, checked, correct } = JSON.parse(savedState)
      setCurrentQuestionIndex(index)
      setUserAnswers(answers)
      setIsChecked(checked)
      setIsCorrect(correct)
    }

    // Disable browser back button
    const disableBackButton = (e: PopStateEvent) => {
      e.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', disableBackButton)

    return () => {
      window.removeEventListener('popstate', disableBackButton)
    }
  }, [])

  useEffect(() => {
    const state = {
      index: currentQuestionIndex,
      answers: userAnswers,
      checked: isChecked,
      correct: isCorrect
    }
    localStorage.setItem('syntaxLearningState', JSON.stringify(state))
  }, [currentQuestionIndex, userAnswers, isChecked, isCorrect])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setIsChecked(false)
      setIsCorrect(false)
      setUserAnswers({})
    } else if (currentQuestionIndex === questions.length - 1 && isCorrect) {
      setShowCompletionDialog(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setIsChecked(false)
      setIsCorrect(false)
      setUserAnswers({})
    }
  }

  const handleCheck = () => {
    setIsChecked(true)
    if (currentQuestion.type === 'fill-in-blank-choice' || currentQuestion.type === 'fill-in-blank-type') {
      const allCorrect = currentQuestion.blanks!.every(
        blank => userAnswers[blank.id]?.toLowerCase() === blank.answer.toLowerCase()
      )
      setIsCorrect(allCorrect)
    } else if (currentQuestion.type === 'multiple-choice') {
      setIsCorrect(userAnswers['choice'] === currentQuestion.correctAnswer)
    }
  }

  const handleRetry = () => {
    setIsChecked(false)
    setIsCorrect(false)
  }

  const handleLeave = () => {
    setShowLeaveDialog(false)
    router.push('/course-overview')
  }

  const renderFillInBlankChoice = (question: Question) => {
    const codeWords = question.code!.split(/(\[\])/)
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{question.title}</h2>
          {question.subtitle && (
            <h3 className="text-lg text-gray-600">{question.subtitle}</h3>
          )}
        </div>
        <div className="bg-[#1C1C1C] text-white p-4 rounded-lg font-mono">
          <div className="flex items-center space-x-2">
            {codeWords.map((word, index) => {
              if (word === '[]') {
                const blankId = index === 1 ? 'left' : 'right'
                return (
                  <div
                    key={index}
                    className={cn(
                      "w-8 h-8 bg-gray-700 rounded flex items-center justify-center",
                      isChecked && userAnswers[blankId] === question.blanks!.find(b => b.id === blankId)!.answer && "text-green-500",
                      isChecked && userAnswers[blankId] !== question.blanks!.find(b => b.id === blankId)!.answer && "text-red-500"
                    )}
                  >
                    {userAnswers[blankId] || ''}
                  </div>
                )
              }
              return <span key={index}>{word}</span>
            })}
          </div>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          {question.blanks!.map((blank) => (
            <div key={blank.id} className="flex gap-2">
              {blank.choices!.map((choice) => (
                <Button
                  key={choice}
                  variant="outline"
                  className={cn(
                    "w-12 h-12 text-lg",
                    userAnswers[blank.id] === choice && "border-primary bg-primary/10"
                  )}
                  onClick={() => {
                    if (!isChecked) {
                      setUserAnswers(prev => ({
                        ...prev,
                        [blank.id]: prev[blank.id] === choice ? '' : choice
                      }))
                    }
                  }}
                  disabled={isChecked}
                >
                  {choice}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderFillInBlankType = (question: Question) => {
    const codeWords = question.code!.split(/(\[\])/)
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{question.title}</h2>
          {question.subtitle && (
            <h3 className="text-lg text-gray-600">{question.subtitle}</h3>
          )}
        </div>
        <div className="bg-[#1C1C1C] text-white p-4 rounded-lg font-mono">
          <div className="flex items-center space-x-2">
            {codeWords.map((word, index) => {
              if (word === '[]') {
                const blankId = index === 1 ? 'comment' : 'snake'
                return (
                  <div key={index} className="w-8 h-8 relative">
                    <Input
                      value={userAnswers[blankId] || ''}
                      onChange={(e) => !isChecked && setUserAnswers(prev => ({
                        ...prev,
                        [blankId]: e.target.value
                      }))}
                      className={cn(
                        "w-8 h-8 p-0 text-center bg-gray-700 border-none text-white absolute inset-0",
                        isChecked && userAnswers[blankId] === question.blanks!.find(b => b.id === blankId)!.answer && "text-green-500",
                        isChecked && userAnswers[blankId] !== question.blanks!.find(b => b.id === blankId)!.answer && "text-red-500"
                      )}
                      maxLength={1}
                      disabled={isChecked}
                    />
                  </div>
                )
              }
              return <span key={index}>{word}</span>
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderMultipleChoice = (question: Question) => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">{question.title}</h2>
        <p className="text-lg">{question.content}</p>
        <div className="space-y-2">
          {question.choices!.map((option) => (
            <button
              key={option}
              onClick={() => !isChecked && setUserAnswers({ choice: option })}
              className={cn(
                "w-full p-4 text-left rounded-lg border",
                userAnswers['choice'] === option
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-500",
                isChecked && option === question.correctAnswer && "bg-green-50 border-green-500",
                isChecked && userAnswers['choice'] === option && option !== question.correctAnswer && "bg-red-50 border-red-500"
              )}
              disabled={isChecked}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'explanation':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium">{currentQuestion.title}</h2>
            {currentQuestion.image && (
              <div className="flex justify-center">
                <Image
                  src={currentQuestion.image.src}
                  alt={currentQuestion.image.alt}
                  width={currentQuestion.image.width}
                  height={currentQuestion.image.height}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">{currentQuestion.content}</p>
            </div>
          </div>
        )
      case 'fill-in-blank-choice':
        return renderFillInBlankChoice(currentQuestion)
      case 'fill-in-blank-type':
        return renderFillInBlankType(currentQuestion)
      case 'multiple-choice':
        return renderMultipleChoice(currentQuestion)
    }
  }

  const handleAction = () => {
    if (currentQuestion.type === 'explanation') {
      handleNext()
    } else if (isChecked) {
      if (isCorrect) {
        handleNext()
      } else {
        handleRetry()
      }
    } else {
      handleCheck()
    }
  }

  const canCheck = () => {
    if (currentQuestion.type === 'explanation') return true
    if (currentQuestion.type === 'multiple-choice') return userAnswers['choice'] !== undefined
    if (currentQuestion.type === 'fill-in-blank-choice') {
      return userAnswers['left'] && userAnswers['right']
    }
    if (currentQuestion.type === 'fill-in-blank-type') {
      return userAnswers['comment'] && userAnswers['snake']
    }
    return false
  }

  const getActionButtonText = () => {
    if (currentQuestion.type === 'explanation') return 'Continue'
    if (isChecked) {
      if (isCorrect) return 'Next'
      return 'Retry'
    }
    return 'Check'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Are you sure you want to leave?</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              If you leave the Code Coach without solving, your changes will not be saved
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={handleLeave}
            >
              Leave
            </Button>
            <Button
              className="bg-[#14181F] hover:bg-[#14181F]/90"
              onClick={() => setShowLeaveDialog(false)}
            >
              Stay and solve!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl mb-4">Lesson completed!</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              You learned Applying Best Practices. You are one step closer to reaching your goal!
            </DialogDescription>
          </DialogHeader>
          <Button 
            className="w-full mt-6 bg-[#2196F3] hover:bg-[#2196F3]/90"
            onClick={() => {
              setShowCompletionDialog(false)
              router.push('/course-overview')
            }}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeaveDialog(true)}
            className="absolute top-4 left-4"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>{currentQuestion.likes}</span>
          </div>
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-5 w-5 mr-2" />
            Stuck?
          </Button>
        </div>

        <div className="relative mb-8">
          <Progress value={progress} className="h-2" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1 || !isCorrect}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {renderQuestion()}
        </div>

        <Button
          className="w-full"
          onClick={handleAction}
          disabled={!canCheck()}
        >
          {getActionButtonText()}
        </Button>
      </div>
    </div>
  )
}