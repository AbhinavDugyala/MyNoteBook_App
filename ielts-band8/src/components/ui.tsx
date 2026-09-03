import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function BandDial({ value, label }: { value: number; label?: string }) {
  const p = (value / 9) * 100
  return (
    <div className="band" style={{ '--p': p } as CSSProperties} title={label}>
      <b>{value.toFixed(1)}</b>
    </div>
  )
}

export function Chip({ children, tone = 'ok' }: { children: ReactNode; tone?: 'ok' | 'warn' | 'gold' }) {
  return <span className={`chip ${tone === 'ok' ? '' : tone}`}>{children}</span>
}

export function Stat({ k, v, sub }: { k: string; v: ReactNode; sub?: string }) {
  return (
    <div className="stat">
      <div className="kicker">{k}</div>
      <b>{v}</b>
      {sub ? <div className="muted">{sub}</div> : null}
    </div>
  )
}

export function Criteria({ data }: { data: Record<string, number> }) {
  return (
    <div className="criteria">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <div>
            {k}
            <div className="bar"><i style={{ width: `${(v / 9) * 100}%` }} /></div>
          </div>
          <strong>{v.toFixed(1)}</strong>
        </div>
      ))}
    </div>
  )
}

export function Timer({ seconds }: { seconds: number }) {
  const m = Math.floor(Math.max(0, seconds) / 60)
  const s = Math.max(0, seconds) % 60
  return <div className={`timer ${seconds < 120 ? 'low' : ''}`}>{m}:{String(s).padStart(2, '0')}</div>
}

export function SetLink({ id, children }: { id: string; children: ReactNode }) {
  return <Link to={`/practice/${id}`}>{children}</Link>
}
