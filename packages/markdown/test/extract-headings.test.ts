import { describe, expect, it } from "vitest";

import { extractHeadings, parseDocument } from "../src/index.js";

describe("extractHeadings (ADR-0003 weight-B field)", () => {
  it("collects ATX headings at all levels, stripping markers", () => {
    const md = "# Title\n\nProse.\n\n## Sub *section*\n\n###### Deep `code` heading\n";
    expect(extractHeadings(md)).toBe("Title\nSub section\nDeep code heading");
  });

  it("strips trailing closing hashes", () => {
    expect(extractHeadings("## Closed heading ##\n")).toBe("Closed heading");
  });

  it("ignores # lines inside fenced code blocks", () => {
    const md = "# Real\n\n```bash\n# just a comment\n```\n\n~~~\n## also not a heading\n~~~\n\n## Also real\n";
    expect(extractHeadings(md)).toBe("Real\nAlso real");
  });

  it("returns empty string for heading-less bodies", () => {
    expect(extractHeadings("Just prose.\n")).toBe("");
  });

  it("is wired into parseDocument", () => {
    const raw = "---\nid: STD-001\ntitle: X\n---\n\n# Section One\n\nBody.\n\n## Section Two\n";
    const doc = parseDocument("docs/standards/STD-001.md", raw);
    expect(doc.bodyHeadings).toBe("Section One\nSection Two");
  });
});
