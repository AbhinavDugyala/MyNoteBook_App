export type Skill = 'listening' | 'reading' | 'writing' | 'speaking'

export type Phase = 'foundation' | 'build' | 'intensify' | 'simulate' | 'taper'

export interface Profile {
  name: string
  examDate: string
  target: number
  hoursPerDay: number
  current: Record<Skill, number>
  weakSkills: Skill[]
  createdAt: string
}

export interface Question {
  id: string
  n?: number
  part?: number
  type: string
  prompt: string
  options?: string[]
  answer?: string | string[]
  maxWords?: number
  explanation: string
}

export interface PracticeSet {
  id: string
  skill: Skill
  kind: 'drill' | 'section' | 'full' | 'task'
  title: string
  topic: string
  level: 'foundation' | 'band7' | 'band8'
  minutes: number
  questionType: string
  instructions: string
  passage?: string
  passages?: { title: string; text: string }[]
  script?: { text: string; pause?: number }[]
  visual?: string
  chart?: ChartSpec
  cue?: string
  questions: Question[]
  modelAnswer?: string
  tips: string[]
  officialNote: string
}

export interface TopicCard {
  id: string
  title: string
  cluster: string
  why: string
  listening: string
  reading: string
  writing: string
  speaking: string
  vocab: string[]
  phrases: string[]
  drill: string
}

export interface Attempt {
  id: string
  setId: string
  skill: Skill
  title: string
  startedAt: string
  finishedAt: string
  answers: Record<string, string>
  correct?: number
  total?: number
  raw?: number
  band: number
  criteria?: Record<string, number>
  feedback: string[]
  priorities: string[]
  daysLeft: number
  timeUsed?: number
  timeAllotted?: number
}

export interface PlanTask {
  id: string
  dayOffset: number
  date: string
  skill: Skill | 'mixed'
  title: string
  minutes: number
  setId?: string
  why: string
  done?: boolean
}

export interface StudyPlan {
  phase: Phase
  headline: string
  strategy: string
  days: PlanTask[]
  weeklyMocks: string
  nonNegotiables: string[]
}

export type ChartSpec =
  | {
      type: 'line' | 'bar'
      title: string
      unit: string
      labels: string[]
      series: { name: string; values: number[] }[]
    }
  | {
      type: 'pie'
      title: string
      slices: { name: string; value: number }[]
      compare?: { title: string; slices: { name: string; value: number }[] }
    }
  | {
      type: 'table'
      title: string
      headers: string[]
      rows: (string | number)[][]
    }
  | {
      type: 'process'
      title: string
      stages: string[]
      note?: string
    }
  | {
      type: 'map'
      title: string
      leftTitle: string
      rightTitle: string
      left: MapMark[]
      right: MapMark[]
    }
  | {
      type: 'mixed'
      title: string
      charts: ChartSpec[]
    }

export interface MapMark {
  id: string
  label: string
  x: number
  y: number
  kind: 'build' | 'green' | 'water' | 'road' | 'note'
}

export interface ExaminerMark {
  skill: Skill
  title: string
  band: number
  raw?: number
  total?: number
  correct?: number
  criteria?: Record<string, number>
  parts: { label: string; correct: number; total: number; band?: number }[]
  comments: string[]
}

export interface ExamSession {
  id: string
  title: string
  createdAt: string
  papers: { skill: Skill; title: string; setIds: string[]; minutes: number }[]
  current: number
  begun?: boolean
  attemptIds: string[]
  times: { used: number; allotted: number }[]
  finishedAt?: string
  awaitingMark?: boolean
  lastMarks?: ExaminerMark[]
  allMarks?: ExaminerMark[]
}

export interface VocabEntry {
  word: string
  meaning: string
  collocations: string[]
  band8: string
  topic: string
}
