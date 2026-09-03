import type { ExaminerMark, PracticeSet } from '../types'
import { evaluateSpeaking, evaluateWriting } from './evaluate'
import { answersMatch, rawToBand } from './scoring'

/** Public IELTS Writing/Speaking descriptor gist (official published bands). */
export const DESCRIPTOR: Record<string, Record<number, string>> = {
  'Task Achievement': {
    5: 'Recounts detail mechanically; no clear overview; some inaccuracy.',
    6: 'Addresses the task; overview may be unclear; some irrelevant detail.',
    7: 'Clear overview; key features selected; occasional omission or inaccuracy.',
    8: 'Clear, well-selected features; accurate data; a fully sufficient overview.',
    9: 'Fully satisfies the task; nothing irrelevant; data precise.',
  },
  'Task Response': {
    5: 'Addresses the task only partially; ideas limited and not well supported.',
    6: 'Addresses all parts, though some more fully; position present but general.',
    7: 'All parts covered; position clear; ideas extended but may be over-general.',
    8: 'Well-developed position; ideas relevant and extended; nothing left thin.',
    9: 'Fully addresses all parts with a precise, fully extended position.',
  },
  'Coherence & Cohesion': {
    5: 'Organisation inadequate; linking may be repetitive or faulty.',
    6: 'Coherent overall; cohesive devices used but sometimes mechanical.',
    7: 'Logical progression; a range of cohesive devices, with occasional lapses.',
    8: 'Sequences information and ideas logically; manages all aspects of cohesion.',
    9: 'Uses cohesion in such a way that it attracts no attention.',
  },
  'Lexical Resource': {
    5: 'Limited vocabulary; errors may cause difficulty.',
    6: 'Adequate range; some attempts at less common items, with errors.',
    7: 'Sufficient range; some less common items; occasional inaccuracy.',
    8: 'Wide resource used fluently; uncommon items mostly skilful.',
    9: 'Full flexibility and precise meaning throughout.',
  },
  'Grammatical Range & Accuracy': {
    5: 'Limited range; frequent errors; meaning sometimes unclear.',
    6: 'Mix of simple and complex; errors do not usually impede communication.',
    7: 'A variety of complex structures; frequent error-free sentences.',
    8: 'Wide range; the majority of sentences are error-free.',
    9: 'Full range; accuracy is consistent apart from rare slips.',
  },
  'Fluency & Coherence': {
    5: 'Speech is slow; repetition and self-correction; simple linking.',
    6: 'Willing to speak at length; some hesitation and repetition.',
    7: 'Speaks at length without noticeable effort; some self-correction.',
    8: 'Fluent with only occasional repetition or self-correction.',
    9: 'Effortless; coherent spoken language throughout.',
  },
  Pronunciation: {
    5: 'Mispronunciation causes some strain for the listener.',
    6: 'Can be understood; mispronunciation of some words or sounds.',
    7: 'Easy to understand; L1 is noticeable but does not reduce clarity.',
    8: 'Easy throughout; flexible use of features; L1 influence may remain.',
    9: 'Precision and subtlety throughout; effortless to understand.',
  },
}

export function descriptorFor(criterion: string, band: number): string {
  const table = DESCRIPTOR[criterion]
  if (!table) return ''
  const keys = Object.keys(table).map(Number).sort((a, b) => b - a)
  const hit = keys.find((k) => band >= k) ?? keys[keys.length - 1]
  return table[hit]
}

export function liveWriting(set: PracticeSet, text: string) {
  return evaluateWriting(set, text)
}

export function liveSpeaking(set: PracticeSet, text: string) {
  return evaluateSpeaking(set, text)
}

export function cefrOf(band: number): string {
  if (band >= 8.5) return 'C2'
  if (band >= 7) return 'C1'
  if (band >= 5.5) return 'B2'
  if (band >= 4) return 'B1'
  if (band >= 3) return 'A2'
  return 'A1'
}

