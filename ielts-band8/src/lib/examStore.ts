import type { ExamSession } from '../types'

const K = 'band8.exam.sessions'

export function saveSession(s: ExamSession) {
  const all = loadSessions().filter((x) => x.id !== s.id)
  all.unshift(s)
  localStorage.setItem(K, JSON.stringify(all.slice(0, 20)))
}

export function loadSessions(): ExamSession[] {
  try {
    return JSON.parse(localStorage.getItem(K) || '[]') as ExamSession[]
  } catch {
    return []
  }
}

export function loadSession(id: string): ExamSession | undefined {
  return loadSessions().find((s) => s.id === id)
}

export const OFFICIAL_MINUTES = {
  listening: 30,
  reading: 60,
  writing: 60,
  speaking: 14,
} as const
