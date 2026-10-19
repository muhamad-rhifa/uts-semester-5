import { RATING_LABELS } from '../../data/fixtures'

interface RatingBarProps {
  label: string
  value: number
  maxValue?: number
}

/**
 * Rating indicator dengan label verbal dan bar visual.
 * Tidak hanya warna — selalu menampilkan angka dan label teks.
 */
export default function RatingBar({ label, value, maxValue = 5 }: RatingBarProps) {
  const percent = (value / maxValue) * 100
  const ratingLabel = RATING_LABELS[value] ?? `${value}/${maxValue}`

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
          {value}/{maxValue} — {ratingLabel}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={maxValue}
        aria-label={`${label}: ${ratingLabel}`}
      >
        <div
          className="h-full rounded-full transition-base"
          style={{
            width: `${percent}%`,
            backgroundColor: value >= 4 ? 'var(--color-neon)' : value === 3 ? 'var(--color-cyan)' : 'var(--color-muted)',
          }}
        />
      </div>
    </div>
  )
}
