import type { Phase, PlanTask, Profile, Skill, StudyPlan } from '../types'
import { daysUntil } from './scoring'
import { SETS } from '../data/practice'

function pick(skill: Skill, level: 'foundation' | 'band7' | 'band8', i: number) {
  const pool = SETS.filter((s) => s.skill === skill && (s.level === level || level === 'band8'))
  return pool[i % Math.max(pool.length, 1)]
}

export function phaseFor(days: number): Phase {
  if (days <= 3) return 'taper'
  if (days <= 10) return 'simulate'
  if (days <= 30) return 'intensify'
  if (days <= 70) return 'build'
  return 'foundation'
}

const HEAD: Record<Phase, string> = {
  foundation: 'Learn the machine before you race it',
  build: 'Cover every question type, then time it',
  intensify: 'Weak-skill pressure and weekly full mocks',
  simulate: 'Exam conditions only — no new tricks',
  taper: 'Protect sleep, sharpen errors, stay flexible',
}

const STRAT: Record<Phase, string> = {
  foundation:
    'Official IELTS Academic has four papers on one day (Speaking may be a week either side). Spend this window on format, paraphrase, and Task 1 overviews rather than score chasing.',
  build:
    'Rotate official question types so none are “unknown” on test day. British Council and IDP both warn that unfamiliar types cost easy marks. Writing and Speaking stay in the week even when Reading feels safer.',
  intensify:
    'Published conversion tables put Band 8 near 35–36/40 on Listening and Academic Reading. You now need timed accuracy plus daily productive papers. One full Academic mock per week, reviewed the same day.',
  simulate:
    'The real papers are strictly timed: Listening ~30 minutes, Reading 60, Writing 60 (20+40), Speaking 11–14. Match those clocks. Review only recurring errors.',
  taper:
    'IDP and British Council both advise arriving familiar with the format, not exhausted. Light warm-ups, ID ready, no cramming of predicted essays.',
}

export function buildPlan(profile: Profile): StudyPlan {
  const daysLeft = Math.max(0, daysUntil(profile.examDate))
  const phase = phaseFor(daysLeft)
  const horizon = Math.min(Math.max(daysLeft, 1), 21)
  const weak = profile.weakSkills.length ? profile.weakSkills : weakest(profile)
  const days: PlanTask[] = []

  for (let i = 0; i < horizon; i++) {
    const date = shiftDate(profile.examDate, daysLeft - i)
    const dow = new Date(date).getDay()
    const tasks = tasksForDay(profile, phase, i, dow, weak, date, daysLeft)
    days.push(...tasks)
  }

  return {
    phase,
    headline: HEAD[phase],
    strategy: STRAT[phase],
    days,
    weeklyMocks: mockCadence(phase),
    nonNegotiables: nonNegotiables(phase, profile),
  }
}

function weakest(profile: Profile): Skill[] {
  return (['writing', 'speaking', 'reading', 'listening'] as Skill[])
    .sort((a, b) => profile.current[a] - profile.current[b])
    .slice(0, 2)
}

function mockCadence(phase: Phase): string {
  if (phase === 'foundation') return 'One section mock each weekend. First full Academic mock after you have seen every question type once.'
  if (phase === 'build') return 'One full mock every 10 days. Section mocks twice a week.'
  if (phase === 'intensify') return 'One full timed Academic mock every 7 days. Review the same evening.'
  if (phase === 'simulate') return 'Full mock on day 1 and day 4 of this window. Last 48 hours: no full mock.'
  return 'No full mock in the final 48 hours. 20-minute Listening or Speaking warm-up only.'
}

function nonNegotiables(phase: Phase, p: Profile): string[] {
  const base = [
    `Target overall ${p.target}. Official overall is the average of four skills, rounded to the nearest half band.`,
    'Academic Writing Task 1 = 150 words / ~20 minutes. Task 2 = 250 words / ~40 minutes and is worth twice Task 1.',
    'Listening answers must follow word limits and spelling. Reading has no extra transfer time on computer-delivered IELTS.',
  ]
  if (phase === 'taper' || phase === 'simulate') {
    return [...base, 'Sleep and exam-day logistics beat one more predicted essay.']
  }
  return [...base, `${p.hoursPerDay} focused hours beat 6 tired hours. Split skills; do not only revise what already feels easy.`]
}

