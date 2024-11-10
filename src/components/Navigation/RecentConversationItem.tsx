import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { EllipsisVertical, MessageSquareText } from "lucide-react";
import { useConversationStore } from "@/stores/useConversationStore";
import RenameChat from "../ChatOptions/RenameChat";
import DeleteChat from "../ChatOptions/DeleteChat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

export default function RecentConversationItem({
	conversation,
	index,
	small
}: {
	conversation: Conversation
	index: number
	small?: boolean
}) {
	const {
		activeConversation,
	} = useConversationStore();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const goToChat = (convo: Conversation) => {
		router.push(`/chat/${convo.id}`);
	};

	return (
		<div className='grid grid-cols-[1fr_auto] items-center justify-start w-[-webkit-fill-available]' key={index}>
			<ContextMenu modal={false}>
				<ContextMenuTrigger>
					<Button
						key={conversation.id}
						className={`${!small ? 'min-w-32 px-1' : ''} flex flex-shrink-0 items-center text-left ${conversation.id === activeConversation?.id ? 'dark:bg-gray-200/20 bg-gray-200/60' : ''} hover:bg-gray-300/40 my-2`}
						onClick={() => goToChat(conversation)}
						variant={"ghost"}
					>
						<MessageSquareText className={`${!small && 'mx-2'} w-4`} />
						{!small && (
							<span className="lg:max-w-44 md:max-w-32 max-w-52 w-28 truncate">{conversation.title}</span>
						)}
					</Button>
				</ContextMenuTrigger>
				<ContextMenuContent className="pointer-events-auto rounded-xl">
					<ContextMenuItem asChild>
						<RenameChat convo={conversation} setDropdownOpen={setOpen} />
					</ContextMenuItem>
					<ContextMenuItem asChild>
						<DeleteChat convo={conversation} setDropdownOpen={setOpen} />
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			{!small && (
				<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="p-0 px-2 flex items-center hover:bg-gray-300/40">
							<EllipsisVertical className="opacity-70" />
							<span className="sr-only">Conversation options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="rounded-xl">
						<DropdownMenuItem onClick={() => setOpen(false)} asChild>
							<RenameChat convo={conversation} setDropdownOpen={setOpen} />
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<DeleteChat convo={conversation} setDropdownOpen={setOpen} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	)
}
