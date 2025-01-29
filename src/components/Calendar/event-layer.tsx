import moment from 'moment';
import { cn } from '@/lib/utils';
import { CalendarEvent, CalendarView } from '@/lib/types';

interface EventLayerProps {
	events: CalendarEvent[];
	weekDays: moment.Moment[];
	view: CalendarView;
}

export function EventLayer({ events, weekDays, view }: EventLayerProps) {
	const calculateEventPosition = (event: CalendarEvent, view: CalendarView) => {
		const startHour = moment(event.start).hour();
		const duration = moment(event.end).diff(moment(event.start), 'minutes');

		if(view === 'day') {
			if (!weekDays[0].isSame(event.start, 'day')) return null;

			// Get all events for this day
			const dayEvents = events.filter(e => moment(e.start).isSame(weekDays[0], 'day'));
			const isOverlapping = dayEvents.some(e =>
				e.id !== event.id &&
				moment(event.start).isBefore(moment(e.end)) &&
				moment(event.end).isAfter(moment(e.start))
			);

			if(isOverlapping) console.log(event.title, events.findIndex(e => e.id === event.id) % 2 === 0);

			return {
				gridRow: `${(12 * startHour) + 1} / span ${12 * (duration / 60)}`,
				gridColumn: 1,
				width: isOverlapping ? '48%' : '100%',
				justifySelf: isOverlapping ? events.findIndex(e => e.id === event.id) % 2 === 0 ? 'end' : 'start' : 'stretch'
			};
		}

		const dayIndex = weekDays.findIndex(day => day.isSame(event.start, 'day'));
		if (dayIndex === -1) return null;

		// Check for overlaps
		const dayEvents = events.filter(e => moment(e.start).isSame(weekDays[dayIndex], 'day'));
		const isOverlapping = dayEvents.some(e =>
			e.id !== event.id &&
			moment(event.start).isBefore(moment(e.end)) &&
			moment(event.end).isAfter(moment(e.start))
		);

		return {
			gridRow: `${(12 * startHour) + 1} / span ${12 * (duration / 60)}`,
			gridColumn: dayIndex + 1,
			width: isOverlapping ? '47%' : 'unset',
			justifySelf: isOverlapping ? events.findIndex(e => e.id === event.id) % 2 === 0 ? 'end' : 'start' : 'stretch'
		};
	};

	return (
		<div
			className={cn(
				"mt-2 z-10", // offset from the top
				"ml-10 lg:ml-[4.5rem]", // Time column width
				"absolute inset-0 grid h-[1440px]",
				"grid-cols-[auto_repeat(5,_1fr)] lg:grid-cols-[auto_repeat(7,_1fr)]",
				view === 'week' && "grid-cols-5",
				view === '3day' && "grid-cols-3",
				view === 'day' && "grid-cols-1",
				"row-start-1 col-start-1"
			)}
			style={{
				gridTemplateRows: 'repeat(288, minmax(0, 1fr))',
			}}
		>
			{events.map((event) => {
				const position = calculateEventPosition(event, view);
				if (!position) return null;

				return (
					<div
						key={event.id}
						className={cn(
							"flex flex-col relative mx-1 rounded-md p-2 mb-1 overflow-hidden cursor-pointer",
							"hover:z-10 hover:max-w-full hover:shadow-md transition-all duration-200 shrink",
							event.color,
							"dark:invert dark:bg-neutral-300 dark:shadow-white",
							"bg-opacity-70 hover:bg-opacity-100"
						)}
						style={{
							gridRow: position.gridRow,
							gridColumn: position.gridColumn,
							width: position.width,
							justifySelf: position.justifySelf
						}}
						onMouseEnter={(e) => {
							const currentTarget = e.currentTarget;
							const computedStyle = window.getComputedStyle(currentTarget);
							const currentHeight = parseFloat(computedStyle.height);
							const contentHeight = currentTarget.scrollHeight;

							currentTarget.style.height = `${Math.max(currentHeight, contentHeight)}px`;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.height = 'unset';
						}}
					>
						<p className="text-xs opacity-75 font-semibold truncate">
							{event.title}
						</p>
						<p className={cn(`${view === "week" ? "text-[0.5rem] sm:text-xs" : "text-xs"} font-light truncate`)}>{event.location}</p>
					</div>
				);
			})}
		</div>
	);
}
