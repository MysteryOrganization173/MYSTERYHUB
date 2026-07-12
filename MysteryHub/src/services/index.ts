export { apiClient } from "./api";
export { bundlesService } from "./bundles";
export { ordersService, generateOrderReference } from "./orders";
export { profilesService } from "./profiles";
export { authService } from "./auth";
export { dataBundlesService } from "./dataBundles";
export { catalogueService } from "./catalogue";
// Server-only (imports the Supabase admin client + Paystack secret key) —
// never import this barrel from a "use client" component. Use the
// `/api/checkout` route instead. See src/services/checkout.ts.
export { checkoutService } from "./checkout";
// Server-only (transitively imports the Supabase admin client via
// ordersService). Prepared, not called by any route yet — see
// src/services/fulfillment/ and docs/fulfillment.md.
export { fulfillmentService } from "./fulfillment";
