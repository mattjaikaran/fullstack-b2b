import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrganization } from '@/lib/organizations'
import { cn } from '@/lib/utils'

export default function OrgSwitcher() {
  const { organizations, currentOrg, setCurrentOrg, isLoading } = useOrganization()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return <div className="h-10 w-40 animate-pulse rounded-md bg-gray-200"></div>
  }

  if (organizations.length === 0) {
    return (
      <Link to="/organizations/new" className="btn-primary text-sm">
        Create Organization
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current organization: ${currentOrg?.name ?? 'None'}`}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <div className="flex size-6 items-center justify-center rounded bg-primary-100 text-xs font-bold text-primary-700">
          {currentOrg?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[100px] truncate">{currentOrg?.name}</span>
        <svg className={cn('h-4 w-4', isOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close organization switcher"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 z-20 mt-2 w-56 rounded-md border bg-white py-1 shadow-lg">
            <div className="border-b px-3 py-2">
              <p className="text-xs font-medium uppercase text-gray-500">Organizations</p>
            </div>
            {organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => { setCurrentOrg(org); setIsOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50',
                  currentOrg?.id === org.id && 'bg-primary-50'
                )}
              >
                <div className="flex size-8 items-center justify-center rounded bg-primary-100 text-sm font-bold text-primary-700">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{org.name}</p>
                  <p className="text-xs text-gray-500">{org.role}</p>
                </div>
              </button>
            ))}
            <div className="border-t">
              <Link to="/organizations/new" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
                + Create Organization
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
