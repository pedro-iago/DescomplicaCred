export function formatCentsToBRL(cents) {
  const value = cents / 100
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export function maskCurrencyInput(rawValue) {
  const digits = rawValue.replace(/\D/g, '')
  if (!digits) return ''
  const cents = parseInt(digits, 10)
  return formatCentsToBRL(cents)
}

export function parseCurrencyToNumber(masked) {
  if (!masked) return 0
  const digits = masked.replace(/\D/g, '')
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}

export function formatBRL(value) {
  if (!Number.isFinite(value)) return 'R$ 0,00'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export function formatRateLabel(rate) {
  return `${String(rate).replace('.', ',')}%`
}
