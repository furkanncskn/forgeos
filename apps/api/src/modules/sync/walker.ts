import { readdir } from "node:fs/promises";
import { join } from "node:path";

export interface WalkOptions {
  /**
   * Directory names skipped entirely. Default: ["frontmatter"] — the
   * docs/templates/frontmatter/ folder holds authoring scaffolding with
   * placeholder ids, not documentation. templates/ itself (TPL-*)
   * and README.md files ARE walked: they carry real ids and content.
   */
  excludeDirs?: string[];
  /** File names skipped. Default: [] — READMEs without frontmatter are handled by the parser as skips. */
  excludeFiles?: string[];
}

/**
 * Recursively finds all markdown files under `rootDir`, sorted by full path
 * (ordinal, separator-normalized) for deterministic sync runs. Dotfiles and
 * dot-directories are always skipped. Returns absolute paths.
 */
export async function findMarkdownFiles(
  rootDir: string,
  options: WalkOptions = {}
): Promise<string[]> {
  const excludeDirs = new Set(options.excludeDirs ?? ["frontmatter"]);
  const excludeFiles = new Set(options.excludeFiles ?? []);
  const found: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return; // unreadable/vanished directory — skip silently
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!excludeDirs.has(entry.name)) await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md") && !excludeFiles.has(entry.name)) {
        found.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  // Ordinal sort on separator-normalized paths so runs are deterministic and
  // identical across Windows and POSIX.
  const sortKey = (p: string): string => p.split("\\").join("/");
  return found.sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : sortKey(a) > sortKey(b) ? 1 : 0));
}
