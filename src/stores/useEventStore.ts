import { create } from 'zustand';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

interface EventStore {
    baseEvents: CalendarEvent[];
    setBaseEvents: (events: CalendarEvent[]) => void;
    updateEvent: (event: CalendarEvent) => void;
    deleteEvent: (eventId: string) => void;
    generateMockEvents: (baseDate: moment.Moment) => void;
}

const eventTitles = [
    'Team Meeting', 'Project Review', 'Client Call', 'Lunch Break',
    'Code Review', 'Design Sprint', 'Weekly Sync', 'Planning Session',
    '1:1 Meeting', 'Workshop'
];

const locations = [
    'Room 101', 'Room 102', 'Room 103', 'Conference A', 'Conference B',
    'Meeting Room 1', 'Meeting Room 2', 'Cafeteria', 'Office', 'Virtual'
];

const colors = [
    'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-green-300',
    'bg-blue-300', 'bg-indigo-300', 'bg-purple-300', 'bg-pink-300'
];

export const useEventStore = create<EventStore>((set) => ({
    baseEvents: [],
    setBaseEvents: (events) => set({ baseEvents: events }),
    updateEvent: (updatedEvent) => set((state) => ({
        baseEvents: state.baseEvents.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        )
    })),
    deleteEvent: (eventId) => set((state) => ({
        baseEvents: state.baseEvents.filter(event => event.id !== eventId)
    })),
    generateMockEvents: (baseDate) => {
        const events: CalendarEvent[] = [];

        // Generate events for 14 days
        for (let day = 0; day < 14; day++) {
            const currentDay = moment(baseDate).add(day, 'days');

            // Skip weekends
            if (currentDay.day() === 0 || currentDay.day() === 6) continue;

            // Random number of events for this day (2-5)
            const numEvents = Math.floor(Math.random() * 4) + 2;
            const usedHours = new Set();

            for (let i = 0; i < numEvents; i++) {
                // Find an available start hour (9-16)
                let startHour;
                do {
                    startHour = Math.floor(Math.random() * 8) + 9; // 9 AM to 4 PM
                } while (usedHours.has(startHour));

                usedHours.add(startHour);
                const duration = Math.random() < 0.7 ? 1 : 2;

                events.push({
                    id: uuidv4(),
                    title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
                    location: locations[Math.floor(Math.random() * locations.length)],
                    start: moment(currentDay).hour(startHour).minute(0).toDate(),
                    end: moment(currentDay).hour(startHour + duration).minute(0).toDate(),
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        }

        // Add recurring events
        const recurringEvents: CalendarEvent[] = [
            {
                id: uuidv4(),
                title: 'Recur 0',
                location: 'Virtual',
                start: moment(baseDate).hour(10).minute(0).toDate(),
                end: moment(baseDate).hour(10).minute(30).toDate(),
                color: 'bg-blue-300',
                recurrence: {
                    type: 'specific-days',
                    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                    endDate: moment(baseDate).add(3, 'months').toDate(),
					interval: 1
                }
            },
            {
                id: uuidv4(),
                title: 'Recur 1',
                location: 'Conference A',
                start: moment(baseDate).day(1).hour(14).minute(0).toDate(),
                end: moment(baseDate).day(1).hour(15).minute(0).toDate(),
                color: 'bg-green-300',
                recurrence: {
                    type: 'weekly',
                    interval: 2
                }
            }
        ];

        events.push(...recurringEvents);
        events.sort((a, b) => moment(a.start).diff(moment(b.start)));

        set({ baseEvents: events });
    }
}));
