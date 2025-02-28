import { create } from 'zustand';

interface CalendarStore {
	calendarOpen: boolean;
	setCalendarOpen: () => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
	calendarOpen: false,
	setCalendarOpen: () => set((state) => ({ calendarOpen: !state.calendarOpen })),
}));
