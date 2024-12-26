"use client";
import WeekCalendar from "@/components/Calendar/week-calendar";
import ChatInterface from "@/components/ChatInterface";
import InfoTooltip from "@/components/InfoTooltip";
import Nav from "@/components/Navigation/Nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { useSchedulerStore } from "@/stores/useConversationStore";
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
					<div className="flex flex-row gap-2 self-center border text-blue-950 border-blue-950 rounded-3xl p-4">
						<div>
							<p className="font-semibold">Dragon Scheduler</p>
							<p>Take a look at your schedule</p>
						</div>
						<ArrowUpRight />
					</div>
					<div className="flex flex-row">
						<ChatInterface />
						{isDesktop
							? calendarOpen && (<WeekCalendar />)
							: <Sheet open={calendarOpen} onOpenChange={() => setCalendarOpen()} >
								<SheetContent className="!max-w-full w-full">
									<div className="flex flex-row gap-6">
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
