"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function NewChatButton({
	state
}: {
	state?: "open" | "closed" | "mobile"
}) {
	const router = useRouter();

	const startNewConversation = () => {
		router.push(`/`);
	};

	return (
		<>
			<Button className={`${!state || state === 'open' ? 'px-10' : 'w-fit'} shadow-md rounded-xl`} variant={"default"} size={state === "mobile" ? "lg" : "default"} onClick={startNewConversation}>
				<Plus className="scale-75" />{!state || state === 'open' ? 'New Chat' : ''}
			</Button>
		</>
	)
}
