import type { Attempt, PracticeSet, Profile, Skill } from '../types'
import { clampBand, daysUntil, overallBand } from './scoring'

const ACADEMIC = [
  'moreover', 'furthermore', 'however', 'therefore', 'whereas', 'consequently',
  'nevertheless', 'albeit', 'substantial', 'significant', 'indicate', 'illustrate',
  'constitute', 'prevalent', 'mitigate', 'exacerbate', 'fluctuate', 'proportion',
  'whereas', 'notably', 'predominantly', 'subsequently', 'respectively',
  'hypothesis', 'implication', 'correlation', 'framework', 'perspective',
]

const INFORMAL = [
  'gonna', 'wanna', 'kids', 'guys', 'a lot of', 'really really', 'i think that i think',
  'stuff', 'things like that', 'etc', 'kinda', 'yeah',
]

const LINKERS = [
  'firstly', 'secondly', 'in contrast', 'on the other hand', 'for instance',
  'as a result', 'in conclusion', 'overall', 'to summarise', 'in addition',
  'by contrast', 'this means', 'one reason', 'another factor',
]

const HEDGE = ['arguably', 'it appears', 'tend to', 'may', 'might', 'likely', 'to some extent']

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

function countHits(text: string, list: string[]): number {
  const t = text.toLowerCase()
  return list.filter((w) => t.includes(w)).length
}

function sentenceStats(text: string) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 8)
  const lengths = sentences.map((s) => words(s).length)
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  const variety = lengths.length ? Math.max(...lengths) - Math.min(...lengths) : 0
  return { sentences: sentences.length, avg, variety }
}

function criterion(score: number, notes: string[]): { score: number; notes: string[] } {
  return { score: clampBand(score), notes }
}

export function evaluateWriting(set: PracticeSet, text: string) {
  const wc = words(text).length
  const isTask1 = /task 1|visual|graph|chart|map|process|table/i.test(set.title + set.questionType)
  const min = isTask1 ? 150 : 250
  const stats = sentenceStats(text)
  const academic = countHits(text, ACADEMIC)
  const informal = countHits(text, INFORMAL)
  const linkers = countHits(text, LINKERS)
  const hedges = countHits(text, HEDGE)
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim().length > 40).length
  const hasOverview = /overall|it is clear|the most striking|in general/i.test(text)
  const hasPosition = /i (agree|disagree|believe|argue)|this essay|in my view|i am of the opinion/i.test(text)
  const compare = /higher|lower|increased|decreased|compared|whereas|while|respectively|peak|lowest/i.test(text)
  const repeatHeavy = /(the data|the graph|people|government)\s+\1/i.test(text) || /(\b\w{5,}\b).{0,40}\1.{0,40}\1/i.test(text)

  let ta = 6
  if (wc >= min) ta += 0.5
  if (wc >= min + 40) ta += 0.5
  if (wc < min - 20) ta -= 1.5
  if (isTask1 && hasOverview) ta += 1
  if (isTask1 && compare) ta += 0.5
  if (!isTask1 && hasPosition) ta += 0.5
  if (!isTask1 && paras >= 4) ta += 0.5
  if (set.questions[0] && text.toLowerCase().includes(set.topic.toLowerCase().split(' ')[0] || 'xx')) ta += 0.25

  let cc = 5.5
  if (linkers >= 3) cc += 1
  if (linkers >= 6) cc += 0.5
  if (paras >= (isTask1 ? 3 : 4)) cc += 0.5
  if (stats.sentences >= (isTask1 ? 8 : 12)) cc += 0.5
  if (linkers <= 1) cc -= 0.5

  let lr = 5.5
  if (academic >= 4) lr += 1
  if (academic >= 8) lr += 0.5
  if (hedges >= 2) lr += 0.5
  if (informal) lr -= informal * 0.5
  if (repeatHeavy) lr -= 0.5
  if (wc > min && new Set(words(text).map((w) => w.toLowerCase())).size / wc > 0.55) lr += 0.5

  let gra = 6
  if (stats.variety >= 8) gra += 0.5
  if (stats.avg >= 14 && stats.avg <= 24) gra += 0.5
  if (stats.sentences >= 10) gra += 0.5
  if ((text.match(/\b(which|that|although|while|if|because)\b/gi) || []).length >= 4) gra += 0.5
  if ((text.match(/\bi am\b/gi) || []).length > 6) gra -= 0.5

  const criteria = {
    [isTask1 ? 'Task Achievement' : 'Task Response']: clampBand(ta),
    'Coherence & Cohesion': clampBand(cc),
    'Lexical Resource': clampBand(lr),
    'Grammatical Range & Accuracy': clampBand(gra),
  }
  const band = clampBand(
    (Object.values(criteria).reduce((a, b) => a + b, 0) / 4),
  )

  const notes: string[] = []
  if (wc < min) notes.push(`Under length: ${wc} words (minimum ${min}). Examiners penalise this immediately.`)
  else notes.push(`Length: ${wc} words — ${wc >= min + 20 ? 'safe' : 'just at the line'}.`)
  if (isTask1 && !hasOverview) notes.push('Band 8 Task 1 requires a clear overview of main trends, not a list of numbers.')
  if (!isTask1 && !hasPosition) notes.push('State a precise position in the introduction and keep it consistent.')
  if (linkers < 3) notes.push('Cohesion is thin. Use a wider range of referencing and sequencing, not only “firstly/secondly”.')
  if (academic < 4) notes.push('Lexical resource is still general. Swap common words for precise academic verbs and nouns.')
  if (informal) notes.push('Informal wording appeared. Academic Writing must stay formal throughout.')
  if (stats.avg < 12) notes.push('Sentences are short and similar. Mix complex and compound structures.')
  if (band >= 8) notes.push('This draft is in the Band 8 range on a rubric estimate — check it still answers every bullet of the task.')

  return { band, criteria, notes, wordCount: wc }
}

