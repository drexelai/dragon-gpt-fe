"use client";
import React, { useState } from "react";
import moment from "moment";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { formatHourIntl } from "@/lib/utils";

const WeeklyCalendar: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(moment());

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


	return (
		<div className="max-h-screen overflow-scroll w-full max-w-5xl mx-auto">
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
			<div className="grid" style={{ gridTemplateColumns: "1fr repeat(7, 1fr)" }}>
				<div className="grid grid-rows-24 gap-0.5">
					{hours.map((hour, index) => (
						<div
							key={index}
							className="mr-2 text-xs text-center flex items-end justify-end"
						>
							{hour}
						</div>
					))}
				</div>
				{daysOfWeek.map((day) => (
					<div key={day.toString()} className="grid grid-rows-24 gap-0.5">
						<div className="text-center font-semibold py-2 h-16 flex flex-col items-start justify-center border-b">
							<span className="text-sm font-light">{day.format("ddd").toUpperCase()}</span>
							<span className="text-xl font-bold">{day.format("D")}</span>
						</div>
						{hours.map((hour) => (
							<div
								key={`${day}-${hour}`}
								className="h-16 border-b border-l border-gray-300/40 hover:bg-neutral-300/70 transition-all"
							>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default WeeklyCalendar;
