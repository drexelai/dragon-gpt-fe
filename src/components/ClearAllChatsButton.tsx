import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export default function ClearAllChatsButton({
	iconOnly
}: {
	iconOnly?: boolean
}) {
	const handleClearAllChats = () => {
		window.localStorage.removeItem('conversations');
		window.location.reload();
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"} className="hover:bg-gray-300/40 py-4">
					<Trash2Icon className="h-[1.2rem] w-[1.2rem] mr-2" />{!iconOnly && <>Clear all chats</>}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your conversation data off of the website.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleClearAllChats}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
