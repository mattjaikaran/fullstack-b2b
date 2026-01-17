import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

// Types
export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  plan: string
  role: string
  is_active: boolean
}

export interface Team {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string
  created_at: string
}

export interface Member {
  id: string
  user_id: number
  user_email: string
  organization_id: string
  organization_name: string
  role: string
  is_active: boolean
  created_at: string
}

interface OrganizationContextType {
  organizations: Organization[]
  currentOrg: Organization | null
  isLoading: boolean
  setCurrentOrg: (org: Organization | null) => void
  refreshOrganizations: () => void
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

const CURRENT_ORG_KEY = 'current_organization_id'

const fetchOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get('/organizations')
  return data
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrg, setCurrentOrgState] = useState<Organization | null>(null)
  const queryClient = useQueryClient()

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  useEffect(() => {
    if (organizations.length > 0 && !currentOrg) {
      const savedOrgId = localStorage.getItem(CURRENT_ORG_KEY)
      const savedOrg = organizations.find((o) => o.id === savedOrgId)
      setCurrentOrgState(savedOrg || organizations[0])
    }
  }, [organizations, currentOrg])

  const setCurrentOrg = (org: Organization | null) => {
    setCurrentOrgState(org)
    if (org) {
      localStorage.setItem(CURRENT_ORG_KEY, org.id)
    } else {
      localStorage.removeItem(CURRENT_ORG_KEY)
    }
  }

  const refreshOrganizations = () => {
    queryClient.invalidateQueries({ queryKey: ['organizations'] })
  }

  return (
    <OrganizationContext.Provider
      value={{ organizations, currentOrg, isLoading, setCurrentOrg, refreshOrganizations }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

export function useTeams(orgId: string | undefined) {
  return useQuery({
    queryKey: ['teams', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/teams`)
      return data as Team[]
    },
    enabled: !!orgId,
  })
}

export function useMembers(orgId: string | undefined) {
  return useQuery({
    queryKey: ['members', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/members`)
      return data as Member[]
    },
    enabled: !!orgId,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const response = await api.post('/organizations', data)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ orgId, data }: { orgId: string; data: { email: string; role: string } }) => {
      const response = await api.post(`/organizations/${orgId}/invitations`, data)
      return response.data
    },
    onSuccess: (_, { orgId }) => queryClient.invalidateQueries({ queryKey: ['members', orgId] }),
  })
}
