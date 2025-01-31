import { MonthCalendar } from "@/components/Calendar/components/MonthCalendar";
import { useState } from "react";
import EventEmbed from "@/components/Calendar/components/EventEmbed";
import moment from "moment";

export default function MonthView({ events }: { events: CalendarEvent[] }) {
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
			/>
			<div className="flex flex-col gap-2">
				{events.filter(event => moment(event.start).isSame(date, 'day')).map((event) => (
					<EventEmbed key={event.id} event={event} />
				))}
			</div>
		</div>
	)
}
