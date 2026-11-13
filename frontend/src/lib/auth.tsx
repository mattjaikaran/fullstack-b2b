import { createContext, use, useState, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  appsUsersControllersLogin,
  appsUsersControllersMe,
  appsUsersControllersRegister,
  type LoginSchema,
  type UserCreateSchema,
  type UserSchema,
} from '@/api/generated'
import { setTokens, clearTokens, getAccessToken } from './api'

// Types
export type User = UserSchema
export type LoginCredentials = LoginSchema
export type RegisterData = UserCreateSchema

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth API functions
const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await appsUsersControllersMe({ throwOnError: true })
  return data
}

const loginUser = async (credentials: LoginCredentials) => {
  const { data } = await appsUsersControllersLogin({ body: credentials, throwOnError: true })
  return data
}

const registerUser = async (userData: RegisterData) => {
  const { data } = await appsUsersControllersRegister({ body: userData, throwOnError: true })
  return data
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken())
  const queryClient = useQueryClient()

  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
    retry: false,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      setIsAuthenticated(true)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  // Logout function
  const logout = () => {
    clearTokens()
    setIsAuthenticated(false)
    queryClient.clear()
  }

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated,
    login: async (credentials) => {
      await loginMutation.mutateAsync(credentials)
    },
    register: async (data) => {
      await registerMutation.mutateAsync(data)
    },
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook
export function useAuth() {
  const context = use(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
