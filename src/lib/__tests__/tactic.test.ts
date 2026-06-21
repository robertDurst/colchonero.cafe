import { describe, it, expect } from "vitest";
import { renderTactic } from "../tactic/renderer";

describe("renderTactic", () => {
  it("returns an svg element", () => {
    const svg = renderTactic("title: Test\n");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("renders home players as circles with labels", () => {
    const svg = renderTactic(`
home:
  - { pos: cf, label: "9" }
`);
    expect(svg).toContain("<circle");
    expect(svg).toContain(">9<");
  });

  it("renders away players with away fill color", () => {
    const svg = renderTactic(`
away:
  - { pos: opp-gk, label: GK }
`);
    expect(svg).toContain("#1a3a6b");
  });

  it("clips to half pitch via viewBox", () => {
    const svg = renderTactic("pitch: half\n");
    expect(svg).toContain('viewBox="378 0 442 518"');
  });

  it("uses dark theme pitch fill", () => {
    const svg = renderTactic("theme: dark\n");
    expect(svg).toContain("#162616");
  });

  it("GK position renders as square", () => {
    const svg = renderTactic(`
home:
  - { pos: gk, label: 1 }
`);
    expect(svg).toContain("<rect");
  });

  it("renders player name with a pill background", () => {
    const svg = renderTactic(`
home:
  - { pos: cf, label: 9, name: "Morata" }
`);
    expect(svg).toContain("Morata");
    expect(svg).toContain("#0b1b3f");
  });

  it("sets svg title for accessibility", () => {
    const svg = renderTactic('title: "Mi táctica"\n');
    expect(svg).toContain("<title>Mi táctica</title>");
  });

  it("skips players with unknown zone positions gracefully", () => {
    expect(() =>
      renderTactic(`
home:
  - { pos: not-a-real-zone, label: 1 }
`),
    ).not.toThrow();
  });

  it("returns error div on invalid yaml", () => {
    const out = renderTactic("home: [unclosed");
    expect(out).toContain("tactic-error");
  });
});
