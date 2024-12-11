import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DefaultAvatar from "../public/default_pfp.jpg";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import DOMPurify from "dompurify";
import { useConversationStore } from "@/stores/useConversationStore";
import logo from "../public/mario.png";
import { useMaskImage } from "@/hooks";

const options = {
	prefix: "chat-header-",
};

marked.use(gfmHeadingId(options));
marked.setOptions({
	gfm: true,
	breaks: true,
});

export default function ChatMessages({
	messages,
	isStreaming,
}: {
	messages: { text: string; isUser: boolean }[];
	isStreaming: boolean;
}) {
	const { activeConversation } = useConversationStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom(); // Ensure this works as expected
		const chatMessages = document.getElementById("chat-messages");
		if (!chatMessages) return;

		// Using setTimeout to wait for DOM update
		setTimeout(() => {
			const links = chatMessages.getElementsByTagName("a");
			for (const link of Array.from(links)) {
				link.setAttribute("target", "_blank");
			}
		}, 500);
	}, [messages]);

	useMaskImage(scrollRef);

	return (
		<div
			className="overflow-y-auto h-full w-full flex flex-col margin-top: auto"
			id="chat-messages"
			ref={scrollRef}
		>
			{" "}
			{/* Add id for links effect */}
			{activeConversation?.messages.map((message, index) => (
				<div
					key={index}
					className={`first:mt-auto flex ${message.isUser ? "justify-end" : "justify-start"
						} p-2`}
				>
					<div
						className={`flex p-2 items-start overflow-hidden text-wrap whitespace-pre-wrap break-words ${message.isUser && "flex-row-reverse"
							}`}
					>
						{!message.isUser ? (
							<Image
								priority
								src={logo}
								alt="Sage Wizard Logo"
								className="w-10 h-10 md:w-14 md:h-14 aspect-square rounded-full mr-4 object-cover flex-shrink-0 align-top"
							/>
						) : (
							<Image
								priority
								src={DefaultAvatar}
								alt="Default Avatar"
								className="w-10 h-10 md:w-14 md:h-14 aspect-square rounded-full ml-4 object-cover flex-shrink-0 align-top"
							/>
						)}
						{message.isUser ? (
							<span
								className="bg-gray-300/40 p-3 rounded-lg max-w-96 text-wrap whitespace-pre-wrap break-words"
								style={{ wordBreak: "break-word" }}
							>
								{message.text}
							</span>
						) : (
							<span
								className={`max-w-lg overflow-hidden text-wrap whitespace-pre-wrap break-words tracking-tight ${isStreaming && message.text.length === 0 && "after:content-[''] after:w-0.5 after:h-5 after:bg-black dark:after:bg-white after:animate-blink after:ml-1 after:inline-block"}`}
								style={{ wordBreak: "break-word" }}
								id="bot-response"
								// className="leading-8"
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(marked(message.text) as string),
								}}
							/>
						)}
					</div>
				</div>
			))}
			<div ref={messagesEndRef} />
		</div>
	);
}
