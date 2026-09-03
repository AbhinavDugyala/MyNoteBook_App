import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getSet } from '../data/practice'
import { useApp } from '../context/AppContext'
import { answersMatch, rawToBand } from '../lib/scoring'
import { attemptFromObjective, daysAwareAdvice, evaluateSpeaking, evaluateWriting } from '../lib/evaluate'
import { mintTask1, mintTask2, onceMintId } from '../lib/generateWriting'
import { ExamChart } from '../components/ExamChart'
import { ExaminerMeter } from '../components/CdShell'
import { Criteria, Timer } from '../components/ui'
import { liveSpeaking, liveWriting } from '../lib/examiner'
import type { Attempt } from '../types'

export function Practice() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const next = sp.get('next')
  const qs = sp.toString() ? `?${sp.toString()}` : ''
  const set = id && !id.startsWith('fresh-') ? getSet(id) : undefined

  useEffect(() => {
    if (!id) return
    if (id === 'fresh-t1') {
      nav(`/practice/${onceMintId('mint-t1', mintTask1)}${qs}`, { replace: true })
      return
    }
    if (id === 'fresh-t2') {
      nav(`/practice/${onceMintId('mint-t2', mintTask2)}${qs}`, { replace: true })
      return
    }
    if (id === 'fresh-writing') {
      nav('/run/fresh-writing', { replace: true })
      return
    }
    if (id === 'fresh-full-mock') {
      nav('/exam/fresh', { replace: true })
      return
    }
    const base = getSet(id)
    if (base?.skill === 'writing' && !id.startsWith('gen-')) {
      const isT1 = /task 1|visual|graph|process|map|table|pie|bar|line/i.test(`${base.title} ${base.questionType}`)
      const minted = onceMintId(isT1 ? 'mint-t1' : 'mint-t2', isT1 ? mintTask1 : mintTask2)
      nav(`/practice/${minted}${qs}`, { replace: true })
    }
  }, [id, nav, qs])
  const { profile, addAttempt } = useApp()
  const [seconds, setSeconds] = useState(set ? set.minutes * 60 : 0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Attempt | null>(null)
  const [playing, setPlaying] = useState(false)
  const [hearing, setHearing] = useState('')
  const recRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setSeconds(set ? set.minutes * 60 : 0)
    setAnswers({})
    setResult(null)
    speechSynthesis.cancel()
  }, [set?.id])

  useEffect(() => {
    if (!set || result) return
    const t = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [set?.id, result])

  const productive = set && (set.skill === 'writing' || set.skill === 'speaking')
  const wc = (answers.body || '').trim().split(/\s+/).filter(Boolean).length
  const minWords = set?.questionType.toLowerCase().includes('task 1') ? 150 : 250

  const play = () => {
    const chunks = set?.script
    if (!chunks) return
    speechSynthesis.cancel()
    setPlaying(true)
    const utterAll = (i: number) => {
      if (i >= chunks.length) {
        setPlaying(false)
        return
      }
      const u = new SpeechSynthesisUtterance(chunks[i].text)
      u.rate = 0.92
      const voices = speechSynthesis.getVoices()
      const gb = voices.find((v) => /en-GB|British/i.test(v.lang + v.name))
      if (gb) u.voice = gb
      u.onend = () => setTimeout(() => utterAll(i + 1), (chunks[i].pause ?? 0.6) * 1000)
      speechSynthesis.speak(u)
    }
    utterAll(0)
  }

  const listenMic = (qid: string) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setHearing('This browser has no speech recognition. Type a transcript instead.')
      return
    }
    const rec = new SR()
    rec.lang = 'en-GB'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' '
      setAnswers((a) => ({ ...a, [qid]: text.trim(), body: text.trim() }))
    }
    rec.onerror = () => setHearing('Mic failed — paste a transcript.')
    recRef.current = rec
    rec.start()
    setHearing('Listening… speak as in the exam room.')
  }

  const submit = () => {
    if (!set || !profile) return
    if (set.skill === 'writing') {
      const ev = evaluateWriting(set, answers.body || '')
      const att = attemptFromObjective(set, answers, profile, {
        band: ev.band,
        criteria: ev.criteria,
        feedback: daysAwareAdvice(profile, 'writing', ev.band, ev.notes),
      })
      att.priorities = ev.notes
      att.timeUsed = set.minutes * 60 - seconds
      att.timeAllotted = set.minutes * 60
      addAttempt(att)
      setResult(att)
      return
    }
    if (set.skill === 'speaking') {
      const ev = evaluateSpeaking(set, answers.body || Object.values(answers).join(' '))
      const att = attemptFromObjective(set, answers, profile, {
        band: ev.band,
        criteria: ev.criteria,
        feedback: daysAwareAdvice(profile, 'speaking', ev.band, ev.notes),
      })
      att.timeUsed = set.minutes * 60 - seconds
      att.timeAllotted = set.minutes * 60
      addAttempt(att)
      setResult(att)
      return
    }
    const scored = set.questions.filter((q) => q.answer != null)
    let correct = 0
    scored.forEach((q) => {
      if (answersMatch(q.answer as string | string[], answers[q.id] || '')) correct += 1
    })
    const scale = set.kind === 'full' ? correct : Math.round((correct / Math.max(scored.length, 1)) * 40)
    const band = rawToBand(set.skill === 'listening' ? 'listening' : 'reading', scale)
    const misses = scored.filter((q) => !answersMatch(q.answer as string | string[], answers[q.id] || ''))
    const notes = [
      `${correct} / ${scored.length} on this paper. Scaled to official 40-item conversion: ~${scale}/40 → Band ${band}.`,
      ...misses.slice(0, 5).map((q) => `Q${q.n ?? q.id}: ${q.explanation}`),
    ]
    const att = attemptFromObjective(set, answers, profile, {
      band,
      feedback: daysAwareAdvice(profile, set.skill, band, notes),
    })
    att.correct = correct
    att.total = scored.length
    att.raw = scale
    att.timeUsed = set.minutes * 60 - seconds
    att.timeAllotted = set.minutes * 60
    addAttempt(att)
    setResult(att)
  }

  const review = useMemo(() => {
    if (!set || !result) return []
    return set.questions.filter((q) => q.answer != null)
  }, [set, result])

  if (!set) {
    return (
      <div className="card">
        <p>{id?.startsWith('fresh-') || !id ? 'Issuing a new paper…' : 'Set not found.'}</p>
        <Link to="/write">Writing studio</Link>
      </div>
    )
  }
  if (!profile) return <p>Complete setup first.</p>

  return (
    <>
      <div className="practice-head">
        <div>
          <div className="kicker">{set.skill} · {set.questionType}</div>
          <h1 className="page-title">{set.title}</h1>
          <p className="muted">{set.officialNote}</p>
        </div>
        <div>
          <Timer seconds={seconds} />
          {set.skill === 'writing' ? (
            <div className={`wordcount ${wc >= minWords ? 'ok' : ''}`}>{wc} / {minWords} words</div>
          ) : null}
          {seconds <= 180 && seconds > 0 && !result ? <div className="time-warn">Under 3 minutes</div> : null}
        </div>
      </div>

      <div className="card" style={{ margin: '16px 0' }}>
        <p>{set.instructions}</p>
        {set.tips.length ? <ul>{set.tips.map((t) => <li key={t}>{t}</li>)}</ul> : null}
        {set.script ? (
          <div className="row">
            <button className="btn gold" type="button" onClick={play} disabled={playing}>
              {playing ? 'Playing official-pace audio…' : 'Play recording (once, like the test)'}
            </button>
            <button className="btn ghost" type="button" onClick={() => speechSynthesis.cancel()}>Stop</button>
          </div>
        ) : null}
      </div>

      {set.chart ? <ExamChart spec={set.chart} print /> : set.visual ? <pre className="passage">{set.visual}</pre> : null}
      {set.cue ? <pre className="passage">{set.cue}</pre> : null}
      {set.passage ? <div className="passage">{set.passage}</div> : null}

      {!result ? (
        <div className="card" style={{ marginTop: 16 }}>
          {productive ? (
            <>
              <label className="q">
                <span>{set.questions[0]?.prompt || 'Your answer'}</span>
                <textarea
                  value={answers.body || ''}
                  onChange={(e) => setAnswers({ ...answers, body: e.target.value })}
                  placeholder={set.skill === 'writing' ? 'Type the full Task…' : 'Speak, or paste a transcript…'}
                />
              </label>
              {set.skill === 'speaking' ? (
                <div className="row">
                  <button className="btn sage" type="button" onClick={() => listenMic('body')}>Use microphone</button>
                  <button className="btn ghost" type="button" onClick={() => recRef.current?.stop()}>Stop mic</button>
                  <span className="muted">{hearing}</span>
                </div>
              ) : null}
              {set.skill === 'writing' || set.skill === 'speaking' ? (() => {
                const live = set.skill === 'writing' ? liveWriting(set, answers.body || '') : liveSpeaking(set, answers.body || Object.values(answers).join(' '))
                return <ExaminerMeter band={live.band} criteria={live.criteria} live />
              })() : null}
              {set.questions.length > 1 ? set.questions.slice(1).map((q) => (
                <label className="q" key={q.id}>
                  <span>{q.n ? `${q.n}. ` : ''}{q.prompt}</span>
                  <textarea
                    style={{ minHeight: 90 }}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value, body: Object.values({ ...a, [q.id]: e.target.value }).join('\n') }))}
                  />
                </label>
              )) : null}
            </>
          ) : (
            set.questions.map((q) => (
              <label className="q" key={q.id}>
                <span>{q.n ? `Question ${q.n}. ` : ''}{q.prompt}</span>
                {q.options || q.type === 'tfng' || q.type === 'yng' ? (
                  <select value={answers[q.id] || ''} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}>
                    <option value="">Select</option>
                    {(q.options || (q.type === 'yng' ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'])).map((o) => {
                      const stored = q.type === 'headings' || q.type === 'mcq' || q.type === 'match' ? letter(o) : o
                      return <option key={o} value={stored}>{o}</option>
                    })}
                  </select>
                ) : (
                  <input value={answers[q.id] || ''} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
                )}
              </label>
            ))
          )}
          <button className="btn" type="button" onClick={submit}>Submit for a band estimate</button>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="kicker">Marked · {result.daysLeft} days then left on your clock</div>
          <h2>Estimated band {result.band.toFixed(1)}</h2>
          {result.total ? <p>{result.correct} / {result.total} correct (official-style conversion used {result.raw}/40).</p> : null}
          {result.criteria ? <Criteria data={result.criteria} /> : null}
          <ul className="feedback">
            {result.feedback.map((f) => <li key={f}>{f}</li>)}
          </ul>
          {set.modelAnswer ? (
            <>
              <h3>Examiner-style model (not a memorise-me script)</h3>
              <div className="passage">{set.modelAnswer}</div>
            </>
          ) : null}
          {review.length ? (
            <div className="table-wrap">
            <table className="table">
              <thead><tr><th>#</th><th>Yours</th><th>Key</th><th>Why</th></tr></thead>
              <tbody>
                {review.map((q) => {
                  const ok = answersMatch(q.answer as string | string[], answers[q.id] || '')
                  return (
                    <tr key={q.id}>
                      <td>{q.n}</td>
                      <td style={{ color: ok ? 'var(--sage)' : 'var(--brick)' }}>{answers[q.id] || '—'}</td>
                      <td>{Array.isArray(q.answer) ? q.answer[0] : q.answer}</td>
                      <td>{q.explanation}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          ) : null}
          <div className="row" style={{ marginTop: 16 }}>
            {next ? <Link className="btn gold" to={next}>Next paper in this mock</Link> : <Link className="btn gold" to="/progress">Save & see trend</Link>}
            {set.skill === 'writing' ? (
              <Link
                className="btn"
                to={set.questionType.toLowerCase().includes('task 1') ? '/practice/fresh-t1' : '/practice/fresh-t2'}
              >
                Write another new mock
              </Link>
            ) : null}
            <Link className="btn ghost" to="/write">Writing studio</Link>
          </div>
        </div>
      )}
    </>
  )
}

function letter(option: string) {
  const roman = option.match(/^(i{1,3}|iv|v|vi{0,3}|ix|x)\b/i)
  if (roman) return roman[1].toLowerCase()
  const m = option.match(/^([A-E])\b/i)
  return m ? m[1].toUpperCase() : option
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition }
    webkitSpeechRecognition: { new (): SpeechRecognition }
  }
  interface SpeechRecognition extends EventTarget {
    lang: string
    continuous: boolean
    interimResults: boolean
    start(): void
    stop(): void
    onresult: ((e: SpeechRecognitionEvent) => void) | null
    onerror: (() => void) | null
  }
  interface SpeechRecognitionEvent extends Event {
    results: { length: number; [i: number]: { [j: number]: { transcript: string } } }
  }
}
