import NavbarAfterLogin from "@/components/navbar-after-login"
import Link from "next/link"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavbarAfterLogin />
      <main>{children}</main>
      <footer className="bg-white dark:bg-gray-800 shadow mt-8">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Programlingo. All rights reserved.
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
    </>
  )
}