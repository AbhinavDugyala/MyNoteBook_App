import { useEffect, useRef, useState } from 'react'
import { ExamChart } from './ExamChart'
import { CdNav, CdShell, ExaminerMeter } from './CdShell'
import { descriptorFor, liveSpeaking, liveWriting } from '../lib/examiner'
import type { PracticeSet, Question } from '../types'

function letter(option: string) {
  const roman = option.match(/^(i{1,3}|iv|v|vi{0,3}|ix|x)\b/i)
  if (roman) return roman[1].toLowerCase()
  const m = option.match(/^([A-E])\b/i)
  return m ? m[1].toUpperCase() : option
}

function storedValue(q: Question, option: string) {
  if (q.type === 'tfng' || q.type === 'yng') return option
  if (q.type === 'mcq' || q.type === 'match' || q.type === 'heading' || q.type === 'headings') return letter(option)
  return option
}

function isChoice(q: Question) {
  return Boolean(q.options) || q.type === 'tfng' || q.type === 'yng' || q.type === 'heading'
}

function choiceOptions(q: Question) {
  if (q.options?.length) return q.options
  if (q.type === 'yng') return ['YES', 'NO', 'NOT GIVEN']
  return ['TRUE', 'FALSE', 'NOT GIVEN']
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function CdPaper({
  paper,
  sets,
  remaining,
  t1phase,
  onSubmit,
}: {
  paper: { skill: string; title: string; minutes: number }
  sets: PracticeSet[]
  remaining: number
  t1phase: boolean
  onSubmit: (a: Record<string, string>[]) => void
}) {
  const [answers, setAnswers] = useState<Record<string, string>[]>(() => sets.map(() => ({})))
  const [hidden, setHidden] = useState(false)
  const [help, setHelp] = useState(false)
  const [settings, setSettings] = useState(false)
  const [font, setFont] = useState<'s' | 'm' | 'l'>('m')
  const [bg, setBg] = useState<'white' | 'cream'>('white')
  const [volume, setVolume] = useState(1)
  const sent = useRef(false)

  useEffect(() => {
    if (remaining === 0 && !sent.current) {
      sent.current = true
      onSubmit(answers)
    }
  }, [remaining, answers, onSubmit])

  const finish = () => {
    if (sent.current) return
    sent.current = true
    onSubmit(answers)
  }

  const flash = remaining <= 600
  const theme = `cd-font-${font} cd-bg-${bg}`
  const moduleName = `${paper.title}  ·  ${paper.minutes} minutes`

  const dialogs = (
    <>
      {help ? (
        <div className="cd-modal" role="dialog">
          <h2>Help — IELTS on computer</h2>
          <ul>
            <li>Timer is at the top centre. It turns red and flashes at 10 minutes and 5 minutes left.</li>
            <li>Listening: type as you hear. There is no transfer sheet. Last two minutes are for checking.</li>
            <li>Reading: passage left, questions right. Highlight text if it helps. 40 questions, 60 minutes.</li>
            <li>Writing: Task 1 then Task 2. Word count is bottom-left. There is no spellcheck, as in the real test.</li>
            <li>Answered numbers are underlined. Review turns a number into a circle.</li>
            <li>Hide covers the screen if an invigilator lets you leave the room.</li>
          </ul>
          <button className="cd-btn" type="button" onClick={() => setHelp(false)}>Close</button>
        </div>
      ) : null}
      {settings ? (
        <div className="cd-modal" role="dialog">
          <h2>Settings</h2>
          <p>Font size</p>
          <div className="cd-seg">
            {(['s', 'm', 'l'] as const).map((f) => (
              <button key={f} type="button" className={font === f ? 'on' : ''} onClick={() => setFont(f)}>{f === 's' ? 'Small' : f === 'm' ? 'Medium' : 'Large'}</button>
            ))}
          </div>
          <p>Background</p>
          <div className="cd-seg">
            <button type="button" className={bg === 'white' ? 'on' : ''} onClick={() => setBg('white')}>White</button>
            <button type="button" className={bg === 'cream' ? 'on' : ''} onClick={() => setBg('cream')}>Cream</button>
          </div>
          <button className="cd-btn" type="button" onClick={() => setSettings(false)}>Close</button>
        </div>
      ) : null}
    </>
  )

  const shell = {
    remaining,
    flash,
    theme,
    hidden,
    onHelp: () => setHelp(true),
    onSettings: () => setSettings(true),
    onHide: () => setHidden(true),
    onResume: () => setHidden(false),
  }

  if (paper.skill === 'listening') {
    return (
      <>
        <ListenView set={sets[0]} answers={answers[0] || {}} setAnswers={(a) => setAnswers([a])} remaining={remaining} volume={volume} setVolume={setVolume} moduleName={moduleName} shell={shell} onFinish={finish} />
        {dialogs}
      </>
    )
  }
  if (paper.skill === 'reading') {
    return (
      <>
        <ReadView set={sets[0]} answers={answers[0] || {}} setAnswers={(a) => setAnswers([a])} moduleName={moduleName} shell={shell} onFinish={finish} />
        {dialogs}
      </>
    )
  }
  if (paper.skill === 'writing') {
    return (
      <>
        <WriteView sets={sets} answers={answers} setAnswers={setAnswers} t1phase={t1phase} moduleName={moduleName} shell={shell} onFinish={finish} />
        {dialogs}
      </>
    )
  }
  return (
    <>
      <SpeakView set={sets[0]} answers={answers[0] || {}} setAnswers={(a) => setAnswers([a])} moduleName={moduleName} shell={shell} onFinish={finish} />
      {dialogs}
    </>
  )
}

function ListenView({
  set,
  answers,
  setAnswers,
  remaining,
  volume,
  setVolume,
  moduleName,
  shell,
  onFinish,
}: {
  set: PracticeSet
  answers: Record<string, string>
  setAnswers: (a: Record<string, string>) => void
  remaining: number
  volume: number
  setVolume: (n: number) => void
  moduleName: string
  shell: Omit<Parameters<typeof CdShell>[0], 'children' | 'footer' | 'moduleName' | 'volume' | 'onVolume'>
  onFinish: () => void
}) {
  const [n, setN] = useState(1)
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(false)
  const q = set.questions.find((x) => (x.n ?? 0) === n) || set.questions[n - 1]
  const answered = new Set(set.questions.filter((x) => answers[x.id]).map((x) => x.n || 0))
  const review = remaining <= 120

  const play = () => {
    if (!set.script || played || playing) return
    speechSynthesis.cancel()
    setPlaying(true)
    const chunks = set.script
    const go = (i: number) => {
      if (i >= chunks.length) {
        setPlaying(false)
        setPlayed(true)
        return
      }
      const u = new SpeechSynthesisUtterance(chunks[i].text)
      u.rate = 0.92
      u.volume = volume
      const voices = speechSynthesis.getVoices()
      const gb = voices.find((v) => /en-GB|British/i.test(v.lang + v.name))
      if (gb) u.voice = gb
      u.onend = () => setTimeout(() => go(i + 1), (chunks[i].pause ?? 0.5) * 1000)
      speechSynthesis.speak(u)
    }
    go(0)
  }

  return (
    <CdShell {...shell} moduleName={moduleName} volume={volume} onVolume={setVolume} footer={(
      <CdNav
        total={set.questions.length}
        current={n}
        answered={answered}
        flagged={flagged}
        onJump={setN}
        onFlag={() => setFlagged((s) => { const n2 = new Set(s); if (n2.has(n)) n2.delete(n); else n2.add(n); return n2 })}
        extra={<button type="button" className="cd-finish" onClick={onFinish}>Finish section</button>}
      />
    )}>
      <div className="cd-listen">
        <div className="cd-listen-bar">
          <button className="cd-btn gold" type="button" disabled={playing || played} onClick={play}>
            {playing ? 'Playing once…' : played ? 'Recording finished' : 'Play recording (once)'}
          </button>
          {review ? <span className="cd-review-flag">Review time — check spelling. No extra transfer sheet.</span> : <span className="muted">Type as you listen. 40 questions, four parts.</span>}
        </div>
        {q ? (
          <div className="cd-qcard">
            <div className="cd-qmeta">Questions {q.n} of {set.questions.length} · Part {q.part ?? Math.ceil((q.n || 1) / 10)}</div>
            <ItemField q={q} value={answers[q.id] || ''} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} />
          </div>
        ) : null}
      </div>
    </CdShell>
  )
}

