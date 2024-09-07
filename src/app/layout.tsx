import { Providers } from './provider'
import './styles/globals.css'
import { Metadata } from 'next'
import { AuthContext } from './context/authContext'

export const metadata: Metadata = {
  title: "ShitHub",
  description: "Provide the shittest experience for you",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Providers>
          <AuthContext.Provider value={{ auth: false }}>
            {children}
          </AuthContext.Provider>
        </Providers>
      </body>
    </html>
  )
}