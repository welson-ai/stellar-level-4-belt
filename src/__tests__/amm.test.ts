import { getAmountOut, getPriceImpact, getPrice } from '@/lib/amm';

describe('AMM', () => {
  it('calculates correct output amount', () => {
    const out = getAmountOut(100, 10000, 5000);
    expect(out).toBeGreaterThan(0);
    expect(out).toBeLessThan(100);
  });
  it('calculates price impact', () => {
    const impact = getPriceImpact(1000, 10000);
    expect(impact).toBeGreaterThan(0);
    expect(impact).toBeLessThan(100);
  });
  it('calculates pool price correctly', () => {
    const price = getPrice(10000, 5000);
    expect(price.AtoB).toBe(0.5);
    expect(price.BtoA).toBe(2);
  });
  it('returns 0 for empty reserves', () => {
    const out = getAmountOut(100, 0, 0);
    expect(out).toBe(0);
  });
});
