import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import ClientLayoutShell from '@/components/ClientLayoutShell'
import { NotificationProvider } from '../context/NotificationContext'
import './globals.css'

export const metadata = {
  title: 'GreenFleet',
  description: 'Next.js Authentication App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NotificationProvider>
            <ClientLayoutShell>
              <Navbar />
              <main className="main-content">
                {children}
              </main>
            </ClientLayoutShell>
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  )
}
