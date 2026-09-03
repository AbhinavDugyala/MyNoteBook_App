import { useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { MOCKS, getSet } from '../data/practice'
import { Chip } from '../components/ui'
import { useApp } from '../context/AppContext'
import { mintAcademicMock, mintReceptiveMock, mintWritingPair, onceMintId } from '../lib/generateWriting'
import { loadGeneratedMock, loadGeneratedMocks } from '../lib/generatedStore'

export function Mocks() {
  const { daysLeft } = useApp()
  const recent = loadGeneratedMocks()

  return (
    <>
      <div className="kicker">Exam conditions</div>
      <h1 className="page-title">A new mock each time you sit one</h1>
      <p className="muted">
        With {daysLeft} days left: sit a full Academic day in a computer-delivered room (timer, 1–40 navigator, split Reading), then read examiner-style marks and a Test Report Form.
      </p>
      <div className="grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <Chip tone="gold">~170 min</Chip>
          <h2>New full Academic mock</h2>
          <p className="muted">Full-screen IELTS-on-computer room: top timer, 1–40 navigator, split Reading, Writing without spellcheck, then a Test Report Form. Each paper is newly generated (40 Listening, 40 Reading). Examiner-style marks after every module.</p>
          <Link className="btn" to="/exam/fresh">Start unique 4-paper exam</Link>
        </div>
        <div className="card">
          <Chip tone="gold">60 min</Chip>
          <h2>New Writing-only mock</h2>
          <p className="muted">A fresh figure and a fresh essay. Use this on days you only have an hour.</p>
          <Link className="btn gold" to="/run/fresh-writing">Generate Writing mock</Link>
        </div>
        <div className="card">
          <Chip>90 min</Chip>
          <h2>Listening + Reading</h2>
          <p className="muted">Receptive papers back-to-back. Follow with a new Writing mock so the day stays complete.</p>
          <Link className="btn ghost" to="/run/fresh-lr">Start receptive mock</Link>
        </div>
        <div className="card">
          <h2>Practice library (fixed keys)</h2>
          <p className="muted">Section drills with published-style answer keys. Good for question types; do not confuse them with the generated Writing papers.</p>
          <ol>
            {MOCKS.map((m) => (
              <li key={m.id}><Link to={`/run/${m.id}`}>{m.title}</Link></li>
            ))}
          </ol>
        </div>
      </div>
      {recent.length ? (
        <div className="card" style={{ marginTop: 18 }}>
          <h2>Recently generated</h2>
          {recent.slice(0, 6).map((m) => (
            <div className="task" key={m.id}>
              <Chip>{m.kind}</Chip>
              <div>
                <strong>{m.title}</strong>
                <div className="muted">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <Link className="btn ghost" to={`/run/${m.id}`}>Reopen</Link>
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

export function MockRun() {
  const { mockId } = useParams()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const idx = Number(sp.get('p') || 0)

  useEffect(() => {
    if (mockId === 'fresh-full-mock') {
      nav(`/run/${onceMintId('mint-full', mintAcademicMock)}`, { replace: true })
    } else if (mockId === 'fresh-writing') {
      nav(`/run/${onceMintId('mint-write', () => mintWritingPair().mock)}`, { replace: true })
    } else if (mockId === 'fresh-lr') {
      nav(`/run/${onceMintId('mint-lr', mintReceptiveMock)}`, { replace: true })
    }
  }, [mockId, nav])

  if (mockId === 'fresh-full-mock' || mockId === 'fresh-writing' || mockId === 'fresh-lr') {
    return <div className="card"><p>Issuing a new paper…</p></div>
  }

  const mock = (mockId ? loadGeneratedMock(mockId) : undefined) ?? MOCKS.find((m) => m.id === mockId)
  if (!mock) return <p>Mock not found. <Link to="/mocks">Back</Link></p>
  const partId = mock.parts[idx]
  if (!partId) {
    return (
      <div className="card">
        <h1>Mock complete</h1>
        <p>Open the scorebook. Official overall is the average of the four skills you sat.</p>
        <div className="row">
          <Link className="btn gold" to="/progress">Scorebook</Link>
          <Link className="btn ghost" to="/run/fresh-writing">New Writing mock</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="card">
      <div className="kicker">Paper {idx + 1} / {mock.parts.length}</div>
      <h1>{mock.title}</h1>
      <p>Next up: {getSet(partId)?.title ?? partId}. Stay on the official clock.</p>
      <div className="row">
        <button
          className="btn gold"
          onClick={() =>
            nav(`/practice/${partId}?next=${encodeURIComponent(`/run/${mock.id}?p=${idx + 1}`)}`)
          }
        >
          Open this paper
        </button>
        <button className="btn ghost" onClick={() => nav(`/run/${mock.id}?p=${idx + 1}`)}>Skip</button>
      </div>
    </div>
  )
}
