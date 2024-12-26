// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Conversation = {
	id: string;
	title: string;
	messages: Message[];
	// This will probably include more fields in the future like the creator (user)
}

type Message = {
	text: string;
	isUser: boolean;
	timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CalendarView = 'week' | '3day';
