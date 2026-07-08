/**
 * Toast utility — thin re-export from Sonner.
 *
 * Usage:
 *   import { toast } from "@/components/ui/toast"
 *   toast.success("Bundle added to cart!")
 *   toast.error("Something went wrong.")
 *   toast.promise(fetchData(), { loading: "Loading…", success: "Done!", error: "Error" })
 */
export { toast } from "sonner";
export type { ExternalToast as ToastOptions } from "sonner";
