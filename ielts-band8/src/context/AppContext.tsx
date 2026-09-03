import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Attempt, Profile } from '../types'
import { buildPlan } from '../lib/studyPlan'
import { loadAttempts, loadDone, loadProfile, saveAttempt, saveProfile, toggleDone as persistDone } from '../lib/storage'
import { daysUntil, overallBand, readiness } from '../lib/scoring'

interface Ctx {
  profile: Profile | null
  attempts: Attempt[]
  done: string[]
  setProfile: (p: Profile) => void
  addAttempt: (a: Attempt) => void
  toggleTask: (id: string) => void
  daysLeft: number
  overall: number
  ready: number
}

const C = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(loadProfile)
  const [attempts, setAttempts] = useState<Attempt[]>(loadAttempts)
  const [done, setDone] = useState<string[]>(loadDone)

  const setProfile = (p: Profile) => {
    saveProfile(p)
    setProfileState(p)
  }
  const addAttempt = (a: Attempt) => {
    saveAttempt(a)
    setAttempts(loadAttempts())
    if (profile) {
      const next = { ...profile, current: { ...profile.current, [a.skill]: blend(profile.current[a.skill], a.band) } }
      saveProfile(next)
      setProfileState(next)
    }
  }
  const toggleTask = (id: string) => {
    persistDone(id)
    setDone(loadDone())
  }

  const daysLeft = profile ? daysUntil(profile.examDate) : 0
  const overall = profile ? overallBand(profile.current) : 0
  const ready = profile ? readiness(profile.current, profile.target) : 0

  const value = useMemo(
    () => ({ profile, attempts, done, setProfile, addAttempt, toggleTask, daysLeft, overall, ready }),
    [profile, attempts, done, daysLeft, overall, ready],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useApp() {
  const v = useContext(C)
  if (!v) throw new Error('useApp outside provider')
  return v
}

export function usePlan() {
  const { profile } = useApp()
  return profile ? buildPlan(profile) : null
}

function blend(oldB: number, next: number) {
  if (!next) return oldB
  return Math.round(((oldB * 0.6 + next * 0.4) * 2)) / 2
}
