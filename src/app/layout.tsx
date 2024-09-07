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

  const [auth, dispatch] = useReducer(authReducer, initialAuth);

  return (
    <html>
      <body>
        <Providers>
          <AuthContext.Provider value={auth}>
            <AuthDispatchContext.Provider value={dispatch}>
              {children}
            </AuthDispatchContext.Provider>
          </AuthContext.Provider>
        </Providers>
      </body>
    </html>
  )
}

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return { auth: true, user: action.payload }
    case 'LOGOUT':
      return { auth: false, user: null }
    default:
      return state
  }
}

const initialAuth = {
  auth: false,
  user: null,
}