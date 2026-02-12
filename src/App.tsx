import { useState } from "react";
import { SearchBar } from "./Components/SearchBar";
import "./index.css";
import { DisplayDictionaryEntry } from "./Components/DisplayDictionaryEntry";
import type { WordResponseData } from "./types/types";

export function App() {
	const [results, setResults] = useState<WordResponseData>([]);

	async function handleSearch(query: string) {
		try {
			const response = await fetch(
				`https://www.sefaria.org/api/words/${encodeURIComponent(query)}`,
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data: WordResponseData = await response.json();
			const jastrow = data.filter(
				(entry) => entry.parent_lexicon === "Jastrow Dictionary",
			);
			setResults(jastrow);
		} catch (err) {
			console.error("Error fetching from Sefaria API:", err);
		}
	}

	return (
		<div>
			<p>Hello World</p>
			<SearchBar onSearch={handleSearch} />
			<DisplayDictionaryEntry data={results} />
		</div>
	);
}

export default App;
