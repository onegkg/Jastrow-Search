import type { WordResponseData } from "../types/types";

async function hitLexiconAPI(query: string) {
	try {
		const response = await fetch(
			`https://www.sefaria.org/api/words/${encodeURIComponent(query)}`,
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data: WordResponseData = await response.json();
		return data;
	} catch (err) {
		console.error("Error fetching from Sefaria API:", err);
	}
}

export async function getJastrowEntries(query: string) {
	const allLexiconEntries = await hitLexiconAPI(query);
	if (!allLexiconEntries) {
		return [];
	}
	const jastrowEntries = allLexiconEntries.filter(
		(entry) => entry.parent_lexicon === "Jastrow Dictionary",
	);
	return jastrowEntries;
}
