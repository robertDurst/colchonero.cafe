import { describe, it, expect } from "vitest";
import { parseEvents, buildMonths, typeKey, fmtEventDate } from "../calendar";

describe("parseEvents", () => {
  it("skips comments, blanks, and the header row", () => {
    const csv = [
      "# a comment",
      "",
      "date,time,title,location,type",
      "2026-08-16,21:00,Atleti vs Rival,Metropolitano,Liga",
    ].join("\n");
    expect(parseEvents(csv)).toEqual([
      { date: "2026-08-16", time: "21:00", title: "Atleti vs Rival", location: "Metropolitano", type: "Liga" },
    ]);
  });

  it("honours quoted fields containing commas", () => {
    const csv = 'date,time,title,location,type\n2026-09-01,,"Atleti vs Sevilla, jornada 1",Casa,Liga';
    expect(parseEvents(csv)[0].title).toBe("Atleti vs Sevilla, jornada 1");
  });

  it("sorts by date then time", () => {
    const csv = [
      "2026-09-01,20:00,B,,Liga",
      "2026-08-16,21:00,A,,Liga",
      "2026-08-16,18:00,Z,,Copa",
    ].join("\n");
    expect(parseEvents(csv).map((e) => e.title)).toEqual(["Z", "A", "B"]);
  });

  it("drops rows without a valid date", () => {
    expect(parseEvents("not-a-date,,x,,Liga\n2026/08/16,,y,,Liga")).toEqual([]);
  });
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
    const months = buildMonths(parseEvents("2026-08-16,21:00,A,,Liga"));
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
    const csv = "2026-12-01,,A,,Liga\n2026-08-16,,B,,Liga";
    expect(buildMonths(parseEvents(csv)).map((m) => m.label)).toEqual([
      "agosto 2026",
      "septiembre 2026",
      "octubre 2026",
      "noviembre 2026",
      "diciembre 2026",
    ]);
  });

  it("spans across a year boundary", () => {
    const csv = "2026-11-10,,A,,Liga\n2027-02-02,,B,,Liga";
    expect(buildMonths(parseEvents(csv)).map((m) => m.label)).toEqual([
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
