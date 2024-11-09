'use client';

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { EllipsisVertical, MessageSquareText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import RenameChat from "./ChatOptions/RenameChat";
import DeleteChat from "./ChatOptions/DeleteChat";

const renameForm = z.object({
	name: z.string()
		.min(1, 'Name must be at least 1 character')
		.max(40, 'Name cannot be more than 40 characters')
		.regex(/^[a-zA-Z0-9 ]+$/, 'Name can only contain letters, numbers, and spaces'),
});

const RecentConversations = ({
	conversations,
	activeConversation,
	small
}: {
	conversations: Conversation[],
	activeConversation?: Conversation,
	small?: boolean,
}) => {
	const router = useRouter();
	const form = useForm<z.infer<typeof renameForm>>({
		resolver: zodResolver(renameForm),
		defaultValues: {
			name: '',
		}
	});

	const onSubmit = (values: z.infer<typeof renameForm>, convo: Conversation) => {
		handleRename(convo, values.name);
	}

	const setActiveConversation = (convo: Conversation) => {
		router.push(`/chat/${convo.id}`);
	};

	const handleRename = (convo: Conversation, newName: string) => {
		const conversations = JSON.parse(window.localStorage.getItem('conversations') || '[]') as Conversation[];
		const conversation = conversations.find(c => c.id === convo.id);
		if (conversation) {
			conversation.title = newName;
			window.localStorage.setItem('conversations', JSON.stringify(conversations));
			window.location.reload();
		}
	}

	const handleDelete = (convo: Conversation) => {
		const conversations = JSON.parse(window.localStorage.getItem('conversations') || '[]') as Conversation[];
		const newConversations = conversations.filter(c => c.id !== convo.id);
		window.localStorage.setItem('conversations', JSON.stringify(newConversations));
		router.push('/');
	}

	return (
		<div className="flex flex-col flex-grow overflow-auto">
			{!small && (
				<h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-wide first:mt-0">
					Recent
				</h2>
			)}
			<div className={`${small ? 'items-center' : 'items-start'} flex flex-col items-start max-h-96`}>
				{conversations.map((convo, index) => (
					<div className='grid grid-cols-[1fr_auto] items-center justify-start w-[-webkit-fill-available]' key={index}>
						<ContextMenu modal={false}>
							<ContextMenuTrigger>
								<Button
									key={convo.id}
									className={`${!small ? 'min-w-32 px-1' : ''} flex flex-shrink-0 items-center text-left ${convo.id === activeConversation?.id ? 'dark:bg-gray-200/20 bg-gray-200/60' : ''} hover:bg-gray-300/40 my-2`}
									onClick={() => setActiveConversation(convo)}
									variant={"ghost"}
								>
									<MessageSquareText className={`${!small && 'mx-2'} w-4`} />
									{!small && (
										<span className="lg:max-w-44 md:max-w-32 max-w-52 w-28 truncate">{convo.title}</span>
									)}
								</Button>
							</ContextMenuTrigger>
							<ContextMenuContent className="pointer-events-auto rounded-xl">
								<ContextMenuItem asChild>
									<RenameChat convo={convo} form={form} onSubmit={onSubmit} />
								</ContextMenuItem>
								<ContextMenuItem asChild>
									<DeleteChat convo={convo} onDelete={handleDelete} />
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>

						{!small && (
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="p-0 px-2 flex items-center">
										<EllipsisVertical className="opacity-70" />
										<span className="sr-only">Conversation options</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="rounded-xl">
									<DropdownMenuItem asChild>
										<RenameChat convo={convo} form={form} onSubmit={onSubmit} />
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<DeleteChat convo={convo} onDelete={handleDelete} />
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default RecentConversations;
