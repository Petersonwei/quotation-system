import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Item } from "../types/quotation"
import { getAllUnits } from "../utils/units"

interface ItemFormProps {
  onAddItem: (item: Item) => void
  currencies: string[]
}

export function ItemForm({ onAddItem, currencies }: ItemFormProps) {
  const [item, setItem] = useState<Item>({
    id: "",
    name: "",
    quantity: 0,
    isFixedCost: false,
    includeTax: false,
    taxRate: 0,
    dimensions: {
      length: { value: 0, unit: "m" },
      width: { value: 0, unit: "m" },
      weightPerArea: { value: 0, unit: "g/m²" },
    },
    pricePerWeight: {
      value: 0,
      weightUnit: "kg",
      currency: "USD",
    },
    currency: "USD",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddItem({ ...item, id: Date.now().toString() })
    setItem({
      id: "",
      name: "",
      quantity: 0,
      isFixedCost: false,
      includeTax: false,
      taxRate: 0,
      dimensions: {
        length: { value: 0, unit: "m" },
        width: { value: 0, unit: "m" },
        weightPerArea: { value: 0, unit: "g/m²" },
      },
      pricePerWeight: {
        value: 0,
        weightUnit: "kg",
        currency: "USD",
      },
      currency: "USD",
    })
  }

  const lengthUnits = getAllUnits("length")
  const weightPerAreaUnits = getAllUnits("weightPerArea")
  const weightUnits = getAllUnits("weight")

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={item.quantity}
          onChange={(e) => setItem({ ...item, quantity: Number(e.target.value) })}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isFixedCost"
          checked={item.isFixedCost}
          onCheckedChange={(checked) => setItem({ ...item, isFixedCost: checked })}
        />
        <Label htmlFor="isFixedCost">Fixed Cost</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="includeTax"
          checked={item.includeTax}
          onCheckedChange={(checked) => setItem({ ...item, includeTax: checked })}
        />
        <Label htmlFor="includeTax">Include Tax</Label>
      </div>
      {item.isFixedCost ? (
        <div>
          <Label htmlFor="unitCost">Unit Cost</Label>
          <Input
            id="unitCost"
            type="number"
            value={item.unitCost || 0}
            onChange={(e) => setItem({ ...item, unitCost: Number(e.target.value) })}
            required
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                value={item.dimensions?.length.value || 0}
                onChange={(e) =>
                  setItem({
                    ...item,
                    dimensions: {
                      ...item.dimensions,
                      length: { ...item.dimensions!.length, value: Number(e.target.value) },
                    },
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lengthUnit">Length Unit</Label>
              <Select
                value={item.dimensions?.length.unit || "m"}
                onValueChange={(value) =>
                  setItem({
                    ...item,
                    dimensions: { ...item.dimensions, length: { ...item.dimensions!.length, unit: value } },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {lengthUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={item.dimensions?.width.value || 0}
                onChange={(e) =>
                  setItem({
                    ...item,
                    dimensions: {
                      ...item.dimensions,
                      width: { ...item.dimensions!.width, value: Number(e.target.value) },
                    },
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="widthUnit">Width Unit</Label>
              <Select
                value={item.dimensions?.width.unit || "m"}
                onValueChange={(value) =>
                  setItem({
                    ...item,
                    dimensions: { ...item.dimensions, width: { ...item.dimensions!.width, unit: value } },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {lengthUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weightPerArea">Weight per Area</Label>
              <Input
                id="weightPerArea"
                type="number"
                value={item.dimensions?.weightPerArea.value || 0}
                onChange={(e) =>
                  setItem({
                    ...item,
                    dimensions: {
                      ...item.dimensions,
                      weightPerArea: { ...item.dimensions!.weightPerArea, value: Number(e.target.value) },
                    },
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="weightPerAreaUnit">Weight per Area Unit</Label>
              <Select
                value={item.dimensions?.weightPerArea.unit || "g/m²"}
                onValueChange={(value) =>
                  setItem({
                    ...item,
                    dimensions: {
                      ...item.dimensions,
                      weightPerArea: { ...item.dimensions!.weightPerArea, unit: value },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {weightPerAreaUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pricePerWeight">Price per Weight</Label>
              <Input
                id="pricePerWeight"
                type="number"
                value={item.pricePerWeight?.value || 0}
                onChange={(e) =>
                  setItem({ ...item, pricePerWeight: { ...item.pricePerWeight!, value: Number(e.target.value) } })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="pricePerWeightUnit">Weight Unit</Label>
              <Select
                value={item.pricePerWeight?.weightUnit || "kg"}
                onValueChange={(value) =>
                  setItem({ ...item, pricePerWeight: { ...item.pricePerWeight!, weightUnit: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {weightUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priceCurrency">Price Currency</Label>
              <Select
                value={item.pricePerWeight?.currency || "USD"}
                onValueChange={(value) =>
                  setItem({ ...item, pricePerWeight: { ...item.pricePerWeight!, currency: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {item.includeTax && (
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={item.taxRate}
                onChange={(e) => setItem({ ...item, taxRate: Number(e.target.value) })}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          )}
        </>
      )}
      <div>
        <Label htmlFor="currency">Item Currency</Label>
        <Select value={item.currency} onValueChange={(value) => setItem({ ...item, currency: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Item</Button>
    </form>
  )
}

