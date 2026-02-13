import { useState } from "react";
import { getJastrowEntries } from "./api/Lexicon";
import { DisplayDictionaryEntries } from "./Components/DisplayDictionaryEntries";
import { GithubLink } from "./Components/GithubLink";
import { HomeScreen } from "./Components/HomeScreen";
import { SearchBar } from "./Components/SearchBar";
import "./index.css";
import type { WordResponseData } from "./types/types";

export function App() {
  const [lexiconEntries, setLexiconEntries] = useState<WordResponseData | null>(
    null,
  );

  const handleSearch = async (query: string) => {
    const results = await getJastrowEntries(query);
    setLexiconEntries(results || []);
  };

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
      <h1 style={{ color: "#E0D695" }}>Jastrow Search</h1>
      <SearchBar onSearch={handleSearch} />
      {lexiconEntries === null ? (
        <HomeScreen />
      ) : (
        <DisplayDictionaryEntries data={lexiconEntries} />
      )}
      <GithubLink />
    </div>
  );
}

export default App;
