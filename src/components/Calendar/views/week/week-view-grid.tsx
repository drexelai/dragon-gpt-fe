import { cn, formatHourIntl } from '@/lib/utils';
import { useWindowSize } from '@/hooks';
import { MinimumWidth } from '@/types';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { CalendarView } from '@/lib/types';

const findDayLength = (view: CalendarView) => {
	if (view === 'week') return 5;
	if (view === '3day') return 3;
	if (view === 'day') return 1;
	return 5;
}

const findTodayIndex = (weekDays: moment.Moment[]) => {
	return weekDays.findIndex(day => day.isSame(moment(), 'day'));
}

interface WeekViewGridProps {
	weekDays: moment.Moment[];
	view: CalendarView;
}

export function WeekViewGrid({ weekDays, view }: WeekViewGridProps) {
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const [currentTime, setCurrentTime] = useState(moment());

	// Update current time every minute
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(moment());
		}, 60000); // 60000ms = 1 minute

		return () => clearInterval(timer);
	}, []);

	// Calculate position for current time indicator
	const getCurrentTimePosition = () => {
		const hours = currentTime.hours();
		const minutes = currentTime.minutes();
		const totalMinutes = hours * 60 + minutes;
		return (totalMinutes / 1440) * 100; // Convert to percentage of day
	};

	return (
		<div
			className={cn(
				"mt-2 ml-10 grid h-[1440px] grid-cols-5 row-start-1 col-start-1 relative",
				view === 'week' && "grid-cols-5",
				view === '3day' && "grid-cols-3",
				view === 'day' && "grid-cols-1",
			)}
			style={{
				gridTemplateRows: view === 'day' ? 'repeat(12, minmax(0, 1fr))' : 'repeat(288, minmax(0, 1fr))',
			}}
		>
			{/* Current time indicator */}
			{moment().isSame(weekDays[0], 'day') && view === 'day' && (
				<div
					className="absolute w-full z-50 flex items-center pointer-events-none"
					style={{
						top: `${getCurrentTimePosition()}%`
					}}
				>
					<div className="w-2 h-2 rounded-full bg-primary -translate-x-1" />
					<div className="flex-1 h-[1px] bg-primary" />
				</div>
			)}

			{/* Day columns */}
			{Array.from({ length: findDayLength(view) }).map((_, dayIndex) => (
				<div
					key={dayIndex}
					className={cn("border-r relative", dayIndex === 6 && "border-r-0")}
				>
					{hours.map((hour) => (
						<div
							key={hour}
							className={cn(
								"h-[60px] border-r border-t border-border/50 dark:border-neutral-200/10",
								findTodayIndex(weekDays) === dayIndex && view !== 'day' && "bg-neutral-100 dark:bg-neutral-900/30"
							)}
							style={{
								gridRow: `span 12`, // 12 5-minute slots per hour
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}
