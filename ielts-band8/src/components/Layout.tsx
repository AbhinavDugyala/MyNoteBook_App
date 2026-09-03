import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const LINKS = [
  ['/', 'Studio'],
  ['/plan', 'Plan'],
  ['/write', 'Write'],
  ['/skills', 'Skills'],
  ['/topics', 'Topics'],
  ['/mocks', 'Mocks'],
  ['/vocab', 'Lexicon'],
  ['/progress', 'Scores'],
  ['/resources', 'Official'],
] as const

const TABS = [
  ['/', 'Studio', HomeIcon],
  ['/plan', 'Plan', PlanIcon],
  ['/write', 'Write', WriteIcon],
  ['/mocks', 'Mocks', MockIcon],
  ['/progress', 'Scores', ScoreIcon],
] as const

export function Layout() {
  const { profile, daysLeft, overall } = useApp()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc.pathname])

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-btn" type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <div className="brand">
          <em>Band Eight</em>
        </div>
        <div className="days">{daysLeft < 0 ? '—' : `${daysLeft}d`}</div>
      </header>

      {open ? <button className="menu-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <em>Band Eight</em>
          <span>IELTS Academic coach</span>
        </div>
        <nav className="nav">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          {profile ? (
            <>
              Days to {profile.name}'s test
              <strong>{daysLeft < 0 ? 'Date passed' : daysLeft}</strong>
              Overall {overall.toFixed(1)} → target {profile.target.toFixed(1)}
            </>
          ) : (
            'Set your exam date to unlock a day-counted plan.'
          )}
        </div>
      </aside>

      <div>
        <div className="main">
          <Outlet />
        </div>
        <nav className="bottom-nav" aria-label="Primary">
          {TABS.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

function HomeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" /></svg>
}
function PlanIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>
}
function WriteIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m13 7 4 4" /></svg>
}
function MockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></svg>
}
function ScoreIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 19V9M10 19V5M15 19v-7M20 19V8" /></svg>
}
