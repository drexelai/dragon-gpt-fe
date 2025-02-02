import { cn } from "@/lib/utils";

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const dayAbbreviations: Record<Day, string> = {
	monday: 'M',
	tuesday: 'Tu',
	wednesday: 'W',
	thursday: 'Th',
	friday: 'F',
	saturday: 'Sa',
	sunday: 'Su'
};

interface DaySelectProps {
	value: Day[];
	onChange: (value: Day[]) => void;
}

export function DaySelect({ value = [], onChange }: DaySelectProps) {
	const days: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	const toggleDay = (day: Day) => {
		const newValue = value.includes(day)
			? value.filter(d => d !== day)
			: [...value, day];
		onChange(newValue);
	};

	return (
		<div className="flex flex-row gap-2">
			{days.map((day) => (
				<button
					key={day}
					type="button"
					onClick={() => toggleDay(day)}
					className={cn(
						"size-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
						"border border-input hover:bg-accent",
						value.includes(day)
							? "bg-primary text-primary-foreground hover:bg-primary/90"
							: "bg-background"
					)}
				>
					{dayAbbreviations[day]}
				</button>
			))}
		</div>
	);
}
