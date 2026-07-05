import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Markdown } from "../src/components/Markdown.js";

afterEach(cleanup);

describe("Markdown", () => {
  it("renders headings, emphasis and GFM tables", () => {
    render(
      <Markdown>{"# Title\n\nSome **bold** text.\n\n| A | B |\n|---|---|\n| 1 | 2 |\n"}</Markdown>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Title");
    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("does not render raw HTML from document bodies (XSS guard)", () => {
    const { container } = render(
      <Markdown>{'Safe.\n\n<script>window.hacked = true</script><img src=x onerror="x">'}</Markdown>
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect((window as unknown as Record<string, unknown>).hacked).toBeUndefined();
  });
});
