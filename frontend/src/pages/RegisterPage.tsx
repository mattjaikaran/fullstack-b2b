import { useReducer, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { getErrorMessage } from '@/lib/api'

interface RegisterFormState {
  email: string
  username: string
  password: string
  confirmPassword: string
  error: string
  isLoading: boolean
}

type RegisterFormAction =
  | { type: 'SET_FIELD'; field: keyof Pick<RegisterFormState, 'email' | 'username' | 'password' | 'confirmPassword'>; value: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_LOADING'; isLoading: boolean }

const initialState: RegisterFormState = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  error: '',
  isLoading: false,
}

function reducer(state: RegisterFormState, action: RegisterFormAction): RegisterFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading }
  }
}

export default function RegisterPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { email, username, password, confirmPassword, error, isLoading } = state

  const { register, login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'SET_ERROR', error: '' })

    if (password !== confirmPassword) {
      dispatch({ type: 'SET_ERROR', error: 'Passwords do not match' })
      return
    }

    if (password.length < 8) {
      dispatch({ type: 'SET_ERROR', error: 'Password must be at least 8 characters' })
      return
    }

    dispatch({ type: 'SET_LOADING', isLoading: true })

    try {
      await register({ email, username, password })
      // Auto-login after registration
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: getErrorMessage(err) })
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false })
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                className="input mt-1"
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>

            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })}
                className="input mt-1"
                placeholder="johndoe"
                aria-label="Username"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                className="input mt-1"
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'confirmPassword', value: e.target.value })}
                className="input mt-1"
                placeholder="••••••••"
                aria-label="Confirm password"
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
