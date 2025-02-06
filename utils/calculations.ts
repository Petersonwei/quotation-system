import type { CurrencyRate, Item } from "../types/quotation"
import { convertUnit } from "./units"

export const defaultCurrencyRates: CurrencyRate[] = [
  { code: "USD", name: "US Dollar", rate: 1 },
  { code: "EUR", name: "Euro", rate: 0.92 },
  { code: "CNY", name: "Chinese Yuan", rate: 7.19 },
  { code: "HKD", name: "Hong Kong Dollar", rate: 7.82 },
  { code: "TWD", name: "Taiwan Dollar", rate: 31.2 },
]

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: CurrencyRate[],
): number {
  const fromRate = rates.find((r) => r.code === fromCurrency)?.rate || 1
  const toRate = rates.find((r) => r.code === toCurrency)?.rate || 1
  return amount * (toRate / fromRate)
}

export function calculateItemWeight(item: Item): number {
  if (!item.dimensions) return 0

  const length = convertUnit(item.dimensions.length.value, item.dimensions.length.unit, "m", "length")
  const width = convertUnit(item.dimensions.width.value, item.dimensions.width.unit, "m", "length")
  const weightPerArea = convertUnit(
    item.dimensions.weightPerArea.value,
    item.dimensions.weightPerArea.unit,
    "kg/m²",
    "weightPerArea",
  )

  return length * width * weightPerArea * item.quantity
}

export function calculateItemCost(item: Item): number {
  if (item.isFixedCost) {
    return (item.unitCost || 0) * item.quantity
  } else {
    const weight = calculateItemWeight(item)
    if (item.pricePerWeight) {
      const pricePerKg = convertUnit(item.pricePerWeight.value, item.pricePerWeight.weightUnit, "kg", "weight")
      return weight * pricePerKg
    }
    return 0
  }
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

