import type {
  AltHeadword,
  DictionaryEntry,
  Sense,
  WordResponseData,
} from "../types/types";
import { SanitizedHtml } from "./SanitizedHtml";

export function DisplayDictionaryEntries({ data }: { data: WordResponseData }) {
  // Handle case where data is not an array
  if (!Array.isArray(data)) {
    return (
      <div style={{ padding: "1rem", color: "#aaa" }}>
        <p>No dictionary entries found.</p>
      </div>
    );
  }

  // Handle empty array
  if (data.length === 0) {
    return (
      <div style={{ padding: "1rem", color: "#aaa" }}>
        <p>No results found for this word.</p>
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

// Helper component for displaying a single sense/definition
function SenseDisplay({ sense }: { sense: Sense }) {
  return (
    <div
      className="sense"
      style={{ marginLeft: "1rem", marginBottom: "0.5rem" }}
    >
      {sense.number && <strong>{sense.number}. </strong>}
      {sense.pre_num && (
        <span style={{ fontStyle: "italic" }}>{sense.pre_num} </span>
      )}
      {sense.num && <strong>{sense.num}. </strong>}

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

      {sense.definition ? (
        <SanitizedHtml html={sense.definition} replaceLinks={true} />
      ) : null}

      {sense.note && (
        <div style={{ marginTop: "0.25rem", fontSize: "0.9em", color: "#bbb" }}>
          Note: <SanitizedHtml html={sense.note} replaceLinks={true} />
        </div>
      )}

      {sense.notes && (
        <div style={{ marginTop: "0.25rem", fontSize: "0.9em", color: "#bbb" }}>
          <SanitizedHtml html={sense.notes} replaceLinks={true} />
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
        {entry.rid && (
          <span style={{ marginLeft: "0.5rem", color: "#888" }}>
            ({entry.rid})
          </span>
        )}
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
          <SanitizedHtml html={entry.notes} replaceLinks={true} />
        </div>
      )}

      {/* Derivatives */}
      {entry.derivatives && (
        <div style={{ marginTop: "0.75rem", fontSize: "0.9em" }}>
          <strong>Derivatives:</strong>{" "}
          <SanitizedHtml html={entry.derivatives} replaceLinks={true} />
        </div>
      )}

      {/* Cross references */}
      {entry.refs && entry.refs.length > 0 && (
        <div
          style={{ marginTop: "0.75rem", fontSize: "0.85em", color: "#bbb" }}
        >
          <strong>References:</strong> {entry.refs.join(", ")}
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
      <div
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
        {entry.prev_hw && <span>← Previous: {entry.prev_hw}</span>}
        {entry.next_hw && <span>Next: {entry.next_hw} →</span>}
      </div>

      {/* Lexicon details */}
      {entry.parent_lexicon_details && (
        <details
          style={{ marginTop: "0.5rem", fontSize: "0.85em", color: "#aaa" }}
        >
          <summary style={{ cursor: "pointer" }}>Lexicon Details</summary>
          <pre style={{ marginTop: "0.5rem", fontSize: "0.8em" }}>
            {JSON.stringify(entry.parent_lexicon_details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
