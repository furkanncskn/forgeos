import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { postSyncRun } from "../lib/api.js";
import { RoleGate } from "../lib/auth.js";

/** MVP modules and the phase in which each one lands (ADR-0001, §6). */
const MODULES = [
  {
    name: "Document Explorer",
    description: "Browse every /docs document with metadata and relationships",
    phase: "Phase 2",
    live: true
  },
  { name: "Knowledge Search", description: "Full-text search across all documents", phase: "Phase 3" },
  { name: "Agent Registry", description: "AI agent definitions and capabilities", phase: "Phase 4" },
  { name: "Prompt Library", description: "Reusable prompts with variables", phase: "Phase 4" },
  { name: "Workflow Viewer", description: "Interactive workflow graphs", phase: "Phase 4" },
  { name: "Admin Panel", description: "Users, sync and audit log", phase: "Phase 5" }
];

export function DashboardPage() {
  return (
    <>
      <h2>Modules</h2>
      <div className="grid">
        {MODULES.map((mod) => (
          <div className="card" key={mod.name}>
            <div className="card-title">
              {mod.live ? (
                <Link to="/explorer" className="card-link">
                  {mod.name}
                </Link>
              ) : (
                mod.name
              )}
            </div>
            <div className="card-desc">{mod.description}</div>
            <span className={mod.live ? "badge badge-ok" : "badge badge-muted"}>
              {mod.live ? "Live" : mod.phase}
            </span>
          </div>
        ))}
      </div>

      {/* Admin-only action — hidden entirely for editors and viewers. */}
      <RoleGate minRole="admin">
        <SyncCard />
      </RoleGate>
    </>
  );
}

function SyncCard() {
  const queryClient = useQueryClient();
  const syncMutation = useMutation({
    mutationFn: postSyncRun,
    onSuccess: async () => {
      // Fresh documents after a sync.
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["document"] });
    }
  });

  return (
    <section className="panel sync-card">
      <h3>Administration</h3>
      <p className="muted">
        Re-index <code>/docs</code> into the database. The filesystem stays the source of truth.
      </p>
      <button
        type="button"
        className="button button-primary"
        onClick={() => syncMutation.mutate()}
        disabled={syncMutation.isPending}
      >
        {syncMutation.isPending ? "Syncing…" : "Run /docs sync"}
      </button>
      {syncMutation.isSuccess && (
        <p className="muted sync-result">
          Sync {syncMutation.data.status}: {syncMutation.data.filesSeen} seen,{" "}
          {syncMutation.data.filesChanged} changed, {syncMutation.data.filesUnchanged} unchanged,{" "}
          {syncMutation.data.filesInvalid} invalid.
        </p>
      )}
      {syncMutation.isError && (
        <p className="login-error">Sync failed: {syncMutation.error.message}</p>
      )}
    </section>
  );
}
