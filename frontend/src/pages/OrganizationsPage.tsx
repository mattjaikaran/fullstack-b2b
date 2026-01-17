import { Link } from 'react-router-dom'
import { useOrganization } from '@/lib/organizations'
import { formatDate } from '@/lib/utils'

export default function OrganizationsPage() {
  const { organizations, currentOrg, setCurrentOrg } = useOrganization()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Link to="/organizations/new" className="btn-primary">
          Create Organization
        </Link>
      </div>

      <div className="space-y-4">
        {organizations.map((org) => (
          <div key={org.id} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-xl font-bold text-primary-700">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{org.name}</h2>
                  <p className="text-sm text-gray-500">
                    {org.role} · {org.plan} plan
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {currentOrg?.id === org.id ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    Current
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentOrg(org)}
                    className="btn-outline text-sm"
                  >
                    Switch
                  </button>
                )}
                <Link to={`/organizations/${org.id}/settings`} className="btn-outline text-sm">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
