/**
 * Profile domain types — V1 Backend Foundation.
 *
 * `Profile` is the camelCase shape used by services/components.
 * `ProfileRow` is the raw DB row shape (snake_case), imported only inside
 * the service layer — components should never see `ProfileRow` directly.
 */
import type { Database } from "./database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  updatedAt: string;
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
