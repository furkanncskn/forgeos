import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { ApiRequestError, postLogin } from "../lib/api.js";
import { useAuth, useInvalidateAuth } from "../lib/auth.js";

/** Email/password sign-in. Sessions are httpOnly cookies set by the API. */
export function LoginPage() {
  const navigate = useNavigate();
  const invalidateAuth = useInvalidateAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: async () => {
      await invalidateAuth();
      await navigate({ to: "/" });
    }
  });

  // Already signed in (e.g. opened /login directly) — go home.
  if (user) {
    void navigate({ to: "/" });
    return null;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!loginMutation.isPending) {
      loginMutation.mutate({ email, password });
    }
  };

  const errorMessage = loginMutation.isError
    ? loginMutation.error instanceof ApiRequestError && loginMutation.error.status === 401
      ? "Invalid email or password."
      : `Sign-in failed: ${loginMutation.error.message}`
    : null;

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit} aria-label="Sign in">
        <h1 className="login-title">ForgeOS</h1>
        <p className="subtitle">Sign in to the Enterprise Operating System</p>

        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="input"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {errorMessage && (
          <p className="login-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button className="button button-primary" type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
