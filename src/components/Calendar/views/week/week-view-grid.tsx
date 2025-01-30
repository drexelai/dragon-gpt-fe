import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks';
import { MinimumWidth } from '@/types';
import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
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
	const gridRef = useRef<HTMLDivElement>(null);

	const getCurrentTimePosition = () => {
		if (!gridRef.current) return 0;

		const startOfDay = moment().startOf('day');
		const diffInMinutes = moment().diff(startOfDay, 'minutes');
		const minutesInDay = 24 * 60;

		const gridHeight = gridRef.current.clientHeight;
		const pixelsPerMinute = gridHeight / minutesInDay;

		return (diffInMinutes * pixelsPerMinute);
	};

	return (
		<>
			<div
				ref={gridRef}
				className={cn(
					"mt-2 mb-4 ml-10 md:mb-0 grid grid-cols-5 row-start-1 col-start-1 relative",
					"h-[1440px]", // 24 hours * 60 minutes
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
							top: `${getCurrentTimePosition()}px`
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
						{Array.from({ length: 24 }).map((_, hour) => (
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
		</>
	);
}
