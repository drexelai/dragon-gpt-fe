import { CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import moment from "moment";
import EventEmbed from "../event-embed";
import ZzIcon from "@/components/ui/zz-icon";
import React from "react";

export default function ScheduleView({ events }: { events: CalendarEvent[] }) {
	const groupedEvents = events.reduce((acc, event) => {
		const day = moment(event.start).format('YYYY-MM-DD');
		if (!acc[day]) {
			acc[day] = [];
		}
		acc[day].push(event);
		return acc;
	}, {} as Record<string, CalendarEvent[]>);

	const today = moment().format('YYYY-MM-DD');
	if (!groupedEvents[today]) {
		groupedEvents[today] = [];
	}
	const sortedDays = Object.keys(groupedEvents).sort((a, b) =>
		moment(a).diff(moment(b))
	);

	const getDayHeight = (day: string): number => {
		if (groupedEvents[day].length === 0) {
			return moment(day).isSame(moment(), 'day') ? 5 : 0; // 5rem for empty today, 0 for other empty days
		}

		return groupedEvents[day].length * 4.75;
	};

	const isNewMonth = (currentDay: string, prevDay?: string) => {
		if (!prevDay) return true;
		return moment(currentDay).month() !== moment(prevDay).month();
	};

	return (
		<div className="flex flex-row gap-4 w-full h-full overflow-auto">
			<div className="flex flex-col bg-sky-50 dark:bg-neutral-900/30 rounded-lg h-fit gap-4">
				{/** Day column */}
				{sortedDays.map((day, index) => (
					<React.Fragment key={day}>
						{isNewMonth(day, sortedDays[index - 1]) && (
							<div className="h-10" />
						)}
						<div
							className={cn(
								"flex flex-col p-4 text-center rounded-lg transition-all",
								!moment(day).isSame(moment(), "day")
								? "text-neutral-500 dark:text-neutral-400"
								: "bg-blue-400/50"
							)}
							style={{
								height: `${getDayHeight(day)}rem`,
								minHeight: '80px'
							}}
						>
							<span className="text-xl font-semibold">{moment(day).format("D")}</span>
							<span className={cn("text-sm font-normal")}>
								{moment(day).format("ddd")}
							</span>
						</div>
					</React.Fragment>
				))}
			</div>
			{/** Event column */}
			<div className="flex flex-col w-full h-fit gap-4">
				{sortedDays.map((day, index) => (
					<React.Fragment key={day}>
						{isNewMonth(day, sortedDays[index - 1]) && (
							<div className="px-4 py-2 font-medium text-muted-foreground">
								{moment(day).format("MMMM YYYY")}
							</div>
						)}
						<div
							className="flex flex-col gap-2 transition-all"
							style={{
								height: `${getDayHeight(day)}rem`,
								minHeight: '80px'
							}}
						>
							{groupedEvents[day].length === 0 && moment(day).isSame(moment(), 'day') ? (
								<div className="flex flex-col p-4 text-neutral-500 dark:text-neutral-400 text-center">
									<ZzIcon />Your schedule is empty for today
								</div>
							) : (
								groupedEvents[day].map((event) => (
									<EventEmbed
										key={event.id}
										event={event}
									/>
								))
							)}
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	)
}
