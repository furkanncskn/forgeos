import type { ZodType } from "zod";

import {
  apiErrorSchema,
  authMeSchema,
  documentDetailSchema,
  documentListSchema,
  healthStatusSchema,
  relatedResponseSchema,
  searchResponseSchema,
  syncRunSchema,
  type DocType,
  type DocumentDetail,
  type DocumentList,
  type HealthStatus,
  type LoginRequest,
  type RelatedResponse,
  type SearchMode,
  type SearchResponse,
  type SessionUser,
  type SyncRun
} from "@forgeos/types";

/**
 * Typed API client. Every response is validated against the shared Zod
 * contract from @forgeos/types, so a drifting API fails loudly in dev
 * instead of rendering garbage (ADR-0001 §2).
 */

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function parseError(res: Response): Promise<ApiRequestError> {
  let message = `HTTP ${res.status}`;
  try {
    message = apiErrorSchema.parse(await res.json()).message;
  } catch {
    // non-JSON error body — keep the generic message
  }
  return new ApiRequestError(res.status, message);
}

async function getJson<T>(url: string, schema: ZodType<T>): Promise<T> {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw await parseError(res);
  return schema.parse(await res.json());
}

async function postJson<T>(url: string, body: unknown, schema: ZodType<T>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!res.ok) throw await parseError(res);
  return schema.parse(await res.json());
}

export interface DocumentsQuery {
  type?: DocType;
  q?: string;
  limit?: number;
  offset?: number;
}

/** Builds the querystring for GET /documents, omitting empty params. */
export function documentsQueryString(query: DocumentsQuery): string {
  const params = new URLSearchParams();
  if (query.type) params.set("type", query.type);
  if (query.q && query.q.trim() !== "") params.set("q", query.q.trim());
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined && query.offset > 0) params.set("offset", String(query.offset));
  const qs = params.toString();
  return qs === "" ? "" : `?${qs}`;
}

export function fetchDocuments(query: DocumentsQuery): Promise<DocumentList> {
  return getJson(`/api/v1/documents${documentsQueryString(query)}`, documentListSchema);
}

export function fetchDocument(slug: string): Promise<DocumentDetail> {
  return getJson(`/api/v1/documents/${encodeURIComponent(slug)}`, documentDetailSchema);
}

export function fetchHealth(): Promise<HealthStatus> {
  return getJson("/api/v1/health", healthStatusSchema);
}

/** null = anonymous (401); any other failure throws. */
export async function fetchMe(): Promise<SessionUser | null> {
  const res = await fetch("/api/v1/auth/me", { credentials: "same-origin" });
  if (res.status === 401) return null;
  if (!res.ok) throw await parseError(res);
  return authMeSchema.parse(await res.json()).user;
}

export async function postLogin(credentials: LoginRequest): Promise<SessionUser> {
  const parsed = await postJson("/api/v1/auth/login", credentials, authMeSchema);
  return parsed.user;
}

export async function postLogout(): Promise<void> {
  const res = await fetch("/api/v1/auth/logout", { method: "POST", credentials: "same-origin" });
  if (!res.ok) throw await parseError(res);
}

/** Admin-only: triggers a full /docs → DB sync and returns the run summary. */
export function postSyncRun(): Promise<SyncRun> {
  return postJson("/api/v1/sync/run", undefined, syncRunSchema);
}

export interface SearchParams {
  q: string;
  type?: DocType[];
  status?: string[];
  tag?: string[];
  mode?: SearchMode;
  limit?: number;
  offset?: number;
}

/** Builds the querystring for GET /search (repeated params for lists). */
export function searchQueryString(params: SearchParams): string {
  const qs = new URLSearchParams();
  qs.set("q", params.q);
  for (const t of params.type ?? []) qs.append("type", t);
  for (const s of params.status ?? []) qs.append("status", s);
  for (const t of params.tag ?? []) qs.append("tag", t);
  if (params.mode && params.mode !== "auto") qs.set("mode", params.mode);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.offset !== undefined && params.offset > 0) qs.set("offset", String(params.offset));
  return `?${qs.toString()}`;
}

export function fetchSearch(params: SearchParams): Promise<SearchResponse> {
  return getJson(`/api/v1/search${searchQueryString(params)}`, searchResponseSchema);
}

export function fetchRelated(slug: string, limit?: number): Promise<RelatedResponse> {
  const qs = limit !== undefined ? `?limit=${limit}` : "";
  return getJson(`/api/v1/documents/${encodeURIComponent(slug)}/related${qs}`, relatedResponseSchema);
}
