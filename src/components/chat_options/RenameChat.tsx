import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Pencil, X } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useConversationStore } from "@/stores/useConversationStore";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

const renameForm = z.object({
	name: z.string()
		.min(1, 'Name must be at least 1 character')
		.max(40, 'Name cannot be more than 40 characters')
		.regex(/^[a-zA-Z0-9 ]+$/, 'Name can only contain letters, numbers, and spaces'),
});

export default function RenameChat({
	convo,
	setDropdownOpen,
}: {
	convo: Conversation;
	setDropdownOpen: (open: boolean) => void;
}) {
	const { setConversations, conversations } = useConversationStore();
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof renameForm>>({
		resolver: zodResolver(renameForm),
		defaultValues: {
			name: '',
		}
	});

	const onSubmit = (values: z.infer<typeof renameForm>, convo: Conversation) => {
		handleRename(convo, values.name);
		setOpen(false);
		setDropdownOpen(false);
	}

	const handleRename = (convo: Conversation, newName: string) => {
		convo.title = newName;
		setConversations(conversations);
		toast.success('Chat renamed successfully');
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger className="flex gap-10 relative px-2 py-1.5 transition-all  hover:bg-gray-300/50 text-sm items-center rounded-sm w-full">
				<p>Rename</p>
				<Pencil className="w-5 h-5 ml-auto" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogCancel asChild>
						<Button variant="ghost" className="absolute top-2 right-2 border-0">
							<X className="opacity-70 w-4 h-4" />
							<span className="sr-only">Close</span>
						</Button>
					</AlertDialogCancel>
					<AlertDialogTitle>
						Rename <span className="text-">{`"${convo.title}"`}</span>
					</AlertDialogTitle>
					<AlertDialogDescription className="hidden" />
					<Form {...form}>
						<form onSubmit={form.handleSubmit((data) => {
							onSubmit(data, convo)
						})} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="hidden">New Name</FormLabel>
										<FormControl>
											<Input placeholder={convo.title} type="text" autoComplete="off" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<Button type="submit" className="mr-2 rounded-xl">Submit</Button>
						</form>
					</Form>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	)
}
