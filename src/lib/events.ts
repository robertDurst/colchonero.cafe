// Live calendar data — fetched in the browser from the libero API (the fútbol
// warehouse), which now serves the schedule that used to live in a hardcoded
// CSV. The DB is the single source of truth; there is no bundled fallback.
import type { CalEvent } from "./calendar";

// Same backend StatusDot pings. Override with PUBLIC_API_BASE for local dev.
export const API_BASE =
  (import.meta.env.PUBLIC_API_BASE as string | undefined) ?? "https://api.colchonero.cafe";

// Coerce an unknown /events payload into clean, sorted CalEvents. Mirrors the
// old CSV parser's guarantees: every row has a valid YYYY-MM-DD date, every
// field is a string, sorted by date then time.
export function normalizeEvents(data: unknown): CalEvent[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
    .map((e) => ({
      date: String(e.date ?? ""),
      time: String(e.time ?? ""),
      title: String(e.title ?? ""),
      location: String(e.location ?? ""),
      type: String(e.type ?? ""),
    }))
    .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date))
    .sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    );
}

// Fetch the live schedule. Throws on a non-2xx response or network error so
// the caller can render an error state. `cache: "no-store"` keeps it fresh.
export async function fetchEvents(signal?: AbortSignal): Promise<CalEvent[]> {
  const res = await fetch(`${API_BASE}/events`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`GET /events failed: ${res.status}`);
  return normalizeEvents(await res.json());
}