export function markObjective(set: PracticeSet, answers: Record<string, string>): ExaminerMark {
  const scored = set.questions.filter((q) => q.answer != null)
  let correct = 0
  const buckets: Record<string, { correct: number; total: number }> = {}
  scored.forEach((q) => {
    const n = q.n ?? 0
    const inferred = set.skill === 'listening'
      ? Math.min(4, Math.max(1, Math.ceil(n / 10) || 1))
      : Math.min(3, n <= 13 ? 1 : n <= 26 ? 2 : 3)
    const part = q.part ?? inferred
    const label = set.skill === 'listening'
      ? `Part ${part} (Q${(part - 1) * 10 + 1}–${part * 10})`
      : `Passage ${part}`
    buckets[label] ||= { correct: 0, total: 0 }
    buckets[label].total += 1
    if (answersMatch(q.answer as string | string[], answers[q.id] || '')) {
      correct += 1
      buckets[label].correct += 1
    }
  })
  const scale = Math.round((correct / Math.max(scored.length, 1)) * 40)
  const band = rawToBand(set.skill === 'listening' ? 'listening' : 'reading', scale)
  const parts = Object.entries(buckets).map(([label, v]) => ({
    label,
    ...v,
    band: rawToBand(set.skill === 'listening' ? 'listening' : 'reading', Math.round((v.correct / Math.max(v.total, 1)) * 40)),
  }))
  const comments = [
    `An IELTS examiner would mark this paper by raw score, not by impression. ${correct}/${scored.length} scales to about ${scale}/40 → Band ${band.toFixed(1)} on the published Academic conversion.`,
    band >= 8
      ? 'Band 8 on this paper is typically 35–36/40. You are in that region — protect spelling and word limits.'
      : `To reach Band 8 you still need about ${Math.max(0, 35 - scale)} more correct answers on a 40-item paper.`,
    parts.some((p) => p.correct / p.total < 0.5)
      ? `Weakest block: ${parts.slice().sort((a, b) => a.correct / a.total - b.correct / b.total)[0].label}. That is a question-type problem, not “the whole paper”.`
      : 'Accuracy is fairly even across parts — keep that balance under the official clock.',
  ]
  return {
    skill: set.skill,
    title: set.title,
    band,
    raw: scale,
    total: scored.length,
    correct,
    parts,
    comments,
  }
}

export function markWriting(set: PracticeSet, text: string): ExaminerMark {
  const ev = evaluateWriting(set, text)
  const comments = [
    ...ev.notes,
    ...Object.entries(ev.criteria).map(([k, v]) => `${k} ${v.toFixed(1)} — ${descriptorFor(k, v)}`),
  ]
  return {
    skill: 'writing',
    title: set.title,
    band: ev.band,
    criteria: ev.criteria,
    parts: Object.entries(ev.criteria).map(([label, band]) => ({ label, correct: 0, total: 0, band })),
    comments,
  }
}

export function combinedWriting(t1: ExaminerMark, t2: ExaminerMark): ExaminerMark {
  const band = Math.round(((t1.band + t2.band * 2) / 3) * 2) / 2
  return {
    skill: 'writing',
    title: 'Academic Writing (Task 2 double weight)',
    band,
    criteria: {
      'Task 1': t1.band,
      'Task 2': t2.band,
      Combined: band,
    },
    parts: [
      { label: 'Task 1', correct: 0, total: 0, band: t1.band },
      { label: 'Task 2 (×2)', correct: 0, total: 0, band: t2.band },
    ],
    comments: [
      `An examiner reports one Writing band. Task 2 counts twice Task 1: (${t1.band.toFixed(1)} + ${t2.band.toFixed(1)}×2) ÷ 3 → ${band.toFixed(1)}.`,
      ...t1.comments.slice(0, 2).map((c) => `Task 1: ${c}`),
      ...t2.comments.slice(0, 2).map((c) => `Task 2: ${c}`),
    ],
  }
}

export function markSpeaking(set: PracticeSet, text: string): ExaminerMark {
  const ev = evaluateSpeaking(set, text)
  const comments = [
    ...ev.notes,
    ...Object.entries(ev.criteria).map(([k, v]) => `${k} ${v.toFixed(1)} — ${descriptorFor(k, v)}`),
  ]
  return {
    skill: 'speaking',
    title: set.title,
    band: ev.band,
    criteria: ev.criteria,
    parts: Object.entries(ev.criteria).map(([label, band]) => ({ label, correct: 0, total: 0, band })),
    comments,
  }
}
