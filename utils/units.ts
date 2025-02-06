export interface Unit {
  name: string
  conversionFactor: number
}

export const lengthUnits: Unit[] = [
  { name: "m", conversionFactor: 1 },
  { name: "cm", conversionFactor: 0.01 },
  { name: "mm", conversionFactor: 0.001 },
  { name: "in", conversionFactor: 0.0254 },
  { name: "ft", conversionFactor: 0.3048 },
]

export const weightUnits: Unit[] = [
  { name: "g", conversionFactor: 0.001 },      // 1g = 0.001kg
  { name: "kg", conversionFactor: 1 },         // base unit
  { name: "ton", conversionFactor: 1000 },     // 1 ton = 1000kg
  { name: "metric-ton", conversionFactor: 1000 }  // 1 metric ton = 1000kg
]

export const weightUnitLabels: Record<string, string> = {
  "g": "Grams (g)",
  "kg": "Kilograms (kg)",
  "ton": "Tons (噸)",
  "metric-ton": "Metric Tons (公噸)"
}

export const weightPerAreaUnits: Unit[] = [
  { name: "kg/m²", conversionFactor: 1 },
  { name: "g/m²", conversionFactor: 0.001 },
  { name: "oz/yd²", conversionFactor: 0.0339057 },
]

export const customLengthUnits: Unit[] = []
export const customWeightUnits: Unit[] = []
export const customWeightPerAreaUnits: Unit[] = []

export function addCustomUnit(unitType: "length" | "weight" | "weightPerArea", name: string, conversionFactor: number) {
  const newUnit = { name, conversionFactor }
  switch (unitType) {
    case "length":
      customLengthUnits.push(newUnit)
      break
    case "weight":
      customWeightUnits.push(newUnit)
      break
    case "weightPerArea":
      customWeightPerAreaUnits.push(newUnit)
      break
  }
}

export function getAllUnits(unitType: "length" | "weight" | "weightPerArea"): Unit[] {
  switch (unitType) {
    case "length":
      return [...lengthUnits, ...customLengthUnits]
    case "weight":
      return [...weightUnits, ...customWeightUnits]
    case "weightPerArea":
      return [...weightPerAreaUnits, ...customWeightPerAreaUnits]
  }
}

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  unitType: "length" | "weight" | "weightPerArea",
): number {
  const units = getAllUnits(unitType)
  const fromUnitFactor = units.find((u) => u.name === fromUnit)?.conversionFactor || 1
  const toUnitFactor = units.find((u) => u.name === toUnit)?.conversionFactor || 1
  return value * (fromUnitFactor / toUnitFactor)
}

export function convertWeight(value: number, fromUnit: string, toUnit: string): number {
  const units = weightUnits
  const fromUnitFactor = units.find((u) => u.name === fromUnit)?.conversionFactor || 1
  const toUnitFactor = units.find((u) => u.name === toUnit)?.conversionFactor || 1
  return value * (fromUnitFactor / toUnitFactor)
}

