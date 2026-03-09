import { calculatePrice } from './pricing';

describe('Pricing Calculator Logic', () => {
  const defaultRules = {
    baseRate: 12,
    weightMultiplier: 1.6,
    fuelLevyPercentage: 0.035, // 3.5%
  };

  it('calculates standard delivery perfectly (2kg, serviceType 2.2)', () => {
    const result = calculatePrice(2, 2.2, defaultRules);
    
    // base = 12 * 2.2 = 26.4
    // weightCharge = 2 * 1.6 * 2.2 = 7.04
    // subtotal = 33.44
    // fuel = 33.44 * 0.035 = 1.1704
    // total = 34.6104
    
    expect(result.base).toBeCloseTo(26.4);
    expect(result.weightCharge).toBeCloseTo(7.04);
    expect(result.fuel).toBeCloseTo(1.1704);
    expect(result.total).toBeCloseTo(34.6104);
  });

  it('calculates same-day express correctly (5kg, serviceType 1.0)', () => {
    const result = calculatePrice(5, 1.0, defaultRules);
    
    // base = 12 * 1.0 = 12
    // weightCharge = 5 * 1.6 * 1.0 = 8.0
    // subtotal = 20.0
    // fuel = 20.0 * 0.035 = 0.70
    // total = 20.70

    expect(result.base).toBe(12);
    expect(result.weightCharge).toBe(8);
    expect(result.fuel).toBeCloseTo(0.70);
    expect(result.total).toBeCloseTo(20.70);
  });
});
