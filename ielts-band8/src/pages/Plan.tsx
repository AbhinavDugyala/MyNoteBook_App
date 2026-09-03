import { Link } from 'react-router-dom'
import { Chip } from '../components/ui'
import { useApp, usePlan } from '../context/AppContext'
import type { PlanTask } from '../types'

export function Plan() {
  const { done, toggleTask, daysLeft, profile } = useApp()
  const plan = usePlan()
  if (!plan || !profile) return null
  const byDate = group(plan.days)

  return (
    <>
      <div className="kicker">Adaptive campaign</div>
      <h1 className="page-title">Your next {Math.min(21, Math.max(daysLeft, 1))} days</h1>
      <p className="muted">{plan.strategy}</p>
      <div className="row" style={{ margin: '16px 0 24px' }}>
        <Chip tone="gold">{plan.phase}</Chip>
        <Chip>{daysLeft} days remaining</Chip>
      </div>
      <div className="card" style={{ marginBottom: 18 }}>
        <h2>Mock cadence</h2>
        <p>{plan.weeklyMocks}</p>
        <h2>Non-negotiables</h2>
        <ul>{plan.nonNegotiables.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>
      {Object.entries(byDate).map(([date, tasks]) => (
        <div className="card" key={date} style={{ marginBottom: 12 }}>
          <div className="kicker">{date}</div>
          {tasks.map((t) => (
            <div className="task" key={t.id}>
              <div className={`check ${done.includes(t.id) ? 'on' : ''}`} onClick={() => toggleTask(t.id)}>
                {done.includes(t.id) ? '✓' : ''}
              </div>
              <div>
                <strong>{t.title}</strong>
                <div className="muted">{t.skill} · {t.minutes} min · {t.why}</div>
              </div>
              {t.setId ? (
                <Link className="btn ghost" to={t.setId === 'fresh-full-mock' ? '/exam/fresh' : `/practice/${t.setId}`}>
                  Open
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function group(days: PlanTask[]) {
  const o: Record<string, PlanTask[]> = {}
  for (const d of days) {
    ;(o[d.date] ||= []).push(d)
  }
  return o
}
