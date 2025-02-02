import { MonthCalendar } from "@/components/Calendar/components/MonthCalendar";
import { useState } from "react";
import EventEmbed from "@/components/Calendar/components/EventEmbed";
import moment from "moment";
import ZzIcon from "@/icons/general/zz-icon";

interface MonthViewProps {
	events: CalendarEvent[];
	onMonthChange?: (date: moment.Moment) => void;
}

export default function MonthView({ events, onMonthChange }: MonthViewProps) {
	const [date, setDate] = useState<Date>(new Date());

	return (
		<div className="flex flex-col p-4 overflow-auto">
			<MonthCalendar
				mode="single"
				selected={date}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onSelect={setDate as any}
				className="w-full"
				events={events}
				defaultMonth={date}
				onNavigate={(date) => onMonthChange?.(moment(date))}
			/>
			<div className="flex flex-col gap-4">
				{events.filter(event => moment(event.start).isSame(date, 'day')).length > 0 ?
					events.filter(event => moment(event.start).isSame(date, 'day')).map((event) => (
						<EventEmbed key={event.id} event={event} />
					)) : (
						<div className="flex flex-col mt-20 gap-2 text-neutral-500 dark:text-neutral-400 text-center justify-center items-center">
							<ZzIcon />
							<p>No events for this day</p>
							<p>Yay or nay?</p>
						</div>
					)}
			</div>
		</div>
	)
}
