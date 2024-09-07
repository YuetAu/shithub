"use client"
import { useReducer } from 'react'
import { AuthContext, AuthDispatchContext } from './context/authContext'
import { Providers } from './provider'
import './styles/globals.css'
import { Metadata } from 'next'


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
              {children}
           
        </Providers>
      </body>
    </html>
  )
}

