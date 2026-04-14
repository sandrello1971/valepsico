import sanitizeHtml from 'sanitize-html';

/**
 * Sanifica l'HTML prodotto dal rich text editor (TipTap).
 * Whitelisting di tag e attributi sicuri per rendering di articoli.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'blockquote',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'u',
      's',
      'br',
      'hr',
      'a',
      'img',
      'figure',
      'figcaption',
      'span',
      'div',
      'code',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'class', 'style'],
      figure: ['class'],
      figcaption: ['class'],
      span: ['class', 'style'],
      div: ['class', 'style'],
      p: ['class', 'style'],
      h1: ['class'],
      h2: ['class'],
      h3: ['class'],
      h4: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/, /^hsl\(/],
        'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/, /^hsl\(/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
        width: [/^\d+(?:px|%)$/, /^auto$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target || '_blank',
        },
      }),
    },
  });
}

/**
 * Estrae testo semplice dall'HTML (per il conteggio parole nel JSON-LD).
 */
export function htmlToPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
}
