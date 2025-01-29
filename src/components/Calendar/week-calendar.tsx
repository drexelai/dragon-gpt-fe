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
	const today = moment(baseDate);

	return [
		{
			id: '1',
			title: 'Org Mgmt',
			location: 'Room 101',
			start: moment(today).add(1, 'day').hour(9).minute(0).toDate(),
			end: moment(today).add(1, 'day').hour(10).minute(0).toDate(),
			color: 'bg-red-300',
		},
		{
			id: '2',
			title: 'Macro',
			location: 'Room 102',
			start: moment(today).add(1, 'day').hour(10).minute(0).toDate(),
			end: moment(today).add(1, 'day').hour(11).minute(0).toDate(),
			color: 'bg-orange-300',
		},
		{
			id: '3',
			title: 'Micro',
			location: 'Room 103',
			start: moment(today).add(1, 'day').hour(11).minute(0).toDate(),
			end: moment(today).add(1, 'day').hour(12).minute(0).toDate(),
			color: 'bg-yellow-300',
		},
		{
			id: '4',
			title: 'Financial Mgmt',
			location: 'Room 104',
			start: moment(today).add(1, 'day').hour(12).minute(0).toDate(),
			end: moment(today).add(1, 'day').hour(14).minute(0).toDate(),
			color: 'bg-green-300',
		}
	];
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
		<div className="w-full max-w-4xl flex flex-col h-[800px] bg-background rounded-lg">
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
							<Button variant="outline" className='rounded-2xl w-full justify-between'>
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
