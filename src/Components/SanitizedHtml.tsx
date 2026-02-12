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
}

/**
 * Renders an HTML string after sanitizing it with DOMPurify.
 *
 * Use this component for Sefaria API fields that contain embedded HTML
 * (e.g. `notes`, `derivatives`, `language_reference`, `definition`).
 */
export function SanitizedHtml({
	html,
	as: Tag = "span",
	style,
	className,
}: SanitizedHtmlProps) {
	const clean = DOMPurify.sanitize(html, PURIFY_CONFIG);

	// Spread pattern: DOMPurify.sanitize strips dangerous tags/attributes before rendering
	const innerHtmlProp = { dangerouslySetInnerHTML: { __html: clean } };

	return <Tag {...innerHtmlProp} style={style} className={className} />;
}
