import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateTonnage, convertCurrency, formatCurrency, type CurrencyRate } from "../utils/calculations"

interface CostPreviewProps {
  gsm: number
  width: number
  length: number
  quantity: number
  pricePerTon: number
  baseCurrency: string
  displayCurrency: string
  rates: CurrencyRate[]
}

export function CostPreview({
  gsm,
  width,
  length,
  quantity,
  pricePerTon,
  baseCurrency,
  displayCurrency,
  rates,
}: CostPreviewProps) {
  const tonnage = calculateTonnage(gsm, width, length, quantity)
  const costInBaseCurrency = tonnage * pricePerTon
  const costInDisplayCurrency = convertCurrency(costInBaseCurrency, baseCurrency, displayCurrency, rates)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Weight per piece:</div>
          <div className="text-right">{((gsm * width * length) / 1000).toFixed(4)} kg</div>
          <div>Total weight:</div>
          <div className="text-right">{tonnage.toFixed(4)} tons</div>
          <div>Cost ({baseCurrency}):</div>
          <div className="text-right">{formatCurrency(costInBaseCurrency, baseCurrency)}</div>
          <div>Cost ({displayCurrency}):</div>
          <div className="text-right">{formatCurrency(costInDisplayCurrency, displayCurrency)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

