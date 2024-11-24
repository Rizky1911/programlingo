'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  //Code, 
  BookOpen, 
  //Users, 
  Zap, 
  ChevronRight, 
  Gamepad2} from "lucide-react"
import Navbar from "./navbar"
import Image from "next/image"
import { useRouter } from "next/navigation"

const TypeWriter = ({ text, delay, className }: { text: string; delay: number; className?: string }) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  return <span className={className} aria-label={text}>{currentText}</span>
}

const popularLanguages = [
  {
    name: "Python",
    image: "/python.svg",
  },
  {
    name: "JavaScript",
    image: "/javascript.svg",
  },
  {
    name: "C++",
    image: "/c++.svg",
  },
  {
    name: "Java",
    image: "/java.svg",
  },
]

export default function LandingPage() {
  const router = useRouter()

  const handleLogin = () => {
    // Add your logout logic here
    // For now, we'll just redirect to the '/logout' page
    router.push('/login')
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* <header>
        <Link className="flex items-center justify-center" href="#">
          <Code className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Programlingo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header> */}
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  <TypeWriter 
                    text="Jago Ngoding Dengan Programlingo" 
                    delay={50}
                    className="inline-block"
                  />
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  <TypeWriter 
                    text="Belajar ngoding sepertti bermain game di Programlingo. Mulai perjalananmu menjadi pengoding handal sekarang!" 
                    delay={50}
                    className="inline-block"
                  />
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={handleLogin}>Mulai</Button>
                <Button variant="outline">Pelajari Lebih Lanjut</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Mengapa Pilih Programlingo?</h2>
            <div className="grid gap-6 items-center md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <BookOpen className="h-12 w-12 mb-2 text-primary" />
                  <h3 className="text-xl font-bold">Pelajaran Interaktif</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Kamu dapat langsung mencoba kode yang kamu pelajari.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Gamepad2 className="h-12 w-12 mb-2 text-primary" />
                  <h3 className="text-xl font-bold">Seperti Bermain Game</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Dengan Programlingo kamu dapat belajar seperti bermain game.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Zap className="h-12 w-12 mb-2 text-primary" />
                  <h3 className="text-xl font-bold">Micro Learning</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Pelajari materi sesukamu dan kapan saja. Serius tapi santai.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Bahasa Populer</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popularLanguages.map((lang, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col items-center p-6">
                    <Image
                      alt={`${lang.name} logo`}
                      className="mx-auto mb-4 h-24 w-24"
                      src={`${lang.image}`}
                      height={96}
                      width={96}
                    />
                    <h3 className="text-xl font-bold">{lang.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Testimoni Pengguna</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "John Doe",
                  text: "Belajar ngoding di Programlingo telah membantu saya meningkatkan keterampilan saya dalam pemrograman!",
                },
                {
                  name: "Jane Doe",
                  text: "Programlingo membantu saya memahami konsep pemrograman yang kompleks.",
                },
                {
                  name: "Michael Chen",
                  text: "Programlingo membantu saya belajar pemrograman secara interaktif dan menyenangkan.",
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col space-y-2 p-6">
                    <p className="text-gray-500 dark:text-gray-400">{testimonial.text}</p>
                    <p className="font-semibold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Mulai Belajar Ngoding Sekarang
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Ayo Daftar Untuk Belajar Ngoding di Programlingo.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                  <Button type="submit" onClick={handleLogin}>
                    Mulai
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                {/* <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit" onClick={handleLogin}>
                    Mulai
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form> */}
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p> */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Programlingo. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}