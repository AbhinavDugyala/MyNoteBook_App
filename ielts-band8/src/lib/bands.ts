/** Official IELTS bands: 1.0–9.0 in half-band steps. */
export const ALL_BANDS = Array.from({ length: 17 }, (_, i) => 1 + i * 0.5)

export const BAND_HINT: Record<number, string> = {
  1: 'Non-user',
  2: 'Intermittent',
  3: 'Extremely limited',
  4: 'Limited',
  4.5: 'Limited+',
  5: 'Modest',
  5.5: 'Modest+',
  6: 'Competent',
  6.5: 'Competent+ / many universities',
  7: 'Good',
  7.5: 'Good+',
  8: 'Very good',
  8.5: 'Very good+',
  9: 'Expert',
}

export function bandLabel(n: number): string {
  return n.toFixed(1)
}
