import { Cache } from '@/lib/cache';

describe('Cache', () => {
  it('stores and retrieves data', () => {
    const c = new Cache();
    c.set('key', 'value', 5000);
    expect(c.get('key')).toBe('value');
  });
  it('returns null for expired entries', () => {
    const c = new Cache();
    c.set('key', 'value', -1);
    expect(c.get('key')).toBeNull();
  });
  it('clears entries correctly', () => {
    const c = new Cache();
    c.set('key', 'value', 5000);
    c.clear('key');
    expect(c.get('key')).toBeNull();
  });
});
