import type { Segment } from "../api/definitionUtils";
import { sanitizeAndLink, splitOnEmDashes } from "../api/definitionUtils";

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
	/**
	 * Whether to split on em-dashes and render each segment as a visually
	 * grouped sub-section. When false the raw HTML is rendered as-is.
	 */
	replaceEmDashes?: boolean;
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
	replaceLinks = true,
	replaceEmDashes = true,
}: SanitizedHtmlProps) {
	const linked = sanitizeAndLink(html, replaceLinks);

	if (!replaceEmDashes) {
		return (
			<Tag
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized above
				dangerouslySetInnerHTML={{ __html: linked }}
				style={style}
				className={className}
			/>
		);
	}

	const segments = splitOnEmDashes(linked);

	if (segments.length === 1) {
		return (
			<Tag
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized above
				dangerouslySetInnerHTML={{ __html: segments[0]?.html ?? "" }}
				style={style}
				className={className}
			/>
		);
	}

	return (
		<Tag style={style} className={className}>
			{segments.map((segment, i) => (
				<EmDashSegment
					key={`seg-${
						// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
						i
					}`}
					segment={segment}
					isFirst={i === 0}
				/>
			))}
		</Tag>
	);
}

// ---------------------------------------------------------------------------
// Internal rendering components
// ---------------------------------------------------------------------------

interface EmDashSegmentProps {
	segment: Segment;
	isFirst: boolean;
}

function EmDashSegment({ segment, isFirst }: EmDashSegmentProps) {
	if (isFirst) {
		return (
			<span
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by caller
				dangerouslySetInnerHTML={{ __html: segment.html }}
			/>
		);
	}

	if (segment.kind === "definition") {
		return (
			<span
				style={{
					display: "block",
					paddingLeft: "0.75rem",
					marginTop: "0.75rem",
					borderLeft: "3px solid #4a5a8a",
				}}
			>
				<strong style={{ fontSize: "1.05em", color: "#d0d8f0" }}>
					{segment.label}{" "}
				</strong>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by caller */}
				<span dangerouslySetInnerHTML={{ __html: segment.html }} />
			</span>
		);
	}

	// Plain sub-section: indented, muted, thinner rail.
	return (
		<span
			style={{
				display: "block",
				paddingLeft: "1.25rem",
				marginTop: "0.3rem",
				borderLeft: "2px solid #3a3a4a",
				color: "#b0b8c8",
				fontSize: "0.93em",
			}}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by caller
			dangerouslySetInnerHTML={{ __html: segment.html }}
		/>
	);
}
