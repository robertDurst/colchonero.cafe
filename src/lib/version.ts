import { execSync } from "node:child_process";
import { fmtDate } from "./coffee";

export interface BuildVersion {
  sha: string;
  date: string; // "18 jun 2026", or "" if unavailable
}

function git(args: string): string | null {
  try {
    return (
      execSync(`git ${args}`, { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim() || null
    );
  } catch {
    return null;
  }
}

// Resolved at build time and baked into the HTML — no client JS, no runtime cost.
// Falls back to Vercel's git env var when the .git dir isn't present in CI.
export function buildVersion(): BuildVersion | null {
  const sha =
    git("rev-parse --short HEAD") ??
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
    null;
  if (!sha) return null;
  const iso = git("log -1 --format=%cd --date=short");
  return { sha, date: iso ? fmtDate(iso) : "" };
}