function ReadView({
  set,
  answers,
  setAnswers,
  moduleName,
  shell,
  onFinish,
}: {
  set: PracticeSet
  answers: Record<string, string>
  setAnswers: (a: Record<string, string>) => void
  moduleName: string
  shell: Omit<Parameters<typeof CdShell>[0], 'children' | 'footer' | 'moduleName' | 'volume' | 'onVolume'>
  onFinish: () => void
}) {
  const [n, setN] = useState(1)
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const q = set.questions.find((x) => (x.n ?? 0) === n) || set.questions[n - 1]
  const tabFromQ = Math.min(3, Math.max(1, q?.part ?? (n <= 13 ? 1 : n <= 26 ? 2 : 3)))
  const [tab, setTab] = useState(tabFromQ)
  useEffect(() => { setTab(tabFromQ) }, [tabFromQ])
  const passages = set.passages?.length ? set.passages : [{ title: set.title, text: set.passage || '' }]
  const answered = new Set(set.questions.filter((x) => answers[x.id]).map((x) => x.n || 0))
  const pane = useRef<HTMLDivElement>(null)

  const highlight = () => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.rangeCount) return
    try {
      const mark = document.createElement('mark')
      sel.getRangeAt(0).surroundContents(mark)
      sel.removeAllRanges()
    } catch {
      /* overlapping highlight */
    }
  }

  return (
    <CdShell {...shell} moduleName={moduleName} footer={(
      <CdNav
        total={set.questions.length}
        current={n}
        answered={answered}
        flagged={flagged}
        onJump={setN}
        onFlag={() => setFlagged((s) => { const n2 = new Set(s); if (n2.has(n)) n2.delete(n); else n2.add(n); return n2 })}
        extra={<button type="button" className="cd-finish" onClick={onFinish}>Finish section</button>}
      />
    )}>
      <div className="cd-split">
        <div className="cd-left">
          <div className="cd-tabs">
            {passages.map((p, i) => (
              <button key={p.title} type="button" className={tab === i + 1 ? 'on' : ''} onClick={() => setTab(i + 1)}>
                Passage {i + 1}
              </button>
            ))}
            <button type="button" className="ghost" onClick={highlight}>Highlight</button>
          </div>
          <div className="cd-passage" ref={pane}>
            <h2>{passages[tab - 1]?.title}</h2>
            <div className="cd-passage-body">{passages[tab - 1]?.text}</div>
          </div>
        </div>
        <div className="cd-right">
          {q ? (
            <div className="cd-qcard">
              <div className="cd-qmeta">Question {q.n} of {set.questions.length}</div>
              <ItemField q={q} value={answers[q.id] || ''} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} />
            </div>
          ) : null}
        </div>
      </div>
    </CdShell>
  )
}

