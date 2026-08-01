import { Wallet, CreditCard } from 'lucide-react'

export default function Tabs({ activeTab, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-base-card border border-base-border">
      <button
        type="button"
        onClick={() => onChange('receber')}
        className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
          activeTab === 'receber'
            ? 'bg-gold-gradient text-black shadow-gold'
            : 'text-silver hover:text-gold-light'
        }`}
      >
        <Wallet size={16} />
        Quero Receber
      </button>
      <button
        type="button"
        onClick={() => onChange('limite')}
        className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
          activeTab === 'limite'
            ? 'bg-gold-gradient text-black shadow-gold'
            : 'text-silver hover:text-gold-light'
        }`}
      >
        <CreditCard size={16} />
        Tenho de Limite
      </button>
    </div>
  )
}
