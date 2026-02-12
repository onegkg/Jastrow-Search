import { useState } from "react";

type SearchBarProps = {
	onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
	const [search, setSearch] = useState("");
	const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (!search.trim) {
			return;
		}

		onSearch(search.trim().toLowerCase());

		setSearch("");
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search..."
			/>
			<button type="submit">Search</button>
		</form>
	);
}
