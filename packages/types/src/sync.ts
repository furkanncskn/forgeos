import { z } from "zod";

/** Shared contracts for the sync module (ADR-0001, §4 — sync). */

export const syncIssueSchema = z.object({
  /** Dotted field path inside the frontmatter; empty for file-level issues. */
  path: z.string(),
  message: z.string()
});
export type SyncIssue = z.infer<typeof syncIssueSchema>;

export const syncFileErrorSchema = z.object({
  /** Repo-relative file path, e.g. 'docs/agents/broken.md'. */
  path: z.string(),
  issues: z.array(syncIssueSchema)
});
export type SyncFileError = z.infer<typeof syncFileErrorSchema>;

export const syncRunStatusSchema = z.enum(["running", "ok", "failed"]);
export type SyncRunStatus = z.infer<typeof syncRunStatusSchema>;

/** One sync run, as returned by POST /sync/run and GET /sync/runs. */
export const syncRunSchema = z.object({
  id: z.string().uuid(),
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
  status: syncRunStatusSchema,
  filesSeen: z.number().int().nonnegative(),
  filesChanged: z.number().int().nonnegative(),
  filesUnchanged: z.number().int().nonnegative(),
  /** README.md files without a frontmatter block — navigation aids, not documents. */
  filesSkipped: z.number().int().nonnegative(),
  filesInvalid: z.number().int().nonnegative(),
  errors: z.array(syncFileErrorSchema)
});
export type SyncRun = z.infer<typeof syncRunSchema>;

export const syncRunListSchema = z.object({
  runs: z.array(syncRunSchema)
});
export type SyncRunList = z.infer<typeof syncRunListSchema>;
