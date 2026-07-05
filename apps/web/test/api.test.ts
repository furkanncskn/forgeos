import { describe, expect, it, vi, afterEach } from "vitest";

import { ApiRequestError, documentsQueryString, fetchDocuments } from "../src/lib/api.js";

describe("documentsQueryString", () => {
  it("returns an empty string for no filters", () => {
    expect(documentsQueryString({})).toBe("");
  });

  it("includes only set parameters and trims q", () => {
    expect(documentsQueryString({ type: "agent", q: "  review " })).toBe("?type=agent&q=review");
    expect(documentsQueryString({ q: "   " })).toBe("");
  });

  it("omits offset 0 and encodes reserved characters", () => {
    expect(documentsQueryString({ limit: 50, offset: 0 })).toBe("?limit=50");
    expect(documentsQueryString({ q: "100%" })).toBe("?q=100%25");
  });
});

describe("fetchDocuments", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses a valid response against the shared contract", async () => {
    const payload = {
      documents: [
        {
          id: "6f1e0d9a-3f75-4a6c-9d0e-1c2b3a4d5e6f",
          docId: "STD-001",
          slug: "std-001",
          docType: "standard",
          title: "Documentation Standard",
          path: "docs/standards/STD-001.md",
          status: "Approved",
          version: "1.0.0",
          owner: "CAO",
          tags: [],
          updatedAt: "2026-07-05T00:00:00.000Z"
        }
      ],
      total: 1,
      limit: 50,
      offset: 0
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }))
    );

    const result = await fetchDocuments({});
    expect(result.total).toBe(1);
    expect(result.documents[0]?.docId).toBe("STD-001");
  });

  it("throws ApiRequestError with the server message on API errors", async () => {
    const body = { statusCode: 400, error: "Bad Request", message: "type: invalid enum value" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 400 }))
    );

    await expect(fetchDocuments({})).rejects.toMatchObject({
      name: "ApiRequestError",
      status: 400,
      message: "type: invalid enum value"
    });
  });

  it("rejects contract-violating payloads instead of rendering garbage", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ nope: true }), { status: 200 }))
    );
    await expect(fetchDocuments({})).rejects.toThrow();
  });

  it("exposes the status for 404 handling", () => {
    const err = new ApiRequestError(404, "no document with slug 'x'");
    expect(err.status).toBe(404);
  });
});
