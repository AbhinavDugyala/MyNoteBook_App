import { Link } from 'react-router-dom'
import { QUESTION_TYPES, DESCRIPTORS_8, FORMAT } from '../data/curriculum'
import { SETS } from '../data/practice'
import type { Skill } from '../types'
import { Chip } from '../components/ui'

const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']

export function Skills() {
  return (
    <>
      <div className="kicker">Official papers</div>
      <h1 className="page-title">Every question type, examined several ways</h1>
      <p className="muted">
        British Council, IDP and IELTS.org publish the same Academic format. Work each type as a drill,
        then inside a section, then inside a full mock.
      </p>
      <div className="grid-2" style={{ marginTop: 20 }}>
        {SKILLS.map((skill) => (
          <div className="card" key={skill}>
            <div className="kicker">{skill}</div>
            <h2 style={{ textTransform: 'capitalize' }}>{skill}</h2>
            <p className="muted">{FORMAT[skill]}</p>
            {skill === 'writing' || skill === 'speaking' ? (
              <p className="muted">
                Band 8 public descriptors:{' '}
                {skill === 'writing'
                  ? DESCRIPTORS_8.writing.ta
                  : DESCRIPTORS_8.speaking.fc}
              </p>
            ) : null}
            <ol>
              {QUESTION_TYPES[skill].map((t) => (
                <li key={t.type} style={{ margin: '10px 0' }}>
                  <strong>{t.type}</strong>
                  <div className="muted">{t.exam}</div>
                  <div>Band 8 habit: {t.band8}</div>
                </li>
              ))}
            </ol>
            <div className="row">
              {skill === 'writing' ? (
                <>
                  <Link className="btn gold" to="/practice/fresh-t2">New Task 2</Link>
                  <Link className="btn" to="/practice/fresh-t1">New Task 1</Link>
                  <Link className="btn ghost" to="/run/fresh-writing">New Writing mock</Link>
                </>
              ) : null}
              {SETS.filter((s) => s.skill === skill && s.skill !== 'writing').map((s) => (
                <Link key={s.id} className="btn ghost" to={`/practice/${s.id}`}>
                  {s.kind} · {s.title.split('—')[0]}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="footer-note"><Chip>Tip</Chip> If a type is new, do the drill untimed once, then immediately again on the official clock.</p>
    </>
  )
}
