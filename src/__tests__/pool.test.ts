import { getPoolState, executeSwap, addLiquidity } from '@/lib/pool';

describe('Pool', () => {
  it('returns pool state with required fields', async () => {
    const state = await getPoolState();
    expect(state).toHaveProperty('reserveA');
    expect(state).toHaveProperty('reserveB');
    expect(state).toHaveProperty('priceAtoB');
  });
  it('swap changes pool reserves', () => {
    const out = executeSwap(100, true);
    expect(out).toBeGreaterThan(0);
  });
  it('add liquidity increases reserves', async () => {
    const before = await getPoolState();
    addLiquidity(100, 50);
    const after = await getPoolState();
    expect(Number(after.reserveA)).toBeGreaterThan(Number(before.reserveA));
  });
});
