"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import moment from "moment"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Dispatch } from "react"
import { SetStateAction } from "react"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	events?: CalendarEvent[];
	onSelect?: Dispatch<SetStateAction<Date>>;
}

function MonthCalendar({
	className,
	classNames,
	showOutsideDays = true,
	events = [],
	selected,
	onSelect,
	...props
}: CalendarProps) {
	const [currentMonth, setCurrentMonth] = React.useState<Date>(props.defaultMonth || new Date());

	// Function to get events for a specific day
	const getEventsForDay = (day: Date) => {
		return events?.filter(event =>
			moment(event.start).isSame(day, 'day')
		).slice(0, 3); // Only take first 3 events
	};

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			onMonthChange={setCurrentMonth}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-base font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex justify-center gap-4",
				head_cell:
					"text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
				row: "flex w-full mt-2 justify-center gap-4",
				cell: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
					props.mode === "range"
						? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
						: "[&:has([aria-selected])]:rounded-md"
				),
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"h-8 w-8 p-0 font-normal aria-selected:opacity-100 relative"
				),
				day_range_start: "day-range-start",
				day_range_end: "day-range-end",
				day_selected:
					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
				IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
				Day: ({ date, ...dayProps }: { date: Date } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
					const dayEvents = getEventsForDay(date);
					const isSelected = selected instanceof Date && moment(date).isSame(selected, 'day');
					const isOutsideMonth = !moment(date).isSame(currentMonth, 'month');

					return (
						<button
							{...dayProps}
							onClick={(e) => {
								dayProps.onClick?.(e);
								onSelect?.(date);
							}}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"h-8 w-8 p-0 font-normal relative flex flex-col items-center",
								isSelected && "bg-neutral-100 border border-neutral-200",
								isOutsideMonth && "text-muted-foreground",
								dayProps.className
							)}
						>
							<span>{date.getDate()}</span>
							{dayEvents.length > 0 && (
								<div className="flex gap-0.5 absolute -bottom-[0.05px]">
									{dayEvents.map((event) => (
										<div
											key={event.id}
											className={cn(
												"w-1 h-1 rounded-full",
												event.color,
												isOutsideMonth && "opacity-50"
											)}
										/>
									))}
								</div>
							)}
						</button>
					);
				}
			}}
			{...props}
		/>
	)
}
MonthCalendar.displayName = "MonthCalendar"

export { MonthCalendar }
