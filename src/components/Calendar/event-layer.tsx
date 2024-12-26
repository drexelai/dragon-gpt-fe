import moment from 'moment';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types';

interface EventLayerProps {
	events: CalendarEvent[];
	weekDays: moment.Moment[];
}

export function EventLayer({ events, weekDays }: EventLayerProps) {
	const calculateEventPosition = (event: CalendarEvent) => {
		const dayIndex = weekDays.findIndex(day => day.isSame(event.start, 'day'));
		if (dayIndex === -1) return null;

		const startHour = moment(event.start).hour();
		const startMinute = moment(event.start).minute();
		const duration = moment(event.end).diff(moment(event.start), 'minutes');

		return {
			gridColumn: dayIndex + 2, // +2 because first column is time
			top: `${startHour * 60 + startMinute}px`,
			height: `${duration}px`,
		};
	};

	return (
		<div
			className={cn(
				"mt-2", // offset from the top
				"ml-8 lg:ml-[4.5rem]", // Time column width
				"absolute inset-0 grid h-[1440px]",
				"grid-cols-[auto_repeat(5,_1fr)] lg:grid-cols-[auto_repeat(7,_1fr)]",
			)}
			style={{
				gridTemplateRows: 'repeat(288, minmax(0, 1fr))',
			}}
		>
			{events.map((event) => {
				const position = calculateEventPosition(event);
				if (!position) return null;

				return (
					<div
						key={event.id}
						className={cn(
							"absolute mx-1 rounded-md p-2 overflow-hidden",
							"hover:z-10 hover:max-w-full hover:shadow-md transition-all duration-200 shrink",
							"min-w-[4.3rem] max-w-[4.3rem] sm:min-w-[7rem] sm:max-w-[7rem]",
							event.color,
							"dark:invert dark:bg-neutral-300 dark:shadow-white",
							"bg-opacity-70 hover:bg-opacity-100"
						)}
						style={{
							gridColumn: position.gridColumn,
							top: position.top,
							height: position.height,
						}}
						onMouseEnter={(e) => {
							const currentTarget = e.currentTarget;
							const computedStyle = window.getComputedStyle(currentTarget);
							const currentHeight = parseFloat(computedStyle.height);
							const contentHeight = currentTarget.scrollHeight;

							currentTarget.style.height = `${Math.max(currentHeight, contentHeight)}px`;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.height = position.height;
						}}
					>
						<p className="text-xs opacity-75 font-semibold">
							{moment(event.start, ["HH:mm"]).format('h:mm a')}
						</p>
						<p className="text-xs truncate">{event.title}</p>
					</div>
				);
			})}
		</div>
	);
}
