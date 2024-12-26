import { cn, formatHourIntl } from '@/lib/utils';
import { useWindowSize } from '@/hooks';
import { MinimumWidth } from '@/types';
import moment from 'moment';

const findDayLength = (view: 'week' | '3day') => {
	if (view === 'week') return 5;
	if (view === '3day') return 3;
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
				"mt-2 ml-10 grid h-[1440px] grid-cols-[auto_repeat(5,_1fr)]",
				view === 'week' && "grid-cols-[auto_repeat(5,_1fr)]",
				view === '3day' && "grid-cols-[auto_repeat(3,_1fr)]",
			)}
			style={{
				gridTemplateRows: 'repeat(288, minmax(0, 1fr))',
			}}
		>
			{/* Time column */}
			<div className="relative right-12">
				{hours.map((hour) => (
					<div
						key={hour}
						className="h-[60px] relative border-b border-border/50 w-max"
						style={{
							gridRow: `span 12`, // 12 5-minute slots per hour
						}}
					>
						<span className="absolute -translate-y-1/2 text-xs text-muted-foreground px-2 w-max">
							{formatHourIntl(hour)}
						</span>
					</div>
				))}
			</div>

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
								findTodayIndex(weekDays) === dayIndex && "bg-neutral-100"
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
