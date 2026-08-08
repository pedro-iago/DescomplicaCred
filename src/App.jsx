import { useMemo, useState } from 'react'
import { Copy, Check, TrendingDown, Wallet, CreditCard, AlertTriangle, MessageCircle } from 'lucide-react'
import Tabs from './components/Tabs'
import RateSelector from './components/RateSelector'
import InstallmentSelector from './components/InstallmentSelector'
import { maskCurrencyInput, parseCurrencyToNumber, formatBRL } from './utils/currency'

export default function App() {
  const [activeTab, setActiveTab] = useState('receber')
  const [rateInput, setRateInput] = useState('3,5')
  const [valorDesejado, setValorDesejado] = useState('')
  const [valorCartao, setValorCartao] = useState('')
  const [installments, setInstallments] = useState(1)
  const [copied, setCopied] = useState(false)

  const taxaNum = useMemo(() => {
    const parsed = parseFloat(rateInput.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : 0
  }, [rateInput])

  const taxaDecimal = taxaNum / 100
  const divisor = 1 - taxaDecimal
  const taxaInvalida = divisor <= 0

  const resultadoReceber = useMemo(() => {
    const valorLiquido = parseCurrencyToNumber(valorDesejado)
    if (taxaInvalida || valorLiquido <= 0) {
      return { valorLiquido, valorAPassar: 0, valorTaxa: 0, multiplicador: 0 }
    }
    const multiplicador = 1 / divisor
    const valorAPassar = valorLiquido * multiplicador
    const valorTaxa = valorAPassar - valorLiquido
    const valorParcela = valorAPassar / installments
    return { valorLiquido, valorAPassar, valorTaxa, multiplicador, valorParcela }
  }, [valorDesejado, divisor, taxaInvalida, installments])

  const resultadoLimite = useMemo(() => {
    const valorTotal = parseCurrencyToNumber(valorCartao)
    const valorTaxa = valorTotal * taxaDecimal
    const valorLiquidoReceber = valorTotal - valorTaxa
    const valorParcela = valorTotal / installments
    return { valorTotal, valorTaxa, valorLiquidoReceber, valorParcela }
  }, [valorCartao, taxaDecimal, installments])

  function handleSelectRate(rate) {
    setRateInput(String(rate).replace('.', ','))
  }

  function buildMessage() {
    let message = ''

    if (activeTab === 'receber') {
      const { valorLiquido, valorAPassar, valorTaxa, valorParcela } = resultadoReceber
      const parcelasLine =
        installments > 1
          ? `Parcelas ${installments}x ${formatBRL(valorParcela)}\n`
          : ''
      message =
        `💳 *Descomplica Cred* 💳\n\n` +
        `🎯 Você quer receber: *${formatBRL(valorLiquido)}*\n\n` +
        `➡️ Valor a passar no cartão: *${formatBRL(valorAPassar)}*\n` +
        parcelasLine +
        `📉 Taxa descontada: *${formatBRL(valorTaxa)}*\n` +
        `✅ Valor líquido recebido: *${formatBRL(valorLiquido)}*\n\n` +
        `_Chega de pagar caro pelo seu dinheiro. Complicou? Chama a Descomplica!_`
    } else {
      const { valorTotal, valorTaxa, valorLiquidoReceber, valorParcela } = resultadoLimite
      const parcelasLine =
        installments > 1
          ? `Parcelas ${installments}x ${formatBRL(valorParcela)}\n`
          : ''
      message =
        `💳 *Descomplica Cred* 💳\n\n` +
        `💰 Valor a passar no cartão: *${formatBRL(valorTotal)}*\n` +
        parcelasLine +
        `📉 Taxa descontada: *${formatBRL(valorTaxa)}*\n` +
        `✅ Valor líquido a receber: *${formatBRL(valorLiquidoReceber)}*\n\n` +
        `_Chega de pagar caro pelo seu dinheiro. Complicou? Chama a Descomplica!_`
    }

    return message
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildMessage())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function handleShareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(buildMessage())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <img
            src="/logo.png"
            alt="Descomplica Cred"
            className="w-20 h-20 rounded-full shadow-goldStrong"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-gold-light">Descomplica</span>{' '}
              <span className="text-silver">Cred</span>
            </h1>
            <p className="text-silver-soft text-xs mt-1 max-w-xs mx-auto">
              Chega de pagar caro pelo seu dinheiro. Complicou? Chama a Descomplica!
            </p>
          </div>
        </header>

        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="rounded-2xl bg-base-soft border border-base-border p-5 space-y-5 animate-fade-in">
          {activeTab === 'receber' ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-silver text-sm font-medium">
                <Wallet size={16} className="text-gold" />
                Valor líquido desejado
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={valorDesejado}
                onChange={(e) => setValorDesejado(maskCurrencyInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full rounded-lg bg-base-card border border-base-border px-4 py-3 text-lg font-semibold text-white placeholder:text-silver-soft focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-silver text-sm font-medium">
                <CreditCard size={16} className="text-gold" />
                Valor a passar no cartão / limite
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={valorCartao}
                onChange={(e) => setValorCartao(maskCurrencyInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full rounded-lg bg-base-card border border-base-border px-4 py-3 text-lg font-semibold text-white placeholder:text-silver-soft focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors"
              />
            </div>
          )}

          <InstallmentSelector installments={installments} onChange={setInstallments} />

          <RateSelector
            rateInput={rateInput}
            onSelectRate={handleSelectRate}
            onCustomChange={setRateInput}
          />
        </div>

        {taxaInvalida && (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-4 py-3 text-red-300 text-sm">
            <AlertTriangle size={16} />
            Taxa inválida: deve ser menor que 100%.
          </div>
        )}

        <div className="rounded-2xl bg-gradient-to-b from-base-card to-base-soft border border-gold/30 p-6 space-y-4 animate-fade-in">
          {activeTab === 'receber' ? (
            <>
              <div className="text-center">
                <p className="text-silver text-xs uppercase tracking-widest mb-1">
                  Valor a passar no cartão
                </p>
                <p className="text-4xl font-extrabold text-gold-light break-words">
                  {formatBRL(resultadoReceber.valorAPassar)}
                </p>
                {installments > 1 && (
                  <p className="text-silver text-sm mt-1">
                    Em {installments}x de {formatBRL(resultadoReceber.valorParcela)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-base-border">
                <div>
                  <p className="text-silver-soft text-xs flex items-center gap-1">
                    <TrendingDown size={12} className="text-red-400" />
                    Taxa descontada
                  </p>
                  <p className="text-red-400 font-semibold">
                    - {formatBRL(resultadoReceber.valorTaxa)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-silver-soft text-xs">Valor líquido</p>
                  <p className="text-silver font-semibold">
                    {formatBRL(resultadoReceber.valorLiquido)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-silver-soft pt-2 border-t border-base-border/60">
                <span>Divisor: {divisor.toFixed(4)}</span>
                <span>Multiplicador: {resultadoReceber.multiplicador.toFixed(4)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-silver text-xs uppercase tracking-widest mb-1">
                  Valor líquido a receber
                </p>
                <p className="text-4xl font-extrabold text-gold-light break-words">
                  {formatBRL(resultadoLimite.valorLiquidoReceber)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-base-border">
                <div>
                  <p className="text-silver-soft text-xs flex items-center gap-1">
                    <TrendingDown size={12} className="text-red-400" />
                    Taxa descontada
                  </p>
                  <p className="text-red-400 font-semibold">
                    - {formatBRL(resultadoLimite.valorTaxa)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-silver-soft text-xs">Valor total passado</p>
                  <p className="text-silver font-semibold">
                    {formatBRL(resultadoLimite.valorTotal)}
                  </p>
                  {installments > 1 && (
                    <p className="text-gold-light text-xs font-medium mt-0.5">
                      Em {installments}x de {formatBRL(resultadoLimite.valorParcela)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient text-black font-bold py-4 shadow-gold hover:shadow-goldStrong active:scale-[0.98] transition-all"
          >
            {copied ? (
              <>
                <Check size={18} /> Copiado!
              </>
            ) : (
              <>
                <Copy size={18} /> Copiar
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-bold py-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] active:scale-[0.98] transition-all"
          >
            <MessageCircle size={18} /> Compartilhar
          </button>
        </div>

        <footer className="text-center text-silver-soft text-[11px] pb-4">
          © {new Date().getFullYear()} Descomplica Cred — Todos os direitos reservados
        </footer>
      </div>
    </div>
  )
}
