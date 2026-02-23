// Home screen exclusive content. Currently contains links to the full Jastrow on Sefaria and the GitHub repo for this project.
export function HomeScreen() {
	return (
		<h4 style={{ marginTop: "2rem", textAlign: "center" }}>
			<a
				href="https://www.sefaria.org/Jastrow?tab=contents"
				style={{ color: "#E0D695" }}
			>
				Just looking to browse? You can look through the full Jastrow on
				Sefaria's website.
			</a>
			<br />
			<br />
			<a
				href="https://github.com/onegkg/Jastrow-Search"
				style={{ color: "#E0D695" }}
			>
				Do you like Jastrow Search? Consider starring it on GitHub!
			</a>
		</h4>
	);
}
