import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { roleAtLeast, type SessionUser, type UserRole } from "@forgeos/types";

import { fetchMe } from "./api.js";

export const ME_QUERY_KEY = ["auth", "me"] as const;

export interface AuthState {
  /** undefined while loading; null when anonymous. */
  user: SessionUser | null | undefined;
  isLoading: boolean;
}

/** Current session, cached app-wide. `null` data means "not signed in". */
export function useAuth(): AuthState {
  const query = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    staleTime: 60_000,
    retry: 1
  });
  return { user: query.data, isLoading: query.isPending };
}

/** Invalidate after login/logout so every consumer refetches the session. */
export function useInvalidateAuth(): () => Promise<void> {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    // Documents are role-agnostic today, but a session change should never
    // show another user's cached data.
    await queryClient.invalidateQueries({ queryKey: ["documents"] });
    await queryClient.invalidateQueries({ queryKey: ["document"] });
  };
}

/**
 * Renders children only when the signed-in user has at least `minRole`.
 * Unauthorized users see nothing (actions are hidden, not disabled).
 */
export function RoleGate({ minRole, children }: { minRole: UserRole; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !roleAtLeast(user.role, minRole)) return null;
  return <>{children}</>;
}
