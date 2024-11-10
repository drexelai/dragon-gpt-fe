'use client';

import { useConversationStore } from "@/stores/useConversationStore";
import RecentConversationItem from "./RecentConversationItem";

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
				{conversations.map((convo, index) => (
					<RecentConversationItem conversation={convo} index={index} small={small} key={index} />
				))}
			</div>
		</div>
	);
};

export default RecentConversations;
