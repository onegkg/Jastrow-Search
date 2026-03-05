import DOMPurify, { type Config } from "dompurify";

/**
 * Allowed HTML tags and attributes for Sefaria API content.
 * This permits basic formatting and links while stripping
 * dangerous elements like <script>, <iframe>, event handlers, etc.
 */
const PURIFY_CONFIG: Config = {
	ALLOWED_TAGS: [
		"a",
		"em",
		"i",
		"b",
		"strong",
		"span",
		"sup",
		"sub",
		"br",
		"div",
	],
	ALLOWED_ATTR: ["href", "dir", "class", "data-ref", "style"],
};

/** A plain sub-section break — examples, citations, cross-refs, etc. */
export interface SubSection {
	kind: "subsection";
	html: string;
}

/**
 * An inline numbered definition, e.g. the `2) definition text...` that
 * follows a `—` in a Jastrow blob. The number label is separated out so
 * it can be styled like a top-level sense number.
 */
export interface InlineDefinition {
	kind: "definition";
	/** The number label as it appeared in the source, e.g. `"2)"` */
	label: string;
	html: string;
}

export type Segment = SubSection | InlineDefinition;

/**
 * Matches the start of an inline numbered definition immediately after an
 * em-dash, e.g. `2) ` or `2a) `. We accept digits optionally followed by a
 * single lowercase letter, then a closing parenthesis.
 */
const INLINE_DEF_RE = /^(\d+[a-z]?\))\s*/;

/** Sanitize raw HTML and optionally rewrite relative links. */
export function sanitizeAndLink(html: string, replaceLinks: boolean): string {
	const clean = DOMPurify.sanitize(html, PURIFY_CONFIG);
	return replaceLinks ? replaceHTMLLinks(clean) : clean;
}

/**
 * Splits an HTML string on em-dash characters (—) while avoiding splits
 * inside HTML tags. Each split point is classified as either a plain
 * sub-section break or the start of a new inline numbered definition.
 */
export function splitOnEmDashes(html: string): Segment[] {
	// Collect the raw text chunks between em-dashes, staying out of tags.
	const rawChunks: string[] = [];
	let current = "";
	let insideTag = false;

	for (let i = 0; i < html.length; i++) {
		const ch = html[i];

		if (ch === "<") {
			insideTag = true;
			current += ch;
		} else if (ch === ">") {
			insideTag = false;
			current += ch;
		} else if (!insideTag && ch === "—") {
			rawChunks.push(current.trimEnd());
			current = "";
			// Skip a single space that typically follows the em-dash.
			if (html[i + 1] === " ") {
				i++;
			}
		} else {
			current += ch;
		}
	}
	rawChunks.push(current.trimEnd());

	// Classify each chunk and drop empties.
	return rawChunks
		.filter((chunk) => chunk.length > 0)
		.map((chunk, i): Segment => {
			// The very first chunk is never preceded by an em-dash.
			if (i === 0) {
				return { kind: "subsection", html: chunk };
			}

			const match = INLINE_DEF_RE.exec(chunk);
			if (match) {
				return {
					kind: "definition",
					label: match[1] ? match[1] : "?)",
					// Strip the label from the rendered html — we render it separately.
					html: chunk.slice(match[0].length),
				};
			}

			return { kind: "subsection", html: chunk };
		});
}

function replaceHTMLLinks(html: string): string {
	// Replace href attributes in <a> tags with absolute Sefaria URLs
	return html.replace(
		/<a\s+([^>]*?\s+)?href="([^"]+)"/g,
		(match, _beforeHref, href) => {
			// If the href is already an absolute URL, leave it as is
			if (/^https?:\/\//.test(href)) {
				return match;
			}
			// Otherwise, prepend "https://www.sefaria.org"
			const newHref = `https://www.sefaria.org${href}`;
			return match.replace(`href="${href}"`, `href="${newHref}"`);
		},
	);
}
