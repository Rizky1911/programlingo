'use client'

import { useState } from 'react'
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  //Code, 
  BookOpen, 
  Star, 
  Clock, 
  //BarChart,
  Filter
} from "lucide-react"

// Mock data for courses
const courses = [
  { 
    id: 1, 
    title: "Python Fundamentals", 
    description: "Learn the basics of Python programming language", 
    level: "Beginner", 
    duration: "4 weeks", 
    rating: 4.7, 
    enrolled: 10500,
    image: "/placeholder.svg?height=100&width=200"
  },
  { 
    id: 2, 
    title: "JavaScript Essentials", 
    description: "Master the core concepts of JavaScript", 
    level: "Intermediate", 
    duration: "6 weeks", 
    rating: 4.8, 
    enrolled: 8900,
    image: "/placeholder.svg?height=100&width=200"
  },
  { 
    id: 3, 
    title: "Advanced React Patterns", 
    description: "Dive deep into advanced React concepts and patterns", 
    level: "Advanced", 
    duration: "8 weeks", 
    rating: 4.9, 
    enrolled: 5600,
    image: "/placeholder.svg?height=100&width=200"
  },
  { 
    id: 4, 
    title: "Data Structures in Java", 
    description: "Implement and understand essential data structures using Java", 
    level: "Intermediate", 
    duration: "10 weeks", 
    rating: 4.6, 
    enrolled: 7200,
    image: "/placeholder.svg?height=100&width=200"
  },
  { 
    id: 5, 
    title: "Machine Learning Basics", 
    description: "Introduction to machine learning algorithms and concepts", 
    level: "Intermediate", 
    duration: "12 weeks", 
    rating: 4.8, 
    enrolled: 6800,
    image: "/placeholder.svg?height=100&width=200"
  },
]

const levels = ["All", "Beginner", "Intermediate", "Advanced"]

export default function CourseSelectionPage() {
  const [selectedLevel, setSelectedLevel] = useState("All")

  const filteredCourses = selectedLevel === "All" 
    ? courses 
    : courses.filter(course => course.level === selectedLevel)

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
      <main className="max-w-7xl flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Courses</h1>
        
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filter by level:</span>
          {levels.map(level => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="mt-2">{course.description}</CardDescription>
                <div className="flex items-center mt-4 space-x-4">
                  <Badge variant="secondary">{course.level}</Badge>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-sm text-gray-500 ml-2">({course.enrolled.toLocaleString()} enrolled)</span>
                </div>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

    </div>
  )
}