declare global {
	type CalendarView = 'week' | '3day' | 'day' | 'month' | 'schedule';

	interface CalendarEvent {
		id: string;
		title: string;
		location?: string;
		start: Date;
		end: Date;
		color: string;
	}

	type Message = {
		text: string;
		isUser: boolean;
		timestamp: number;
	}

	type Conversation = {
		id: string;
		title: string;
		messages: Message[];
	}
}

export { };
