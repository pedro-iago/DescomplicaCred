import { Percent } from 'lucide-react'
import { formatRateLabel } from '../utils/currency'

const QUICK_RATES = [
  1.49, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12
]

export default function RateSelector({ rateInput, onSelectRate, onCustomChange }) {
  const currentNumeric = parseFloat(rateInput.replace(',', '.'))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-silver text-sm font-medium">
        <Percent size={16} className="text-gold" />
        <span>Taxa da operação</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_RATES.map((rate) => {
          const isActive = currentNumeric === rate
          return (
            <button
              key={rate}
              type="button"
              onClick={() => onSelectRate(rate)}
              className={`rounded-lg py-2 text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-gold-gradient text-black border-gold shadow-gold'
                  : 'bg-base-card text-silver border-base-border hover:border-gold/50 hover:text-gold-light'
              }`}
            >
              {formatRateLabel(rate)}
            </button>
          )
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={rateInput}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Ou digite uma taxa personalizada"
          className="w-full rounded-lg bg-base-card border border-base-border px-4 py-3 text-sm text-white placeholder:text-silver-soft focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-soft text-sm">%</span>
      </div>
    </div>
  )
}
