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

interface SanitizedHtmlProps {
	/** The raw HTML string to sanitize and render */
	html: string;
	/** The wrapper element tag (defaults to "span") */
	as?: keyof React.JSX.IntrinsicElements;
	/** Optional inline styles for the wrapper element */
	style?: React.CSSProperties;
	/** Optional CSS class name for the wrapper element */
	className?: string;
	/** Whether to replace relative links with links to sefaria */
	replaceLinks: boolean;
}

/**
 * Renders an HTML string after sanitizing it with DOMPurify.
 *
 * Use this component for fields that contain embedded HTML
 * (e.g. `notes`, `derivatives`, `language_reference`, `definition`).
 */
export function SanitizedHtml({
	html,
	as: Tag = "span",
	style,
	className,
	replaceLinks,
}: SanitizedHtmlProps) {
	const clean = DOMPurify.sanitize(html, PURIFY_CONFIG);

	// Spread pattern: DOMPurify.sanitize strips dangerous tags/attributes before rendering
	const innerHtmlProp = {
		dangerouslySetInnerHTML: {
			__html: replaceLinks ? replaceHTMLLinks(clean) : clean,
		},
	};

	return <Tag {...innerHtmlProp} style={style} className={className} />;
}

function replaceHTMLLinks(html: string): string {
	// Replace href attributes in <a> tags with absolute Sefaria URLs
	return html.replace(
		/<a\s+([^>]*?\s+)?href="([^"]+)"/g,
		// match: the entire <a> tag, beforeHref: any attributes before href, href: the URL in the href attribute
		(match, beforeHref, href) => {
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
