import { EXAM_DAY, RESOURCES } from '../data/resources'
import { OFFICIAL_BAND_NOTE } from '../data/curriculum'

export function Resources() {
  return (
    <>
      <div className="kicker">From the test owners</div>
      <h1 className="page-title">Real-time official help, not predicted PDFs</h1>
      <p className="muted">
        IELTS is jointly owned by the British Council, IDP and Cambridge University Press & Assessment.
        Use their pages for format, scoring and familiarisation. Use Cambridge books for extra full tests.
        This studio’s papers are original and exam-shaped so you are not leaking copyrighted keys.
      </p>
      {RESOURCES.map((g) => (
        <div className="card" key={g.group} style={{ margin: '16px 0' }}>
          <h2>{g.group}</h2>
          {g.items.map((it) => (
            <p key={it.url}>
              <a href={it.url} target="_blank" rel="noreferrer"><strong>{it.name}</strong></a>
              <div className="muted">{it.use}</div>
            </p>
          ))}
        </div>
      ))}
      <div className="card">
        <h2>Exam-day sheet</h2>
        <ul>{EXAM_DAY.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="footer-note">{OFFICIAL_BAND_NOTE}</p>
      </div>
    </>
  )
}
