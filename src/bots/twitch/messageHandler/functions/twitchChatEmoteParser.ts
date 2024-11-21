type EmoteData = Map<string, string[]>;

interface EmotePosition {
	id: string;
	startIndex: number;
	endIndex: number;
}

export function twitchChatEmoteParser(message: string, emoteData: EmoteData): string {
	// Convert emoteData map into an array of emotes with start and end positions
	const emotePositions: EmotePosition[] = [];

	emoteData.forEach((positions, emoteId) => {
		positions.forEach(pos => {
			const [startIndex, endIndex] = pos.split("-").map(Number);
			emotePositions.push({ id: emoteId, startIndex, endIndex });
		});
	});

	// Sort emotes by startIndex in descending order
	const sortedEmotes = emotePositions.sort((a, b) => b.startIndex - a.startIndex);

	// Start with the original message and replace emotes by their respective image tags
	let parsedMessage = message;

	sortedEmotes.forEach(emote => {
		const emoteText = parsedMessage.slice(emote.startIndex, emote.endIndex + 1);
		const emoteTag = `[[src=https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0 alt=${emoteText}]]`;

		parsedMessage =
			parsedMessage.slice(0, emote.startIndex) + emoteTag + parsedMessage.slice(emote.endIndex + 1);
	});

	return parsedMessage;
}
