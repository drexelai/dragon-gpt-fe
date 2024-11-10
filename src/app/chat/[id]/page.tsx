"use client";

import { useRouter } from "next/navigation";
import Nav from "@/components/Navigation/Nav";
import InfoToolTip from "@/components/InfoTooltip";
import ChatInterface from "@/components/ChatInterface";
import { useEffect } from "react";
import { useConversationStore } from "@/stores/useConversationStore";

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
	const {
		setConversations,
		setActiveConversation
	} = useConversationStore();

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
			<div className="py-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 w-full">
				<div className="flex flex-col">
					<div className="flex flex-row pb-4 mb-4 md:relative md:left-[-50px] md:top-[20px] justify-center md:justify-normal">
						<h1 className="text-4xl px-4 font-bold">SAGE</h1>
						<InfoToolTip />
					</div>
					<ChatInterface />
				</div>
			</div>
		</div>
	);
}
