"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { QuotationData, Item, Dimension } from "../../types/quotation"
import { calculateWeight, calculateUnitPrice } from "../../utils/calculations"

const currencies = ["USD", "EUR", "GBP", "JPY", "CNY"]
const defaultDimensions = ["GSM", "Width", "Length"]

export default function QuotationForm({ onSubmit }) {
  const [formData, setFormData] = useState<QuotationData>({
    customer_info: { name: "", contact_person: "", email: "" },
    items: [],
    overall_tax_rate: 0,
    overall_discount_rate: 0,
    exchange_rates: { USD: 1, EUR: 0.84, GBP: 0.72, JPY: 110, CNY: 6.47 },
    display_currency: "USD",
  })

  const addItem = () => {
    const newItem: Item = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 0,
      dimensions: defaultDimensions.map((name) => ({
        name,
        value: 0,
        unit: name.toLowerCase() === "gsm" ? "gsm" : "m",
      })),
      base_unit_price: 0,
      currency: "USD",
      tax_rate: 0,
      discount_rate: 0,
      moq: 0,
      is_fixed_cost: false,
      weight_calculation: {
        price_per_ton: 21.3,
        currency: "USD",
      },
    }
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const addDimension = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            dimensions: [...item.dimensions, { name: "", value: 0, unit: "m" }],
          }
        }
        return item
      }),
    }))
  }

  const updateDimension = (itemId: string, dimensionIndex: number, field: keyof Dimension, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const newDimensions = [...item.dimensions]
          newDimensions[dimensionIndex] = {
            ...newDimensions[dimensionIndex],
            [field]: value,
          }
          return { ...item, dimensions: newDimensions }
        }
        return item
      }),
    }))
  }

  const updateItem = (itemId: string, field: keyof Item, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value }
        }
        return item
      }),
    }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(formData)
      }}
      className="space-y-8"
    >
      {/* Customer Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Customer Information</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="customer_name">Name</Label>
            <Input
              id="customer_name"
              value={formData.customer_info.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customer_info: { ...prev.customer_info, name: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              value={formData.customer_info.contact_person}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customer_info: { ...prev.customer_info, contact_person: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.customer_info.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customer_info: { ...prev.customer_info, email: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Items</h2>
        {formData.items.map((item, itemIndex) => (
          <div key={item.id} className="border p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Base Unit Price</Label>
                <Input
                  type="number"
                  value={item.base_unit_price}
                  onChange={(e) => updateItem(item.id, "base_unit_price", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={item.currency} onValueChange={(value) => updateItem(item.id, "currency", value)}>
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
              <div>
                <Label>Is Fixed Cost</Label>
                <Switch
                  checked={item.is_fixed_cost}
                  onCheckedChange={(checked) => updateItem(item.id, "is_fixed_cost", checked)}
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <h3 className="font-medium">Dimensions</h3>
              <div className="grid gap-4">
                {item.dimensions.map((dimension, dimIndex) => (
                  <div key={dimIndex} className="grid grid-cols-3 gap-2">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={dimension.name}
                        onChange={(e) => updateDimension(item.id, dimIndex, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={dimension.value}
                        onChange={(e) => updateDimension(item.id, dimIndex, "value", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={dimension.unit}
                        onChange={(e) => updateDimension(item.id, dimIndex, "unit", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={() => addDimension(item.id)}>
                  Add Dimension
                </Button>
              </div>
            </div>

            {/* Weight-based Pricing */}
            {!item.is_fixed_cost && (
              <div className="space-y-2">
                <h3 className="font-medium">Weight-based Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price per Ton</Label>
                    <Input
                      type="number"
                      value={item.weight_calculation?.price_per_ton || 0}
                      onChange={(e) =>
                        updateItem(item.id, "weight_calculation", {
                          ...item.weight_calculation,
                          price_per_ton: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select
                      value={item.weight_calculation?.currency || "USD"}
                      onValueChange={(value) =>
                        updateItem(item.id, "weight_calculation", {
                          ...item.weight_calculation,
                          currency: value,
                        })
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
                <div className="text-sm text-muted-foreground">
                  Calculated Weight: {calculateWeight(item.dimensions).toFixed(6)} tons
                </div>
                <div className="text-sm text-muted-foreground">
                  Unit Price (including weight): {calculateUnitPrice(item).toFixed(2)} {item.currency}
                </div>
              </div>
            )}
          </div>
        ))}
        <Button type="button" onClick={addItem}>
          Add Item
        </Button>
      </div>

      {/* Overall Rates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Overall Tax Rate (%)</Label>
          <Input
            type="number"
            value={formData.overall_tax_rate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                overall_tax_rate: Number(e.target.value),
              }))
            }
          />
        </div>
        <div>
          <Label>Overall Discount Rate (%)</Label>
          <Input
            type="number"
            value={formData.overall_discount_rate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                overall_discount_rate: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>

      {/* Display Currency */}
      <div>
        <Label>Display Currency</Label>
        <Select
          value={formData.display_currency}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, display_currency: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select display currency" />
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

      <Button type="submit">Generate Quotation</Button>
    </form>
  )
}

