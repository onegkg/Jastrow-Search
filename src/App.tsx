import { useCallback, useState } from "react";
import { hitWordCompletionAPI } from "./api/Autocomplete";
import { getJastrowEntries } from "./api/Lexicon";
import { DisplayDictionaryEntries } from "./Components/DisplayDictionaryEntries";
import { GithubLink } from "./Components/GithubLink";
import { HomeScreen } from "./Components/HomeScreen";
import { SearchBar } from "./Components/SearchBar";
import "./index.css";
import { GOLD } from "./types/constants";
import type { WordResponseData } from "./types/types";

export function App() {
  // State to hold the search results from the Sefaria lexicon API
  const [lexiconEntries, setLexiconEntries] = useState<WordResponseData | null>(
    null,
  );
  const [query, setQuery] = useState<string>("");

  // Wrapper function to call the API and update the state with the results
  const handleSearch = async (query: string) => {
    setQuery(query);
    const results = await getJastrowEntries(query);
    setLexiconEntries(results || null);
  };

  // Wrapper function to handle autocomplete API that may return undefined
  const handleAutoComplete = useCallback(
    async (query: string): Promise<string[][]> => {
      const results = await hitWordCompletionAPI(query);
      return results || [];
    },
    [],
  );

  return (
    // style: all elements centered with some padding, and max width of 900px for the results
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: GOLD }}>Jastrow Search</h1>
      <SearchBar onSearch={handleSearch} autoComplete={handleAutoComplete} />
      {/* If there are no search results, show the home screen. Otherwise, display the results. */}
      {lexiconEntries === null ? (
        <HomeScreen />
      ) : (
        <DisplayDictionaryEntries data={lexiconEntries} query={query} />
      )}
      <GithubLink />
    </div>
  );
}

export default App;
