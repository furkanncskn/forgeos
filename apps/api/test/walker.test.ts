import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { findMarkdownFiles } from "../src/modules/sync/walker.js";

describe("findMarkdownFiles (Phase 1.5 policy)", () => {
  let root: string;
  let docsDir: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "forgeos-walker-"));
    docsDir = join(root, "docs");
    await mkdir(join(docsDir, "agents", "nested"), { recursive: true });
    await mkdir(join(docsDir, "templates", "frontmatter"), { recursive: true });
    await mkdir(join(docsDir, ".hidden"), { recursive: true });

    await writeFile(join(docsDir, "README.md"), "root readme");
    await writeFile(join(docsDir, "agents", "AGENT-001.md"), "a");
    await writeFile(join(docsDir, "agents", "README.md"), "agents readme");
    await writeFile(join(docsDir, "agents", "nested", "b.md"), "b");
    await writeFile(join(docsDir, "agents", ".draft.md"), "hidden file");
    await writeFile(join(docsDir, "agents", "notes.txt"), "not markdown");
    await writeFile(join(docsDir, "templates", "TPL-001.md"), "real template doc");
    await writeFile(join(docsDir, "templates", "frontmatter", "agent.md"), "old scaffolding");
    await writeFile(join(docsDir, ".hidden", "x.md"), "hidden dir");
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("includes READMEs and templates/, excludes only frontmatter/ scaffolding", async () => {
    const files = await findMarkdownFiles(docsDir);
    const rel = files.map((f) => relative(docsDir, f).split("\\").join("/"));
    expect(rel).toEqual([
      "README.md",
      "agents/AGENT-001.md",
      "agents/README.md",
      "agents/nested/b.md",
      "templates/TPL-001.md"
    ]);
  });

  it("always skips dotfiles, dot-directories and non-markdown", async () => {
    const files = (await findMarkdownFiles(docsDir)).join("\n");
    expect(files).not.toContain(".draft.md");
    expect(files).not.toContain(".hidden");
    expect(files).not.toContain("notes.txt");
    expect(files).not.toContain("frontmatter");
  });

  it("honors custom exclude options", async () => {
    const files = await findMarkdownFiles(docsDir, {
      excludeDirs: ["agents"],
      excludeFiles: ["README.md"]
    });
    const rel = files.map((f) => relative(docsDir, f).split("\\").join("/"));
    expect(rel).toEqual(["templates/TPL-001.md", "templates/frontmatter/agent.md"]);
  });

  it("returns an empty list for a missing directory", async () => {
    expect(await findMarkdownFiles(join(root, "does-not-exist"))).toEqual([]);
  });
});
