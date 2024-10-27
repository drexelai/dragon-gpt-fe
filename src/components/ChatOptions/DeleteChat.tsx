import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Trash2, X } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteChat({
	convo,
	onDelete
}: {
	convo: Conversation;
	onDelete: (convo: Conversation) => void;
}) {

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
						<Button variant="destructive" className="rounded-xl" onClick={() => onDelete(convo)}>Delete</Button>
					</div>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	)
}
