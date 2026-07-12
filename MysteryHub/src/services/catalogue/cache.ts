/**
 * Catalogue Layer — in-memory TTL cache.
 *
 * Deliberately dependency-free (no React Query/Zustand — per
 * docs/ROADMAP.md, heavy client-state libraries are added only when a
 * feature needs them). Scoped per catalogue key (e.g. "networks",
 * "bundles:mtn-express") so refreshing one network doesn't invalidate
 * others.
 */
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class CatalogueCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  constructor(private readonly ttlMs: number = DEFAULT_TTL_MS) {}

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: T): void {
    this.store.set(key, { data, expiresAt: Date.now() + this.ttlMs });
  }

  /** Invalidates a single key, or the entire cache when no key is given. */
  invalidate(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }
}
