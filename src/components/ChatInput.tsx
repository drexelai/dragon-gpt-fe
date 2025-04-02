import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Mic, SendHorizonal } from "lucide-react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";

export default function ChatInput({
	onSendMessage,
	isStreaming,
	messageRef,
}: {
	onSendMessage: (message: string) => void;
	isStreaming: boolean;
	messageRef: React.RefObject<HTMLDivElement>;
}) {
	const [inputValue, setInputValue] = useState<{
		text: string;
		voice: boolean;
	}>({ text: "", voice: false });
	const [isRecording, setIsRecording] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);

	const handleSend = () => {
		if (inputValue.text.trim().length > 0) {
			onSendMessage(inputValue.text);
			setInputValue({ text: "", voice: false });
			if (messageRef.current) {
				messageRef.current.innerText = "";
			}
		}
	};

	// Remove the <br> tag when the content is empty (user deletes their text)
	// This makes the placeholder reappear
	useEffect(() => {
		const input = messageRef.current;
		if (input) {
			const textContent = input.textContent?.trim();
			if (textContent === "") {
				input.innerHTML = "";
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
			window.SpeechRecognition ?? window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.lang = "en-US";
		recognition.interimResults = false;

		recognition.onstart = () => {
			setIsRecording(true);
		};
		recognition.onresult = async (event: SpeechRecognitionEvent) => {
			const results = event.results;
			const transcript = results[0][0].transcript;
			setInputValue({ text: transcript, voice: true });

			// This was for when interimResults = true - it attempts to fix the cursor position (don't delete)
			// setTimeout(() => {
			// 	messageRef?.current?.focus();
			// 	document.execCommand('SelectAll', false, undefined);
			// 	document.getSelection()?.collapseToEnd();
			// }, 500);
		};
		recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			console.error(event);
			setIsRecording(false);
			toast.error("Permissions with your browser are preventing the microphone from working. Please check your settings.", { duration: 5000 });
		};
		recognition.onend = () => {
			console.log("recognition end");
			messageRef?.current?.focus(); // Focus the div
			document.execCommand("SelectAll", false, undefined);
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
		<div className="z-10 items-center justify-center flex flex-row gap-2 w-[-webkit-fill-available]">
			<div className="flex flex-row items-center px-1 w-[-webkit-fill-available] max-w-xl lg:max-w-4xl border-solid border rounded-3xl shadow-spread dark:shadow-none focus-within:ring-1 focus-within:ring-neutral-500 bg-gray-200 dark:bg-neutral-700 backdrop-blur-md backdrop-filter">
				<div
					contentEditable={true}
					translate="no"
					onInput={(e) => {
						setInputValue({
							text: (e.target as HTMLElement).textContent || "",
							voice: false,
						});
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
							e.preventDefault();
							handleSend();
						}
					}}
					ref={messageRef}
					suppressContentEditableWarning={true}
					className="flex items-center flex-1 p-2 h-auto min-h-10 max-h-40 overflow-y-auto whitespace-pre-wrap border-none
					focus-visible:ring-0 focus-visible:outline-none"
					data-placeholder="Message Mario"
					id="input-yes"
					style={{ overflowWrap: "anywhere" }}
				>
					{inputValue.voice ? inputValue.text : <></>}
				</div>
				<Button
					onClick={handleMicClick}
					className={`rounded-full hover:bg-whtie transition-all ${isRecording ? "bg-red-500 animate-pulse hover:bg-red-500" : ""
						}`}
					variant="ghost"
				>
					<Mic className="hover:scale-90 transition-all dark:text-gray-300" />
					<span className="sr-only">Record voice</span>
				</Button>
				<Button
				onClick={handleSend}
				disabled={isStreaming}
				className={`rounded-3xl px-3 bg-sage-primary`}
				variant="ghost"
			>
				<SendHorizonal className="md:hidden text-white" />
				<span className="hidden md:block text-white">Send</span>
			</Button>
			</div>

			<AlertDialog open={alertOpen}>
				<AlertDialogTrigger></AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Error</AlertDialogTitle>
						<AlertDialogDescription>
							Permissions with your browser are preventing the microphone from
							working. Please check your settings.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setAlertOpen(!alertOpen)}>
							Done
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
