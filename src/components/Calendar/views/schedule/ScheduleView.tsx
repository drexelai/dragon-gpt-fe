import { cn } from "@/lib/utils";
import moment from "moment";
import EventEmbed from "../../components/EventEmbed";
import ZzIcon from "@/icons/general/zz-icon";
import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

const WEEKS_TO_LOAD = 2;

export default function ScheduleView({
	events,
	onLoadMore
}: {
	events: CalendarEvent[];
	onLoadMore: () => void;
}) {
	const [displayedWeeks, setDisplayedWeeks] = useState(WEEKS_TO_LOAD);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(false);
	}, [events]);

	const groupedEvents = events
		.filter(event => moment(event.start).isSameOrAfter(moment().startOf('day')))
		.reduce((acc, event) => {
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

	const sortedDays = Object.keys(groupedEvents)
		.sort((a, b) => moment(a).diff(moment(b)))
		.filter(day => moment(day).isBefore(moment().add(displayedWeeks, 'weeks')));

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const element = e.currentTarget;
		const bottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50; // threshold

		if (bottom && !isLoading && hasMore) {
			setIsLoading(true);
			const futureDate = moment().add(displayedWeeks, 'weeks');
			const hasMoreEvents = events.some(event =>
				moment(event.start).isAfter(futureDate)
			);

			if (!hasMoreEvents && displayedWeeks >= 6) {
				onLoadMore();
			} else if (!hasMoreEvents) {
				setHasMore(false);
				setIsLoading(false);
			} else {
				setTimeout(() => {
					setDisplayedWeeks(prev => prev + WEEKS_TO_LOAD);
					setIsLoading(false);
				}, 500);
			}
		}
	};

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

	if (sortedDays.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-8 text-neutral-500 dark:text-neutral-400">
				<ZzIcon className="w-12 h-12 mb-4" />
				<p>No upcoming events scheduled</p>
			</div>
		);
	}

	return (
		<div
			className="flex flex-row gap-4 w-full h-full mb-4 overflow-auto"
			onScroll={handleScroll}
		>
			<div className="flex flex-col bg-sky-50 dark:bg-neutral-900/30 rounded-lg h-fit gap-4">
				{sortedDays.map((day, index) => (
					<React.Fragment key={day}>
						{isNewMonth(day, sortedDays[index - 1]) && (
							<div className="h-[2.5rem]" />
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
							<span className="text-sm font-normal">
								{moment(day).format("ddd")}
							</span>
						</div>
					</React.Fragment>
				))}
			</div>

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
				{isLoading && (
					<div className="text-center p-4 text-muted-foreground">
						<Spinner />
					</div>
				)}
				{!hasMore && !isLoading && (
					<div className="text-center p-4 text-muted-foreground">
						No more events to load
					</div>
				)}
			</div>
		</div>
	);
}
