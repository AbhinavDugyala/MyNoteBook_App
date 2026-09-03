import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS } from '../data/curriculum'
import { SETS } from '../data/practice'
import { Chip } from '../components/ui'

export function Topics() {
  const [q, setQ] = useState('')
  const [cluster, setCluster] = useState('All')
  const clusters = ['All', ...Array.from(new Set(TOPICS.map((t) => t.cluster)))]
  const list = useMemo(
    () =>
      TOPICS.filter((t) => (cluster === 'All' || t.cluster === cluster) && (t.title + t.why).toLowerCase().includes(q.toLowerCase())),
    [q, cluster],
  )

  return (
    <>
      <div className="kicker">Atlas</div>
      <h1 className="page-title">Every high-frequency Academic topic, four ways</h1>
      <p className="muted">
        IELTS does not publish a closed topic list. These are the clusters that dominate Cambridge papers,
        British Council samples, and IDP practice: each one is examined as Listening, Reading, Writing and Speaking.
      </p>
      <div className="row" style={{ margin: '16px 0' }}>
        <input style={{ maxWidth: 280 }} placeholder="Search topics" value={q} onChange={(e) => setQ(e.target.value)} />
        {clusters.map((c) => (
          <button key={c} className={`btn ${cluster === c ? 'gold' : 'ghost'}`} onClick={() => setCluster(c)}>{c}</button>
        ))}
      </div>
      {list.map((t) => {
        const related = SETS.filter((s) => s.topic === t.id)
        return (
          <div className="card" key={t.id} style={{ marginBottom: 14 }}>
            <div className="row">
              <Chip>{t.cluster}</Chip>
              <h2 style={{ margin: 0 }}>{t.title}</h2>
            </div>
            <p>{t.why}</p>
            <div className="grid-2">
              <p><strong>Listening.</strong> {t.listening}</p>
              <p><strong>Reading.</strong> {t.reading}</p>
              <p><strong>Writing.</strong> {t.writing}</p>
              <p><strong>Speaking.</strong> {t.speaking}</p>
            </div>
            <p><strong>Band 8 lexis:</strong> {t.vocab.join(' · ')}</p>
            <p><strong>Phrases:</strong> {t.phrases.join(' · ')}</p>
            <p><strong>Examine it differently:</strong> {t.drill}</p>
            {related.length ? (
              <div className="row">
                {related.map((s) => (
                  <Link key={s.id} className="btn ghost" to={`/practice/${s.id}`}>{s.skill} practice</Link>
                ))}
              </div>
            ) : (
              <p className="muted">Use the drill above, then steal the lexis into today’s Writing or Part 3.</p>
            )}
          </div>
        )
      })}
    </>
  )
}
