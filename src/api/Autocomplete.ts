export async function hitWordCompletionAPI(
	query: string,
): Promise<string[][] | undefined> {
	try {
		const url = `https://www.sefaria.org/api/words/completion/${query}/Jastrow%20Dictionary`;
		const response = await fetch(url);
		return response.json();
	} catch (err) {
		console.error("Error fetching from Word Completion API:", err);
	}
}
