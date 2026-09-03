import { LINKING, VOCAB } from '../data/curriculum'
import { addJournal } from '../lib/storage'
import { useState } from 'react'

export function Vocabulary() {
  const [note, setNote] = useState('')
  return (
    <>
      <div className="kicker">Lexicon</div>
      <h1 className="page-title">Words that raise a 7 to an 8</h1>
      <p className="muted">
        Band 8 lexical resource is not a longer word list. It is precise collocation and the courage to hedge.
        Official descriptors reward flexibility and rare slips — not “moreover” in every sentence.
      </p>
      <div className="card" style={{ margin: '16px 0' }}>
        <h2>Moves, not decorations</h2>
        <div className="grid-2">
          {Object.entries(LINKING).map(([k, v]) => (
            <p key={k}><strong style={{ textTransform: 'capitalize' }}>{k}:</strong> {v.join(' · ')}</p>
          ))}
        </div>
      </div>
      <div className="table-wrap">
      <table className="table">
        <thead>
          <tr><th>Item</th><th>Meaning</th><th>Collocations</th><th>In a Band 8 sentence</th></tr>
        </thead>
        <tbody>
          {VOCAB.map((w) => (
            <tr key={w.word}>
              <td><strong>{w.word}</strong><div className="muted">{w.topic}</div></td>
              <td>{w.meaning}</td>
              <td>{w.collocations.join(', ')}</td>
              <td>{w.band8}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Error journal</h2>
        <p className="muted">Write the sentence you used wrongly, then the repair. This is what you reread in the last 7 days.</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="I wrote “the government should raise awareness”. Repair: name a tax, ban, or subsidy." />
        <p>
          <button
            className="btn"
            type="button"
            onClick={() => {
              if (note.trim()) addJournal('lexis', note.trim())
              setNote('')
              alert('Saved on this device.')
            }}
          >
            Keep this correction
          </button>
        </p>
      </div>
    </>
  )
}