function tasksForDay(
  profile: Profile,
  phase: Phase,
  offset: number,
  dow: number,
  weak: Skill[],
  date: string,
  daysLeft: number,
): PlanTask[] {
  const hours = profile.hoursPerDay
  const out: PlanTask[] = []
  const add = (skill: Skill | 'mixed', title: string, minutes: number, setId: string | undefined, why: string) => {
    out.push({
      id: `${date}-${skill}-${title}`.replace(/\s+/g, '-').toLowerCase(),
      dayOffset: offset,
      date,
      skill,
      title,
      minutes,
      setId,
      why,
    })
  }

  if (phase === 'taper') {
    add('mixed', 'Error-journal sweep', 25, undefined, 'Re-read only mistakes you have already made.')
    add(weak[0], 'Light warm-up on weakest paper', 20, pick(weak[0], 'band8', offset)?.id, 'Keep the hand moving without fatigue.')
    return out
  }

  if (phase === 'simulate') {
    if (offset === 0 || offset === 3) {
      add('mixed', 'Full Academic mock (exam clocks)', Math.min(180, hours * 60), 'fresh-full-mock', 'Simulate the real day once, then stop collecting new papers.')
    } else {
      add(weak[0], 'Timed weak-skill section', 45, pick(weak[0], 'band8', offset)?.id, 'Only the paper that still sits below target.')
      add('writing', 'Rewrite yesterday’s weakest paragraph', 25, undefined, 'Quality of correction > volume of new essays.')
    }
    return out
  }

  const rotation: Skill[] = ['listening', 'reading', 'writing', 'speaking']
  const primary = dow === 0 ? 'mixed' : weak[offset % weak.length]
  const secondary = rotation[(offset + 2) % 4]

  if (primary === 'mixed' || dow === 0) {
    add('mixed', daysLeft <= 30 ? 'Full or half Academic mock' : 'Weekend section mock', 90, 'fresh-full-mock', 'British Council recommends practising under timed conditions, not untimed perfection.')
  } else if (primary === 'writing') {
    add('writing', 'New writing mock (fresh prompt)', Math.min(55, hours * 25), offset % 2 ? 'fresh-t1' : 'fresh-t2', `This skill is below ${profile.target}. A new paper is generated each time.`)
  } else {
    const set = pick(primary, phase === 'foundation' ? 'foundation' : 'band8', offset)
    add(primary, set?.title || `${primary} focus`, Math.min(55, hours * 25), set?.id, `This skill is below ${profile.target}.`)
  }

  if (hours >= 2) {
    if (secondary === 'writing') {
      add('writing', 'New Task 1 or 2', 35, 'fresh-t1', 'Do not let a “safe” paper decay — still write a new figure.')
    } else {
      const set = pick(secondary, 'band7', offset)
      add(secondary, set?.title || `${secondary} maintenance`, 35, set?.id, 'Do not let a “safe” paper decay.')
    }
  }

  if (phase !== 'foundation' && offset % 2 === 0) {
    add('writing', 'New Task 2 (fresh prompt)', 40, 'fresh-t2', 'Task 2 carries two-thirds of the Writing band. A new question is issued every time.')
  } else if (offset % 2 === 1) {
    add('speaking', 'Part 2 long turn + Part 3', 20, pick('speaking', 'band8', offset)?.id, 'Fluency is built by daily recording, not by reading tips.')
  }

  return out
}

function shiftDate(examIso: string, daysBeforeExam: number): string {
  const d = new Date(examIso)
  d.setDate(d.getDate() - Math.max(0, daysBeforeExam))
  return d.toISOString().slice(0, 10)
}

export function todayTasks(plan: StudyPlan): PlanTask[] {
  const today = new Date().toISOString().slice(0, 10)
  const hit = plan.days.filter((t) => t.date === today)
  if (hit.length) return hit
  return plan.days.slice(0, 3)
}
