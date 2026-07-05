-- Phase 3: lexical search index (ADR-0003 D3).
-- search_tsv is GENERATED: the checksum-idempotent sync IS the incremental
-- indexer — no separate write path, rebuild = resync.

ALTER TABLE documents ADD COLUMN IF NOT EXISTS body_headings text NOT NULL DEFAULT '';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('simple', slug), 'A') ||
    setweight(to_tsvector('english', coalesce(frontmatter->>'tags', '')), 'B') ||
    setweight(to_tsvector('english', body_headings), 'B') ||
    setweight(to_tsvector('english', body_text), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS documents_search_idx ON documents USING gin (search_tsv);

-- Existing rows predate heading extraction: clear checksums so the next sync
-- rewrites every row (filling body_headings; the tsv regenerates itself).
UPDATE documents SET checksum = '';
