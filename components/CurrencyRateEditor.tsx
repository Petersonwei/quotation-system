import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CurrencyRate } from "../utils/calculations"

interface CurrencyRateEditorProps {
  rates: CurrencyRate[]
  onChange: (rates: CurrencyRate[]) => void
}

export function CurrencyRateEditor({ rates, onChange }: CurrencyRateEditorProps) {
  const [newRate, setNewRate] = useState<CurrencyRate>({
    code: "",
    name: "",
    rate: 1,
  })

  const handleRateChange = (code: string, newValue: number) => {
    const updatedRates = rates.map((rate) => (rate.code === code ? { ...rate, rate: newValue } : rate))
    onChange(updatedRates)
  }

  const handleAddRate = () => {
    if (newRate.code && newRate.name && newRate.rate) {
      onChange([...rates, newRate])
      setNewRate({ code: "", name: "", rate: 1 })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Rates (vs USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {rates.map((rate) => (
              <div key={rate.code} className="grid grid-cols-2 items-center gap-2">
                <Label>
                  {rate.code} - {rate.name}
                </Label>
                <Input
                  type="number"
                  value={rate.rate}
                  onChange={(e) => handleRateChange(rate.code, Number.parseFloat(e.target.value))}
                  step="0.0001"
                  min="0"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Code (e.g., JPY)"
                value={newRate.code}
                onChange={(e) => setNewRate((prev) => ({ ...prev, code: e.target.value }))}
              />
              <Input
                placeholder="Name"
                value={newRate.name}
                onChange={(e) => setNewRate((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Rate"
                value={newRate.rate}
                onChange={(e) => setNewRate((prev) => ({ ...prev, rate: Number.parseFloat(e.target.value) }))}
                step="0.0001"
                min="0"
              />
            </div>
            <Button onClick={handleAddRate}>Add Currency</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

