"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyRateEditor } from "../components/CurrencyRateEditor"
import { ItemForm } from "../components/ItemForm"
import { ItemList } from "../components/ItemList"
import { defaultCurrencyRates, calculateItemCost, convertCurrency, formatCurrency } from "../utils/calculations"
import { addCustomUnit } from "../utils/units"
import type { CurrencyRate, Item, QuotationData } from "../types/quotation"
import { QuotationPreview } from "../components/QuotationPreview"

export default function QuotationPage() {
  const [rates, setRates] = useState<CurrencyRate[]>(defaultCurrencyRates)
  const [items, setItems] = useState<Item[]>([])
  const [customer, setCustomer] = useState({ name: "", email: "" })
  const [baseCurrency, setBaseCurrency] = useState("USD")
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [newUnit, setNewUnit] = useState({ type: "length", name: "", conversionFactor: 1 })

  const handleAddItem = (newItem: Item) => {
    setItems([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleAddCustomUnit = () => {
    addCustomUnit(newUnit.type as "length" | "weight" | "weightPerArea", newUnit.name, newUnit.conversionFactor)
    setNewUnit({ type: "length", name: "", conversionFactor: 1 })
  }

  const generateQuotation = (): QuotationData => {
    return {
      customer,
      items,
      baseCurrency,
      displayCurrency,
    }
  }

  const totalCost = items.reduce((sum, item) => {
    const itemCost = calculateItemCost(item)
    return sum + convertCurrency(itemCost, item.currency, displayCurrency, rates)
  }, 0)

  const quotationData: QuotationData = {
    customer,
    items,
    baseCurrency,
    displayCurrency,
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Quotation System</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Custom Unit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="unitType">Unit Type</Label>
            <Select value={newUnit.type} onValueChange={(value) => setNewUnit({ ...newUnit, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="weightPerArea">Weight per Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unitName">Unit Name</Label>
            <Input
              id="unitName"
              value={newUnit.name}
              onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="conversionFactor">Conversion Factor</Label>
            <Input
              id="conversionFactor"
              type="number"
              value={newUnit.conversionFactor}
              onChange={(e) => setNewUnit({ ...newUnit, conversionFactor: Number(e.target.value) })}
            />
          </div>
          <Button onClick={handleAddCustomUnit}>Add Custom Unit</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm onAddItem={handleAddItem} currencies={rates.map((r) => r.code)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemList items={items} onRemoveItem={handleRemoveItem} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="baseCurrency">Base Currency</Label>
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger id="baseCurrency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rates.map((rate) => (
                  <SelectItem key={rate.code} value={rate.code}>
                    {rate.code} - {rate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="displayCurrency">Display Currency</Label>
            <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
              <SelectTrigger id="displayCurrency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rates.map((rate) => (
                  <SelectItem key={rate.code} value={rate.code}>
                    {rate.code} - {rate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CurrencyRateEditor rates={rates} onChange={setRates} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quotation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Cost: {formatCurrency(totalCost, displayCurrency)}</p>
          <Button onClick={() => console.log(generateQuotation())}>Generate Quotation</Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quotation Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <QuotationPreview quotation={quotationData} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

