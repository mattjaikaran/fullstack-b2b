import { useState } from 'react'
import { useOrganization, useTeams, useMembers, useInviteMember } from '@/lib/organizations'
import { getErrorMessage } from '@/lib/api'

export default function TeamPage() {
  const { currentOrg } = useOrganization()
  const { data: teams = [], isLoading: teamsLoading } = useTeams(currentOrg?.id)
  const { data: members = [], isLoading: membersLoading } = useMembers(currentOrg?.id)
  const inviteMember = useInviteMember()

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [error, setError] = useState('')

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrg) return
    try {
      await inviteMember.mutateAsync({ orgId: currentOrg.id, data: { email: inviteEmail, role: inviteRole } })
      setInviteEmail('')
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (!currentOrg) {
    return <div className="p-8 text-center">Select an organization first</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Team</h1>

      {/* Invite Form */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Invite Member</h2>
        <form onSubmit={handleInvite} className="flex gap-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@example.com"
            className="input flex-1"
            required
          />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="input w-32">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="btn-primary" disabled={inviteMember.isPending}>
            {inviteMember.isPending ? 'Sending...' : 'Invite'}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Members List */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Members ({members.length})</h2>
        </div>
        {membersLoading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium">{member.user_email}</p>
                  <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Teams List */}
      <div className="mt-8 rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Teams ({teams.length})</h2>
        </div>
        {teamsLoading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : teams.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No teams yet</div>
        ) : (
          <div className="divide-y">
            {teams.map((team) => (
              <div key={team.id} className="px-6 py-4">
                <p className="font-medium">{team.name}</p>
                <p className="text-sm text-gray-500">{team.description || 'No description'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
