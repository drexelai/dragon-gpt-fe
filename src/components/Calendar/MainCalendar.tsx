import { useEffect, useRef, useState, useMemo } from 'react';
import moment from 'moment';
import { ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { WeekHeader } from './views/week/week-header';
import { EventLayer } from './components/EventLayer';
import { MinimumWidth } from '@/types';
import { Button } from '../ui/button';
import { useMaskImage } from '@/hooks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DayIcon, MonthIcon, ScheduleIcon, ThreeDayIcon, WeekIcon } from '@/icons/calendar';
import { WeekViewGrid } from './views/week/week-view-grid';
import CalendarHours from './components/CalendarHours';
import ScheduleView from './views/schedule/ScheduleView';
import MonthView from './views/month/MonthView';
import { useEventStore } from '@/stores/useEventStore';

const expandRecurringEvents = (events: CalendarEvent[], startDate: Date, endDate: Date): CalendarEvent[] => {
	const expandedEvents: CalendarEvent[] = [];

	events.forEach(event => {
		if (!event.recurrence) {
			expandedEvents.push(event);
			return;
		}

		const start = moment(startDate);
		const end = moment(endDate);
		const eventStart = moment(event.start);
		const eventEnd = moment(event.end);

		while (start.isBefore(end)) {
			if (event.recurrence.type === 'daily') {
				expandedEvents.push({
					...event,
					start: start.clone().hour(eventStart.hour()).minute(eventStart.minute()).toDate(),
					end: start.clone().hour(eventEnd.hour()).minute(eventEnd.minute()).toDate(),
				});
			} else if (event.recurrence.type === 'weekly') {
				const interval = event.recurrence.interval || 1;
				const weekDiff = start.diff(eventStart, 'weeks');
				if (start.day() === eventStart.day() && weekDiff % interval === 0) {
					expandedEvents.push({
						...event,
						start: start.clone().hour(eventStart.hour()).minute(eventStart.minute()).toDate(),
						end: start.clone().hour(eventEnd.hour()).minute(eventEnd.minute()).toDate(),
					});
				}
			} else if (event.recurrence.type === 'specific-days') {
				const interval = event.recurrence.interval || 1;
				const weekDiff = start.diff(eventStart, 'weeks');
				if (event.recurrence.days?.includes(start.format('dddd').toLowerCase() as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday') &&
					weekDiff % interval === 0) {
					expandedEvents.push({
						...event,
						start: start.clone().hour(eventStart.hour()).minute(eventStart.minute()).toDate(),
						end: start.clone().hour(eventEnd.hour()).minute(eventEnd.minute()).toDate(),
					});
				}
			}
			start.add(1, 'day');
		}
	});

	return expandedEvents.sort((a, b) => moment(a.start).diff(moment(b.start)));
};

export default function MainCalendar() {
	const { baseEvents, generateMockEvents } = useEventStore();
	const [currentDate, setCurrentDate] = useState(moment());
	const [currentView, setCurrentView] = useState<CalendarView>(() => {
		const savedView = localStorage.getItem('calendarView');
		return (savedView as CalendarView) || '3day';
	});

	useEffect(() => {
		generateMockEvents(currentDate);
	}, []);

	const events = useMemo(() => {
		const startDate = moment(currentDate).subtract(6, 'weeks');
		const endDate = moment(currentDate).add(6, 'weeks');
		return expandRecurringEvents(baseEvents, startDate.toDate(), endDate.toDate());
	}, [baseEvents, currentDate]);

	const isDesktop = window?.innerWidth > MinimumWidth.Large;
	const scrollRef = useRef<HTMLDivElement>(null);
	const [swipeProgress, setSwipeProgress] = useState(0);
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
		const progress = Math.max(0, Math.min(1, Math.abs(delta) / window.innerWidth));
		setSwipeProgress(progress);
	};

	const handleTouchEnd = () => {
		setIsSwiping(false);
		if (offsetX > 50) {
			goToPrevious();
		} else if (offsetX < -50) {
			goToNext();
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
	}, [currentView, currentDate]);

	const handleViewChange = (view: CalendarView) => {
		setCurrentView(view);
		localStorage.setItem('calendarView', view);
	};

	const handleMonthChange = (newDate: moment.Moment) => {
		setCurrentDate(newDate);
	};

	return (
		<div className="w-full max-w-4xl flex flex-col h-full bg-background rounded-lg">
			{/* <div className="flex items-center gap-2 w-full mt-4 px-4">
				<CalendarDays className="w-6 h-6 text-primary" />
				<h2 className="text-md lg:text-xl text-primary font-medium">
					{currentDate.format('MMMM YYYY')}
				</h2>
			</div> */}

			<div className="flex items-center p-4 gap-2">
				<div className="inline-flex -space-x-px rounded-2xl rtl:space-x-reverse shadow-sm border border-neutral-200 dark:border-neutral-700">
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
							<Button variant="outline" className='rounded-2xl w-full justify-between dark:border-neutral-700'>
								<div className='flex flex-row gap-2 items-center'>
									{currentView === '3day' && (<><ThreeDayIcon />3 Day</>)}
									{currentView === 'week' && (<><WeekIcon />Week</>)}
									{currentView === 'day' && (<><DayIcon />Day</>)}
									{currentView === 'schedule' && (<><ScheduleIcon />Schedule</>)}
									{currentView === 'month' && (<><MonthIcon />Month</>)}
								</div>
								<div>
									<ChevronDownIcon />
									<span className='sr-only'>Open menu</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='rounded-2xl'>
							<DropdownMenuItem
								className='flex items-center gap-1'
								onClick={() => handleViewChange('day')}
							>
								<DayIcon />Day
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='flex items-center gap-1'
								onClick={() => handleViewChange('3day')}
							>
								<ThreeDayIcon />3 Day
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='flex items-center gap-1'
								onClick={() => handleViewChange('week')}
							>
								<WeekIcon /> Week
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='flex items-center gap-1'
								onClick={() => handleViewChange('month')}
							>
								<MonthIcon />Month
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex items-center gap-1' onClick={() => handleViewChange('schedule')}>
								<ScheduleIcon />Schedule
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

			</div>

			{currentView === 'schedule' ? (
				<ScheduleView events={events} />
			) : currentView === 'month' ? (
				<MonthView
					events={events}
					onMonthChange={handleMonthChange}
				/>
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
