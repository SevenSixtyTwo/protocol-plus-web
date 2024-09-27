import './globals.css'
import { Inter } from 'next/font/google'
import { LayoutComponent } from '@/components/components-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Electric Motor Test Report System',
  description: 'A system for managing and creating test reports for electric motors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  )
}