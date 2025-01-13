import { v4 } from "uuid";
import { randomEmoji } from "./randomEmoji";
import { generateRandomCount } from "../../generateRandomCount";

const emojiCountObj: { [key: string]: number } = {
	add: generateRandomCount(5, 8),
	remove: generateRandomCount(5, 8),
	super: generateRandomCount(15, 25),
	win: generateRandomCount(25, 50)
};

export const generateEmojiArray = (action: string) => {
	const emojiCount = emojiCountObj[action];
	const emojiArray = [];

	for (let i = 0; i < emojiCount; i++) {
		emojiArray.push({
			_id: v4(),
			action,
			createdAt: new Date(),
			emoji: randomEmoji(action),
			start: generateRandomCount(1, 20)
		});
	}

	return emojiArray;
};
