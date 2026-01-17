import { useAuth } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.first_name || user?.username}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Account Status</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {user?.is_active ? (
              <span className="text-green-600">Active</span>
            ) : (
              <span className="text-red-600">Inactive</span>
            )}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Member Since</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {user?.date_joined ? formatDate(user.date_joined) : 'N/A'}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 truncate text-lg font-semibold tracking-tight text-gray-900">
            {user?.email}
          </dd>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-outline">View Profile</button>
          <button className="btn-outline">Change Password</button>
          <button className="btn-outline">Notifications</button>
          <button className="btn-outline">Settings</button>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-12 text-center text-gray-500">
            <p>No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