function WriteView({
  sets,
  answers,
  setAnswers,
  t1phase,
  moduleName,
  shell,
  onFinish,
}: {
  sets: PracticeSet[]
  answers: Record<string, string>[]
  setAnswers: (a: Record<string, string>[]) => void
  t1phase: boolean
  moduleName: string
  shell: Omit<Parameters<typeof CdShell>[0], 'children' | 'footer' | 'moduleName' | 'volume' | 'onVolume'>
  onFinish: () => void
}) {
  const [tab, setTab] = useState(0)
  const set = sets[tab]
  const body = answers[tab]?.body || ''
  const min = tab === 0 ? 150 : 250
  const live = liveWriting(set, body)
  const wc = words(body)

  return (
    <CdShell
      {...shell}
      moduleName={`${moduleName}  ·  ${t1phase ? 'Aim to finish Task 1 in the first 20 minutes' : 'Task 2 — about 40 minutes of this paper'}`}
      footer={(
        <footer className="cd-nav write">
          <div className={`cd-wc ${wc >= min ? 'ok' : ''}`}>Words: {wc} (minimum {min})</div>
          <div className="cd-tabs">
            {sets.map((s, i) => (
              <button key={s.id} type="button" className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>
                {i === 0 ? 'Task 1' : 'Task 2'}
              </button>
            ))}
          </div>
          <button type="button" className="cd-finish" onClick={onFinish}>Finish writing</button>
        </footer>
      )}
    >
      <div className="cd-split write">
        <div className="cd-left">
          <p className="cd-prompt">{set.instructions}</p>
          {set.chart ? <ExamChart spec={set.chart} print /> : set.visual ? <pre className="passage">{set.visual}</pre> : null}
        </div>
        <div className="cd-right">
          <textarea
            className="cd-essay"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            value={body}
            onChange={(e) => {
              const next = [...answers]
              next[tab] = { ...next[tab], body: e.target.value }
              setAnswers(next)
            }}
            placeholder="Type your answer here. There is no spellcheck."
          />
          <ExaminerMeter band={live.band} criteria={live.criteria} live />
          <p className="ex-live-hint">{descriptorFor(Object.keys(live.criteria)[0], Object.values(live.criteria)[0])}</p>
        </div>
      </div>
    </CdShell>
  )
}

