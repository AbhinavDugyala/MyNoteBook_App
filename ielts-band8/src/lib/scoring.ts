import type { Skill } from '../types'

/** Official-style conversion used in published IELTS practice materials. */
const LISTENING: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
  [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5],
]

const ACADEMIC_READING: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5],
  [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5],
]

export function rawToBand(skill: 'listening' | 'reading', correct: number): number {
  const table = skill === 'listening' ? LISTENING : ACADEMIC_READING
  for (const [min, band] of table) {
    if (correct >= min) return band
  }
  return 2
}

/** IELTS overall: mean of 4 skills, .25→.5, .75→next whole. */
export function overallBand(scores: Record<Skill, number>): number {
  const mean = (scores.listening + scores.reading + scores.writing + scores.speaking) / 4
  const whole = Math.floor(mean)
  const frac = mean - whole
  if (frac < 0.25) return whole
  if (frac < 0.75) return whole + 0.5
  return whole + 1
}

export function daysUntil(isoDate: string): number {
  const exam = new Date(isoDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  exam.setHours(0, 0, 0, 0)
  return Math.round((exam.getTime() - today.getTime()) / 86400000)
}

export function clampBand(n: number): number {
  const x = Math.max(1, Math.min(9, n))
  return Math.round(x * 2) / 2
}

export function readiness(current: Record<Skill, number>, target: number): number {
  const gap = (target * 4 - (current.listening + current.reading + current.writing + current.speaking)) / 4
  return Math.max(0, Math.min(100, Math.round((1 - gap / 3) * 100)))
}

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(the|a|an)\s+/, '')
}

export function answersMatch(expected: string | string[], given: string): boolean {
  const variants = (Array.isArray(expected) ? expected : [expected]).map(normalizeAnswer)
  const g = normalizeAnswer(given)
  if (!g) return false
  return variants.some((v) => v === g || v.replace(/\s/g, '') === g.replace(/\s/g, ''))
}

export const BAND8 = {
  listening: 'About 35–36 / 40. Almost no missed signposting; answers spelled as spoken.',
  reading: 'About 35–36 / 40 on Academic. You locate paraphrase under time, not just keywords.',
  writing:
    'Task 1 has a clear overview. Task 2 has a precise position, fully extended ideas, rare grammar slips, and flexible academic lexis.',
  speaking:
    'Fluent with only occasional self-correction. Wide vocabulary including less-common items. Flexible complex grammar. Accent does not reduce clarity.',
}
