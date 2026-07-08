/**
 * Global Client State — Mystery Bundle Hub
 *
 * State management strategy:
 *   • Server state  → React Query / SWR (data fetching, caching)
 *   • Client state  → Zustand slices (cart, UI modals, filters)
 *   • Form state    → React Hook Form (local to each form)
 *   • URL state     → Next.js searchParams (shareable filters/pagination)
 *
 * To add Zustand:
 *   npm install zustand
 *
 * Planned store slices (implement when building features):
 *   - useCartStore     — cart items, totals, add/remove/clear
 *   - useUIStore       — modal open state, sidebar, loading overlays
 *   - useFilterStore   — active bundle filters, sort order
 *   - useAuthStore     — cached user session (thin wrapper around Supabase)
 */

// Placeholder export so the alias @/store/* resolves without error.
export {};
