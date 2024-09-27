'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex space-x-4">
            <li>
              <Link 
                href="/" 
                className={`hover:underline ${pathname === '/' ? 'font-bold' : ''}`}
              >
                Test Report Form
              </Link>
            </li>
            <li>
              <Link 
                href="/manage" 
                className={`hover:underline ${pathname === '/manage' ? 'font-bold' : ''}`}
              >
                Manage Tools & Motors
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground py-4">
        <div className="container mx-auto px-4 text-center">
          © {new Date().getFullYear()} Electric Motor Test Report System
        </div>
      </footer>
    </div>
  )
}