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
			"ml-20", // Time column width
			"absolute inset-0 grid h-[1440px]"
		)}
			style={{
				gridTemplateColumns: 'auto repeat(7, 1fr)',
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
							"hover:z-10 transition-all duration-200 min-w-[7rem] max-w-[7rem] shrink",
							event.color,
							"border-l-4 border-current border-opacity-10"
						)}
						style={{
							gridColumn: position.gridColumn,
							top: position.top,
							height: position.height,
						}}
					>
						<p className="text-xs opacity-75 font-semibold">
							{moment(event.start).format('HH:mm A')}
						</p>
						<p className="text-xs truncate">{event.title}</p>
					</div>
				);
			})}
		</div>
	);
}
