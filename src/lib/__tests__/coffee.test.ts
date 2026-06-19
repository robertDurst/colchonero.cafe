import { describe, it, expect } from "vitest";
import { classify, wordCount, fmtDate, displayTitle } from "../coffee";

describe("classify", () => {
  it("espresso under 120 words, fixed ~30 s label", () => {
    expect(classify(80)).toMatchObject({ label: "espresso", read: "~30 s", cupPx: 22 });
  });
  it("cortado from 120 to 399 words", () => {
    expect(classify(200)).toMatchObject({ label: "cortado", read: "~1 min", cupPx: 28 });
  });
  it("cappuccino from 400 to 899 words", () => {
    expect(classify(500)).toMatchObject({ label: "cappuccino", read: "~3 min", cupPx: 34 });
  });
  it("café con leche at 900+ words", () => {
    expect(classify(1000)).toMatchObject({ label: "café con leche", cupPx: 42 });
  });
});

describe("wordCount", () => {
  it("counts unicode words and splits numbers on punctuation", () => {
    // Hola, Atleti, 3, 0  ->  4 tokens (matches Python's \w+)
    expect(wordCount("¡Hola, Atleti! 3–0")).toBe(4);
  });
});

describe("fmtDate / displayTitle", () => {
  it("formats ISO date in Spanish, no leading zero on day", () => {
    expect(fmtDate("2026-06-15")).toBe("15 jun 2026");
  });
  it("prefixes the title with the date", () => {
    expect(displayTitle("Hola y bienvenido", "2026-06-15")).toBe("15 jun 2026 · Hola y bienvenido");
  });
});
