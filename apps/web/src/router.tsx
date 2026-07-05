import { useMutation } from "@tanstack/react-query";
import {
  Link,
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate
} from "@tanstack/react-router";

import { docTypeSchema, type DocType } from "@forgeos/types";

import { CommandPalette } from "./components/CommandPalette.js";
import { postLogout } from "./lib/api.js";
import { useAuth, useInvalidateAuth } from "./lib/auth.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { DocumentPage } from "./pages/DocumentPage.js";
import { ExplorerPage, type ExplorerSearch } from "./pages/ExplorerPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { SearchPage, type SearchPageSearch } from "./pages/SearchPage.js";

/**
 * Authenticated chrome. Everything except /login renders inside this guard:
 * anonymous visitors are redirected to the login page.
 */
function AuthedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="empty-state login-wrap">Checking session…</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="shell">
      <header className="header">
        <div className="header-brand">
          <h1>
            <Link to="/" className="brand-link">
              ForgeOS
            </Link>
          </h1>
          <p className="subtitle">Enterprise Operating System</p>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link" activeOptions={{ exact: true }}>
            Dashboard
          </Link>
          <Link to="/explorer" className="nav-link">
            Explorer
          </Link>
          <Link to="/search" className="nav-link">
            Search
          </Link>
          <button
            type="button"
            className="button button-small kbd-hint"
            title="Open the command palette"
            onClick={() =>
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))
            }
          >
            ⌘K
          </button>
          <UserChip name={user.name} role={user.role} />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">Phase 3 — Knowledge Search · ADR-0001 / ADR-0002 / ADR-0003</footer>
      <CommandPalette />
    </div>
  );
}

function UserChip({ name, role }: { name: string; role: string }) {
  const navigate = useNavigate();
  const invalidateAuth = useInvalidateAuth();
  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSettled: async () => {
      await invalidateAuth();
      await navigate({ to: "/login" });
    }
  });

  return (
    <span className="user-chip">
      <span className="user-name" title={`Signed in as ${name}`}>
        {name}
      </span>
      <span className="chip chip-role">{role}</span>
      <button
        type="button"
        className="button button-small"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        Sign out
      </button>
    </span>
  );
}

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: () => (
    <div className="empty-state">
      <h2>Page not found</h2>
      <Link to="/explorer">Go to the Document Explorer</Link>
    </div>
  )
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage
});

/** Pathless layout route: all app pages require a session. */
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AuthedLayout
});

const indexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: DashboardPage
});

const explorerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/explorer",
  component: ExplorerPage,
  // Filters live in the URL so views are shareable/bookmarkable.
  validateSearch: (search: Record<string, unknown>): ExplorerSearch => {
    const type = docTypeSchema.safeParse(search.type);
    const page = Number(search.page);
    return {
      type: type.success ? type.data : undefined,
      q: typeof search.q === "string" && search.q !== "" ? search.q : undefined,
      page: Number.isInteger(page) && page > 1 ? page : undefined
    };
  }
});

const documentRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/explorer/$slug",
  component: DocumentPage
});

const searchRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/search",
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): SearchPageSearch => {
    const list = (value: unknown): string[] | undefined => {
      const arr = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
      const cleaned = arr.filter((v): v is string => typeof v === "string" && v !== "");
      return cleaned.length > 0 ? cleaned : undefined;
    };
    const page = Number(search.page);
    return {
      q: typeof search.q === "string" && search.q !== "" ? search.q : undefined,
      type: list(search.type)?.filter((t): t is DocType => docTypeSchema.safeParse(t).success),
      status: list(search.status),
      tag: list(search.tag),
      page: Number.isInteger(page) && page > 1 ? page : undefined
    };
  }
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([indexRoute, explorerRoute, documentRoute, searchRoute])
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
