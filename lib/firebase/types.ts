export interface Family {
  id: string
  name: string
  childName: string | null
  startDate: string
  createdAt: string
}

export interface FamilyMember {
  userId: string
  familyId: string
  role: 'owner' | 'member'
  email: string
  createdAt: string
}

export interface Invite {
  id: string
  familyId: string
  email: string
  status: 'pending' | 'accepted' | 'revoked'
  invitedBy: string
  createdAt: string
}

export interface LogEntry {
  id: string
  familyId: string
  date: string
  food: string
  amount: string
  time: string
  note: string
  isAllergen: boolean
  source: 'plan' | 'custom'
  createdBy: string
  createdAt: string
}
