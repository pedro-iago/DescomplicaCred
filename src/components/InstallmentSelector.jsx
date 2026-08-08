import { Layers } from 'lucide-react'

const INSTALLMENT_OPTIONS = Array.from({ length: 24 }, (_, i) => i + 1)

export default function InstallmentSelector({ installments, onChange }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-silver text-sm font-medium">
        <Layers size={16} className="text-gold" />
        Parcelas
      </label>
      <select
        value={installments}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg bg-base-card border border-base-border px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors"
      >
        {INSTALLMENT_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}x
          </option>
        ))}
      </select>
    </div>
  )
}
