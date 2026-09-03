import { ALL_BANDS, BAND_HINT, bandLabel } from '../lib/bands'

export function BandPicker({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (n: number) => void
  label: string
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <p className="muted band-hint">{BAND_HINT[value] ? `${bandLabel(value)} — ${BAND_HINT[value]}` : bandLabel(value)}</p>
      <div className="band-grid" role="listbox" aria-label={label}>
        {ALL_BANDS.map((n) => (
          <button
            key={n}
            type="button"
            role="option"
            aria-selected={value === n}
            className={`band-chip ${value === n ? 'on' : ''}`}
            onClick={() => onChange(n)}
          >
            {bandLabel(n)}
          </button>
        ))}
      </div>
    </div>
  )
}
