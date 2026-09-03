import { useNavigate } from 'react-router-dom'
import { remainingPrompts } from '../lib/generateWriting'
import { Chip } from '../components/ui'

export function Write() {
  const nav = useNavigate()
  const left = remainingPrompts()

  return (
    <>
      <div className="kicker">Writing studio</div>
      <h1 className="page-title">A new mock every time you write</h1>
      <p className="muted">
        Academic Writing is two papers: Task 1 (~20 minutes, 150 words) and Task 2 (~40 minutes, 250 words, double weight).
        Each start issues an unused prompt. Task 1 figures are rebuilt with new numbers so you cannot memorise last week’s chart.
      </p>
      <div className="row" style={{ margin: '14px 0 18px' }}>
        <Chip tone="gold">Task 2 left in this cycle: {left.task2Left}/{left.task2Total}</Chip>
        <Chip>Task 1 templates left: {left.task1Left}/{left.task1Total}</Chip>
      </div>
      <div className="grid-2">
        <div className="card">
          <h2>New Task 2</h2>
          <p className="muted">Opinion, discussion, problem–solution, advantages, or two-part — chosen from questions you have not written yet.</p>
          <button className="btn gold block" type="button" onClick={() => nav('/practice/fresh-t2')}>Start a new Task 2</button>
        </div>
        <div className="card">
          <h2>New Task 1</h2>
          <p className="muted">A real exam-style figure: bar graph, line graph, pie, table, process diagram, or before/after map — not a wall of numbers.</p>
          <button className="btn block" type="button" onClick={() => nav('/practice/fresh-t1')}>Start a new Task 1</button>
        </div>
        <div className="card">
          <h2>Full Writing mock</h2>
          <p className="muted">60 minutes. Fresh Task 1 then a fresh Task 2, official order. Never the same pair twice.</p>
          <button className="btn sage block" type="button" onClick={() => nav('/run/fresh-writing')}>Sit a new Writing mock</button>
        </div>
        <div className="card">
          <h2>After you submit</h2>
          <p className="muted">You get a rubric estimate and days-left advice. Then tap “Write another new mock” — do not rewrite the same question unless you are doing a correction pass.</p>
        </div>
      </div>
    </>
  )
}
