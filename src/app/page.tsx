"use client";

import ChatInterface from "@/components/ChatInterface";
import Nav from "@/components/Navigation/Nav";
import InfoToolTip from "@/components/InfoTooltip";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useConversationStore } from "@/stores/useConversationStore";
import Calendar from "@/components/Calendar/week-calendar";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { cn } from "@/lib/utils";
import { MinimumWidth } from "@/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft } from "lucide-react";

export default function Home() {
	const isDesktop = window.innerWidth > MinimumWidth.Large;
	const {
		setConversations,
		setActiveConversation,
	} = useConversationStore();
	const { calendarOpen, setCalendarOpen } = useCalendarStore();
	const pathname = usePathname();

	useEffect(() => {
		const fetchConversations = () => {
			return JSON.parse(
				window.localStorage.getItem("conversations") || "[]"
			) as Conversation[];
		};

		if (typeof window !== "undefined") {
			setConversations(fetchConversations());
		}
	}, []);

	useEffect(() => {
		const updatedConversations = JSON.parse(
			window.localStorage.getItem("conversations") || "[]"
		);
		setConversations(updatedConversations);
		const conversationId = window.location.pathname.split("/").pop();
		const activeConversation = updatedConversations.find(
			(convo: Conversation) => convo.id === conversationId
		);
		setActiveConversation(activeConversation);
	}, [pathname]);

	return (
		<div className="m-4 flex">
			<Nav />
			<div className={cn(
				"w-full",
				!calendarOpen && "sm:py-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 "
			)}>
				<div className="flex flex-col gap-8">
					<div className="flex flex-row pb-4 md:relative md:left-[-50px] md:top-[20px] justify-center md:justify-normal">
						<h1 className={cn(
							"fixed md:relative text-4xl px-4 font-semibold",
							calendarOpen && "ml-8"
						)}>DragonGPT</h1>
						<InfoToolTip />
					</div>
					<div className="flex flex-row">
						<ChatInterface />
						{isDesktop
							? calendarOpen && (<Calendar />)
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
									<Calendar />
								</SheetContent>
							</Sheet>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
