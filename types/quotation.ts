export type WeightUnit = "g" | "kg" | "ton" | "metric-ton"

export interface Unit {
  name: string
  conversionFactor: number // conversion factor to base unit (m for length, kg for weight)
  type: "length" | "weight" | "weightPerArea"
}

export interface Dimension {
  value: number
  unit: string
}

export interface Item {
  id: string
  name: string
  quantity: number
  isFixedCost: boolean
  includeTax: boolean
  taxRate: number
  dimensions?: {
    length: Dimension
    width: Dimension
    weightPerArea: Dimension // can be gsm or kg/m²
  }
  pricePerWeight?: {
    value: number
    weightUnit: string
    currency: string
  }
  unitCost?: number
  currency: string
}

export interface QuotationData {
  customer: {
    name: string
    email: string
  }
  items: Item[]
  baseCurrency: string
  displayCurrency: string
}

export interface CurrencyRate {
  code: string
  name: string
  rate: number
}

