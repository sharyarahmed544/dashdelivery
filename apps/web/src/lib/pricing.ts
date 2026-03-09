export interface PricingRules {
  baseRate: number;
  weightMultiplier: number;
  fuelLevyPercentage: number;
}

export function calculatePrice(
  weight: number,
  serviceType: number,
  rules: PricingRules
) {
  const base = rules.baseRate * serviceType;
  const weightCharge = weight * rules.weightMultiplier * serviceType;
  const subtotal = base + weightCharge;
  const fuel = subtotal * rules.fuelLevyPercentage;
  const total = subtotal + fuel;

  return {
    base,
    weightCharge,
    fuel,
    total,
  };
}
