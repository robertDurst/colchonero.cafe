import { describe, it, expect } from "vitest";
import { buildMonths, typeKey, fmtEventDate, type CalEvent } from "../calendar";

// Build a CalEvent from a compact tuple, so the grid tests read like the old
// CSV rows without depending on a parser.
const ev = (date: string, time = "", title = "", location = "", type = "Liga"): CalEvent => ({
  date,
  time,
  title,
  location,
  type,
});

describe("typeKey", () => {
  it("maps known competitions case-insensitively, otherwise 'otro'", () => {
    expect(typeKey("Liga")).toBe("liga");
    expect(typeKey("UEFA Champions League")).toBe("champions");
    expect(typeKey("Copa del Rey")).toBe("copa");
    expect(typeKey("Amistoso")).toBe("amistoso");
    expect(typeKey("Mundial")).toBe("mundial");
    expect(typeKey("Copa del Mundo")).toBe("mundial"); // mundial wins over copa
    expect(typeKey("Presentación")).toBe("otro");
  });
});

describe("buildMonths", () => {
  it("groups by month with Monday-first padding", () => {
    // 2026-08-01 is a Saturday -> 5 leading pad cells (Mon..Fri).
    const months = buildMonths([ev("2026-08-16", "21:00", "A")]);
    expect(months).toHaveLength(1);
    const m = months[0];
    expect(m.label).toBe("agosto 2026");
    expect(m.weeks[0].slice(0, 5).every((c) => c.day === null)).toBe(true);
    expect(m.weeks[0][5].day).toBe(1);
    // The event lands on its day cell.
    const dayWithEvent = m.weeks.flat().find((c) => c.day === 16);
    expect(dayWithEvent?.events).toHaveLength(1);
  });

  it("fills every month between the first and last event, inclusive", () => {
    const events = [ev("2026-12-01", "", "A"), ev("2026-08-16", "", "B")];
    expect(buildMonths(events).map((m) => m.label)).toEqual([
      "agosto 2026",
      "septiembre 2026",
      "octubre 2026",
      "noviembre 2026",
      "diciembre 2026",
    ]);
  });

  it("spans across a year boundary", () => {
    const events = [ev("2026-11-10", "", "A"), ev("2027-02-02", "", "B")];
    expect(buildMonths(events).map((m) => m.label)).toEqual([
      "noviembre 2026",
      "diciembre 2026",
      "enero 2027",
      "febrero 2027",
    ]);
  });
});

describe("fmtEventDate", () => {
  it("formats with Spanish weekday and short month", () => {
    expect(fmtEventDate("2026-08-16")).toBe("dom 16 ago");
  });
});
