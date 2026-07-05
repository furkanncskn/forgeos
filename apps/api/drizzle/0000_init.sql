-- ForgeOS Phase 1 initial schema (mirrors apps/api/src/db/schema.ts).
-- gen_random_uuid() is built into PostgreSQL 13+; no extension required.

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  doc_type text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  frontmatter jsonb NOT NULL DEFAULT '{}'::jsonb,
  body_md text NOT NULL,
  body_text text NOT NULL,
  checksum text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS documents_type_slug_unique ON documents (doc_type, slug);
CREATE INDEX IF NOT EXISTS documents_type_idx ON documents (doc_type);

CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version integer NOT NULL,
  frontmatter jsonb NOT NULL,
  body_md text NOT NULL,
  checksum text NOT NULL,
  change_note text,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS document_versions_unique ON document_versions (document_id, version);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS document_tags (
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

CREATE TABLE IF NOT EXISTS document_links (
  source_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  target_ref text NOT NULL,
  target_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  link_type text NOT NULL DEFAULT 'references',
  PRIMARY KEY (source_id, target_ref, link_type)
);

CREATE INDEX IF NOT EXISTS document_links_target_idx ON document_links (target_id);

CREATE TABLE IF NOT EXISTS sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  files_seen integer NOT NULL DEFAULT 0,
  files_changed integer NOT NULL DEFAULT 0,
  files_unchanged integer NOT NULL DEFAULT 0,
  files_invalid integer NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]'::jsonb
);
