import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SessionUser } from "@forgeos/types";

import { RoleGate } from "../src/lib/auth.js";
import { LoginPage } from "../src/pages/LoginPage.js";

/** fetch stub routing by URL — /auth/me and /auth/login. */
function stubFetch(options: { me: SessionUser | null; loginStatus?: number; loginUser?: SessionUser }) {
  let currentUser = options.me;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith("/auth/me")) {
      return currentUser
        ? new Response(JSON.stringify({ user: currentUser }), { status: 200 })
        : new Response(
            JSON.stringify({ statusCode: 401, error: "Unauthorized", message: "authentication required" }),
            { status: 401 }
          );
    }
    if (url.endsWith("/auth/login") && init?.method === "POST") {
      const status = options.loginStatus ?? 200;
      if (status !== 200) {
        return new Response(
          JSON.stringify({ statusCode: status, error: "Unauthorized", message: "invalid email or password" }),
          { status }
        );
      }
      currentUser = options.loginUser ?? null;
      return new Response(JSON.stringify({ user: options.loginUser }), { status: 200 });
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderLoginApp() {
  const rootRoute = createRootRoute({ component: Outlet });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage
  });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div data-testid="home">HOME</div>
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([loginRoute, homeRoute]),
    history: createMemoryHistory({ initialEntries: ["/login"] })
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      {/* Test router differs from the app's registered router type. */}
      <RouterProvider router={router as never} />
    </QueryClientProvider>
  );
  return { queryClient };
}

const viewer: SessionUser = {
  id: "6f1e0d9a-3f75-4a6c-9d0e-1c2b3a4d5e6f",
  email: "viewer@test.local",
  name: "Test Viewer",
  role: "viewer"
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LoginPage", () => {
  it("shows an error message on invalid credentials and stays on the form", async () => {
    stubFetch({ me: null, loginStatus: 401 });
    renderLoginApp();

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Email"), "viewer@test.local");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Invalid email or password.");
    expect(screen.queryByTestId("home")).toBeNull();
  });

  it("signs in with valid credentials and navigates to the app", async () => {
    const fetchMock = stubFetch({ me: null, loginUser: viewer });
    renderLoginApp();

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Email"), "viewer@test.local");
    await user.type(screen.getByLabelText("Password"), "correct");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(screen.getByTestId("home")).toBeTruthy());
    const loginCall = fetchMock.mock.calls.find(([url]) => String(url).endsWith("/auth/login"));
    expect(loginCall?.[1]?.body).toContain("viewer@test.local");
  });

  it("redirects to the app when already signed in", async () => {
    stubFetch({ me: viewer });
    renderLoginApp();
    await waitFor(() => expect(screen.getByTestId("home")).toBeTruthy());
  });
});

describe("RoleGate", () => {
  function renderWithUser(me: SessionUser | null, ui: React.ReactNode) {
    stubFetch({ me });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  }

  it("hides admin actions from editors, shows editor actions", async () => {
    renderWithUser(
      { ...viewer, role: "editor" },
      <>
        <RoleGate minRole="editor">
          <button>Edit document</button>
        </RoleGate>
        <RoleGate minRole="admin">
          <button>Run sync</button>
        </RoleGate>
      </>
    );

    expect(await screen.findByRole("button", { name: "Edit document" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Run sync" })).toBeNull();
  });

  it("hides everything gated from anonymous visitors", async () => {
    renderWithUser(
      null,
      <RoleGate minRole="viewer">
        <span>secret</span>
      </RoleGate>
    );
    await waitFor(() => expect(screen.queryByText("secret")).toBeNull());
  });
});
