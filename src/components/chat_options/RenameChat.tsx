import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useConversationStore } from "@/stores/useConversationStore";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const renameForm = z.object({
	name: z.string()
		.min(1, 'Title must be at least 1 character')
		.max(40, 'Title cannot be more than 40 characters')
		.regex(/^[a-zA-Z0-9 ]+$/, 'Title can only contain letters, numbers, and spaces'),
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="flex gap-10 relative px-2 py-1.5 transition-all  hover:bg-gray-300/50 text-sm items-center rounded-sm w-full">
				<p>Rename</p>
				<Pencil className="w-5 h-5 ml-auto" />
			</DialogTrigger>
			<DialogContent className="overflow-y-scroll max-h-dvh">
				<DialogHeader>
					<DialogTitle>
						Rename <span className="text-">{`"${convo.title}"`}</span>
					</DialogTitle>
					<DialogDescription className="hidden" />
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
											<Input placeholder={convo.title} type="text" autoComplete="off" {...field} className="text-base" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<Button type="submit" className="mr-2 rounded-xl">Submit</Button>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
