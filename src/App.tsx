import { useCallback, useState } from "react";
import { hitWordCompletionAPI } from "./api/Autocomplete";
import { getJastrowEntries } from "./api/Lexicon";
import { DisplayDictionaryEntries } from "./Components/DisplayDictionaryEntries";
import { GithubLink } from "./Components/GithubLink";
import { HomeScreen } from "./Components/HomeScreen";
import { SearchBar } from "./Components/SearchBar";
import poweredBySefaria from "./images/PoweredBySefaria.png";
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

  // Wrapper function to handle autocomplete API
  const handleAutoComplete = useCallback(
    async (query: string): Promise<string[][]> => {
      const results = await hitWordCompletionAPI(query);
      return results || [];
    },
    [],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a href="https://www.sefaria.org/texts">
          <img
            alt="Powered By Sefaria"
            src={poweredBySefaria}
            style={{
              width: "120px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default App;
