declare global {
	type CalendarView = 'week' | '3day' | 'day' | 'month' | 'schedule';

	type RecurrencePattern = {
		type: 'daily' | 'weekly' | 'specific-days';
		days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
		endDate?: Date;
	}

	interface CalendarEvent {
		id: string;
		title: string;
		location: string;
		start: Date;
		end: Date;
		color: string;
		recurrence?: RecurrencePattern;
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
