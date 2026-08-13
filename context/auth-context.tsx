'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface AuthUser {
  email: string
  loginTime: Date
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('elevate_auth_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser({
          ...parsedUser,
          loginTime: new Date(parsedUser.loginTime),
        })
      } catch (err) {
        console.error('Failed to restore user session:', err)
        localStorage.removeItem('elevate_auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string) => {
    const newUser: AuthUser = {
      email,
      loginTime: new Date(),
    }
    setUser(newUser)
    localStorage.setItem('elevate_auth_user', JSON.stringify(newUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('elevate_auth_user')
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
