import moment from 'moment';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import EventModal from './components/EventModal';

interface EventLayerProps {
	events: CalendarEvent[];
	weekDays: moment.Moment[];
	view: CalendarView;
}

export function EventLayer({ events, weekDays, view }: EventLayerProps) {
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

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

			return {
				gridRow: `${(12 * startHour) + 1} / span ${12 * (duration / 60)}`,
				gridColumn: 1,
				width: isOverlapping ? '48%' : '100%',
				justifySelf: isOverlapping ? dayEvents.findIndex(e => e.id === event.id) % 2 === 0 ? 'end' : 'start' : 'stretch'
			};
		} else {
			const dayIndex = weekDays.findIndex(day => day.isSame(event.start, 'day'));
			if (dayIndex === -1) return null;

			const dayEvents = events.filter(e => moment(e.start).isSame(weekDays[dayIndex], 'day'));
			const isOverlapping = dayEvents.some(e =>
				e.id !== event.id &&
				moment(event.start).isBefore(moment(e.end)) &&
				moment(event.end).isAfter(moment(e.start))
			);

			return {
				gridRow: `${(12 * startHour) + 1} / span ${12 * (duration / 60)}`,
				gridColumn: dayIndex + 1,
				width: isOverlapping ? '45%' : 'unset',
				justifySelf: isOverlapping ? dayEvents.findIndex(e => e.id === event.id) % 2 === 0 ? 'end' : 'start' : 'stretch'
			};
		}
	};

	const handleEventClick = (event: CalendarEvent) => {
		setSelectedEvent(event);
		setEditModalOpen(true);
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
			{events.map((event, index) => {
				const position = calculateEventPosition(event, view);
				if (!position) return null;

				return (
					<div
						key={`${event.id}-${index}`}
						className={cn(
							"flex flex-col relative mx-1 rounded-md p-2 mb-1 shadow-md overflow-hidden cursor-pointer",
							"hover:z-10 hover:max-w-full hover:shadow-md transition-all duration-200 shrink",
							event.color,
							"",
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
						onClick={() => handleEventClick(event)}
					>
						<p className="text-xs opacity-75 font-semibold">
							{event.title}
						</p>
						<p className={cn(`${
							view === "week" && !position.gridRow.includes("span 12") // if it is a long event and week view, show the location
								? "text-[0.5rem] sm:text-xs"
								: view === "week"
									? "hidden"
									: "text-xs"
							}
							font-light truncate`)}>{event.location}</p>
					</div>
				);
			})}

			{selectedEvent && (
				<EventModal
					event={selectedEvent}
					open={editModalOpen}
					onOpenChange={(open) => {
						setEditModalOpen(open);
						if (!open) setSelectedEvent(null);
					}}
				/>
			)}
		</div>
	);
}
