import { describe, it, expect } from "vitest";
import { normalizeEvents } from "../events";

describe("normalizeEvents", () => {
  it("keeps well-formed rows and coerces every field to a string", () => {
    expect(
      normalizeEvents([
        { date: "2026-08-16", time: "21:00", title: "Atleti vs Rival", location: "Metropolitano", type: "Liga" },
      ]),
    ).toEqual([
      { date: "2026-08-16", time: "21:00", title: "Atleti vs Rival", location: "Metropolitano", type: "Liga" },
    ]);
  });

  it("fills missing fields with empty strings", () => {
    expect(normalizeEvents([{ date: "2026-09-01", type: "Liga" }])).toEqual([
      { date: "2026-09-01", time: "", title: "", location: "", type: "Liga" },
    ]);
  });

  it("sorts by date then time", () => {
    const out = normalizeEvents([
      { date: "2026-09-01", time: "20:00", title: "B" },
      { date: "2026-08-16", time: "21:00", title: "A" },
      { date: "2026-08-16", time: "18:00", title: "Z" },
    ]);
    expect(out.map((e) => e.title)).toEqual(["Z", "A", "B"]);
  });

  it("drops rows without a valid YYYY-MM-DD date", () => {
    expect(normalizeEvents([
      { date: "not-a-date", title: "x" },
      { date: "2026/08/16", title: "y" },
      { title: "z" },
    ])).toEqual([]);
  });

  it("returns [] for non-array payloads", () => {
    expect(normalizeEvents(null)).toEqual([]);
    expect(normalizeEvents({ oops: true })).toEqual([]);
    expect(normalizeEvents("nope")).toEqual([]);
  });
});
