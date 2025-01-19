import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const samples = {
	questions: [
		"What are the top engineering programs at Drexel?",
		"What are the on campus housing options at Drexel?",
		"What resources are available for freshman academic support at Drexel?",
	],
	capabilities: [
		"Reference general sources or explain where you might find further reading.",
		"Answer questions on a wide range of topics, from academics to general knowledge.",
		"Assist with research, offering insight across various fields.",
	],
	limitations: [
		"May occasionally get incorrect information.",
		"May occasionally produce harmful instructions or biased content.",
		"Limited knowledge, Drexel community based.",
	],
	know: [
		["Active Clubs", "Dining Plans", "Popular Majors", "Basketball Team"],
		["Academic Advising", "Class Registration", "Work Study Opportunities"],
	],
};

const formatter = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	hour12: true,
  });

export const formatHourIntl = (hour: number) => {
	const date = new Date(0, 0, 0, hour);
	return formatter.format(date);
  }

export const getTailwindEventColor = (eventColor: string) => {
	const color = eventColor.split('-')[0];
	const shade = eventColor.split('-')[1];
	if(!shade) return `bg-${color}-400`;
	return `bg-${color}-${shade}`;
}
