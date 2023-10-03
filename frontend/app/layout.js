import './globals.css'
import { Inter } from 'next/font/google'
import { Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({subsets: ['latin']})

export const metadata = {
  title: 'DSearch',
  description: 'Decentralized Search Engine',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
