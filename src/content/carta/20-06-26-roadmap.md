---
title: "Roadmap"
date: 2026-06-20
---

Otro día sin partidos —bueno, obviamente hay cuatro y algunos son muy interesantes—, así que, mientras escucho los partidos de fondo, voy a planear el roadmap de este sitio.

## Filosofía y meta

No quiero ser «el mejor sitio de aficionados del Atleti». Si algunas personas siguen mi sitio, genial, pero no es mi objetivo principal. Como dije en el primer post, la meta es aprender español, el deporte del fútbol, y seguir muy de cerca al Atleti.

Y, además, soy de Orlando. No puedo ir a los partidos ni soy parte de la prensa, así que las noticias de este sitio siempre serán de segunda o tercera mano.

Pero soy ingeniero de software y me encanta escribir código. Es mi pasión y puede ser mi contribución a esta comunidad.

Con este contexto, seguimos.

---

## Roadmap

### (1) La fase de descubrimiento de los datos

Primero, necesitamos crear un sistema de agregación de datos. Un warehouse. Este va a vivir detrás de un servidor en la nube. Durante un año y medio trabajé en un equipo de DevOps, así que tengo las habilidades para alojar este sistema correctamente.

Desafortunadamente, me temo que los datos están en servicios externos con cláusulas anti-scraping. No tengo patrocinadores, así que no puedo pagar por los datos. ¡Necesito ser creativo!

Algún día esto puede cambiar, pero por ahora no puedo pagar dinero extra, al menos por los datos.

No es un detalle importante, pero me gustan mucho los lenguajes de programación y esta elección es interesante. Creo que escogeré entre [Gleam](https://gleam.run/), [Ruby](https://www.ruby-lang.org/es/), [Racket](https://racket-lang.org/) o [Rust](https://www.rust-lang.org/). Es probable que escoja [Gleam](https://gleam.run/) porque fui ponente en su primera conferencia y me encantaron la sintaxis y la comunidad. Pero un problema de Gleam (y, en realidad, de todos los lenguajes de Beam) es que son malos con las operaciones numéricas. En fin, no sé.

Pero no es importante. La idea es que la fase uno consiste en encontrar fuentes de datos y luego empezar a procesarlos.

### (2) La fase de análisis

Después de montar un warehouse, la fase de análisis sirve para desarrollar un algoritmo de análisis básico de datos. Por ejemplo, cálculos simples como un heatmap de los tiros del próximo rival del Atleti, o calcular y comprender las estadísticas de expected goals y expected assists.

En esta fase no haremos muchas cosas complicadas; más bien jugaremos con los datos para aprenderlos y entenderlos mejor.

### (3) La fase de predicción de partidos en tiempo real

En esta fase desarrollaremos un algoritmo de predicción en tiempo real para los partidos. No tengo mucha experiencia en este campo (ni en fútbol ni en computación), así que no puedo decir cómo lo haremos en concreto, pero ¡estoy emocionado!

---

No tengo muchos detalles concretos ni voy a escoger fechas específicas (porque no es mi trabajo), pero creo que tener una dirección para este sitio es importante para mí y para mis aficionados.
