"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { usePathname } from "next/navigation";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useConversationStore } from "@/stores/useConversationStore";
import { samples } from "@/lib/utils";
import logo from "../public/dragongpt transparent.png";
import Image from "next/image";

export default function ChatInterface() {
	const {
		conversations,
		setConversations,
		setActiveConversation,
		activeConversation
	} = useConversationStore();

	const [messages, setMessages] = useState<
		{ text: string; isUser: boolean }[] | null
	>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const messageRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	// auto focus on message input
	useEffect(() => {
		messageRef.current?.focus();
	}, []);

	// reset messages when navigating to home
	useEffect(() => {
		if (pathname === "/" && messages && messages.length > 0) {
			// new chat already sets activeConversation to undefined so just setMessages
			setMessages([]);
		}
	}, [pathname]);

	useEffect(() => {
		setMessages(activeConversation?.messages || []);
		setActiveConversation(activeConversation);
	}, [activeConversation, setActiveConversation]);

	const handleSendMessage = async (message: string) => {
		let firstMessage = false;
		setIsStreaming(true);
		const pastConversations = [...conversations]; // duplicate the array to avoid state mutation
		let updatedConversation = activeConversation;

		if (!updatedConversation) {
			firstMessage = true;
			const uuid = v4();

			// Create new active conversation
			updatedConversation = {
				id: uuid,
				title: `Conversation ${pastConversations.length + 1}`,
				messages: [{ text: message, isUser: true, timestamp: Date.now() }, { text: "", isUser: false, timestamp: Date.now() }],
			};

			// Update active conversation and set it
			setActiveConversation(updatedConversation);
			setConversations([...pastConversations, updatedConversation]);
			window.history.pushState(null, "", `/chat/${uuid}`);
		} else if(updatedConversation) {
			updatedConversation = {
				...updatedConversation,
				messages: [...updatedConversation.messages, { text: message, isUser: true, timestamp: Date.now() }, { text: "", isUser: false, timestamp: Date.now() }],
			};
			const updatedConversations = pastConversations.map((c) =>
				c.id === updatedConversation!.id ? updatedConversation! : c // convo will always be defined here, ! added to avoid typescript's annoying complaining
			);
			setConversations(updatedConversations);
			setActiveConversation(updatedConversation);
		}



		// setMessages((prev) => {
		// 	const newMessages = [...prev!];
		// 	newMessages.push({ text: message, isUser: true });
		// 	newMessages[0].text = 'test'
		// 	return newMessages;
		// });
		// console.log('')
		// setMessages((prev) => [...prev!, { text: message, isUser: true }]);
		// setMessages((prev) => [...prev!, { text: "", isUser: false }]);

		try {
			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/query", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					priorConversation: activeConversation?.messages.map(
						(messageObject) => {
							return {
								text: messageObject.text,
								isUser: messageObject.isUser,
							};
						}
					),
					query: message,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send message, status: " + response.status);
			}

			const reader = response.body?.getReader();
			if (!reader) throw new Error("Failed to get response body reader");

			let accumulatedChunks = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = new TextDecoder().decode(value);
				accumulatedChunks += chunk;

				const updateMessages = (chunks: string) => {
					updatedConversation = {
						...updatedConversation!,
						messages: updatedConversation!.messages.map((msg, index) =>
							index === updatedConversation!.messages.length - 1
								? { ...msg, text: chunks }
								: msg
						),
					}
				};

				updateMessages(accumulatedChunks);
				setActiveConversation(updatedConversation);
			}

			//Update conversation
			updatedConversation = {
				...updatedConversation,
				messages: updatedConversation!.messages.map((msg, index) =>
					index === updatedConversation!.messages.length - 1
						? { ...msg, text: accumulatedChunks }
						: msg
				),
			};
			setActiveConversation(updatedConversation);

			const conversationExists = pastConversations.some(
				(c) => c.id === updatedConversation!.id
			);
			const updatedConversations = conversationExists
				? pastConversations.map((c) => (c.id === updatedConversation!.id ? updatedConversation! : c)) // Update existing
				: [...pastConversations, updatedConversation!]; // Append new conversation if it doesn't exist

			setConversations(updatedConversations);

			if (firstMessage) {
				fetch(process.env.NEXT_PUBLIC_API_URL + "/summarize-convo", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message
					}),
				}).then(async data => {
					const newName = (await data.json()).messageSummary;
					updatedConversation!.title = newName;
					setConversations(updatedConversations);
					setActiveConversation(updatedConversation);
				}).catch(err => {
					console.error(err);
				});
			}
		} catch (error: unknown) {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (error instanceof Error) {
				console.error("Error fetching bot response:", error.message);
				const errorText = `I'm sorry, I couldn't process your request at this moment.\nPlease contact the developers with this error message: ${error.message} for question "${message}" `;

				updatedConversation = {
					...updatedConversation,
					messages: updatedConversation!.messages.map((msg, index) =>
						index === updatedConversation!.messages.length - 1
							? { ...msg, text: errorText }
							: msg
					),
				};
				setActiveConversation(updatedConversation);

				const conversationExists = pastConversations.some(
					(c) => c.id === updatedConversation!.id
				);
				const updatedConversations = conversationExists
					? pastConversations.map((c) => (c.id === updatedConversation!.id ? updatedConversation! : c)) // Update existing
					: [...pastConversations, updatedConversation!]; // Append new conversation if it doesn't exist

				setConversations(updatedConversations);

				setMessages((prev) => {
					const newMessages = [...prev!];
					const botMessage = newMessages[newMessages.length - 1];
					if(botMessage) {
						botMessage.text = errorText;
					} else {
						newMessages.push({ text: errorText, isUser: false });
					}
					return newMessages;
				});
			}
		} finally {
			setIsStreaming(false);
		}
	};

	return (
		<div className="flex flex-col h-[calc(100dvh-5rem)] sm:h-[calc(100vh-10rem)] supports-[dvh]:h-[calc(100dvh-10rem)] w-full items-center">
			{messages && messages.length > 0 && (
				<div className="xl:px-20 mt-4 flex-grow overflow-auto w-full">
					<ChatMessages messages={messages} isStreaming={isStreaming} />
				</div>
			)}
			{messages && messages.length === 0 && (
				<>
					{/* Legacy components below */}
					{/* <div className="hidden dark:block absolute -z-10 top-72 m-auto w-72 h-72 lg:w-96 lg:h-96 bg-gradient-radial from-white/20 to-transparent rounded-full blur-2xl"></div> */}
					{/* <div className="hidden md:flex flex-col items-center justify-center h-full w-full">
						<h1 className="text-3xl font-bold mb-10">Ask SAGE</h1>
						<div className="flex flex-row items-start gap-10">
							<div className="flex flex-col items-center">
								<h2 className="hidden lg:block text-lg font-bold mb-4">
									Ask Questions
								</h2>
								<div className="flex flex-col gap-4">
									{samples.questions.map((message, index) => (
										// Put the message in the input field when clicked
										<Button
											key={index}
											variant="ghost"
											onClick={() => handleSendMessage(message)}
											className="max-w-80 h-fit text-wrap text-base font-light rounded-lg bg-gray-100 dark:bg-gray-100/40 hover:bg-gray-200 dark:hover:bg-gray-300/40 text-left px-2"
										>
											{message}
										</Button>
									))}
								</div>
							</div>
							<div className="hidden lg:flex flex-col items-center">
								<h2 className="text-lg font-bold mb-4 text-center">
									What can SAGE do?
								</h2>
								<div className="flex flex-col gap-4">
									{samples.capabilities.map((str, index) => (
										<span
											className="max-w-80 h-fit text-wrap py-2 px-2 bg-gray-100 dark:bg-gray-100/40 rounded-lg"
											key={index}
										>
											{str}
										</span>
									))}
								</div>
							</div>
							<div className="hidden lg:flex flex-col items-center">
								<h2 className="text-lg font-bold mb-4">Limitations</h2>
								<div className="flex flex-col gap-4">
									{samples.limitations.map((str, index) => (
										<span
											className="max-w-80 h-fit text-wrap py-2 px-2 bg-gray-100 dark:bg-gray-100/40 rounded-lg"
											key={index}
										>
											{str}
										</span>
									))}
								</div>
							</div>
						</div>
					</div> */}
					<h1 className="text-3xl md:text-4xl p-1 font-bold mt-20 mb-20 md:mt-5 md:mb-5 text-center w-72 md:w-1/2 flex-1 text-transparent bg-clip-text bg-light-teal-gradient dark:bg-dark-teal-gradient">
					Channel your inner academic weapon
					</h1>
					<Image
					priority
					src={logo}
					alt="Sage Wizard Logo"
					width={120}
					className="mt-0 w-42 sm:w-56 md:w-44 lg:w-44 xl:w-56"
					/>
					<div className="overflow-auto flex justify-end lg:items-center flex-col h-full w-full">
						<p className="p-2 mb-2 max-w-80 text-base font-bold text-center mx-auto"> Ask DragonGPT about:</p>
					<div className="flex flex-col md:items-center overflow-auto no-scrollbar mb-2">
							{samples.know.map((arr, index) => (
								<div key={index} className="flex flex-row">
									{arr.map((message, i) => (
										<Button
											key={i}
											variant="ghost"
											onClick={() => handleSendMessage("Tell me about " + message)}
											className="p-1 px-2 lg:px-3 m-2 max-w-80 h-fit  text-base font-light rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-left"
										>
											{message}
										</Button>
									))}
								</div>
							))}
						</div>
					</div>
				</>
			)}
			{!messages && (
				<div className="flex flex-grow justify-center">
					<Spinner className="" />
				</div>
			)}
			<ChatInput
				onSendMessage={handleSendMessage}
				isStreaming={isStreaming}
				messageRef={messageRef}
			/>
		</div>
	);
}
