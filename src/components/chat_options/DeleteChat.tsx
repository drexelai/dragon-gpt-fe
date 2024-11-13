import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { useConversationStore } from "@/stores/useConversationStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteChat({
	convo,
	setDropdownOpen
}: {
	convo: Conversation;
	setDropdownOpen: (open: boolean) => void;
}) {
	const { activeConversation, setConversations } = useConversationStore();
	const router = useRouter();

	const handleDelete = (convo: Conversation) => {
		const conversations = JSON.parse(window.localStorage.getItem('conversations') || '[]') as Conversation[];
		const newConversations = conversations.filter(c => c.id !== convo.id);
		setConversations(newConversations);
		if(activeConversation && activeConversation.id === convo.id) {
			router.push('/');
		} else {
			setDropdownOpen(false); // close the dropdown if the page doesn't change
		}
		toast.success('Chat deleted successfully');
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger className="flex gap-10 relative px-2 py-1.5 transition-all hover:bg-red-400/40 text-red-500 text-sm items-center rounded-sm w-full">
				<p>Delete</p>
				<Trash2 className="w-5 h-5 ml-auto" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader className="space-y-4">
					<AlertDialogCancel asChild>
						<Button variant="ghost" className="absolute top-2 right-2 border-0">
							<X className="opacity-70 w-4 h-4" />
							<span className="sr-only">Close</span>
						</Button>
					</AlertDialogCancel>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription className="mb-2">
						This will permanently delete the message history of <span className="font-semibold">{convo.title}</span>
					</AlertDialogDescription>
					<div>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" className="rounded-xl" onClick={() => handleDelete(convo)}>Delete</Button>
						</AlertDialogTrigger>
					</div>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	)
}
