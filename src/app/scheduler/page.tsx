"use client";
import WeekCalendar from "@/components/Calendar/week-calendar";
import ChatInterface from "@/components/ChatInterface";
import InfoTooltip from "@/components/InfoTooltip";
import Nav from "@/components/Navigation/Nav";
import SchedulerInterface from "@/components/scheduler/scheduler-interface";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { useSchedulerStore } from "@/stores/useSchedulerStore";
import { MinimumWidth } from "@/types";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect } from "react"

export default function Page() {
	const isDesktop = window.innerWidth > MinimumWidth.Large;
	const {
		setSchedulerMessages,
	} = useSchedulerStore();

	const { calendarOpen, setCalendarOpen } = useCalendarStore();

	useEffect(() => {
		const fetchSchedulerChat = () => {
			return JSON.parse(
				window.localStorage.getItem("scheduler-messages") || "[]"
			) as Message[];
		};

		if (typeof window !== "undefined") {
			setSchedulerMessages(fetchSchedulerChat());
		}
	}, [setSchedulerMessages]);

	return (
		<div className="m-4 flex">
			<Nav />
			<div className={cn(
				"w-full",
				!calendarOpen && "sm:py-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 "
			)}>
				<div className="flex flex-col">
					<div className="flex flex-row pb-4 mb-4 md:relative md:left-[-50px] md:top-[20px] justify-center md:justify-normal">
						<h1 className={cn(
							"fixed md:relative text-xl px-4 py-2 font-semibold",
							calendarOpen && "ml-8"
						)}>DragonGPT Scheduler</h1>
						<InfoTooltip />
					</div>
					<div
						className="flex flex-row gap-2 self-center border text-sky-900 border-sky-900 rounded-[2rem] p-6 m-8 w-full hover:cursor-pointer"
						onClick={() => setCalendarOpen()}
					>
							<div className="w-full">
								<p className="font-semibold text-lg">Dragon Scheduler</p>
								<p>Take a look at your schedule</p>
							</div>
							<ArrowUpRight />
					</div>
					<div className="flex flex-row">
						<SchedulerInterface />
						{isDesktop
							? calendarOpen && (<WeekCalendar />)
							: <Sheet open={calendarOpen} onOpenChange={() => setCalendarOpen()} >
								<SheetTitle className="sr-only">Dragon Scheduler</SheetTitle>
								<SheetContent className="!max-w-full w-full p-2">
									<div className="flex flex-row gap-6 ml-8">
										<SheetTrigger className=" hover:bg-gray-300/40 -top-4 sm:top-0 rounded-sm"
										>
											<ArrowLeft />
											<span className="sr-only">Exit calendar</span>
										</SheetTrigger>
										<span className="text-xl font-bold">Dragon Scheduler</span>
									</div>
									<WeekCalendar />
								</SheetContent>
							</Sheet>
						}
					</div>
				</div>
			</div>
		</div>
	)
}
