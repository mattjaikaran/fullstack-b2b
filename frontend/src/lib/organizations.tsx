import { createContext, use, useState, useMemo, useCallback, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  appsOrganizationsControllersCreateInvitation,
  appsOrganizationsControllersCreateOrganization,
  appsOrganizationsControllersListMembers,
  appsOrganizationsControllersListOrganizations,
  appsOrganizationsControllersListTeams,
  type MembershipSchema,
  type OrganizationWithRoleSchema,
  type TeamSchema,
} from '@/api/generated'

// Types
export type Organization = OrganizationWithRoleSchema
export type Team = TeamSchema
export type Member = MembershipSchema

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
  const { data } = await appsOrganizationsControllersListOrganizations({ throwOnError: true })
  return data
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(
    () => localStorage.getItem(CURRENT_ORG_KEY)
  )
  const queryClient = useQueryClient()

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  // Derive currentOrg from organizations list and stored id — no useEffect needed
  const currentOrg = useMemo((): Organization | null => {
    if (organizations.length === 0) return null
    if (currentOrgId) {
      const found = organizations.find((o) => o.id === currentOrgId)
      if (found) return found
    }
    return organizations[0]
  }, [organizations, currentOrgId])

  const setCurrentOrg = (org: Organization | null) => {
    if (org) {
      localStorage.setItem(CURRENT_ORG_KEY, org.id)
      setCurrentOrgId(org.id)
    } else {
      localStorage.removeItem(CURRENT_ORG_KEY)
      setCurrentOrgId(null)
    }
  }

  const refreshOrganizations = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['organizations'] })
  }, [queryClient])

  const value = useMemo(
    () => ({ organizations, currentOrg, isLoading, setCurrentOrg, refreshOrganizations }),
    [organizations, currentOrg, isLoading, refreshOrganizations]
  )

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = use(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

export function useTeams(orgId: string | undefined) {
  return useQuery({
    queryKey: ['teams', orgId],
    queryFn: async (): Promise<Team[]> => {
      const { data } = await appsOrganizationsControllersListTeams({
        path: { org_id: orgId! },
        throwOnError: true,
      })
      return data
    },
    enabled: !!orgId,
  })
}

export function useMembers(orgId: string | undefined) {
  return useQuery({
    queryKey: ['members', orgId],
    queryFn: async (): Promise<Member[]> => {
      const { data } = await appsOrganizationsControllersListMembers({
        path: { org_id: orgId! },
        throwOnError: true,
      })
      return data
    },
    enabled: !!orgId,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const { data: org } = await appsOrganizationsControllersCreateOrganization({
        body: data,
        throwOnError: true,
      })
      return org
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ orgId, data }: { orgId: string; data: { email: string; role: string } }) => {
      const { data: invitation } = await appsOrganizationsControllersCreateInvitation({
        path: { org_id: orgId },
        body: data,
        throwOnError: true,
      })
      return invitation
    },
    onSuccess: (_, { orgId }) => queryClient.invalidateQueries({ queryKey: ['members', orgId] }),
  })
}
