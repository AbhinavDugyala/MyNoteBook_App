import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CdBriefing, CdMark, CdPaper } from '../components/CdPapers'
import { ExaminerMeter } from '../components/CdShell'
import { Chip } from '../components/ui'
import { useApp } from '../context/AppContext'
import { getSet } from '../data/practice'
import { attemptFromObjective, daysAwareAdvice, fullExamReport } from '../lib/evaluate'
import { cefrOf, combinedWriting, markObjective, markSpeaking, markWriting } from '../lib/examiner'
import { loadSession, saveSession } from '../lib/examStore'
import { mintFullExam } from '../lib/generatePapers'
import { onceMintId } from '../lib/generateWriting'
import type { Attempt, ExaminerMark, PracticeSet, Skill } from '../types'

export function FullExamGate() {
  const nav = useNavigate()
  useEffect(() => {
    nav(`/exam/${onceMintId('mint-exam-day', mintFullExam)}`, { replace: true })
  }, [nav])
  return (
    <div className="cd-root cd-brief">
      <header className="cd-top">
        <div className="cd-brand">IELTS Academic <span>on computer</span></div>
        <div className="cd-clock">—:—</div>
        <div />
      </header>
      <div className="cd-brief-body">
        <p>Building a unique four-paper Academic day…</p>
      </div>
    </div>
  )
}

export function FullExam() {
  const { examId } = useParams()
  const nav = useNavigate()
  const { profile, addAttempt } = useApp()
  const [rev, setRev] = useState(0)
  const session = examId ? loadSession(examId) : undefined
  const begun = Boolean(session?.begun)
  const finished = Boolean(session?.finishedAt)
  const current = session?.current ?? 0
  const paper = session?.papers[current]
  const allotted = (paper?.minutes ?? 0) * 60

  useEffect(() => {
    const t = window.setInterval(() => {
      const s = examId ? loadSession(examId) : undefined
      if (!s?.begun || s.finishedAt || s.awaitingMark || !s.papers[s.current]) return
      const times = [...s.times]
      const cur = times[s.current] ?? { used: 0, allotted: s.papers[s.current].minutes * 60 }
      cur.allotted = s.papers[s.current].minutes * 60
      cur.used += 1
      times[s.current] = cur
      saveSession({ ...s, times })
      setRev((x) => x + 1)
    }, 1000)
    return () => clearInterval(t)
  }, [examId])

  useEffect(() => {
    if (finished && examId) nav(`/exam/${examId}/report`, { replace: true })
  }, [finished, examId, nav])

  if (!session || !profile) {
    return (
      <div className="cd-root cd-brief">
        <div className="cd-brief-body">
          <p>Exam not found.</p>
          <Link to="/mocks">Back to mocks</Link>
        </div>
      </div>
    )
  }

  if (!begun) {
    return (
      <CdBriefing
        title={session.title}
        papers={session.papers}
        onStart={() => {
          saveSession({ ...session, begun: true })
          setRev((x) => x + 1)
        }}
      />
    )
  }

  if (session.awaitingMark && session.lastMarks?.length) {
    const next = current + 1
    const done = next >= session.papers.length
    const nextSkill = session.papers[next]?.skill
    return (
      <CdMark
        marks={session.lastMarks}
        nextLabel={done ? 'Open Test Report Form' : `Continue to ${nextSkill}`}
        onContinue={() => {
          saveSession({
            ...loadSession(session.id)!,
            current: next,
            awaitingMark: false,
            lastMarks: undefined,
            finishedAt: done ? new Date().toISOString() : undefined,
          })
          if (done) nav(`/exam/${session.id}/report`)
          else setRev((x) => x + 1)
        }}
      />
    )
  }

  if (!paper) return null
  const sets = paper.setIds.map((id) => getSet(id)).filter(Boolean) as PracticeSet[]
  const used = session.times[current]?.used ?? 0
  const remaining = Math.max(0, allotted - used)
  const t1phase = paper.skill === 'writing' && used < 20 * 60

  const submitPaper = (answersList: Record<string, string>[]) => {
    const live = loadSession(session.id)!
    if (live.awaitingMark) return
    const made: Attempt[] = []
    const marks: ExaminerMark[] = []
    sets.forEach((set, i) => {
      const answers = answersList[i] || {}
      let mark: ExaminerMark
      if (set.skill === 'writing') mark = markWriting(set, answers.body || '')
      else if (set.skill === 'speaking') mark = markSpeaking(set, answers.body || Object.values(answers).join(' '))
      else mark = markObjective(set, answers)
      marks.push(mark)
      const att = attemptFromObjective(set, answers, profile, {
        band: mark.band,
        criteria: mark.criteria,
        feedback: daysAwareAdvice(profile, set.skill, mark.band, mark.comments),
      })
      att.timeUsed = used
      att.timeAllotted = allotted
      if (mark.correct != null) att.correct = mark.correct
      if (mark.total != null) att.total = mark.total
      if (mark.raw != null) att.raw = mark.raw
      addAttempt(att)
      made.push(att)
    })
    const shown = paper.skill === 'writing' && marks.length >= 2
      ? [marks[0], marks[1], combinedWriting(marks[0], marks[1])]
      : marks
    saveSession({
      ...loadSession(session.id)!,
      attemptIds: [...session.attemptIds, ...made.map((a) => a.id)],
      awaitingMark: true,
      lastMarks: shown,
      allMarks: [...(session.allMarks || []), ...shown],
    })
    setRev((x) => x + 1)
  }

  void rev
  return (
    <CdPaper
      key={`${paper.skill}-${current}`}
      paper={paper}
      sets={sets}
      remaining={remaining}
      t1phase={t1phase}
      onSubmit={submitPaper}
    />
  )
}

