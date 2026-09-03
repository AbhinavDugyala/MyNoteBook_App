import type { ExamSession, PracticeSet } from '../types'
import { LISTEN_PACKS, READ_PASSAGES, SPEAK_PACKS } from '../data/examPapers'
import { SETS } from '../data/practice'
import { loadUsedIds, markUsedId, saveGeneratedSet } from './generatedStore'
import { mintTask1, mintTask2 } from './generateWriting'
import { saveSession } from './examStore'

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

function unused<T extends { id: string }>(pool: T[], key: string): T {
  const used = new Set(loadUsedIds(key))
  const bag = pool.filter((p) => !used.has(p.id))
  const item = (bag.length ? bag : pool)[Math.floor(Math.random() * (bag.length || pool.length))]
  if (!bag.length) localStorage.setItem(`band8.used.${key}`, JSON.stringify([]))
  markUsedId(key, item.id)
  return item
}

export function mintListeningPaper(): PracticeSet {
  const kind = unused(LISTEN_PACKS, 'listen-pack')
  const built = kind.build()
  const set = wrapListen(built.title, built.topic, built.script, built.questions)
  saveGeneratedSet(set)
  return set
}

export function mintReadingPaper(): PracticeSet {
  const trio = pickTrio()
  const counts = [13, 13, 14]
  const questions = trio.flatMap((p, i) =>
    p.questions.slice(0, counts[i]).map((qq) => ({ ...qq, part: i + 1 })),
  )
  const set: PracticeSet = {
    id: uid('gen-read'),
    skill: 'reading',
    kind: 'full',
    title: `Academic Reading — ${trio.map((p) => p.short).join(' / ')}`,
    topic: trio[0].topic,
    level: 'band8',
    minutes: 60,
    questionType: 'Full Academic Reading (40)',
    instructions:
      '60 minutes. Three Academic texts, 40 questions. No extra transfer time. On computer: passage on the left, questions on the right. Answers come only from the passages.',
    officialNote:
      'Official Academic Reading uses three texts and a mix of TFNG, YNG, headings, matching, completion, and multiple choice. This trio is rotated so you do not sit the same three texts twice in a row.',
    passage: trio.map((p, i) => `PASSAGE ${i + 1} — ${p.title}\n${p.text}`).join('\n\n'),
    passages: trio.map((p, i) => ({ title: `Passage ${i + 1} — ${p.title}`, text: p.text })),
    tips: ['About 20 minutes a passage.', 'TFNG last if you bleed time.', 'Headings = paragraph purpose, not a detail.'],
    questions: questions.map((qq, i) => ({ ...qq, n: i + 1, id: `gr-${i + 1}` })),
  }
  saveGeneratedSet(set)
  return set
}

export function mintSpeakingPaper(): PracticeSet {
  const pack = unused(SPEAK_PACKS, 'speak-pack')
  const set: PracticeSet = {
    id: uid('gen-speak'),
    skill: 'speaking',
    kind: 'full',
    title: `Speaking — ${pack.theme}`,
    topic: pack.topic,
    level: 'band8',
    minutes: 14,
    questionType: 'Parts 1–3',
    instructions:
      'Part 1 about 4 minutes, Part 2 prepare 1 minute and speak 1–2, Part 3 about 5 minutes. Official total 11–14.',
    officialNote: 'Cue cards rotate. Do not recycle a memorised Part 2 if the bullets do not fit.',
    cue: pack.cue,
    tips: ['Part 1: 3–5 sentences.', 'Part 2: a story, not a list.', 'Part 3: speculate and compare.'],
    questions: pack.questions,
  }
  saveGeneratedSet(set)
  return set
}

export function mintFullExam(): ExamSession {
  const L = mintListeningPaper()
  const R = mintReadingPaper()
  const t1 = mintTask1()
  const t2 = mintTask2()
  const S = mintSpeakingPaper()
  const session: ExamSession = {
    id: uid('exam'),
    title: `Academic exam day — ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toISOString(),
    current: 0,
    attemptIds: [],
    times: [],
    papers: [
      { skill: 'listening', title: L.title, setIds: [L.id], minutes: 30 },
      { skill: 'reading', title: R.title, setIds: [R.id], minutes: 60 },
      { skill: 'writing', title: 'Academic Writing (Task 1 + Task 2)', setIds: [t1.id, t2.id], minutes: 60 },
      { skill: 'speaking', title: S.title, setIds: [S.id], minutes: 14 },
    ],
  }
  saveSession(session)
  return session
}

function wrapListen(
  title: string,
  topic: string,
  script: { text: string; pause?: number }[],
  questions: PracticeSet['questions'],
): PracticeSet {
  return {
    id: uid('gen-listen'),
    skill: 'listening',
    kind: 'full',
    title: `Listening — ${title}`,
    topic,
    level: 'band8',
    minutes: 30,
    questionType: 'Full Listening (40)',
    instructions:
      'Four parts, 40 questions. The recording plays once. Type as you listen. Computer-delivered IELTS has no extra transfer sheet — you get about two minutes at the end to check spelling.',
    officialNote:
      'Part 1 form, Part 2 map/plan talk, Part 3 academic discussion, Part 4 lecture. Names and numbers change each sitting.',
    script,
    tips: ['Predict grammar before each gap.', 'Move on if you miss one.', 'Use the last two minutes for spelling.'],
    questions: questions.map((qq, i) => ({ ...qq, n: i + 1, part: qq.part ?? Math.min(4, Math.ceil((i + 1) / 10)) })),
  }
}

function pickTrio() {
  const used = new Set(loadUsedIds('read-pass'))
  const unusedP = READ_PASSAGES.filter((p) => !used.has(p.id))
  const pool = unusedP.length >= 3 ? unusedP : READ_PASSAGES
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const trio = shuffled.slice(0, 3)
  trio.forEach((p) => markUsedId('read-pass', p.id))
  return trio
}

/** Static library papers still usable as extras. */
export function libraryListeningIds() {
  return SETS.filter((s) => s.skill === 'listening' && s.kind === 'full').map((s) => s.id)
}
