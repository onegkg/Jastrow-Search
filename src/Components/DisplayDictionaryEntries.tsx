import {
	type InlineDefinition,
	type Segment,
	type SubSection,
	sanitizeAndLink,
	splitOnEmDashes,
} from "../api/definitionUtils";
import type {
	AltHeadword,
	DictionaryEntry,
	Sense,
	WordResponseData,
} from "../types/types";
import { SanitizedHtml } from "./SanitizedHtml";

export function DisplayDictionaryEntries({
	data,
	query,
}: {
	data: WordResponseData;
	query: string;
}) {
	// Handle empty array
	if (!Array.isArray(data) || data.length === 0) {
		return (
			<div style={{ padding: "1rem", color: "#aaa" }}>
				<p>No results found for "{query}".</p>
			</div>
		);
	}

	return (
		<div style={{ padding: "1rem", maxWidth: "900px", margin: "0 auto" }}>
			<div style={{ marginBottom: "1rem", color: "#aaa" }}>
				Found {data.length} {data.length === 1 ? "entry" : "entries"}
			</div>

			{data.map((entry, index) => (
				<DictionaryEntryCard
					key={`entry-${entry.headword || "unknown"}-${index}`}
					entry={entry}
				/>
			))}
		</div>
	);
}

// Shared styles for a numbered definition block (used by both SenseDisplay
// and inline definitions split out of a definition string).
const DEF_BLOCK_STYLE: React.CSSProperties = {
	marginLeft: "1rem",
	marginBottom: "0.75rem",
	paddingLeft: "0.75rem",
	borderLeft: "3px solid #4a5a8a",
};

const DEF_LABEL_STYLE: React.CSSProperties = {
	fontSize: "1.05em",
	color: "#d0d8f0",
};

interface DefinitionGroup {
	definition: InlineDefinition;
	subsections: SubSection[];
}

/**
 * Groups a flat list of sibling segments (which always starts with a
 * `"definition"`) into buckets where each bucket is one definition and all
 * the subsections that immediately follow it.
 */
function groupSiblingSegments(segments: Segment[]): DefinitionGroup[] {
	const groups: DefinitionGroup[] = [];
	for (const seg of segments) {
		if (seg.kind === "definition") {
			groups.push({ definition: seg, subsections: [] });
		} else {
			// Subsection — attach to the last definition group.
			groups.at(-1)?.subsections.push(seg);
		}
	}
	return groups;
}

