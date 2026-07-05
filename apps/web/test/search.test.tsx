import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Snippet } from "../src/components/Snippet.js";
import { searchQueryString } from "../src/lib/api.js";

afterEach(cleanup);

describe("searchQueryString", () => {
  it("always includes q and repeats list params", () => {
    expect(searchQueryString({ q: "zebra" })).toBe("?q=zebra");
    expect(searchQueryString({ q: "zebra", type: ["agent", "standard"], tag: ["naming"] })).toBe(
      "?q=zebra&type=agent&type=standard&tag=naming"
    );
  });

  it("omits auto mode and zero offset, includes real paging", () => {
    expect(searchQueryString({ q: "x", mode: "auto", offset: 0 })).toBe("?q=x");
    expect(searchQueryString({ q: "x", mode: "hybrid", limit: 8, offset: 20 })).toBe(
      "?q=x&mode=hybrid&limit=8&offset=20"
    );
  });

  it("encodes reserved characters", () => {
    expect(searchQueryString({ q: '"exact phrase" -not' })).toBe(
      "?q=%22exact+phrase%22+-not"
    );
  });
});

describe("Snippet", () => {
  it("renders highlights as <mark> and never injects HTML", () => {
    const { container } = render(
      <Snippet
        spans={[
          { text: "the ", highlight: false },
          { text: "frontmatter", highlight: true },
          { text: " <script>alert(1)</script>", highlight: false }
        ]}
      />
    );
    const mark = container.querySelector("mark");
    expect(mark?.textContent).toBe("frontmatter");
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
  });

  it("renders nothing for empty spans", () => {
    const { container } = render(<Snippet spans={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