export function evaluateSpeaking(set: PracticeSet, text: string) {
  const wc = words(text).length
  const stats = sentenceStats(text)
  const discourse = countHits(text, ['well', 'actually', 'to be honest', 'what i mean', 'for example', 'on the other hand', 'i suppose', 'it depends'])
  const rare = countHits(text, ['memorable', 'fascinating', 'inevitable', 'worthwhile', 'invaluable', 'profound', 'subtle', 'nowadays'])
  const fillers = (text.match(/\b(um|uh|like|you know|kind of)\b/gi) || []).length
  const part2 = /part 2|cue/i.test(set.title + set.questionType)
  const target = part2 ? 180 : 80

  let fc = 6
  if (wc >= target) fc += 1
  if (discourse >= 3) fc += 0.5
  if (fillers > 8) fc -= 0.5
  if (wc < target * 0.5) fc -= 1

  let lr = 5.5
  if (rare >= 2) lr += 1
  if (countHits(text, ACADEMIC) >= 2) lr += 0.5
  if (new Set(words(text).map((w) => w.toLowerCase())).size / Math.max(wc, 1) > 0.5) lr += 0.5

  let gra = 6
  if ((text.match(/\b(which|who|although|even if|unless|whereas)\b/gi) || []).length >= 2) gra += 0.5
  if (stats.variety >= 6) gra += 0.5
  if (stats.avg >= 10) gra += 0.5

  let pron = 7
  if (wc < 40) pron = 6

  const criteria = {
    'Fluency & Coherence': clampBand(fc),
    'Lexical Resource': clampBand(lr),
    'Grammatical Range & Accuracy': clampBand(gra),
    Pronunciation: clampBand(pron),
  }
  const band = clampBand(Object.values(criteria).reduce((a, b) => a + b, 0) / 4)
  const notes: string[] = []
  notes.push(part2
    ? `Long-turn length ≈ ${wc} words (aim to speak for 1:30–2:00; this is a transcript proxy).`
    : `Answer length ≈ ${wc} words. Extend with a reason, example, and contrast.`)
  if (discourse < 2) notes.push('Add natural signposting: “It depends…”, “What I mean is…”, “A good example is…”.')
  if (rare < 2) notes.push('Band 8 lexis uses less-common items precisely, not long memorised sentences.')
  notes.push('Pronunciation is estimated only. Record yourself and check word stress and chunking; a human examiner scores this live.')
  if (band >= 8) notes.push('Content is Band 8-ish — now reduce hesitation and avoid reciting a memorised script.')
  return { band, criteria, notes, wordCount: wc }
}

