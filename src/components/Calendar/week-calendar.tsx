import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { WeekHeader } from './views/week/week-header';
import { EventLayer } from './event-layer';
import { MinimumWidth, type CalendarEvent } from '@/types';
import { Button } from '../ui/button';
import { useMaskImage } from '@/hooks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DayIcon, MonthIcon, ScheduleIcon, ThreeDayIcon, WeekIcon } from '@/icons/calendar';
import { WeekViewGrid } from './views/week/week-view-grid';
import CalendarHours from './hours';
import ScheduleView from './views/schedule-view';
import { CalendarView } from '@/lib/types';

const generateMockEvents = (baseDate: moment.Moment): CalendarEvent[] => {
	const events: CalendarEvent[] = [];
	const eventTitles = [
		'Team Meeting',
		'Project Review',
		'Client Call',
		'Lunch Break',
		'Code Review',
		'Design Sprint',
		'Weekly Sync',
		'Planning Session',
		'1:1 Meeting',
		'Workshop'
	];

	const locations = [
		'Room 101',
		'Room 102',
		'Room 103',
		'Conference A',
		'Conference B',
		'Meeting Room 1',
		'Meeting Room 2',
		'Cafeteria',
		'Office',
		'Virtual'
	];

	const colors = [
		'bg-red-300',
		'bg-orange-300',
		'bg-yellow-300',
		'bg-green-300',
		'bg-blue-300',
		'bg-indigo-300',
		'bg-purple-300',
		'bg-pink-300'
	];

	// Generate events for 14 days
	for (let day = 0; day < 14; day++) {
		const currentDay = moment(baseDate).add(day, 'days');

		// Skip weekends
		if (currentDay.day() === 0 || currentDay.day() === 6) continue;

		// Random number of events for this day (2-5)
		const numEvents = Math.floor(Math.random() * 4) + 2;

		// Keep track of used hours to avoid overlap
		const usedHours = new Set();

		for (let i = 0; i < numEvents; i++) {
			// Find an available start hour (9-16)
			let startHour;
			do {
				startHour = Math.floor(Math.random() * 8) + 9; // 9 AM to 4 PM
			} while (usedHours.has(startHour));

			usedHours.add(startHour);

			// Random duration 1-2 hours
			const duration = Math.random() < 0.7 ? 1 : 2;

			events.push({
				id: `${day}-${i}`,
				title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
				location: locations[Math.floor(Math.random() * locations.length)],
				start: moment(currentDay)
					.hour(startHour)
					.minute(0)
					.toDate(),
				end: moment(currentDay)
					.hour(startHour + duration)
					.minute(0)
					.toDate(),
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}

		// Sort events by start time
		events.sort((a, b) => moment(a.start).diff(moment(b.start)));
	}

	return events;
};

export default function WeekCalendar() {
	const [currentDate, setCurrentDate] = useState(moment());
	const [events] = useState<CalendarEvent[]>(() => generateMockEvents(currentDate));
	const isDesktop = window?.innerWidth > MinimumWidth.Large;
	const scrollRef = useRef<HTMLDivElement>(null);
	const [currentView, setCurrentView] = useState<CalendarView>('week');

	const [swipeProgress, setSwipeProgress] = useState(0); // Track swipe progress
	const [isSwiping, setIsSwiping] = useState(false);
	const [startX, setStartX] = useState(0);
	const [offsetX, setOffsetX] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useMaskImage(scrollRef);

	const [weekDays, setWeekDays] = useState(
		Array.from({ length: isDesktop ? 7 : 5 }, (_, i) =>
			moment(currentDate).startOf(isDesktop ? 'week' : 'day').add(i, 'days')
		)
	);

	const goToPrevious = () => {
		let newDate: moment.Moment;
		if (currentView === 'day') {
			newDate = currentDate.clone().subtract(1, "days");
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		} else if (currentView === '3day') {
			const firstShownDate = weekDays[0];
			newDate = moment(firstShownDate).subtract(3, "days");
			setWeekDays(
				Array.from({ length: 3 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		} else if (currentView === 'week') {
			const firstShownDate = weekDays[0];
			newDate = moment(firstShownDate).subtract(5, "days");
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}

		setCurrentDate(newDate!);
	};

	const goToNext = () => {
		let newDate: moment.Moment;
		if (currentView === 'day') {
			newDate = currentDate.clone().add(1, "days");
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		} else if (currentView === '3day') {
			const lastShownDate = weekDays[2];
			newDate = moment(lastShownDate).add(1, "days");
			setWeekDays(
				Array.from({ length: 3 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		} else if (currentView === 'week') {
			const lastShownDate = weekDays[4];
			newDate = moment(lastShownDate).add(1, "days");
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}

		setCurrentDate(newDate!);
	};

	const goToToday = () => {
		const newDate = moment();
		setCurrentDate(moment());
		if (currentView === 'week' || currentView === 'day') {
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		} else if (currentView === '3day') {
			setWeekDays(
				Array.from({ length: 3 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		setIsSwiping(true);
		setStartX(e.touches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isSwiping) return;
		setOffsetX(e.touches[0].clientX - startX);
		const currentX = e.touches[0].clientX;
		const delta = currentX - startX;
		const progress = Math.max(0, Math.min(1, Math.abs(delta) / window.innerWidth)); // 0 to 1
		console.log({ progress, delta, })
		setSwipeProgress(progress);
	};

	const handleTouchEnd = () => {
		setIsSwiping(false);
		if (offsetX > 50) {
			goToPrevious(); // Swipe right
		} else if (offsetX < -50) {
			goToNext(); // Swipe left
		}
		setOffsetX(0);
		setSwipeProgress(0);
	};

	useEffect(() => {
		if (currentView === 'week' || currentView === 'day') {
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(currentDate).add(i, 'days')
				)
			);
		} else if (currentView === '3day') {
			setWeekDays(
				Array.from({ length: 3 }, (_, i) =>
					moment(currentDate).add(i, 'days')
				)
			);
		}
	}, [currentView]);

	return (
		<div className="w-full max-w-4xl flex flex-col h-full bg-background rounded-lg">
			{/* <div className="flex items-center gap-2 w-full mt-4 px-4">
				<CalendarDays className="w-6 h-6 text-primary" />
				<h2 className="text-md lg:text-xl text-primary font-medium">
					{currentDate.format('MMMM YYYY')}
				</h2>
			</div> */}

			<div className="flex items-center p-4 gap-2">
				<div className="inline-flex -space-x-px rounded-2xl rtl:space-x-reverse shadow-sm border border-neutral-200">
					<Button
						className="rounded-none shadow-none first:rounded-s-2xl last:rounded-e-2xl focus-visible:z-10"
						variant="secondary"
						size="icon"
						aria-label="Previous week"
						onClick={goToPrevious}
					>
						<ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
					</Button>
					<Button
						variant="secondary"
						className="p-2 rounded-none border-r-1 border-l-1 border-r-gray-50"
						onClick={goToToday}
					>
						Today
					</Button>
					<Button
						className="rounded-none shadow-none first:rounded-s-2xl last:rounded-e-2xl focus-visible:z-10"
						variant="secondary"
						size="icon"
						aria-label="Next week"
						onClick={goToNext}
					>
						<ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
					</Button>
				</div>
				{/* <NewEventButton /> */}
				<div className='w-full'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className='rounded-2xl w-full justify-between dark:border-neutral-300'>
								<div className='flex flex-row gap-2 items-center'>
									{currentView === '3day' && (<><ThreeDayIcon />3 Day</>)}
									{currentView === 'week' && (<><WeekIcon />Week</>)}
									{currentView === 'day' && (<><DayIcon />Day</>)}
									{currentView === 'schedule' && (<><ScheduleIcon />Schedule</>)}
								</div>
								<div>
									<ChevronDownIcon />
									<span className='sr-only'>Open menu</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='rounded-2xl'>
							<DropdownMenuItem className='flex items-center gap-1' onClick={() => setCurrentView('day')}>
								<DayIcon />Day
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex items-center gap-1' onClick={() => setCurrentView('3day')}>
								<ThreeDayIcon />3 Day
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex items-center gap-1' onClick={() => setCurrentView('week')}>
								<WeekIcon /> Week
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex items-center gap-1'>
								<MonthIcon />Month
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex items-center gap-1' onClick={() => setCurrentView('schedule')}>
								<ScheduleIcon />Schedule
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

			</div>

			{currentView === 'schedule' ? (
				<ScheduleView events={events} />
			) : (
			<>
				<WeekHeader days={weekDays} view={currentView} />
				<div className="flex-1 overflow-scroll"
					ref={scrollRef}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div className="relative flex-1 grid grid-cols-1 grid-rows-1"
						ref={containerRef}
						style={{
							opacity: 1 - swipeProgress,
							transform: `translateX(${offsetX}px)`,
						}}
					>
						<CalendarHours />
						<WeekViewGrid view={currentView} weekDays={weekDays} />
						<EventLayer events={events} weekDays={weekDays} view={currentView} />
					</div>
				</div>
			</>
			)}
		</div>
	);
}
