import moment from 'moment';
import { cn } from '@/lib/utils';

interface WeekHeaderProps {
	days: moment.Moment[];
}

export function WeekHeader({ days }: WeekHeaderProps) {
	return (
		<div className="ml-10 grid grid-cols-5">
			{days.map((day, index) => (
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
						{day.format("ddd")}
					</span>
				</div>
			))}
		</div>
	);
}
