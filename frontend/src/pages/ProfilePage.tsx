import { useReducer, FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth'
import { api, getErrorMessage } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

interface ProfileFormState {
  firstName: string
  lastName: string
  bio: string
  error: string
  success: string
}

type ProfileFormAction =
  | { type: 'SET_FIELD'; field: keyof Pick<ProfileFormState, 'firstName' | 'lastName' | 'bio'>; value: string }
  | { type: 'SET_STATUS'; error: string; success: string }

function reducer(state: ProfileFormState, action: ProfileFormAction): ProfileFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_STATUS':
      return { ...state, error: action.error, success: action.success }
  }
}

export default function ProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [state, dispatch] = useReducer(reducer, {
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    bio: user?.bio || '',
    error: '',
    success: '',
  })
  const { firstName, lastName, bio, error, success } = state

  const updateProfile = useMutation({
    mutationFn: async (data: { first_name: string; last_name: string; bio: string }) => {
      const response = await api.patch('/auth/me', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      dispatch({ type: 'SET_STATUS', error: '', success: 'Profile updated successfully!' })
    },
    onError: (err) => {
      dispatch({ type: 'SET_STATUS', error: getErrorMessage(err), success: '' })
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateProfile.mutate({
      first_name: firstName,
      last_name: lastName,
      bio,
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

      <div className="mt-8 space-y-8">
        {/* Account info */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Member since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.date_joined ? formatDateTime(user.date_joined) : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.is_active ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                      Inactive
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Edit profile */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Edit Profile</h2>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="label">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'firstName', value: e.target.value })}
                    className="input mt-1"
                    aria-label="First name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="label">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'lastName', value: e.target.value })}
                    className="input mt-1"
                    aria-label="Last name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'bio', value: e.target.value })}
                    className="input mt-1"
                    placeholder="Tell us about yourself…"
                    aria-label="Bio"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button type="submit" disabled={updateProfile.isPending} className="btn-primary">
                {updateProfile.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
