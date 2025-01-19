export interface CalendarEvent {
	id: string;
	title: string;
	location?: string;
	start: Date;
	end: Date;
	color: string;
}

export enum MinimumWidth {
	Small = 640,
	Medium = 768,
	Large = 1024,
	ExtraLarge = 1280,
}
