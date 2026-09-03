import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BandPicker } from '../components/BandPicker'
import { useApp } from '../context/AppContext'
import type { Skill } from '../types'

const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']

export function Onboarding() {
  const { setProfile, profile } = useApp()
  const nav = useNavigate()
  const [name, setName] = useState(profile?.name ?? '')
  const [examDate, setExamDate] = useState(profile?.examDate ?? defaultDate(60))
  const [target, setTarget] = useState(profile?.target ?? 7)
  const [hoursPerDay, setHours] = useState(profile?.hoursPerDay ?? 2)
  const [current, setCurrent] = useState<Record<Skill, number>>(
    profile?.current ?? { listening: 6, reading: 6, writing: 5.5, speaking: 5.5 },
  )
  const [weak, setWeak] = useState<Skill[]>(profile?.weakSkills ?? ['writing', 'speaking'])

  return (
    <div className="onboard">
      <div className="onboard-brand brand">
        <em>Band Eight</em>
        <span>IELTS Academic coach</span>
      </div>
      <div className="card">
        <div className="kicker">Start here</div>
        <h1>Set a real target, then train to it</h1>
        <p className="muted">
          Official overall IELTS is the average of Listening, Academic Reading, Writing and Speaking,
          rounded to the nearest half band. Choose any official band from 1.0 to 9.0 — not only 8+.
        </p>
        <div className="field">
          <label htmlFor="name">What should we call you?</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="exam">Exam date</label>
          <input id="exam" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
        </div>
        <BandPicker label="Target overall (all official bands)" value={target} onChange={setTarget} />
        <div className="field">
          <label>Focused hours per day: {hoursPerDay}</label>
          <input type="range" min={1} max={6} value={hoursPerDay} onChange={(e) => setHours(Number(e.target.value))} />
        </div>
        <p className="muted">Honest current bands for each paper (use a recent official or Cambridge mock if you have one).</p>
        {SKILLS.map((s) => (
          <BandPicker
            key={s}
            label={`Current ${s}`}
            value={current[s]}
            onChange={(n) => setCurrent({ ...current, [s]: n })}
          />
        ))}
        <div className="field">
          <label>Papers that need extra time</label>
          <div className="row">
            {SKILLS.map((s) => (
              <button
                type="button"
                key={s}
                className={`btn ${weak.includes(s) ? 'gold' : 'ghost'}`}
                onClick={() => setWeak((w) => (w.includes(s) ? w.filter((x) => x !== s) : [...w, s]))}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          className="btn gold block"
          onClick={() => {
            setProfile({
              name: name || 'Candidate',
              examDate,
              target,
              hoursPerDay,
              current,
              weakSkills: weak,
              createdAt: profile?.createdAt ?? new Date().toISOString(),
            })
            nav('/')
          }}
        >
          Open my studio
        </button>
      </div>
    </div>
  )
}

function defaultDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
