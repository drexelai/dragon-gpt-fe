"use client";
import React, { useRef, useState } from "react";
import moment from "moment";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { formatHourIntl } from "@/lib/utils";
import { useMaskImage } from "@/hooks/useMaskImage";

const events = [
	{
		title: "Morning Meeting",
		start: new Date(moment().hours(10).minutes(0).toDate()),
		end: new Date(moment().hours(11).minutes(20).toDate()),
	},
	{
		title: "Afternoon Work Session",
		start: new Date(moment().add(1, "days").hours(13).minutes(15).toDate()),
		end: new Date(moment().add(1, "days").hours(15).minutes(45).toDate()),
	},
];

const WeeklyCalendar: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(moment());
	const ref = useRef<HTMLDivElement>(null);

	useMaskImage(ref);

	const goToPreviousWeek = () => {
		setCurrentDate(currentDate.clone().subtract(1, "week"));
	};

	const goToNextWeek = () => {
		setCurrentDate(currentDate.clone().add(1, "week"));
	};

	const goToToday = () => {
		setCurrentDate(moment());
	};

	const startOfWeek = currentDate.clone().startOf("week");
	const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
		startOfWeek.clone().add(i, "days")
	);
	const hours = Array.from({ length: 24 }, (_, index) => formatHourIntl(index));

	const getEventPosition = (event: typeof events[number]) => {
		const start = moment(event.start);
		const end = moment(event.end);

		const dayIndex = start.diff(startOfWeek, "days");
		const startMinutes = start.hours() * 60 + start.minutes();
		const endMinutes = end.hours() * 60 + end.minutes();
		const durationMinutes = endMinutes - startMinutes;

		const startTop = (startMinutes / 60) * 4.5;
		const height = (durationMinutes / 60) * 4;

		return { dayIndex, startTop, height };
	};

	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="flex flex-1 items-center mb-4">
				<div className="inline-flex ml-24 -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
					<Button
						className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
						variant="secondary"
						size="icon"
						aria-label="Previous week"
						onClick={goToPreviousWeek}
					>
						<ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
					</Button>
					<Button
						variant="secondary"
						className="p-2 rounded-none border-r-1 boreder-l-1 border-r-gray-50"
						onClick={goToToday}
					>
						Today
					</Button>
					<Button
						className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
						variant="secondary"
						size="icon"
						aria-label="Next week"
						onClick={goToNextWeek}
					>
						<ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
					</Button>
				</div>
				<h2 className="ml-auto text-xl font-bold">{`Week of ${startOfWeek.format(
					"MMM D, YYYY"
				)}`}</h2>
			</header>
			<div className="grid max-h-[45rem] overflow-scroll" style={{ gridTemplateColumns: "1fr repeat(7, 1fr)" }} ref={ref}>
				<div className="grid grid-rows-24 gap-0.5">
					{hours.map((hour, index) => (
						<div
							key={index}
							className="mr-4 text-xs text-muted-foreground font-medium text-center flex items-end justify-end"
						>
							{hour}
						</div>
					))}
				</div>
				{daysOfWeek.map((day) => (
					<div key={day.toString()} className="relative">
						<div className="grid grid-rows-24 gap-0.5 max-h-scren">
							<div className="text-center font-semibold py-2 h-16 flex flex-col items-start justify-center border-b bg-background w-full fixed z-10">
								<span className="text-sm font-semibold text-neutral-500">
									{day.format("ddd").toUpperCase()}
								</span>
								<span className="text-xl font-medium">{day.format("D")}</span>
							</div>
							{hours.map((hour) => (
								<div
									key={`${day}-${hour}`}
									className="h-16 border-b border-l border-neutral-300/40 dark:border-neutral-500/40 hover:bg-neutral-100 dark:hover:bg-neutral-500/40 transition-all"
								/>
							))}
							{events.map((event, index) => {
								const { dayIndex, startTop, height } = getEventPosition(event);
								if (dayIndex !== daysOfWeek.indexOf(day)) return null;

								return (
									<div
										key={index}
										className="absolute flex flex-col bg-blue-200 border-l-4 border-l-blue-500 text-blue-500 font-bold text-xs p-2 rounded-md shadow-md"
										style={{
											top: `${startTop}rem`,
											height: `${height}rem`,
											width: "calc(100% - 1rem)",
											left: "0.5rem",
										}}
									>
										<span className="" >
											{moment(event.start).format('h:mm A')}
										</span>
										<span className="">
											{event.title}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default WeeklyCalendar;
