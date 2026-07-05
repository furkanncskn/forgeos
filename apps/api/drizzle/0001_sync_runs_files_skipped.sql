-- Phase 1.5: READMEs without frontmatter are counted as skipped, not errors.
ALTER TABLE sync_runs ADD COLUMN IF NOT EXISTS files_skipped integer NOT NULL DEFAULT 0;