export function ExamReport() {
  const { examId } = useParams()
  const { profile, attempts } = useApp()
  const session = examId ? loadSession(examId) : undefined
  const mine = useMemo(
    () => attempts.filter((a) => session?.attemptIds.includes(a.id)),
    [attempts, session],
  )
  if (!session || !profile) return <p>No report.</p>
  const writing = mine.filter((a) => a.skill === 'writing')
  const writingBand = writing.length >= 2
    ? Math.round(((writing[0].band + writing[1].band * 2) / 3) * 2) / 2
    : last(mine, 'writing') ?? 0
  const scores = {
    listening: last(mine, 'listening') ?? 0,
    reading: last(mine, 'reading') ?? 0,
    writing: writingBand,
    speaking: last(mine, 'speaking') ?? 0,
  }
  const times = session.papers.map((p, i) => ({
    skill: p.skill as Skill,
    used: session.times[i]?.used ?? 0,
    allotted: p.minutes * 60,
  }))
  const report = fullExamReport(profile, scores, times)
  const cefr = cefrOf(report.overall)

  return (
    <div className="trf-page">
      <div className="trf reveal">
        <div className="trf-banner">
          <div>
            <div className="kicker">Test Report Form · Academic</div>
            <h1>Candidate {profile.name}</h1>
            <p className="muted">{session.title} · coaching estimate, not an official IELTS TRF</p>
          </div>
          <div className="trf-overall">
            <span>Overall band</span>
            <strong>{report.overall.toFixed(1)}</strong>
            <em>CEFR {cefr}</em>
          </div>
        </div>
        <div className="trf-skills">
          {(['listening', 'reading', 'writing', 'speaking'] as const).map((s) => (
            <div className={`trf-box ${s === report.weakest ? 'weak' : ''}`} key={s}>
              <span>{s}</span>
              <b>{scores[s].toFixed(1)}</b>
              <small>target {profile.target.toFixed(1)}</small>
            </div>
          ))}
        </div>
        <p className="muted">Writing uses official weighting: Task 2 counts twice Task 1. Listening and Reading use published /40 conversion. Speaking pronunciation is estimated from a transcript.</p>
      </div>

      {(session.allMarks || []).map((m) => (
        <div className="card reveal" key={m.title + m.band}>
          <div className="cd-mark-head">
            <h2>{m.title}</h2>
            <Chip tone="gold">{m.band.toFixed(1)}</Chip>
          </div>
          {m.criteria ? <ExaminerMeter band={m.band} criteria={m.criteria} /> : null}
          {m.total != null ? <p>{m.correct}/{m.total} · ~{m.raw}/40</p> : null}
          <ul className="feedback">{m.comments.slice(0, 4).map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      ))}

      <div className="card reveal">
        <h2>Time management</h2>
        {report.timing.map((t) => (
          <div className="time-row" key={t.skill}>
            <strong>{t.skill}</strong>
            <div className="bar"><i style={{ width: `${Math.min(100, t.ratio * 100)}%` }} /></div>
            <span>{fmt(t.used)} / {fmt(t.allotted)}</span>
            <p className="muted">{t.note}</p>
          </div>
        ))}
      </div>
      <div className="card reveal">
        <h2>What to do next</h2>
        <ul className="feedback">
          {report.headlines.slice(0, 3).map((h) => <li key={h}>{h}</li>)}
          {report.actions.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </div>
      <div className="row">
        <Link className="btn gold" to="/exam/fresh">Sit another unique full mock</Link>
        <Link className="btn ghost" to="/progress">Scorebook</Link>
        <Link className="btn ghost" to="/">Leave exam room</Link>
      </div>
    </div>
  )
}

function last(list: Attempt[], skill: Attempt['skill']) {
  return [...list].reverse().find((a) => a.skill === skill)?.band
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
