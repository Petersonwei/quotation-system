import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuotationData } from "../types/quotation"
import { calculateItemCost, calculateItemWeight, formatCurrency, convertCurrency } from "../utils/calculations"
import { defaultCurrencyRates } from "../utils/calculations"

interface QuotationPreviewProps {
  quotation: QuotationData
  rates?: CurrencyRate[]
}

export function QuotationPreview({ quotation, rates = defaultCurrencyRates }: QuotationPreviewProps) {
  const convertToDisplayCurrency = (amount: number, fromCurrency: string) => {
    return convertCurrency(amount, fromCurrency, quotation.displayCurrency, rates)
  }

  const calculateSubtotal = () => {
    return quotation.items.reduce((sum, item) => {
      const itemCost = calculateItemCost(item)
      return sum + convertToDisplayCurrency(itemCost, item.currency)
    }, 0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quotation Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">From:</h3>
            <p>Your Company Name</p>
            <p>Company Address</p>
            <p>Contact Information</p>
          </div>
          <div>
            <h3 className="font-semibold">To:</h3>
            <p>{quotation.customer.name}</p>
            <p>{quotation.customer.email}</p>
          </div>
        </div>

        {/* Quotation Details */}
        <div>
          <h3 className="font-semibold mb-2">Quotation Details</h3>
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Quotation Number: QT-{Date.now().toString().slice(-6)}</p>
          <p>Currency: {quotation.displayCurrency}</p>
        </div>

        {/* Items Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Description</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotation.items.map((item) => {
              const baseCost = calculateItemCost({ ...item, includeTax: false })
              const totalCost = calculateItemCost(item)
              const unitPrice = item.isFixedCost 
                ? item.unitCost || 0
                : (item.pricePerWeight?.value || 0)

              // Convert all monetary values to display currency
              const displayUnitPrice = convertToDisplayCurrency(unitPrice, item.currency)
              const displayTotalCost = convertToDisplayCurrency(totalCost, item.currency)
              const displayTaxAmount = convertToDisplayCurrency(totalCost - baseCost, item.currency)

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {!item.isFixedCost && item.dimensions && (
                      <>
                        {item.dimensions.length.value} {item.dimensions.length.unit} x{" "}
                        {item.dimensions.width.value} {item.dimensions.width.unit}
                        <br />
                        {item.dimensions.weightPerArea.value} {item.dimensions.weightPerArea.unit}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.isFixedCost ? "-" : `${calculateItemWeight(item).toFixed(2)} kg`}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(displayUnitPrice, quotation.displayCurrency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.includeTax 
                      ? `${item.taxRate}% (${formatCurrency(displayTaxAmount, quotation.displayCurrency)})`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(displayTotalCost, quotation.displayCurrency)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="flex flex-col gap-2 items-end mt-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-right">Subtotal:</div>
            <div className="text-right">
              {formatCurrency(calculateSubtotal(), quotation.displayCurrency)}
            </div>
            <div className="text-right">Tax Total:</div>
            <div className="text-right">
              {formatCurrency(
                quotation.items.reduce((sum, item) => {
                  if (!item.includeTax) return sum
                  const baseCost = calculateItemCost({ ...item, includeTax: false })
                  const totalCost = calculateItemCost(item)
                  return sum + convertToDisplayCurrency(totalCost - baseCost, item.currency)
                }, 0),
                quotation.displayCurrency
              )}
            </div>
            <div className="text-right font-bold">Total:</div>
            <div className="text-right font-bold">
              {formatCurrency(
                quotation.items.reduce((sum, item) => {
                  const totalCost = calculateItemCost(item)
                  return sum + convertToDisplayCurrency(totalCost, item.currency)
                }, 0),
                quotation.displayCurrency
              )}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Terms and Conditions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Validity: 30 days from the date of quotation</li>
            <li>Payment Terms: 50% advance, 50% before delivery</li>
            <li>Delivery Time: 2-3 weeks after order confirmation</li>
            <li>Prices are subject to change without prior notice</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 