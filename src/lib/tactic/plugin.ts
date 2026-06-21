import { visit } from 'unist-util-visit';
import { renderTactic } from './renderer.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;

export function remarkTactic() {
  return (tree: AnyNode) => {
    visit(tree, 'code', (node: AnyNode, index: number, parent: AnyNode) => {
      if (node.lang !== 'tactic') return;
      const svg = renderTactic(node.value as string);
      const note = extractNote(node.value as string);
      const caption = note ? `<figcaption>${escHtml(note)}</figcaption>` : '';
      parent.children[index] = {
        type: 'html',
        value: `<figure class="tactic-diagram">${svg}${caption}</figure>`,
      };
    });

    // Wrap image paragraphs in <figure><figcaption>. Walk backwards so splice
    // indices stay valid after each insertion.
    const kids: AnyNode[] = tree.children;
    for (let i = kids.length - 1; i >= 0; i--) {
      const child = kids[i];
      if (child.type !== 'paragraph' || child.children?.[0]?.type !== 'image') continue;
      const img = child.children[0];
      const src = escAttr(String(img.url ?? ''));
      const alt = String(img.alt ?? '');
      const caption = alt ? `<figcaption>${escHtml(alt)}</figcaption>` : '';
      const figure: AnyNode = {
        type: 'html',
        value: `<figure class="post-image"><img src="${src}" alt="${escAttr(alt)}"/>${caption}</figure>`,
      };
      if (child.children.length === 1) {
        kids.splice(i, 1, figure);
      } else {
        kids.splice(i, 1, figure, { ...child, children: child.children.slice(1) });
      }
    }
  };
}

function extractNote(yaml: string): string {
  const m = yaml.match(/^note:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : '';
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
