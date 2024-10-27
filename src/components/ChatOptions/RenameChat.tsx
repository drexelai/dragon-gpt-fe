import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Pencil, X } from "lucide-react";
import { Button } from "../ui/button";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";

export default function RenameChat({
	convo,
	form,
	onSubmit
}: {
	convo: Conversation;
	form: UseFormReturn<{ name: string }>;
	onSubmit: (values: { name: string }, convo: Conversation) => void;
}) {

	return (
		<AlertDialog>
			<AlertDialogTrigger className="flex gap-10 relative px-2 py-1.5 transition-all  hover:bg-sky-300/50 text-sm items-center rounded-sm w-full">
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
						<form onSubmit={form.handleSubmit((data) => onSubmit(data, convo))} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="hidden">New Name</FormLabel>
										<FormControl>
											<Input placeholder="New name" type="text" autoComplete="off" {...field} />
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
