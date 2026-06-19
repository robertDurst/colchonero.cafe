# Colchonero Café

Blog rojiblanco en español para fanáticos del Atlético de Madrid. Café, fútbol y orgullo colchonero.

Web no oficial. En vivo en https://colchonero.cafe

Migrado de un generador estático en Python a **Astro**, manteniendo el diseño original
(La Carta como carta de café, glifo de taza por tamaño, vaso que se vacía al leer).

## Correr

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # check + test + astro build
```

Node 20+.

## Rutas

`/` (inicio) · `/carta` (La Carta) · `/recursos` · `/<slug>` (cada post) · `/feed.xml` (RSS)

## Escribir un post

Crea `src/content/carta/<slug>.md`:

```yaml
---
title: "Título"
date: 2026-06-18
---
Cuerpo en Markdown.
```

El "tamaño de café" (espresso → cortado → cappuccino → café con leche), el tiempo de
lectura y el tamaño del glifo de taza se calculan solos a partir del número de palabras
(`src/lib/coffee.ts`). El feed RSS y La Carta se regeneran en cada build.
