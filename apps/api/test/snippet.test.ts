import { describe, expect, it } from "vitest";

import { parseSnippet } from "../src/modules/search/service.js";

describe("parseSnippet (ts_headline → spans)", () => {
  it("splits highlighted and plain spans in order", () => {
    expect(parseSnippet("the ⟪frontmatter⟫ dialect is ⟪canonical⟫")).toEqual([
      { text: "the ", highlight: false },
      { text: "frontmatter", highlight: true },
      { text: " dialect is ", highlight: false },
      { text: "canonical", highlight: true }
    ]);
  });

  it("handles headline with no matches", () => {
    expect(parseSnippet("plain text only")).toEqual([{ text: "plain text only", highlight: false }]);
  });

  it("handles adjacent and leading highlights", () => {
    expect(parseSnippet("⟪ForgeOS⟫⟪Search⟫ done")).toEqual([
      { text: "ForgeOS", highlight: true },
      { text: "Search", highlight: true },
      { text: " done", highlight: false }
    ]);
  });

  it("never produces empty spans", () => {
    for (const span of parseSnippet("⟪a⟫ … ⟪b⟫")) {
      expect(span.text.length).toBeGreaterThan(0);
    }
  });
});
