// ============================================================================
// Sefaria Lexicon API Types
// Based on: https://developers.sefaria.org/reference/get-words
// Endpoint: GET https://www.sefaria.org/api/words/{word}
// ============================================================================

/** Grammar information attached to a sense/definition */
export interface SenseGrammar {
	verbal_stem?: string;
	language_code?: string;
	binyan_form?: string[];
	morphology?: string;
}

/** A single sense/definition entry — can be recursive (nested senses) */
export interface Sense {
	definition?: string;
	number?: string;
	num?: string;
	pre_num?: string;
	grammar?: SenseGrammar;
	form?: string;
	plural_form?: string;
	note?: string;
	notes?: string;
	/** Note: this is intentionally misspelled to match the API response */
	occurences?: string;
	all_cited?: boolean;
	alternative?: string;
	language_code?: string;
	morphology?: string;
	/** Nested sub-senses (recursive structure) */
	senses?: Sense[];
}

/** The `content` object within a dictionary entry */
export interface EntryContent {
	morphology?: string;
	senses: Sense[];
}

/** Metadata about the parent lexicon/dictionary */
export interface ParentLexiconDetails {
	name: string;
	language: string;
	to_language: string;
	text_categories: string[];
	source: string;
	source_url?: string;
	attribution: string;
	attribution_url?: string;
	index_title: string;
	version_title: string;
	version_lang: string;
	should_autocomplete: boolean;
}

/** Alternative headword entry (used in some lexicons like BDB) */
export interface AltHeadword {
	word?: string;
	occurences?: string;
}

/**
 * A single dictionary/lexicon entry returned by the Sefaria Lexicon API.
 *
 * This is a unified type covering all lexicon variants (Jastrow, Klein, BDB,
 * BDB Augmented Strong, etc.). Fields that only appear in certain lexicons
 * are marked optional.
 */
export interface DictionaryEntry {
	/** The headword in Hebrew/Aramaic */
	headword: string;
	/** Optional suffix appended to the headword (e.g. superscript markers) */
	headword_suffix?: string;
	/** Name of the parent lexicon (e.g. "Jastrow Dictionary", "Klein Dictionary") */
	parent_lexicon: string;
	/** The main content: morphology and list of senses/definitions */
	content: EntryContent;
	/** Entry ID within the lexicon */
	rid?: string;
	/** Cross-reference strings */
	refs?: string[];
	/** HTML string describing derivative words */
	derivatives?: string;
	/** Previous headword in the lexicon for navigation */
	prev_hw?: string;
	/** Next headword in the lexicon for navigation */
	next_hw?: string;
	/** Notes (often HTML with embedded links) */
	notes?: string;
	/** Detailed information about the parent lexicon */
	parent_lexicon_details?: ParentLexiconDetails;

	// --- Strong's / BDB Augmented Strong fields ---
	/** Single Strong's number (BDB Augmented Strong) */
	strong_number?: string;
	/** Multiple Strong's numbers (BDB Dictionary) */
	strong_numbers?: string[];
	/** Transliteration of the headword */
	transliteration?: string;
	/** Pronunciation guide */
	pronunciation?: string;

	// --- Language & morphology ---
	/** Language code (e.g. "heb", "(b. h.;") */
	language_code?: string;
	/** Language reference (often HTML with links) */
	language_reference?: string;
	/** Top-level morphology string (some lexicons put this outside content) */
	morphology?: string;

	// --- Plural & alternative forms ---
	/** Plural form(s) of the headword */
	plural_form?: string[];
	/** Alternative headwords — can be strings or objects with word/occurences */
	alt_headwords?: (string | AltHeadword)[];

	// --- Quotations ---
	/** Quotations or usage examples (can be an empty array) */
	quotes?: string[];

	// --- BDB Dictionary specific fields ---
	/** Whether all occurrences of the word are cited */
	all_cited?: boolean;
	/** Goodrick-Kohlenberger number(s) */
	GK?: string[];
	/** Theological Wordbook of the Old Testament reference(s) */
	TWOT?: string[];
	/** Whether this is a root form */
	root?: boolean;
	/** Whether this word is peculiar to Biblical Aramaic */
	peculiar?: boolean;
	/** Ordinal/entry number within the lexicon */
	ordinal?: string;
	/** Number of occurrences in the Bible */
	occurrences?: string;
	/** Whether the entry has brackets notation */
	brackets?: boolean;
}

/**
 * The response data from the Sefaria Lexicon API (`GET /api/words/{word}`).
 *
 * Returns an array of dictionary entries from all matching lexicons.
 */
export type WordResponseData = DictionaryEntry[];
