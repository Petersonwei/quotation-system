import { calculateWeight, calculateUnitPrice, convertCurrency } from "../../utils/calculations"
import type { QuotationData } from "../../types/quotation"

export default function QuotationSummary({ quotation }: { quotation: QuotationData }) {
  const calculateItemTotal = (item) => {
    const unitPrice = calculateUnitPrice(item)
    const subtotal = item.quantity * unitPrice
    const discount = subtotal * (item.discount_rate / 100)
    const afterDiscount = subtotal - discount
    const tax = afterDiscount * (item.tax_rate / 100)
    return afterDiscount + tax
  }

  const calculateDisplayAmount = (amount: number, fromCurrency: string) => {
    return convertCurrency(amount, fromCurrency, quotation.display_currency, quotation.exchange_rates)
  }

  const subtotal = quotation.items.reduce((sum, item) => {
    return sum + calculateDisplayAmount(calculateItemTotal(item), item.currency)
  }, 0)

  const overallDiscount = subtotal * (quotation.overall_discount_rate / 100)
  const afterDiscount = subtotal - overallDiscount
  const overallTax = afterDiscount * (quotation.overall_tax_rate / 100)
  const total = afterDiscount + overallTax

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Quotation Summary</h2>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Customer Information</h3>
        <p>Name: {quotation.customer_info.name}</p>
        <p>Contact: {quotation.customer_info.contact_person}</p>
        <p>Email: {quotation.customer_info.email}</p>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Weight</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item) => {
              const unitPrice = calculateUnitPrice(item)
              const weight = calculateWeight(item.dimensions)
              const total = calculateItemTotal(item)

              return (
                <tr key={item.id} className="border-b">
                  <td className="py-2">
                    <div>{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Dimensions: {item.dimensions.map((d) => `${d.name}: ${d.value}${d.unit}`).join(", ")}
                    </div>
                  </td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">
                    {unitPrice.toFixed(2)} {item.currency}
                  </td>
                  <td className="text-right">{weight.toFixed(6)} tons</td>
                  <td className="text-right">
                    {total.toFixed(2)} {item.currency}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>
            {subtotal.toFixed(2)} {quotation.display_currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Overall Discount ({quotation.overall_discount_rate}%):</span>
          <span>
            -{overallDiscount.toFixed(2)} {quotation.display_currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Overall Tax ({quotation.overall_tax_rate}%):</span>
          <span>
            {overallTax.toFixed(2)} {quotation.display_currency}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>
            {total.toFixed(2)} {quotation.display_currency}
          </span>
        </div>
      </div>
    </div>
  )
}

