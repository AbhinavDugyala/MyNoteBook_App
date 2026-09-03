import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { skillPriorities } from '../lib/evaluate'
import { overallBand } from '../lib/scoring'
import { loadJournal } from '../lib/storage'
import { resetAll } from '../lib/storage'
import { Chip, Criteria } from '../components/ui'
import type { Skill } from '../types'

export function Progress() {
  const { attempts, profile, daysLeft } = useApp()
  if (!profile) return null
  const latest: Partial<Record<Skill, number>> = {}
  for (const a of [...attempts].reverse()) latest[a.skill] = a.band
  const order = skillPriorities(profile, latest)
  const merged = { ...profile.current, ...latest } as Record<Skill, number>
  const journal = loadJournal()

  return (
    <>
      <div className="kicker">Scorebook</div>
      <h1 className="page-title">Where the next mark has to come from</h1>
      <p className="muted">
        With {daysLeft} days remaining, ignore vanity overalls. Official overall is the mean of four skills.
        Right now that estimate is {overallBand(merged).toFixed(1)} against a {profile.target.toFixed(1)} target.
      </p>
      <div className="card" style={{ margin: '16px 0' }}>
        <h2>Priority order</h2>
        <ol>
          {order.map((s) => (
            <li key={s}>
              <strong style={{ textTransform: 'capitalize' }}>{s}</strong> · now {merged[s].toFixed(1)} · gap {(profile.target - merged[s]).toFixed(1)}
            </li>
          ))}
        </ol>
        <p>
          {daysLeft <= 7
            ? 'This week: only the first two skills, plus sleep.'
            : daysLeft <= 30
              ? 'This month: daily work on #1, every-other-day on #2, maintain the rest.'
              : 'You still have time to rebuild question-type coverage before mock volume.'}
        </p>
      </div>
      <div className="table-wrap">
      <table className="table">
        <thead>
          <tr><th>When</th><th>Paper</th><th>Band</th><th>Raw</th><th>Days left then</th></tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a.id}>
              <td>{a.finishedAt.slice(0, 16).replace('T', ' ')}</td>
              <td><Chip>{a.skill}</Chip> {a.title}</td>
              <td><strong>{a.band.toFixed(1)}</strong></td>
              <td>{a.total ? `${a.correct}/${a.total}` : 'rubric'}</td>
              <td>{a.daysLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {attempts[0]?.criteria ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Latest rubric</h2>
          <Criteria data={attempts[0].criteria} />
          <ul>{attempts[0].feedback.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      ) : null}
      {journal.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Error journal</h2>
          {journal.slice(0, 8).map((j) => (
            <p key={j.id}><span className="muted">{j.at.slice(0, 10)} · {j.skill}</span><br />{j.note}</p>
          ))}
        </div>
      ) : null}
      <p className="footer-note">
        <Link to="/onboard">Edit setup</Link>
        {' · '}
        <button
          className="btn brick"
          type="button"
          onClick={() => {
            resetAll()
            window.location.href = '/onboard'
          }}
        >
          Reset this device
        </button>
      </p>
    </>
  )
}
