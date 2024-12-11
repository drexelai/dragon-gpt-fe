import moment from 'moment';
import { cn } from '@/lib/utils';

interface WeekHeaderProps {
	days: moment.Moment[];
}

export function WeekHeader({ days }: WeekHeaderProps) {
	return (
		<div className="ml-10 lg:ml-20 grid grid-cols-5 lg:grid-cols-7">
			{days.map((day, index) => (
				<div
					key={day.format()}
					className={cn(
						"p-2 text-center border-r dark:border-neutral-200/10 font-semibold py-2 h-16 flex flex-col items-start justify-center",
						index === 6 && "border-r-0",
						day.isSame(moment(), "day") && "bg-blue-50"
					)}
				>
					<span className="text-sm font-medium text-neutral-500">
						{day.format("ddd").toUpperCase()}
					</span>
					<span className="text-xl font-medium">{day.format("D")}</span>
				</div>
			))}
		</div>
	);
}
