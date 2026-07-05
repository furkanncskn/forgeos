import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import type { SyncFileError } from "@forgeos/types";

/**
 * ForgeOS database schema (ADR-0001, §3).
 *
 * `documents` mirrors `/docs` (the filesystem stays the source of truth);
 * the remaining tables hold versions, tags, cross-references and sync runs.
 * Typed projections (agents, prompts, workflows) arrive in Phase 4.
 */

/** Identity & access (ADR-0001 §3). Roles: admin > editor > viewer. */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

/**
 * Server-side sessions. `id` stores the SHA-256 hash of the bearer token that
 * lives in the cookie — a leaked table cannot be replayed as sessions.
 */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Repo-relative path with POSIX separators, e.g. 'docs/agents/code-reviewer.md'. */
    path: text("path").notNull().unique(),
    docType: text("doc_type").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    frontmatter: jsonb("frontmatter").$type<Record<string, unknown>>().notNull().default({}),
    bodyMd: text("body_md").notNull(),
    bodyText: text("body_text").notNull(),
    /** Heading lines only — weight B in the search index (ADR-0003). */
    bodyHeadings: text("body_headings").notNull().default(""),
    // search_tsv (tsvector) is a DB-generated column (drizzle/0003_search.sql);
    // deliberately unmapped here so no code path can ever write it.
    /** SHA-256 of the raw file — sync skips files whose checksum is unchanged. */
    checksum: text("checksum").notNull(),
    /** Lifecycle status from frontmatter (draft/active/archived; decisions use their own vocabulary). */
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [
    uniqueIndex("documents_type_slug_unique").on(t.docType, t.slug),
    index("documents_type_idx").on(t.docType)
  ]
);

export const documentVersions = pgTable(
  "document_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    frontmatter: jsonb("frontmatter").$type<Record<string, unknown>>().notNull(),
    bodyMd: text("body_md").notNull(),
    checksum: text("checksum").notNull(),
    changeNote: text("change_note"),
    changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [uniqueIndex("document_versions_unique").on(t.documentId, t.version)]
);

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique()
});

export const documentTags = pgTable(
  "document_tags",
  {
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" })
  },
  (t) => [primaryKey({ columns: [t.documentId, t.tagId] })]
);

/**
 * Cross-document references. `target_ref` is always stored (the document ID,
 * e.g. 'STD-001'), even
 * when the target document does not exist yet — `target_id` is resolved when
 * it does. Rows with a NULL target_id are dangling references, reportable in
 * the Admin Panel.
 */
export const documentLinks = pgTable(
  "document_links",
  {
    sourceId: uuid("source_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    targetRef: text("target_ref").notNull(),
    targetId: uuid("target_id").references(() => documents.id, { onDelete: "set null" }),
    linkType: text("link_type").notNull().default("references")
  },
  (t) => [
    primaryKey({ columns: [t.sourceId, t.targetRef, t.linkType] }),
    index("document_links_target_idx").on(t.targetId)
  ]
);

export const syncRuns = pgTable("sync_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  status: text("status").notNull().default("running"),
  filesSeen: integer("files_seen").notNull().default(0),
  filesChanged: integer("files_changed").notNull().default(0),
  filesUnchanged: integer("files_unchanged").notNull().default(0),
  filesSkipped: integer("files_skipped").notNull().default(0),
  filesInvalid: integer("files_invalid").notNull().default(0),
  errors: jsonb("errors").$type<SyncFileError[]>().notNull().default([])
});
