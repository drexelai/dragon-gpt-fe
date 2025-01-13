import moment from 'moment';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types';

interface EventLayerProps {
	events: CalendarEvent[];
	weekDays: moment.Moment[];
	view: CalendarView;
}

export function EventLayer({ events, weekDays, view }: EventLayerProps) {
	const calculateEventPosition = (event: CalendarEvent, view: CalendarView) => {
		console.log(!weekDays[0].isSame(event.start, 'day'))
		const startHour = moment(event.start).hour();
		const startMinute = moment(event.start).minute();
		const duration = moment(event.end).diff(moment(event.start), 'minutes');

		if(view === 'day') {
			if (!weekDays[0].isSame(event.start, 'day')) return null;
			console.log(!weekDays[0].isSame(event.start, 'day'))
			console.log(`${(12 * startHour) + 1} / span ${12 * (duration / 60)}`)
			return {
				gridRow: `${(12 * startHour) + 1} / span ${12 * (duration / 60)}`,
				gridColumn: 1,
				top: `${moment(event.start).minute()}px`,
				height: `${moment(event.end).diff(moment(event.start), 'minutes')}px`,
			}
		}
		const dayIndex = weekDays.findIndex(day => day.isSame(event.start, 'day'));
		if (dayIndex === -1) return null;
		return {
			gridRow: `${(12 * startHour) + 1} / span ${12 * (duration / 60)}`, // 5 minutes per slot
			gridColumn: dayIndex + 1, // +1 because first column is time
			top: `${startHour * 60 + startMinute}px`,
			height: `${duration}px`,
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
							"flex flex-col relative mx-1 rounded-md p-2 overflow-hidden",
							"hover:z-10 hover:max-w-full hover:shadow-md transition-all duration-200 shrink",
							// view === 'week' && "min-w-[4.8rem] max-w-[4.8rem] sm:min-w-[7rem] sm:max-w-[7rem]",
							// view === '3day' && "min-w-[8rem] max-w-[8rem]",
							event.color,
							"dark:invert dark:bg-neutral-300 dark:shadow-white",
							"bg-opacity-70 hover:bg-opacity-100"
						)}
						style={{
							gridRow: position.gridRow,
							gridColumn: position.gridColumn,
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