// Helper component for displaying a single sense/definition
function SenseDisplay({ sense }: { sense: Sense }) {
	// If the definition string contains inline numbered definitions (e.g. "—2)
	// ..."), split them out so they render as siblings rather than nested inside
	// this sense's border block.
	const definitionSegments = sense.definition
		? splitOnEmDashes(sanitizeAndLink(sense.definition, true))
		: [];

	// Segments that belong inside this sense block: everything up to (but not
	// including) the first inline definition marker.
	const firstInlineDefIndex = definitionSegments.findIndex(
		(s) => s.kind === "definition",
	);
	const innerSegments =
		firstInlineDefIndex === -1
			? definitionSegments
			: definitionSegments.slice(0, firstInlineDefIndex);

	// Sibling definition blocks to render after this sense's div closes.
	const siblingSegments =
		firstInlineDefIndex === -1
			? []
			: definitionSegments.slice(firstInlineDefIndex);

	const hasNumber = Boolean(sense.number || sense.num);

	return (
		<>
			<div
				className="sense"
				style={
					hasNumber
						? DEF_BLOCK_STYLE
						: { marginLeft: "1rem", marginBottom: "0.75rem" }
				}
			>
				{sense.number && (
					<strong style={DEF_LABEL_STYLE}>{sense.number} </strong>
				)}
				{sense.pre_num && (
					<span style={{ fontStyle: "italic" }}>{sense.pre_num} </span>
				)}
				{sense.num && <strong style={DEF_LABEL_STYLE}>{sense.num} </strong>}

				{sense.grammar && (
					<span style={{ color: "#aaa", fontSize: "0.9em" }}>
						{sense.grammar.morphology && `[${sense.grammar.morphology}] `}
						{sense.grammar.verbal_stem && `(${sense.grammar.verbal_stem}) `}
						{sense.grammar.language_code && `{${sense.grammar.language_code}} `}
						{sense.grammar.binyan_form &&
							Array.isArray(sense.grammar.binyan_form) && (
								<em>{sense.grammar.binyan_form.join(", ")} </em>
							)}
					</span>
				)}

				{sense.form && <em style={{ color: "#bbb" }}>[{sense.form}] </em>}
				{sense.plural_form && (
					<em style={{ color: "#bbb" }}>[plural: {sense.plural_form}] </em>
				)}

				{/* Render only the segments that belong inside this block */}
				{innerSegments.map((seg, i) => {
					if (i === 0) {
						return (
							<span
								key="def-first"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
								dangerouslySetInnerHTML={{ __html: seg.html }}
							/>
						);
					}
					return (
						<span
							key={`def-sub-${
								// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
								i
							}`}
							style={{
								display: "block",
								paddingLeft: "1.25rem",
								marginTop: "0.3rem",
								borderLeft: "2px solid #3a3a4a",
								color: "#b0b8c8",
								fontSize: "0.93em",
							}}
							// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
							dangerouslySetInnerHTML={{ __html: seg.html }}
						/>
					);
				})}

				{sense.note && (
					<div
						style={{ marginTop: "0.25rem", fontSize: "0.9em", color: "#bbb" }}
					>
						Note:{" "}
						<SanitizedHtml
							html={sense.note}
							replaceLinks={true}
							replaceEmDashes={true}
						/>
					</div>
				)}

				{sense.notes && (
					<div
						style={{ marginTop: "0.25rem", fontSize: "0.9em", color: "#bbb" }}
					>
						<SanitizedHtml
							html={sense.notes}
							replaceLinks={true}
							replaceEmDashes={true}
						/>{" "}
					</div>
				)}

				{sense.occurences && (
					<span style={{ fontSize: "0.85em", color: "#999" }}>
						{" "}
						(occurs {sense.occurences}×)
					</span>
				)}

				{sense.all_cited && <span style={{ color: "#999" }}> †</span>}
				{sense.alternative && (
					<div style={{ fontSize: "0.9em", color: "#aaa" }}>
						Alternative: {sense.alternative}
					</div>
				)}

				{sense.language_code && (
					<span style={{ fontSize: "0.85em", color: "#999" }}>
						{" "}
						[{sense.language_code}]
					</span>
				)}

				{sense.morphology && (
					<span style={{ fontSize: "0.85em", color: "#999" }}>
						{" "}
						({sense.morphology})
					</span>
				)}

				{/* Render nested sub-senses recursively */}
				{sense.senses && sense.senses.length > 0 && (
					<div style={{ marginTop: "0.25rem" }}>
						{sense.senses.map((subSense, idx) => (
							<SenseDisplay
								key={`subsense-${subSense.number || subSense.num || idx}`}
								sense={subSense}
							/>
						))}
					</div>
				)}
			</div>

			{/* Inline numbered definitions rendered as siblings, not children.
			    Group consecutive subsections into the preceding definition block. */}
			{groupSiblingSegments(siblingSegments).map((group, i) => (
				<div
					key={`inline-def-${
						// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
						i
					}`}
					style={DEF_BLOCK_STYLE}
				>
					<strong style={DEF_LABEL_STYLE}>{group.definition.label} </strong>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized */}
					<span dangerouslySetInnerHTML={{ __html: group.definition.html }} />
					{group.subsections.map((sub, j) => (
						<span
							key={`inline-sub-${
								// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
								j
							}`}
							style={{
								display: "block",
								paddingLeft: "1.25rem",
								marginTop: "0.3rem",
								borderLeft: "2px solid #3a3a4a",
								color: "#b0b8c8",
								fontSize: "0.93em",
							}}
							// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
							dangerouslySetInnerHTML={{ __html: sub.html }}
						/>
					))}
				</div>
			))}
		</>
	);
}

// Helper to render alt_headwords which can be strings or AltHeadword objects
function formatAltHeadword(alt: string | AltHeadword): string {
	if (typeof alt === "string") {
		return alt;
	}
	return alt.word || String(alt);
}

