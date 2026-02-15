import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  // Local state to hold the current search query input by the user
  const [search, setSearch] = useState("");

  // Calls onSearch with the trimmed and lowercased search query, then clears the input field.
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!search.trim) {
      return;
    }
    onSearch(search.trim().toLowerCase());
    setSearch("");
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Jastrow Dictionary..."
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Search
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "0.5rem",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  } as React.CSSProperties,
  input: {
    flex: 1,
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "2px solid #d1d5db",
    borderRadius: "0.5rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  } as React.CSSProperties,
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
};
