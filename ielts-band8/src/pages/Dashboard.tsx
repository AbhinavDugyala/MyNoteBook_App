import { Link } from 'react-router-dom'
import { BandDial, Chip, Stat } from '../components/ui'
import { useApp, usePlan } from '../context/AppContext'
import { todayTasks } from '../lib/studyPlan'
import { BAND8 } from '../lib/scoring'
import { FORMAT, OFFICIAL_BAND_NOTE, TOPICS } from '../data/curriculum'
import type { Skill } from '../types'

export function Dashboard() {
  const { profile, daysLeft, overall, ready, done, toggleTask, attempts } = useApp()
  const plan = usePlan()
  if (!profile || !plan) return null
  const today = todayTasks(plan)
  const last = attempts[0]
  const topic = TOPICS[Math.abs(daysLeft) % TOPICS.length]

  return (
    <>
      <div className="hero">
        <div className="card">
          <div className="kicker">{plan.phase} phase</div>
          <h1>{plan.headline}</h1>
          <p className="muted">{plan.strategy}</p>
          <div className="row" style={{ marginTop: 16 }}>
            <Chip tone="gold">{daysLeft} days left</Chip>
            <Chip>{profile.hoursPerDay} h / day</Chip>
            <Chip tone={overall >= profile.target ? 'ok' : 'warn'}>overall {overall.toFixed(1)} / {profile.target.toFixed(1)}</Chip>
          </div>
          <p className="row" style={{ marginTop: 18 }}>
            <Link className="btn gold" to="/write">Write a new mock</Link>
            <Link className="btn" to="/exam/fresh">Sit IELTS-on-computer mock</Link>
            <Link className="btn ghost" to="/plan">Full plan</Link>
          </p>
        </div>
        <div className="card" style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <BandDial value={overall} />
          <div className="kicker" style={{ marginTop: 10 }}>Estimated overall</div>
          <div className="muted">Readiness {ready}% toward {profile.target.toFixed(1)}</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        {(Object.keys(profile.current) as Skill[]).map((s) => (
          <Stat key={s} k={s} v={profile.current[s].toFixed(1)} sub={BAND8[s]} />
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Today, with {daysLeft} days on the clock</h2>
          {today.map((t) => (
            <div className="task" key={t.id}>
              <div className={`check ${done.includes(t.id) ? 'on' : ''}`} onClick={() => toggleTask(t.id)}>
                {done.includes(t.id) ? '✓' : ''}
              </div>
              <div>
                <strong>{t.title}</strong>
                <div className="muted">{t.minutes} min · {t.why}</div>
              </div>
              {t.setId ? (
                <Link className="btn" to={t.setId === 'fresh-full-mock' ? '/exam/fresh' : `/practice/${t.setId}`}>
                  Start
                </Link>
              ) : <Chip>review</Chip>}
            </div>
          ))}
        </div>
        <div className="card">
          <h2>Last mark</h2>
          {last ? (
            <>
              <p><strong>{last.title}</strong> · Band {last.band.toFixed(1)}</p>
              <ul className="feedback">
                {last.feedback.slice(0, 4).map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link to="/progress">Scorebook →</Link>
            </>
          ) : (
            <p className="muted">No attempt yet. Start with a Section 1 form or a Task 2 so the plan can react.</p>
          )}
          <h2 style={{ marginTop: 22 }}>Official clocks</h2>
          <p className="muted">{FORMAT.listening}</p>
          <p className="muted">{FORMAT.reading}</p>
          <p className="muted">{FORMAT.writing}</p>
          <p className="muted">{FORMAT.speaking}</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div className="kicker">Today’s topic, four exam angles</div>
        <h2>{topic.title}</h2>
        <p className="muted">{topic.why}</p>
        <div className="grid-2">
          <p><strong>Listening</strong> — {topic.listening}</p>
          <p><strong>Reading</strong> — {topic.reading}</p>
          <p><strong>Writing</strong> — {topic.writing}</p>
          <p><strong>Speaking</strong> — {topic.speaking}</p>
        </div>
        <p><strong>Do this now:</strong> {topic.drill}</p>
        <Link to={`/topics`}>Open the full atlas</Link>
      </div>
      <p className="footer-note">{OFFICIAL_BAND_NOTE}</p>
    </>
  )
}
