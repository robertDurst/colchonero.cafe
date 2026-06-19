import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";

// html + typographer ≈ the original markdown2 (tables + smart quotes/dashes).
const parser = new MarkdownIt({ html: true, typographer: true });

export async function GET(context: APIContext) {
  const posts = (await getCollection("carta")).sort((a, b) =>
    a.data.date < b.data.date ? 1 : -1,
  );

  return rss({
    title: "Colchonero Café",
    description:
      "Blog rojiblanco para fanáticos del Atleti. Fútbol, café y orgullo colchonero.",
    site: context.site ?? "https://colchonero.cafe",
    customData: "<language>es</language>",
    items: posts.map((p) => ({
      title: p.data.title,
      link: `/${p.slug}`,
      pubDate: new Date(`${p.data.date}T00:00:00Z`),
      content: parser.render(p.body),
    })),
  });
}
