import moment from 'moment';
import { cn } from '@/lib/utils';
import { CalendarView } from '@/lib/types';

interface WeekHeaderProps {
	days: moment.Moment[];
	view: CalendarView;
}

export function WeekHeader({ days, view }: WeekHeaderProps) {
	const displayDays = view === "day" ? [days[0]] : days;

	return (
		<div className={cn(
			"ml-10 grid",
			view === "week" && "grid-cols-5",
			view === "3day" && "grid-cols-3",
			view === "day" && "grid-cols-1"
		)}>
			{displayDays.map((day, index) => (
				<div
					key={day.format()}
					className={cn(
						"p-2 text-center font-semibold py-2 h-16 flex flex-col items-center justify-center rounded-xl",
						index === 6 && "border-r-0",
						day.isSame(moment(), "day") && "bg-blue-400/50"
					)}
				>
					<span className="text-xl font-semibold">{day.format("D")}</span>
					<span className={cn(
						"text-sm font-normal",
						!day.isSame(moment(), "day") && "text-neutral-500 dark:text-neutral-400"
					)}>
						{day.format(view === "day" ? "dddd" : "ddd")}
					</span>
				</div>
			))}
		</div>
	);
}
