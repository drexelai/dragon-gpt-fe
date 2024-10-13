import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mic, Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export default function ChatInput({
	onSendMessage,
	messageRef,
}: {
	onSendMessage: (message: string) => void;
	messageRef: React.RefObject<HTMLDivElement>;
}) {
	const [inputValue, setInputValue] = useState<{ text: string, voice: boolean }>({ text: "", voice: false });
	const [isSending, setIsSending] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);

	const handleSend = () => {
		if (inputValue.text.trim().length > 0) {
			setIsSending(true);
			onSendMessage(inputValue.text);
			setInputValue({ text: "", voice: false });
			if (messageRef.current) {
				messageRef.current.innerText = "";
			}
			setTimeout(() => setIsSending(false), 500);
		}
	};

	// Remove the <br> tag when the content is empty (user deletes their text)
	// This makes the placeholder reappear
	useEffect(() => {
		const input = messageRef.current;
		if (input) {
			const textContent = input.textContent?.trim();
			if (textContent === '') {
				input.innerHTML = '';
			}
		}
	}, [messageRef.current?.textContent]);

	// useEffect(() => {
	// 	if (textAreaRef.current) {
	// 		const textarea = textAreaRef.current;
	// 		if (textarea.textContent && textarea.textContent.length > 1) {
	// 			textarea.style.height = 'auto'; // Reset the height
	// 			const scrollHeight = textarea.scrollHeight;

	// 			// Check if the content overflows horizontally (text wrapping)
	// 			if (textarea.scrollHeight > textarea.clientHeight || textarea.scrollWidth > textarea.clientWidth) {
	// 				textarea.style.height = `${scrollHeight}px`;
	// 			}
	// 		}
	// 	}
	// }, [inputValue]);

	const handleMicClick = () => {
		const SpeechRecognition =
			(window as any).SpeechRecognition ||
			(window as any).webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.lang = "en-US";
		recognition.interimResults = false;

		recognition.onstart = () => {
			setIsRecording(true);
		};
		recognition.onresult = async (event: any) => {
			const results = event.results as SpeechRecognitionResultList;
			const transcript = results[0][0].transcript;
			setInputValue({ text: transcript, voice: true });

			// This was for when interimResults = true - it attempts to fix the cursor position (don't delete)
			// setTimeout(() => {
			// 	messageRef?.current?.focus();
			// 	document.execCommand('SelectAll', false, undefined);
			// 	document.getSelection()?.collapseToEnd();
			// }, 500);

		};
		recognition.onerror = (event: any) => {
			console.error(event);
			setAlertOpen(true);
			setIsRecording(false);
		};
		recognition.onend = () => {
			console.log("recognition end");
			messageRef?.current?.focus(); // Focus the div
			document.execCommand('SelectAll', false, undefined);
			document.getSelection()?.collapseToEnd();
			setIsRecording(false);
			// handleSend(); // Should we send the message after recording?
		};

		if (isRecording) {
			recognition.stop();
			setIsRecording(false);
			return;
		} else {
			recognition.start();
			messageRef?.current?.focus(); // Focus the div
		}
	};

	return (
		<div className="z-10 *:items-center justify-center flex flex-row gap-2 w-[-webkit-fill-available]">
			<div className="flex flex-row w-[-webkit-fill-available] max-w-xl border-solid border rounded-xl shadow-spread dark:shadow-none focus-within:ring-1 focus-within:ring-black">
				<div
					contentEditable={true}
					translate="no"
					onInput={(e) => {
						setInputValue({ text: (e.target as HTMLElement).textContent || "", voice: false })
					}
					}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					ref={messageRef}
					suppressContentEditableWarning={true}
					className="flex items-center flex-1 p-2 h-auto min-h-10 max-h-40 overflow-y-auto whitespace-pre-wrap break-words border-none
					focus-visible:ring-0 focus-visible:outline-none"
					data-placeholder="Message DragonGPT"
					id="input-yes"
				>
					{inputValue.voice ? inputValue.text : <></>}
				</div>
				<Button
					onClick={handleMicClick}
					className={`rounded-full ${isRecording ? "bg-red-500 animate-pulse hover:bg-red-500" : ""
						}`}
					variant="ghost"
				>
					<Mic />
				</Button>
			</div>
			<Button
				onClick={handleSend}
				disabled={isSending}
				className={`rounded-xl px-3`}
				variant="default"
			>
				<Send className="md:hidden" />
				<span className="hidden md:block">Send</span>
			</Button>
			<AlertDialog open={alertOpen}>
				<AlertDialogTrigger></AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Error</AlertDialogTitle>
						<AlertDialogDescription>
							Permissions with your browser are preventing the microphone from working. Please check your settings.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setAlertOpen(!alertOpen)}>Done</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

