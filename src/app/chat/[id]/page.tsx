"use client";

import { useRouter } from "next/navigation";
import Nav from "@/components/Navigation/Nav";
import InfoToolTip from "@/components/InfoTooltip";
import ChatInterface from "@/components/ChatInterface";
import { useEffect } from "react";
import { useConversationStore } from "@/stores/useConversationStore";
import Calendar from "@/components/Calendar/week-calendar";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { cn } from "@/lib/utils";
import { MinimumWidth } from "@/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft } from "lucide-react";

// export async function generateMetadata({ params }: { params: { id: string }}) {
// 	const conversations = await fetchConversations();
// 	const activeConversation = conversations.find(
// 		(convo) => convo.id === params.id
// 	);

// 	if (!activeConversation) {
// 		return { title: "Conversation Not Found" };
// 	}

// 	return {
// 		title: activeConversation.title,
// 		description: `Viewing ${activeConversation.title}`,
// 	};
// }

export default function ChatPage({ params }: { params: { id: string } }) {
	const isDesktop = window.innerWidth > MinimumWidth.Large;
	const {
		setConversations,
		setActiveConversation
	} = useConversationStore();
	const { calendarOpen, setCalendarOpen } = useCalendarStore();
	const router = useRouter();

	useEffect(() => {
		const fetchConversations = () => {
			return JSON.parse(
				window.localStorage.getItem("conversations") || "[]"
			) as Conversation[];
		};

		if (typeof window !== "undefined") {
			const convos = fetchConversations();
			setConversations(convos);

			const activeConversation = convos.find((convo) => convo.id === params.id);
			setActiveConversation(activeConversation);
			if (!activeConversation) {
				router.push("/"); // if the conversation is not found, redirect to the home page
			}
		}
	}, []);

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
