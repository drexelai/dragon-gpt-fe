import { create } from "zustand";

interface SchedulerChatStore {
	schedulerMessages: Message[];
	setSchedulerMessages: (messages: Message[]) => void;
}

export const useSchedulerStore = create<SchedulerChatStore>((set) => ({
	schedulerMessages: [],
	setSchedulerMessages: (schedulerMessages) => set({ schedulerMessages })
}));
