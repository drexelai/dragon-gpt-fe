import { cn, formatHourIntl } from '@/lib/utils';
import { useWindowSize } from '@/hooks';
import { MinimumWidth } from '@/types';
import moment from 'moment';

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
	const windowSize = useWindowSize();
	const isDesktop = windowSize.width > MinimumWidth.Large;

	return (
		<div
			className={cn(
				"mt-2 ml-10 grid h-[1440px] grid-cols-5 row-start-1 col-start-1",
				view === 'week' && "grid-cols-5",
				view === '3day' && "grid-cols-3",
				view === 'day' && "grid-cols-1",
			)}
			style={{
				gridTemplateRows: view === 'day' ? 'repeat(12, minmax(0, 1fr))' : 'repeat(288, minmax(0, 1fr))',
			}}
		>

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
								findTodayIndex(weekDays) === dayIndex && view !== 'day' && "bg-neutral-100"
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
