import type { ReactNode } from 'react'

export function CdShell({
  moduleName,
  remaining,
  children,
  footer,
  onHelp,
  onSettings,
  hidden,
  onHide,
  onResume,
  volume,
  onVolume,
  flash,
  theme,
}: {
  moduleName: string
  remaining: number
  children: ReactNode
  footer?: ReactNode
  onHelp: () => void
  onSettings: () => void
  hidden: boolean
  onHide: () => void
  onResume: () => void
  volume?: number
  onVolume?: (n: number) => void
  flash: boolean
  theme?: string
}) {
  const m = Math.floor(Math.max(0, remaining) / 60)
  const s = Math.max(0, remaining) % 60
  return (
    <div className={`cd-root ${theme || ''} ${hidden ? 'cd-hidden-mode' : ''}`}>
      {hidden ? (
        <div className="cd-hide-screen">
          <p>Screen hidden — as in IELTS on computer when you leave the room.</p>
          <button className="cd-btn" type="button" onClick={onResume}>Resume test</button>
        </div>
      ) : (
        <>
          <header className="cd-top">
            <div className="cd-brand">IELTS Academic <span>on computer</span></div>
            <div className={`cd-clock ${flash ? 'flash' : ''} ${remaining < 300 ? 'red' : ''}`}>
              {m}:{String(s).padStart(2, '0')}
            </div>
            <div className="cd-tools">
              {onVolume != null ? (
                <label className="cd-vol">
                  Vol
                  <input type="range" min={0} max={1} step={0.05} value={volume ?? 1} onChange={(e) => onVolume(Number(e.target.value))} />
                </label>
              ) : null}
              <button type="button" onClick={onHelp}>Help</button>
              <button type="button" onClick={onSettings}>Settings</button>
              <button type="button" onClick={onHide}>Hide</button>
            </div>
          </header>
          <div className="cd-instr">{moduleName}</div>
          <div className="cd-body">{children}</div>
          {footer}
        </>
      )}
    </div>
  )
}

export function CdNav({
  total,
  current,
  answered,
  flagged,
  onJump,
  onFlag,
  extra,
}: {
  total: number
  current: number
  answered: Set<number>
  flagged: Set<number>
  onJump: (n: number) => void
  onFlag: () => void
  extra?: ReactNode
}) {
  return (
    <footer className="cd-nav">
      {extra}
      <button type="button" className="cd-review" onClick={onFlag}>Review</button>
      <button type="button" onClick={() => onJump(Math.max(1, current - 1))} aria-label="Previous">‹</button>
      <div className="cd-nums">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={`cd-num ${n === current ? 'on' : ''} ${answered.has(n) ? 'done' : ''} ${flagged.has(n) ? 'flag' : ''}`}
            onClick={() => onJump(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onJump(Math.min(total, current + 1))} aria-label="Next">›</button>
    </footer>
  )
}

export function ExaminerMeter({
  band,
  criteria,
  live,
}: {
  band: number
  criteria?: Record<string, number>
  live?: boolean
}) {
  return (
    <aside className="ex-meter">
      <div className="ex-kicker">{live ? 'Live examiner estimate' : 'Examiner mark'}</div>
      <div className="ex-band">{band.toFixed(1)}</div>
      <p className="ex-note">Four published criteria, averaged, then rounded like IELTS. Coaching estimate — not an official TRF.</p>
      {criteria
        ? Object.entries(criteria).map(([k, v]) => (
            <div key={k} className="ex-row">
              <span>{k}</span>
              <div className="ex-bar"><i style={{ width: `${(v / 9) * 100}%` }} /></div>
              <b>{v.toFixed(1)}</b>
            </div>
          ))
        : null}
    </aside>
  )
}
