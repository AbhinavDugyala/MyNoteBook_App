import { TASK1, TASK2, type Task2Prompt } from '../data/writingBank'
import type { PracticeSet } from '../types'
import {
  loadUsedIds,
  markUsedId,
  saveGeneratedMock,
  saveGeneratedSet,
  type GeneratedMock,
} from './generatedStore'

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Avoid issuing two papers when React Strict Mode runs an effect twice. */
export function onceMintId(key: string, create: () => { id: string }): string {
  const existing = sessionStorage.getItem(key)
  if (existing) {
    const [id, ts] = existing.split('|')
    if (id && Date.now() - Number(ts) < 2500) return id
  }
  const item = create()
  sessionStorage.setItem(key, `${item.id}|${Date.now()}`)
  return item.id
}

function pickFresh<T extends { id: string }>(pool: T[], key: string): T {
  const used = new Set(loadUsedIds(key))
  const unused = pool.filter((p) => !used.has(p.id))
  const bag = unused.length ? unused : pool
  if (!unused.length) {
    localStorage.setItem(`band8.used.${key}`, JSON.stringify([]))
  }
  const item = bag[Math.floor(Math.random() * bag.length)]
  markUsedId(key, item.id)
  return item
}

export function mintTask1(): PracticeSet {
  const tpl = pickFresh(TASK1, 't1')
  const built = tpl.build()
  const set: PracticeSet = {
    id: uid('gen-t1'),
    skill: 'writing',
    kind: 'task',
    title: `Task 1 — ${tpl.title}`,
    topic: tpl.topic,
    level: 'band8',
    minutes: 20,
    questionType: `Task 1 ${tpl.kind}`,
    instructions: built.instructions,
    officialNote:
      'A new figure is generated each time you write. Band 7+ Task Achievement needs a clear overview — do not explain causes the figure does not show.',
    visual: built.visual,
    chart: built.chart,
    tips: [built.overviewHint, 'Group data; do not list every number.', 'Stay formal. No “I think the government…”.', 'At least 150 words.'],
    questions: [
      {
        id: 'body',
        type: 'essay',
        prompt: 'Write your Academic Task 1 report (minimum 150 words).',
        explanation: 'Overview, grouping, accuracy, tone.',
      },
    ],
  }
  saveGeneratedSet(set)
  return set
}

export function mintTask2(): PracticeSet {
  const p = pickFresh(TASK2, 't2')
  return setFromTask2(p)
}

function setFromTask2(p: Task2Prompt): PracticeSet {
  const set: PracticeSet = {
    id: uid('gen-t2'),
    skill: 'writing',
    kind: 'task',
    title: `Task 2 — ${labelType(p.type)}`,
    topic: p.topic,
    level: 'band8',
    minutes: 40,
    questionType: `Task 2 ${p.type}`,
    instructions: `Write about the following topic.\n\n${p.question}\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.`,
    officialNote:
      'A new Task 2 is issued every time you write. Task 2 is worth about two-thirds of the Writing band. Do not reuse a memorised essay.',
    tips: [...p.tips, 'Plan for 4–5 minutes.', 'One idea per body paragraph, extended.', 'Position must stay consistent.'],
    questions: [
      {
        id: 'body',
        type: 'essay',
        prompt: 'Write your Academic Task 2 essay (minimum 250 words).',
        explanation: 'Task Response, cohesion, lexis, grammar.',
      },
    ],
  }
  saveGeneratedSet(set)
  return set
}

export function mintWritingPair(): { t1: PracticeSet; t2: PracticeSet; mock: GeneratedMock } {
  const t1 = mintTask1()
  const t2 = mintTask2()
  const mock: GeneratedMock = {
    id: uid('gen-write'),
    title: 'Writing mock — new paper',
    blurb: 'Fresh Task 1 figure and a Task 2 you have not been given yet. 20 minutes then 40.',
    minutes: 60,
    parts: [t1.id, t2.id],
    createdAt: new Date().toISOString(),
    kind: 'writing',
  }
  saveGeneratedMock(mock)
  return { t1, t2, mock }
}

export function mintAcademicMock(): GeneratedMock {
  const t1 = mintTask1()
  const t2 = mintTask2()
  const mock: GeneratedMock = {
    id: uid('gen-mock'),
    title: `Academic Mock — ${new Date().toLocaleString()}`,
    blurb: 'Official order and clocks. Listening and Reading are the Academic papers in the library; Writing is newly generated so you never sit the same essay twice.',
    minutes: 170,
    parts: ['listen-full-1', 'read-full-1', t1.id, t2.id, 'speak-mock-1'],
    createdAt: new Date().toISOString(),
    kind: 'full',
  }
  saveGeneratedMock(mock)
  return mock
}

export function mintReceptiveMock(): GeneratedMock {
  const mock: GeneratedMock = {
    id: uid('gen-lr'),
    title: `Listening + Reading — ${new Date().toLocaleString()}`,
    blurb: '90 minutes back-to-back. Writing is separate so you can generate a new essay after this.',
    minutes: 90,
    parts: ['listen-full-1', 'read-full-1'],
    createdAt: new Date().toISOString(),
    kind: 'receptive',
  }
  saveGeneratedMock(mock)
  return mock
}

function labelType(t: Task2Prompt['type']) {
  if (t === 'opinion') return 'Agree / disagree'
  if (t === 'discussion') return 'Discussion'
  if (t === 'problem-solution') return 'Problem–solution'
  if (t === 'advantages') return 'Advantages–disadvantages'
  return 'Two-part'
}

export function remainingPrompts() {
  const used2 = new Set(loadUsedIds('t2'))
  const used1 = new Set(loadUsedIds('t1'))
  const task2Left = TASK2.filter((p) => !used2.has(p.id)).length
  const task1Left = TASK1.filter((p) => !used1.has(p.id)).length
  return { task2Left, task1Left, task2Total: TASK2.length, task1Total: TASK1.length }
}