export function daysAwareAdvice(profile: Profile, skill: Skill, band: number, notes: string[]): string[] {
  const days = Math.max(0, daysUntil(profile.examDate))
  const gap = profile.target - band
  const out: string[] = []

  if (days <= 2) {
    out.push('Exam-eve rule: no new essay templates. Sleep 8 hours, review your error journal, and do one light warm-up only.')
    out.push('Pack ID, know the test-day rules, and stop refreshing predicted topics. Flexibility beats memorisation.')
  } else if (days <= 7) {
    out.push(`Seven-day triage: close the ${gap >= 0.5 ? skill : 'timing'} gap. One timed ${skill} set daily, then rewrite only the weakest criterion.`)
    out.push('Drop low-yield vocab lists. Re-mark your last two mocks and fix the same three mistakes until they disappear.')
  } else if (days <= 14) {
    out.push('Two-week protocol: 70% of minutes go to your two weakest skills. Full mock every third day.')
    out.push('Writing: one Task 2 every day, one Task 1 every other day. Speaking: record Part 2 daily and transcribe 60 seconds.')
  } else if (days <= 30) {
    out.push('30-day intensify: two section-timed papers most days and one full Academic mock each week.')
    out.push(`Build a personal phrase bank aimed at Band ${profile.target} from your own corrections — examiners reward accurate flexibility, not copied “band 9” sentences.`)
  } else if (days <= 60) {
    out.push('60-day build: master every official question type before chasing mock scores. Weak type = extra drill the next day.')
    out.push('Schedule writing and speaking four days a week even when reading/listening feel safer.')
  } else {
    out.push('Foundation window: learn the test mechanics, paraphrase habits, and Academic Task 1 overview skill before heavy mock volume.')
    out.push('Read one long Academic-style article daily and retell it in 90 seconds — this feeds all four papers.')
  }

  if (gap >= 1.5) out.push(`You are ${gap.toFixed(1)} bands below target on this paper. Prioritise it over skills already at ${profile.target}.`)
  if (gap <= 0) out.push('This paper is at target. Maintain with one timed set every 3 days so it does not slip while you lift others.')
  return [...out, ...notes.slice(0, 4)]
}

export function attemptFromObjective(
  set: PracticeSet,
  answers: Record<string, string>,
  profile: Profile,
  extra?: { band?: number; criteria?: Record<string, number>; feedback?: string[] },
): Attempt {
  const scored = set.questions.filter((q) => q.answer != null)
  let correct = 0
  scored.forEach((q) => {
    const g = answers[q.id] || ''
    if (q.answer && answersMatchSafe(q.answer, g)) correct += 1
  })
  return {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    setId: set.id,
    skill: set.skill,
    title: set.title,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    answers,
    correct,
    total: scored.length || set.questions.length,
    raw: correct,
    band: extra?.band ?? 0,
    criteria: extra?.criteria,
    feedback: extra?.feedback ?? [],
    priorities: [],
    daysLeft: Math.max(0, daysUntil(profile.examDate)),
  }
}

function answersMatchSafe(expected: string | string[], given: string): boolean {
  const norm = (s: string) =>
    s.trim().toLowerCase().replace(/[.,;:!?()]/g, '').replace(/\s+/g, ' ').replace(/^(the|a|an)\s+/, '')
  const variants = (Array.isArray(expected) ? expected : [expected]).map(norm)
  const g = norm(given)
  return Boolean(g) && variants.some((v) => v === g)
}

export function fullExamReport(
  profile: Profile,
  scores: Partial<Record<Skill, number>>,
  times: { skill: Skill; used: number; allotted: number }[],
) {
  const merged: Record<Skill, number> = {
    listening: scores.listening ?? profile.current.listening,
    reading: scores.reading ?? profile.current.reading,
    writing: scores.writing ?? profile.current.writing,
    speaking: scores.speaking ?? profile.current.speaking,
  }
  const overall = overallBand(merged)
  const days = Math.max(0, daysUntil(profile.examDate))
  const timing = times.map((t) => {
    const ratio = t.used / Math.max(t.allotted, 1)
    let note = 'On the official clock.'
    if (ratio < 0.55 && t.skill !== 'speaking') note = 'Finished very early — check you did not rush the last questions.'
    if (ratio > 1) note = 'Overran. On test day the paper is taken away. Practise leaving 2–3 minutes to check.'
    if (ratio > 0.92 && ratio <= 1) note = 'Tight finish. Build a 3-minute check habit.'
    return { ...t, note, ratio }
  })
  const order = skillPriorities(profile, merged)
  const weakest = order[0]
  const headlines = daysAwareAdvice(profile, weakest, merged[weakest], [])
  const actions = [
    `${weakest} is the paper that still sits furthest from ${profile.target.toFixed(1)}. Tomorrow: one timed ${weakest} set, then only correct the weakest criterion.`,
    times.some((t) => t.used > t.allotted)
      ? 'Time management failed at least one paper. Next mock: write the remaining time on paper every 15 minutes.'
      : 'Clocks were under control. Keep the same split: Reading 20/20/20, Writing 20 then 40.',
    days <= 7
      ? 'You are inside a week. Do not sit another full four-paper day tomorrow. Sleep and error journal.'
      : 'Sit the next unique full mock in 3–7 days. Same-week repeats teach the test, not English.',
  ]
  return { overall, merged, timing, headlines, actions, weakest, days }
}

export function skillPriorities(profile: Profile, latest: Partial<Record<Skill, number>>): Skill[] {
  const merged = { ...profile.current, ...latest }
  return (['listening', 'reading', 'writing', 'speaking'] as Skill[])
    .map((s) => ({ s, gap: profile.target - merged[s] }))
    .sort((a, b) => b.gap - a.gap)
    .map((x) => x.s)
}
