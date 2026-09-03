import { useId } from 'react'
import type { ChartSpec, MapMark } from '../types'

const PAL = ['#1c2b4a', '#c4a15a', '#2f6f5e', '#9a3d3d', '#5c7a9a', '#8a6a3a']
const PRINT = ['#111111', '#4a4a4a', '#7a7a7a', '#2c2c2c', '#9a9a9a', '#5a5a5a']

export function ExamChart({ spec, print }: { spec: ChartSpec; print?: boolean }) {
  return (
    <figure className={`exam-figure reveal ${print ? 'print' : ''}`}>
      <figcaption>{print ? `The figure below shows: ${spec.title}` : spec.title}</figcaption>
      {spec.type === 'line' || spec.type === 'bar' ? <AxesChart spec={spec} print={print} /> : null}
      {spec.type === 'pie' ? <PieChart spec={spec} print={print} /> : null}
      {spec.type === 'table' ? <DataTable spec={spec} /> : null}
      {spec.type === 'process' ? <Process spec={spec} /> : null}
      {spec.type === 'map' ? <TwinMap spec={spec} /> : null}
      {spec.type === 'mixed' ? (
        <div className="chart-mixed">
          {spec.charts.map((c, i) => <ExamChart key={i} spec={c} print={print} />)}
        </div>
      ) : null}
    </figure>
  )
}

function AxesChart({ spec, print }: { spec: Extract<ChartSpec, { type: 'line' | 'bar' }>; print?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const pal = print ? PRINT : PAL
  const w = 640
  const h = 320
  const pad = { l: 52, r: 16, t: 16, b: 48 }
  const all = spec.series.flatMap((s) => s.values)
  const max = Math.max(10, ...all) * 1.12
  const n = spec.labels.length
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const x = (i: number) => pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw)
  const y = (v: number) => pad.t + ih - (v / max) * ih
  const ticks = 4

  return (
    <div className="chart-frame">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={spec.title}>
        <defs>
          {pal.map((c, i) => (
            <pattern key={i} id={`hatch-${uid}-${i}`} patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" fill={c} opacity={print ? 0.22 : 0.12} />
              <path d={i % 2 ? 'M0 6 L6 0' : 'M0 0 L6 6'} stroke={c} strokeWidth="1.2" />
            </pattern>
          ))}
        </defs>
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = (max / ticks) * i
          const yy = y(v)
          return (
            <g key={i}>
              <line x1={pad.l} x2={w - pad.r} y1={yy} y2={yy} stroke={print ? '#d0d0d0' : '#e6ddd0'} />
              <text x={pad.l - 8} y={yy + 4} textAnchor="end" className="chart-tick">{Math.round(v)}</text>
            </g>
          )
        })}
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={h - pad.b} stroke="#111" />
        <line x1={pad.l} x2={w - pad.r} y1={h - pad.b} y2={h - pad.b} stroke="#111" />
        {spec.labels.map((lb, i) => (
          <text key={lb + i} x={spec.type === 'bar' ? pad.l + ((i + 0.5) / n) * iw : x(i)} y={h - 16} textAnchor="middle" className="chart-tick">{lb}</text>
        ))}
        {spec.type === 'line'
          ? spec.series.map((s, si) => {
              const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
              return (
                <g key={s.name}>
                  <path d={d} fill="none" stroke={pal[si % pal.length]} strokeWidth="2.2" strokeDasharray={print && si ? `${4 + si} ${2 + si}` : undefined} className="chart-line" />
                  {s.values.map((v, i) => (
                    <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={pal[si % pal.length]} />
                  ))}
                </g>
              )
            })
          : spec.series.map((s, si) => {
              const group = spec.series.length
              const slot = iw / n
              const bw = Math.max(6, (slot * 0.7) / group)
              return s.values.map((v, i) => {
                const xx = pad.l + i * slot + slot * 0.15 + si * bw
                const bh = (v / max) * ih
                return (
                  <rect
                    key={`${s.name}-${i}`}
                    x={xx}
                    y={y(v)}
                    width={bw - 2}
                    height={bh}
                    fill={print ? `url(#hatch-${uid}-${si % pal.length})` : pal[si % pal.length]}
                    stroke={print ? pal[si % pal.length] : 'none'}
                    strokeWidth={print ? 1 : 0}
                    className="chart-bar"
                    style={{ animationDelay: `${(i + si) * 40}ms` }}
                  />
                )
              })
            })}
      </svg>
      <ul className="chart-legend">
        {spec.series.map((s, i) => (
          <li key={s.name}><i style={{ background: pal[i % pal.length] }} />{s.name}{spec.unit ? ` (${spec.unit})` : ''}</li>
        ))}
      </ul>
    </div>
  )
}

