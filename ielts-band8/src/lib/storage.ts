import type { Attempt, Profile } from '../types'

const P = 'band8.profile'
const A = 'band8.attempts'
const D = 'band8.done'
const J = 'band8.journal'

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(P)
    if (!raw) return null
    const p = JSON.parse(raw) as Profile
    p.target = Number(p.target) || 7
    return p
  } catch {
    return null
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(P, JSON.stringify(p))
}

export function loadAttempts(): Attempt[] {
  try {
    return JSON.parse(localStorage.getItem(A) || '[]') as Attempt[]
  } catch {
    return []
  }
}

export function saveAttempt(a: Attempt) {
  const all = loadAttempts()
  all.unshift(a)
  localStorage.setItem(A, JSON.stringify(all.slice(0, 80)))
}

export function loadDone(): string[] {
  try {
    return JSON.parse(localStorage.getItem(D) || '[]') as string[]
  } catch {
    return []
  }
}

export function toggleDone(id: string) {
  const cur = new Set(loadDone())
  if (cur.has(id)) cur.delete(id)
  else cur.add(id)
  localStorage.setItem(D, JSON.stringify([...cur]))
}

export function loadJournal(): { id: string; at: string; skill: string; note: string }[] {
  try {
    return JSON.parse(localStorage.getItem(J) || '[]')
  } catch {
    return []
  }
}

export function addJournal(skill: string, note: string) {
  const all = loadJournal()
  all.unshift({ id: `j-${Date.now()}`, at: new Date().toISOString(), skill, note })
  localStorage.setItem(J, JSON.stringify(all.slice(0, 100)))
}

export function resetAll() {
  localStorage.removeItem(P)
  localStorage.removeItem(A)
  localStorage.removeItem(D)
  localStorage.removeItem(J)
  localStorage.removeItem('band8.gen.sets')
  localStorage.removeItem('band8.gen.mocks')
  localStorage.removeItem('band8.used.t1')
  localStorage.removeItem('band8.used.t2')
}
