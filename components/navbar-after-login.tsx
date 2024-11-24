"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { /*ChevronDown, ChevronRight,*/ Code, HelpCircle, Home, Menu, Settings, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogoutButton } from "./logout-button"
import { LogoutButtonMobile } from "./logout-button-mobile"
import { type LucideIcon } from 'lucide-react'

// Define the type for navigation items
type NavItem = {
  name: string
  href: string
  icon: LucideIcon  // This ensures icon is always a Lucide icon component
}

export default function NavbarAfterLogin() {
  const [isSticky, setIsSticky] = React.useState(false)
  //const [isServicesOpen, setIsServicesOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  //const [isDesktopServicesOpen, setIsDesktopServicesOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Daftar Kelas", href: "/daftar-kelas", icon: BookOpen },
    //{ name: "About", href: "/about" },
    //{ name: "Contact", href: "/contact" },
  ]

  /*const serviceItems = [
    // { name: "Javascript", href: "/services/inventory" },
    { name: "Python", href: "/course-overview" },
    // { name: "C", href: "/services/pos" },
  ]*/

  const userNavigation = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0)
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      } /*else {
        setIsDesktopServicesOpen(false)
      }*/
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>RR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>rizky ramadhan</span>
            <Link href="/edit-profile" className="text-sm text-muted-foreground">
              Go to profile
            </Link>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userNavigation.map((item) => (
          <DropdownMenuItem key={item.name} asChild>
            <Link href={item.href} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <nav
      className={`bg-background border-b transition-shadow duration-300 ${
        isSticky ? "sticky top-0 z-50 shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2">
              <Code className="h-6 w-6" />
              <span className="text-lg font-bold">Programlingo</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* <DropdownMenu open={isDesktopServicesOpen} onOpenChange={setIsDesktopServicesOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2 text-sm font-medium">
                      List Kursus <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {serviceItems.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="w-full">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/* <Button variant="outline" className="border-2 border-primary" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button> */}
            <UserMenu />
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-primary/10"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                  {/* <Collapsible
                    open={isServicesOpen}
                    onOpenChange={setIsServicesOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto font-medium text-sm text-left">
                        List Kursus
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-90' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {serviceItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-6 py-2 text-sm text-foreground hover:bg-primary/10 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible> */}
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                  <LogoutButtonMobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}