function PieChart({ spec, print }: { spec: Extract<ChartSpec, { type: 'pie' }>; print?: boolean }) {
  const pal = print ? PRINT : PAL
  const pies = spec.compare ? [spec.slices, spec.compare.slices] : [spec.slices]
  const titles = spec.compare ? ['First period', spec.compare.title] : [spec.title]
  return (
    <div className={`pie-row ${pies.length > 1 ? 'two' : ''}`}>
      {pies.map((slices, pi) => (
        <div key={pi} className="pie-block">
          <strong>{titles[pi]}</strong>
          <svg viewBox="0 0 160 160">
            {arcs(slices).map((a, i) => (
              <path key={i} d={a.d} fill={pal[i % pal.length]} stroke="#111" strokeWidth={print ? 0.6 : 0} className="chart-bar" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
            <circle cx="80" cy="80" r="28" fill={print ? '#fff' : '#fffdf8'} />
          </svg>
        </div>
      ))}
      <ul className="chart-legend">
        {pies[0].map((s, i) => (
          <li key={s.name}><i style={{ background: pal[i % pal.length] }} />{s.name}</li>
        ))}
      </ul>
    </div>
  )
}

function arcs(slices: { name: string; value: number }[]) {
  const tot = slices.reduce((a, b) => a + b.value, 0) || 1
  let ang = -Math.PI / 2
  return slices.map((s) => {
    const sweep = (s.value / tot) * Math.PI * 2
    const x1 = 80 + 70 * Math.cos(ang)
    const y1 = 80 + 70 * Math.sin(ang)
    ang += sweep
    const x2 = 80 + 70 * Math.cos(ang)
    const y2 = 80 + 70 * Math.sin(ang)
    const large = sweep > Math.PI ? 1 : 0
    return { d: `M 80 80 L ${x1} ${y1} A 70 70 0 ${large} 1 ${x2} ${y2} Z` }
  })
}

function DataTable({ spec }: { spec: Extract<ChartSpec, { type: 'table' }> }) {
  return (
    <div className="table-wrap exam-table">
      <table className="table">
        <thead>
          <tr>{spec.headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {spec.rows.map((row, i) => (
            <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Process({ spec }: { spec: Extract<ChartSpec, { type: 'process' }> }) {
  return (
    <div className="process">
      {spec.stages.map((st, i) => (
        <div key={i} className="process-step">
          <div className="process-box">
            <span>{i + 1}</span>
            {st}
          </div>
          {i < spec.stages.length - 1 ? <div className="process-arrow" aria-hidden>→</div> : null}
        </div>
      ))}
      {spec.note ? <p className="muted">{spec.note}</p> : null}
    </div>
  )
}

function TwinMap({ spec }: { spec: Extract<ChartSpec, { type: 'map' }> }) {
  return (
    <div className="map-pair">
      <MapPanel title={spec.leftTitle} marks={spec.left} />
      <MapPanel title={spec.rightTitle} marks={spec.right} />
    </div>
  )
}

function MapPanel({ title, marks }: { title: string; marks: MapMark[] }) {
  return (
    <div className="map-panel">
      <strong>{title}</strong>
      <svg viewBox="0 0 220 180" className="map-svg">
        <rect x="4" y="4" width="212" height="172" fill="#f4f4f0" stroke="#111" />
        <polygon points="198,18 204,34 192,34" fill="#111" />
        <text x="198" y="14" textAnchor="middle" className="chart-tick">N</text>
        {marks.map((m) => (
          <g key={m.id} className="map-mark">
            {m.kind === 'water' ? <ellipse cx={m.x} cy={m.y} rx="28" ry="12" fill="#b9d4e8" stroke="#1c2b4a" /> : null}
            {m.kind === 'green' ? <circle cx={m.x} cy={m.y} r="16" fill="#8fbc8f" stroke="#1c2b4a" /> : null}
            {m.kind === 'road' ? <rect x={m.x} y={m.y} width="90" height="8" fill="#c4b59a" stroke="#1c2b4a" /> : null}
            {m.kind === 'build' ? <rect x={m.x - 16} y={m.y - 10} width="40" height="22" fill="#f4ead0" stroke="#1c2b4a" /> : null}
            {m.kind === 'note' ? <circle cx={m.x} cy={m.y} r="4" fill="#9a3d3d" /> : null}
            <text x={m.x} y={m.y + (m.kind === 'build' ? 20 : 22)} textAnchor="middle" className="chart-tick">{m.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
