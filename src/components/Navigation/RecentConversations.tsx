'use client';

import { useConversationStore } from "@/stores/useConversationStore";
import RecentConversationItem from "./RecentConversationItem";
import ZzIcon from "../../icons/general/zz-icon";

const RecentConversations = ({
	small
}: {
	small?: boolean,
}) => {
	const {
		conversations,
	} = useConversationStore();

	return (
		<div className="flex flex-col flex-grow overflow-auto">
			{!small && (
				<h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-wide first:mt-0">
					Recent
				</h2>
			)}
			<div className={`${small ? 'items-center' : 'items-start'} flex flex-col items-start max-h-96`}>
				{conversations.length > 0 ? [...conversations].reverse().map((convo, index) => (
					<RecentConversationItem conversation={convo} index={index} small={small} key={index} />
				)) : (
					<div className="flex flex-col gap-4 justify-center items-center w-full h-96">
						<ZzIcon className="text-muted-foreground" />
						{!small && <p className="text-muted-foreground text-center text-sm">{"When you create a new chat, it'll show up here"}</p>}
					</div>
				)}

			</div>
		</div>
	);
};

export default RecentConversations;