// Component for displaying a single dictionary entry
function DictionaryEntryCard({ entry }: { entry: DictionaryEntry }) {
	const lexiconName = entry.parent_lexicon || "Unknown Lexicon";

	return (
		<div
			className="dictionary-entry"
			style={{
				border: "1px solid #444",
				borderRadius: "8px",
				padding: "1rem",
				marginBottom: "1rem",
				backgroundColor: "#1a1a1a",
			}}
		>
			{/* Lexicon name header */}
			<div
				style={{
					fontSize: "0.85em",
					color: "#aaa",
					marginBottom: "0.5rem",
					borderBottom: "1px solid #333",
					paddingBottom: "0.25rem",
				}}
			>
				{lexiconName}
			</div>

			{/* Headword */}
			<h3
				style={{
					fontSize: "1.5rem",
					margin: "0.5rem 0",
					fontWeight: "bold",
					direction: "rtl",
				}}
			>
				{entry.headword || ""}
				{entry.headword_suffix && (
					<span style={{ fontSize: "0.8em" }}> {entry.headword_suffix}</span>
				)}
			</h3>

			{/* Alternative headwords */}
			{entry.alt_headwords && entry.alt_headwords.length > 0 && (
				<div
					style={{
						fontSize: "0.9em",
						color: "#bbb",
						marginBottom: "0.5rem",
						direction: "rtl",
					}}
				>
					Also: {entry.alt_headwords.map(formatAltHeadword).join(", ")}
				</div>
			)}

			{/* Metadata row */}
			<div
				style={{ fontSize: "0.85em", color: "#aaa", marginBottom: "0.75rem" }}
			>
				{entry.transliteration && (
					<span style={{ marginRight: "1rem" }}>{entry.transliteration}</span>
				)}
				{entry.pronunciation && (
					<span style={{ marginRight: "1rem" }}>/{entry.pronunciation}/</span>
				)}
				{entry.strong_number && (
					<span style={{ marginRight: "1rem" }}>
						Strong's: {entry.strong_number}
					</span>
				)}
				{entry.strong_numbers && (
					<span style={{ marginRight: "1rem" }}>
						Strong's: {entry.strong_numbers.join(", ")}
					</span>
				)}
				{entry.TWOT && (
					<span style={{ marginRight: "1rem" }}>
						TWOT: {entry.TWOT.join(", ")}
					</span>
				)}
				{entry.GK && (
					<span style={{ marginRight: "1rem" }}>GK: {entry.GK.join(", ")}</span>
				)}
				{entry.language_code && (
					<span style={{ marginRight: "1rem" }}>
						Lang: {entry.language_code}
					</span>
				)}
				{entry.language_reference && (
					<SanitizedHtml
						html={entry.language_reference}
						style={{ marginRight: "1rem" }}
						replaceLinks={true}
					/>
				)}
			</div>

			{/* Morphology */}
			{entry.morphology && (
				<div
					style={{ fontSize: "0.9em", color: "#bbb", marginBottom: "0.5rem" }}
				>
					<strong>Morphology:</strong> {entry.morphology}
				</div>
			)}

			{entry.content?.morphology && (
				<div
					style={{ fontSize: "0.9em", color: "#bbb", marginBottom: "0.5rem" }}
				>
					<strong>Morphology:</strong> {entry.content.morphology}
				</div>
			)}

			{/* Flags and special markers */}
			<div
				style={{ fontSize: "0.85em", color: "#aaa", marginBottom: "0.5rem" }}
			>
				{entry.root && <span style={{ marginRight: "1rem" }}>✓ Root form</span>}
				{entry.peculiar && (
					<span style={{ marginRight: "1rem" }}>
						‡ Peculiar to Biblical Aramaic
					</span>
				)}
				{entry.all_cited && (
					<span style={{ marginRight: "1rem" }}>† All occurrences cited</span>
				)}
				{entry.brackets && (
					<span style={{ marginRight: "1rem" }}>[brackets]</span>
				)}
				{entry.ordinal && (
					<span style={{ marginRight: "1rem" }}>Entry {entry.ordinal}</span>
				)}
			</div>

			{/* Occurrences */}
			{entry.occurrences && (
				<div
					style={{ fontSize: "0.85em", color: "#aaa", marginBottom: "0.5rem" }}
				>
					Occurs {entry.occurrences}× in the Bible
				</div>
			)}

			{/* Plural form */}
			{entry.plural_form && entry.plural_form.length > 0 && (
				<div
					style={{
						fontSize: "0.9em",
						color: "#bbb",
						marginBottom: "0.5rem",
						direction: "rtl",
					}}
				>
					<strong>Plural:</strong> {entry.plural_form.join(", ")}
				</div>
			)}

			{/* Senses/Definitions */}
			{entry.content?.senses && entry.content.senses.length > 0 && (
				<div style={{ marginTop: "1rem" }}>
					<strong>Definitions:</strong>
					<div style={{ marginTop: "0.5rem" }}>
						{entry.content.senses.map((sense, idx) => (
							<SenseDisplay
								key={`sense-${entry.headword || "unknown"}-${idx}`}
								sense={sense}
							/>
						))}
					</div>
				</div>
			)}

			{/* Notes */}
			{entry.notes && (
				<div
					style={{
						marginTop: "0.75rem",
						fontSize: "0.9em",
						padding: "0.5rem",
						backgroundColor: "#2a2a2a",
						borderRadius: "4px",
					}}
				>
					<strong>Notes:</strong>{" "}
					<SanitizedHtml
						html={entry.notes}
						replaceLinks={true}
						replaceEmDashes={true}
					/>
				</div>
			)}

			{/* Derivatives */}
			{entry.derivatives && (
				<div style={{ marginTop: "0.75rem", fontSize: "0.9em" }}>
					<strong>Derivatives:</strong>{" "}
					<SanitizedHtml
						html={entry.derivatives}
						replaceLinks={true}
						replaceEmDashes={true}
					/>
				</div>
			)}

			{/* Quotes */}
			{entry.quotes && entry.quotes.length > 0 && (
				<div
					style={{
						marginTop: "0.75rem",
						fontSize: "0.85em",
						color: "#bbb",
						fontStyle: "italic",
					}}
				>
					{entry.quotes.join("; ")}
				</div>
			)}

			{/* Navigation */}
			{/*       <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid #333",
          fontSize: "0.85em",
          color: "#999",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {entry.prev_hw && (
          <a href={`https://sefaria.org/${entry.prev_hw}`}>
            <span>← Previous: {entry.prev_hw}</span>
          </a>
        )}
        {entry.next_hw && (
          <a href={`https://sefaria.org/J${entry.next_hw}`}>
            <span>Next: {entry.next_hw} →</span>
          </a>
        )}
      </div>
*/}
		</div>
	);
}
