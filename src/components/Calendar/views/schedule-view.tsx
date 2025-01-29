import { CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import moment from "moment";
import EventEmbed from "../event-embed";

export default function ScheduleView({ events }: { events: CalendarEvent[] }) {
	// Group events by day
	const groupedEvents = events.reduce((acc, event) => {
		const day = moment(event.start).format('YYYY-MM-DD');
		if (!acc[day]) {
			acc[day] = [];
		}
		acc[day].push(event);
		return acc;
	}, {} as Record<string, CalendarEvent[]>);

	return (
		<div className="flex flex-row gap-4 w-full">
			<div className="flex flex-col">
				{Object.entries(groupedEvents).map(([day, dayEvents]) => (
					<div key={day} className={cn(
							"flex flex-col p-4 text-center",
							!moment(dayEvents[0].start).isSame(moment(), "day") && "text-neutral-500 dark:text-neutral-400"
						)}>
						<span className="text-xl font-semibold">{moment(dayEvents[0].start).format("D")}</span>
						<span className={cn(
							"text-sm font-normal",
						)}>
						{moment(dayEvents[0].start).format("ddd")}
					</span>
					</div>
				))}
			</div>
			<div className="flex flex-col w-full">
				{Object.entries(groupedEvents).map(([day, dayEvents]) => (
					<div key={day} className="flex flex-col gap-2">
						{dayEvents.map((event) => (
							<EventEmbed event={event} key={event.id} />
						))}
					</div>
				))}
			</div>
		</div>
	)
}
