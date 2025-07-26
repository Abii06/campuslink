import { Inter } from 'next/font/google'
import "./globals.css"
import ClientLayout from "./components/ClientLayout"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CampusLink',
  description: 'Your centralized hub for campus utilities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}