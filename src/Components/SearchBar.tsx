import { useEffect, useRef, useState } from "react";
import { AutocompleteDropdown } from "./AutocompleteDropdown";

type SearchBarProps = {
  onSearch: (query: string) => void;
  autoComplete?: (query: string) => Promise<string[][]>;
};

export function SearchBar({ onSearch, autoComplete }: SearchBarProps) {
  // Local state to hold the current search query input by the user
  const [search, setSearch] = useState("");
  // State to hold autocomplete suggestions
  const [suggestions, setSuggestions] = useState<string[][]>([]);
  // State to track which suggestion is selected via keyboard
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // State to track if dropdown should be visible
  const [showDropdown, setShowDropdown] = useState(false);
  // Ref to the search input for focus management
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref to the form container for positioning the dropdown
  const formRef = useRef<HTMLFormElement>(null);
  // Ref to track the current request ID to prevent race conditions
  const requestIdRef = useRef(0);

  // Fetch autocomplete suggestions when search input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length > 0 && autoComplete) {
        // Increment request ID for this new request
        const currentRequestId = ++requestIdRef.current;

        try {
          const results = await autoComplete(search.trim());

          // Only update state if this is still the most recent request
          if (currentRequestId === requestIdRef.current) {
            setSuggestions(results || []);
            setShowDropdown(true);
            setSelectedIndex(-1); // Reset selection when new suggestions arrive
          }
        } catch (error) {
          // Only update state if this is still the most recent request
          if (currentRequestId === requestIdRef.current) {
            console.error("Error fetching autocomplete:", error);
            setSuggestions([]);
          }
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    // Debounce the autocomplete API calls
    const timeoutId = setTimeout(fetchSuggestions, 200);
    return () => {
      clearTimeout(timeoutId);
      // Increment request ID to invalidate any in-flight requests
      requestIdRef.current++;
    };
  }, [search, autoComplete]);

  // Handle selecting an autocomplete suggestion
  const handleSelectSuggestion = (value: string) => {
    setSearch(value);
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    // Trigger search immediately
    onSearch(value.trim().toLowerCase());
    setSearch(""); // Clear the input after search
  };

  // Calls onSearch with the trimmed and lowercased search query, then clears the input field.
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      return;
    }

    // If there's a selected suggestion, use it
    if (selectedIndex >= 0 && suggestions[selectedIndex]?.[0]) {
      const displayValue =
        suggestions[selectedIndex][1] || suggestions[selectedIndex][0];
      handleSelectSuggestion(displayValue);
    } else {
      onSearch(search.trim().toLowerCase());
      setSearch("");
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      case "Enter":
        // Let the form submit handler take care of this
        if (selectedIndex >= 0 && suggestions[selectedIndex]?.[0]) {
          e.preventDefault();
          const displayValue =
            suggestions[selectedIndex][1] || suggestions[selectedIndex][0];
          handleSelectSuggestion(displayValue);
        }
        break;
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{ ...styles.form, position: "relative" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Jastrow Dictionary..."
        style={styles.input}
        autoComplete="off"
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowDropdown(true);
          }
        }}
      />
      <button type="submit" style={styles.button}>
        Search
      </button>

      {showDropdown && suggestions.length > 0 && (
        <div style={styles.dropdownContainer}>
          <AutocompleteDropdown
            autocomplete={suggestions}
            onSelect={handleSelectSuggestion}
            selectedIndex={selectedIndex}
          />
        </div>
      )}
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
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: "120px", // Account for the search button width
    zIndex: 1000,
  } as React.CSSProperties,
};
