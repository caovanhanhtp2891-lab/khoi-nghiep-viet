export function formatMoney(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1_000_000_000) {
    return `${trimDecimal(value / 1_000_000_000)} tỷ ₫`
  }

  if (compact && Math.abs(value) >= 1_000_000) {
    return `${trimDecimal(value / 1_000_000)} tr ₫`
  }

  if (compact && Math.abs(value) >= 1_000) {
    return `${trimDecimal(value / 1_000)}k ₫`
  }

  return `${new Intl.NumberFormat('vi-VN').format(Math.round(value))} ₫`
}

function trimDecimal(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatGameTime(minuteOfDay: number): string {
  const normalized = ((minuteOfDay % 1_440) + 1_440) % 1_440
  const hour = Math.floor(normalized / 60)
  const minute = normalized % 60
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export function formatPercent(factor: number): string {
  const value = Math.round((factor - 1) * 100)
  return `${value >= 0 ? '+' : ''}${value}%`
}
