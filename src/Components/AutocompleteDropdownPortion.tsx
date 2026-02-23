type AutocompleteDropdownPortionProps = {
  portion: string | undefined;
  isSelected: boolean;
  onClick: () => void;
};

export function AutocompleteDropdownPortion({
  portion,
  isSelected,
  onClick,
}: AutocompleteDropdownPortionProps) {
  if (!portion) {
    return null;
  }

  return (
    <button
      type="button"
      className="autocomplete-portion"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "0.75rem 1rem",
        cursor: "pointer",
        backgroundColor: isSelected ? "#3b82f6" : "#1f2937",
        color: isSelected ? "white" : "#e5e7eb",
        border: "none",
        borderRadius: "0.25rem",
        transition: "background-color 0.15s, color 0.15s",
        textAlign: "right",
        fontFamily: "inherit",
        fontSize: "1rem",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "#374151";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "#1f2937";
        }
      }}
    >
      {portion}
    </button>
  );
}
