export class Cache {
  private store: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set<T>(key: string, data: T, ttl: number): void {
    this.store.set(key, { data, timestamp: Date.now(), ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  clear(key: string): void {
    this.store.delete(key);
  }
}

export const cache = new Cache();
