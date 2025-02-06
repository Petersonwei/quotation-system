import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Item } from "../types/quotation"
import { calculateItemCost, calculateItemWeight, formatCurrency } from "../utils/calculations"

interface ItemListProps {
  items: Item[]
  onRemoveItem: (id: string) => void
}

export function ItemList({ items, onRemoveItem }: ItemListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Cost Type</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Tax</TableHead>
          <TableHead>Total Cost</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const baseCost = calculateItemCost({ ...item, includeTax: false })
          const totalCost = calculateItemCost(item)
          
          return (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.isFixedCost ? "Fixed" : "Variable"}</TableCell>
              <TableCell>
                {item.isFixedCost ? (
                  `Unit Cost: ${formatCurrency(item.unitCost || 0, item.currency)}`
                ) : (
                  <>
                    {item.dimensions?.length.value} {item.dimensions?.length.unit} x {item.dimensions?.width.value}{" "}
                    {item.dimensions?.width.unit}
                    <br />
                    {item.dimensions?.weightPerArea.value} {item.dimensions?.weightPerArea.unit}
                    <br />
                    Price: {formatCurrency(item.pricePerWeight?.value || 0, item.pricePerWeight?.currency || "")} per{" "}
                    {item.pricePerWeight?.weightUnit}
                  </>
                )}
              </TableCell>
              <TableCell>{item.isFixedCost ? "N/A" : `${calculateItemWeight(item).toFixed(2)} kg`}</TableCell>
              <TableCell>
                {item.includeTax ? `${item.taxRate}% (${formatCurrency(totalCost - baseCost, item.currency)})` : "No Tax"}
              </TableCell>
              <TableCell>{formatCurrency(totalCost, item.currency)}</TableCell>
              <TableCell>
                <button onClick={() => onRemoveItem(item.id)} className="text-red-500">
                  Remove
                </button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

