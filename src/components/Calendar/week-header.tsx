import moment from 'moment';
import { cn } from '@/lib/utils';

interface WeekHeaderProps {
	days: moment.Moment[];
}

export function WeekHeader({ days }: WeekHeaderProps) {
	return (
		<div className="grid grid-cols-8 border-b">
			<div className="p-2 border-r" /> {/* Time column */}
			{days.map((day, index) => (
				<div
					key={day.format()}
					className={cn(
						"p-2 text-center border-r",
						index === 6 && "border-r-0"
					)}
				>
					<div className="text-sm font-medium text-muted-foreground">
						{day.format('ddd')}
					</div>
					<div className="text-lg font-semibold">
						{day.format('D')}
					</div>
				</div>
			))}
		</div>
	);
}
