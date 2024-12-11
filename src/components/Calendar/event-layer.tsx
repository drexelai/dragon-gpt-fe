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
		<div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
			{events.map((event) => {
				const position = calculateEventPosition(event);
				if (!position) return null;

				return (
					<div
						key={event.id}
						className={cn(
							"absolute mx-1 rounded-md p-2 overflow-hidden",
							"hover:z-10 transition-all duration-200 max-w-[7rem] shrink",
							event.color,
							"border-l-4 border-current border-opacity-10"
						)}
						style={{
							gridColumn: position.gridColumn,
							top: position.top,
							height: position.height,
						}}
					>
						<p className="font-medium text-xs truncate">{event.title}</p>
						<p className="text-xs opacity-75">
							{moment(event.start).format('HH:mm')}
						</p>
					</div>
				);
			})}
		</div>
	);
}
