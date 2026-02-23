import { useEffect, useRef } from "react";
import { AutocompleteDropdownPortion } from "./AutocompleteDropdownPortion";

type AutocompleteDropdownParams = {
  /** The list returned from the sefaria word completion API */
  autocomplete: string[][];
  /** Callback when an item is selected (clicked or Enter pressed) */
  onSelect: (value: string) => void;
  /** Index of the currently selected item (for keyboard navigation) */
  selectedIndex: number;
};

export function AutocompleteDropdown({
  autocomplete,
  onSelect,
  selectedIndex,
}: AutocompleteDropdownParams) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll the selected item into view when selectedIndex changes
  useEffect(() => {
    if (dropdownRef.current && selectedIndex >= 0) {
      const itemElement = dropdownRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (itemElement) {
        itemElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  if (autocomplete.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="autocomplete-dropdown"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#1f2937",
        border: "2px solid #374151",
        borderRadius: "0.5rem",
        marginTop: "0.25rem",
        maxHeight: "300px",
        overflowY: "auto",
        zIndex: 1000,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        WebkitOverflowScrolling: "touch", // iOS momentum scrolling
        overflow: "hidden auto", // Ensure overflow only on Y-axis
        overscrollBehavior: "none", // Prevent elastic bounce revealing page content
      }}
    >
      <style>
        {`
					.autocomplete-dropdown::-webkit-scrollbar {
						display: none;
					}
				`}
      </style>
      {autocomplete.map((portion, index) => {
        // Use nikkud version (position 1) if available, otherwise fall back to position 0
        const displayValue = portion[1] || portion[0];
        // Use position 1 (with nikkud) as the key for better uniqueness (different nikkud = different words)
        const keyValue = portion[1] || portion[0];

        if (!displayValue) return null;

        return (
          <AutocompleteDropdownPortion
            portion={displayValue}
            key={keyValue}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(displayValue)}
          />
        );
      })}
    </div>
  );
}
