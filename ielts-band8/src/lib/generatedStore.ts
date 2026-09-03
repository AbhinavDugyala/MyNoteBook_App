import type { PracticeSet } from '../types'

const SETS = 'band8.gen.sets'
const MOCKS = 'band8.gen.mocks'
const usedKey = (kind: string) => `band8.used.${kind}`

export interface GeneratedMock {
  id: string
  title: string
  blurb: string
  minutes: number
  parts: string[]
  createdAt: string
  kind: 'full' | 'writing' | 'receptive'
}

export function saveGeneratedSet(set: PracticeSet) {
  const all = loadAllSets()
  all[set.id] = set
  const ids = Object.keys(all)
  if (ids.length > 80) {
    ids.slice(0, ids.length - 60).forEach((id) => delete all[id])
  }
  localStorage.setItem(SETS, JSON.stringify(all))
}

export function loadGeneratedSet(id: string): PracticeSet | undefined {
  return loadAllSets()[id]
}

function loadAllSets(): Record<string, PracticeSet> {
  try {
    return JSON.parse(localStorage.getItem(SETS) || '{}') as Record<string, PracticeSet>
  } catch {
    return {}
  }
}

export function saveGeneratedMock(m: GeneratedMock) {
  const all = loadGeneratedMocks()
  all.unshift(m)
  localStorage.setItem(MOCKS, JSON.stringify(all.slice(0, 40)))
}

export function loadGeneratedMocks(): GeneratedMock[] {
  try {
    return JSON.parse(localStorage.getItem(MOCKS) || '[]') as GeneratedMock[]
  } catch {
    return []
  }
}

export function loadGeneratedMock(id: string): GeneratedMock | undefined {
  return loadGeneratedMocks().find((m) => m.id === id)
}

export function loadUsedIds(kind: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(usedKey(kind)) || '[]') as string[]
  } catch {
    return []
  }
}

export function markUsedId(kind: string, id: string) {
  const next = [...new Set([...loadUsedIds(kind), id])]
  localStorage.setItem(usedKey(kind), JSON.stringify(next))
}

export function clearGenerated() {
  localStorage.removeItem(SETS)
  localStorage.removeItem(MOCKS)
  ;['t1', 't2'].forEach((k) => localStorage.removeItem(usedKey(k)))
}
