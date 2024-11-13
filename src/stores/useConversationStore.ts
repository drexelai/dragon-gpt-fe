import { create } from 'zustand';

interface ConversationStore {
	conversations: Conversation[];
	activeConversation?: Conversation;
	messages: Message[] | null;
	setConversations: (conversations: Conversation[]) => void;
	setActiveConversation: (conversation: Conversation | undefined) => void;
	setMessages: (messages: Message[] | null) => void;
	setMessagesPrevious: (fn: (prev: Message[] | null) => Message[]) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
	conversations: [],
	activeConversation: undefined,
	messages: null,
	setConversations: (conversations) => {
		set({ conversations });
		window.localStorage.setItem('conversations', JSON.stringify(conversations));
	},
	setActiveConversation: (conversation) => set({ activeConversation: conversation }),
	setMessages: (messages) => set({ messages }),
	setMessagesPrevious: (fn: (prev: Message[] | null) => Message[]) => {
		set((state => ({ messages: fn(state.messages) }) ));
	}
}));
