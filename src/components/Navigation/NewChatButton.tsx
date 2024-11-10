"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useConversationStore } from "@/stores/useConversationStore";

export default function NewChatButton({
	state
}: {
	state?: "open" | "closed" | "mobile"
}) {
	const { setActiveConversation } = useConversationStore();
	const router = useRouter();

	const startNewConversation = () => {
		router.push(`/`);
		setActiveConversation(undefined);
	};


	return (
		<>
			<Button className={`${!state || state === 'open' ? 'px-10' : 'w-fit'} shadow-md rounded-xl`} variant={"default"} size={state === "mobile" ? "lg" : "default"} onClick={startNewConversation}>
				<Plus className="scale-75" />{!state || state === 'open' ? 'New Chat' : ''}
			</Button>
		</>
	)
}
