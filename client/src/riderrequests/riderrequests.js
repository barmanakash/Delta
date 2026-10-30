import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Shared data layer for the rider's "Lift Requests" screens (home, request
 * list, request details, confirm, match confirmed).
 *
 * Everything those screens show about lift takers comes from the server
 * through the hooks below, so they all agree with each other.
 */

export const API_BASE_URL = "http://localhost:8000";

// How often the rider's request list refreshes by itself (milliseconds)
const INCOMING_POLL_MS = 5000;

/* ------------------------------------------------------------------ */
/*  Requests                                                           */
/* ------------------------------------------------------------------ */

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const toAbsoluteUrl = (path) =>
  path ? (path.startsWith("http") ? path : `${API_BASE_URL}${path}`) : null;

export function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}

/** fetch + JSON, never throws on HTTP errors. Resolves { ok, status, data }. */
export async function apiRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...authHeaders(),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

/** A readable message from a FastAPI error body. */
export function errorText(data, fallback) {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    const joined = data.detail
      .map((e) => String(e.msg || "").replace(/^Value error, /, ""))
      .filter(Boolean)
      .join(". ");
    return joined || fallback;
  }
  return fallback;
}

export async function acceptRequest(requestId) {
  try {
    const { ok, data } = await apiRequest(`/api/rides/requests/${requestId}/accept`, {
      method: "POST",
    });
    return ok
      ? { ok: true, request: data }
      : { ok: false, message: errorText(data, "Couldn't accept this request.") };
  } catch {
    return { ok: false, message: "Unable to connect to server." };
  }
}

export async function declineRequest(requestId) {
  try {
    const { ok, data } = await apiRequest(`/api/rides/requests/${requestId}/decline`, {
      method: "POST",
    });
    return ok
      ? { ok: true }
      : { ok: false, message: errorText(data, "Couldn't decline this request.") };
  } catch {
    return { ok: false, message: "Unable to connect to server." };
  }
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** The signed-in user, from the copy the login flow keeps. No network call. */
export function useCachedUser() {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);
}

// Shared by the hooks: turn an HTTP outcome into "go elsewhere" or an error
function useGuard() {
  const navigate = useNavigate();
  return useCallback(
    (status) => {
      if (status === 401) {
        clearSession();
        navigate("/signin", { replace: true });
        return true;
      }
      if (status === 403) {
        navigate("/lifttakerhome", { replace: true }); // lift takers have no rider screens
        return true;
      }
      return false;
    },
    [navigate]
  );
}

/**
 * All lift requests that fit the rider's commutes (newest data from the
 * server): pending ones first, then ones the rider already accepted.
 */
export function useIncomingRequests() {
  const navigate = useNavigate();
  const guard = useGuard();
  const [state, setState] = useState({
    loading: true,
    error: "",
    requests: [],
    pendingCount: 0,
    acceptedCount: 0,
    earnings: 0,
  });

  // `silent` = a background refresh: no error banner if it fails, the list on
  // screen just stays as it was
  const fetchRequests = useCallback(
    async (silent) => {
      if (!localStorage.getItem("access_token")) {
        navigate("/signin");
        return;
      }
      try {
        const { ok, status, data } = await apiRequest("/api/rides/requests/incoming");
        if (guard(status)) return;
        if (!ok) {
          if (!silent) {
            setState((s) => ({
              ...s,
              loading: false,
              error: errorText(data, "Couldn't load your lift requests."),
            }));
          }
          return;
        }
        setState({
          loading: false,
          error: "",
          requests: data.requests,
          pendingCount: data.pending_count,
          acceptedCount: data.accepted_count,
          earnings: data.earnings,
        });
      } catch {
        if (!silent) {
          setState((s) => ({
            ...s,
            loading: false,
            error: "Unable to connect to server. Please make sure the backend is running.",
          }));
        }
      }
    },
    [navigate, guard]
  );

  // Same name and no-argument shape as before, so existing screens keep working
  const load = useCallback(() => fetchRequests(false), [fetchRequests]);

  useEffect(() => {
    fetchRequests(false);

    // New lift requests show up on their own: refresh every few seconds while the
    // tab is open, and straight away when the rider comes back to the tab
    const timer = setInterval(() => {
      if (!document.hidden) fetchRequests(true);
    }, INCOMING_POLL_MS);
    const onVisible = () => {
      if (!document.hidden) fetchRequests(true);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchRequests]);

  return { ...state, reload: load };
}

/** One request by id (pending, or accepted by this rider). */
export function useIncomingRequest(requestId) {
  const navigate = useNavigate();
  const guard = useGuard();
  const [state, setState] = useState({
    loading: true,
    error: "",
    notFound: false,
    request: null,
  });

  const load = useCallback(async () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/signin");
      return;
    }
    if (!requestId) {
      setState({ loading: false, error: "", notFound: true, request: null });
      return;
    }
    try {
      const { ok, status, data } = await apiRequest(`/api/rides/requests/${requestId}`);
      if (guard(status)) return;
      if (status === 404) {
        setState({ loading: false, error: "", notFound: true, request: null });
        return;
      }
      if (!ok) {
        setState({
          loading: false,
          error: errorText(data, "Couldn't load this request."),
          notFound: false,
          request: null,
        });
        return;
      }
      setState({ loading: false, error: "", notFound: false, request: data });
    } catch {
      setState({
        loading: false,
        error: "Unable to connect to server. Please make sure the backend is running.",
        notFound: false,
        request: null,
      });
    }
  }, [navigate, guard, requestId]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, setRequest: (request) => setState((s) => ({ ...s, request })), reload: load };
}

/** The rider's active commute (null when they haven't created one). */
export function useActiveCommute() {
  const [commute, setCommute] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/rides/commutes/active")
      .then(({ ok, data }) => {
        if (!cancelled && ok) setCommute(data);
      })
      .catch(() => {
        // offline: callers fall back to their empty state
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return commute;
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

/** "18:30" -> "6:30 PM" */
export function formatClock(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/** "2026-10-05" -> "Today" / "Tomorrow" / "6 Oct" */
export function formatDayLabel(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const day = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((day - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return day.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** 14 -> "14 mins", 135 -> "2 h 15 min" */
export function formatExpiry(mins) {
  if (mins >= 60) return `${Math.floor(mins / 60)} h ${mins % 60} min`;
  return `${mins} min${mins === 1 ? "" : "s"}`;
}

export function initialsOf(name) {
  return (
    (name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("") || "?"
  );
}

export function genderLabel(gender) {
  return gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "";
}