function SpeakView({
  set,
  answers,
  setAnswers,
  moduleName,
  shell,
  onFinish,
}: {
  set: PracticeSet
  answers: Record<string, string>
  setAnswers: (a: Record<string, string>) => void
  moduleName: string
  shell: Omit<Parameters<typeof CdShell>[0], 'children' | 'footer' | 'moduleName' | 'volume' | 'onVolume'>
  onFinish: () => void
}) {
  const parts = [1, 2, 3] as const
  const [part, setPart] = useState(1)
  const [prep, setPrep] = useState(60)
  const [prepOn, setPrepOn] = useState(false)
  const [prepDone, setPrepDone] = useState(false)
  const qs = set.questions.filter((q) => (q.part ?? (q.n === 2 ? 2 : q.n && q.n >= 3 ? 3 : 1)) === part)
  const transcript = Object.values(answers).join('\n')
  const live = liveSpeaking(set, transcript)

  useEffect(() => {
    if (!prepOn || prepDone) return
    const t = window.setInterval(() => {
      setPrep((s) => {
        if (s <= 1) {
          setPrepOn(false)
          setPrepDone(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [prepOn, prepDone])

  return (
    <CdShell
      {...shell}
      moduleName={moduleName}
      footer={(
        <footer className="cd-nav write">
          <div className="cd-tabs">
            {parts.map((p) => (
              <button key={p} type="button" className={part === p ? 'on' : ''} onClick={() => setPart(p)}>Part {p}</button>
            ))}
          </div>
          <button type="button" className="cd-finish" onClick={onFinish}>Finish speaking</button>
        </footer>
      )}
    >
      <div className="cd-speak">
        {part === 2 ? (
          <div className="cd-cue">
            <div className="kicker">Part 2 · Cue card</div>
            <pre>{set.cue}</pre>
            {!prepDone ? (
              <div className="row">
                <button className="cd-btn gold" type="button" disabled={prepOn} onClick={() => setPrepOn(true)}>
                  {prepOn ? `Prepare ${prep}s` : 'Start 1-minute preparation'}
                </button>
                <span className="muted">You may jot notes. Then speak for 1–2 minutes.</span>
              </div>
            ) : (
              <p className="cd-review-flag">Preparation over — speak now (type a transcript if you are practising without a mic).</p>
            )}
          </div>
        ) : (
          <p className="muted">{part === 1 ? 'Part 1 — familiar topics, short extended answers.' : 'Part 3 — abstract discussion. Compare, speculate, evaluate.'}</p>
        )}
        {qs.map((q) => (
          <label className="q" key={q.id}>
            <span>{q.prompt}</span>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value, body: Object.values({ ...answers, [q.id]: e.target.value }).join('\n') })}
              placeholder="Speak, then type what you said…"
            />
          </label>
        ))}
        <ExaminerMeter band={live.band} criteria={live.criteria} live />
      </div>
    </CdShell>
  )
}

function ItemField({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  if (isChoice(q)) {
    return (
      <fieldset className="cd-choices">
        <legend>{q.n}. {q.prompt}</legend>
        {choiceOptions(q).map((o) => {
          const v = storedValue(q, o)
          return (
            <label key={o}>
              <input type="radio" name={q.id} checked={value === v} onChange={() => onChange(v)} />
              {o}
            </label>
          )
        })}
      </fieldset>
    )
  }
  return (
    <label className="q">
      <span>{q.n}. {q.prompt}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} autoComplete="off" spellCheck={false} />
    </label>
  )
}

export function CdBriefing({
  title,
  papers,
  onStart,
}: {
  title: string
  papers: { skill: string; title: string; minutes: number }[]
  onStart: () => void
}) {
  return (
    <div className="cd-root cd-brief">
      <header className="cd-top">
        <div className="cd-brand">IELTS Academic <span>on computer</span></div>
        <div className="cd-clock">—:—</div>
        <div className="cd-tools"><span>Information</span></div>
      </header>
      <div className="cd-brief-body">
        <h1>Start test</h1>
        <p className="muted">{title}</p>
        <p>
          This sitting copies the official computer-delivered Academic day: Listening 30 minutes (40 questions, audio once, two-minute check),
          Reading 60 minutes (three texts, 40 questions, split screen), Writing 60 minutes (Task 1 about 20, Task 2 about 40, Task 2 double weight),
          Speaking 11–14 minutes (Parts 1–3). After each paper you get an examiner-style mark before the next module.
        </p>
        <ol className="exam-track">
          {papers.map((p) => (
            <li key={p.skill}>
              <strong style={{ textTransform: 'capitalize' }}>{p.skill}</strong>
              <span>{p.minutes} min</span>
              <span className="muted">{p.title}</span>
            </li>
          ))}
        </ol>
        <ul className="cd-rules">
          <li>Timer sits at the top centre and flashes red at 10 and 5 minutes left.</li>
          <li>Question numbers 1–40: underline = answered, circle = flagged for review.</li>
          <li>Writing has no spellcheck. Listening has a volume control.</li>
          <li>Bands here are coaching estimates using published descriptors and conversion tables — not an official TRF.</li>
        </ul>
        <button className="cd-btn gold" type="button" onClick={onStart}>Start test</button>
      </div>
    </div>
  )
}

export function CdMark({
  marks,
  nextLabel,
  onContinue,
}: {
  marks: { title: string; band: number; raw?: number; total?: number; correct?: number; criteria?: Record<string, number>; parts: { label: string; correct: number; total: number; band?: number }[]; comments: string[] }[]
  nextLabel: string
  onContinue: () => void
}) {
  return (
    <div className="cd-root cd-mark">
      <header className="cd-top">
        <div className="cd-brand">IELTS Academic <span>examiner mark</span></div>
        <div className="cd-clock">Paused</div>
        <div />
      </header>
      <div className="cd-mark-body">
        <h1>How an examiner would mark this paper</h1>
        {marks.map((m) => (
          <section key={m.title} className="cd-mark-card">
            <div className="cd-mark-head">
              <h2>{m.title}</h2>
              <div className="ex-band">{m.band.toFixed(1)}</div>
            </div>
            {m.total != null ? <p>{m.correct}/{m.total} correct · scaled {m.raw}/40</p> : null}
            {m.criteria ? <ExaminerMeter band={m.band} criteria={m.criteria} /> : null}
            {m.parts.length && m.total != null ? (
              <ul className="cd-parts">
                {m.parts.map((p) => (
                  <li key={p.label}>
                    <strong>{p.label}</strong> {p.correct}/{p.total}
                    {p.band != null ? ` · part band ~${p.band.toFixed(1)}` : ''}
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className="feedback">{m.comments.map((c) => <li key={c}>{c}</li>)}</ul>
          </section>
        ))}
        <button className="cd-btn gold" type="button" onClick={onContinue}>{nextLabel}</button>
      </div>
    </div>
  )
}

