import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'
import type { ApiUser } from '../types'

interface AuthContextType {
  user: ApiUser | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<void>
  register: (formData: FormData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (user: ApiUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isLoggedIn = !!user

  // On mount, try to restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      authService.getCurrentUser()
        .then((res) => {
          if (res.data) setUser(res.data)
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials: { username?: string; email?: string; password: string }) => {
    const res = await authService.login(credentials)
    if (res.data?.user) {
      setUser(res.data.user)
    }
  }, [])

  const register = useCallback(async (formData: FormData) => {
    await authService.register(formData)
    // After successful registration, don't auto-login - let user login explicitly
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Even if API call fails, clear local state
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getCurrentUser()
      if (res.data) setUser(res.data)
    } catch {
      // ignore
    }
  }, [])

  const updateUser = useCallback((updatedUser: ApiUser) => {
    setUser(updatedUser)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
