import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { CalendarDays, ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { WeekHeader } from './views/week/week-header';
import { TimeGrid } from './time-grid';
import { EventLayer } from './event-layer';
import { MinimumWidth, type CalendarEvent } from '@/types';
import { Button } from '../ui/button';
import { useMaskImage } from '@/hooks';
import NewEventButton from './new-event';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MonthIcon, ScheduleIcon, ThreeDayIcon, WeekIcon } from '@/icons/calendar';
import { WeekViewGrid } from './views/week/week-view-grid';

const generateMockEvents = (baseDate: moment.Moment): CalendarEvent[] => {
	const today = moment(baseDate).startOf('week').add(1, 'day'); // Start from Monday

	return [
		{
			id: '1',
			title: 'Early Morning Workout',
			start: moment(today).add(1, 'day').hour(6).minute(0).toDate(),
			end: moment(today).add(1, 'day').hour(7).minute(0).toDate(),
			color: 'bg-blue-400',
		},
		{
			id: '2',
			title: 'Team Standup',
			start: moment(today).add(1, 'day').hour(9).minute(30).toDate(),
			end: moment(today).add(1, 'day').hour(10).minute(0).toDate(),
			color: 'bg-purple-400',
		},
		{
			id: '3',
			title: 'Project Review',
			start: moment(today).add(2, 'day').hour(10).minute(0).toDate(),
			end: moment(today).add(2, 'day').hour(12).minute(0).toDate(),
			color: 'bg-green-400',
		},
		{
			id: '4',
			title: 'Lunch with Clients',
			start: moment(today).add(3, 'day').hour(12).minute(0).toDate(),
			end: moment(today).add(3, 'day').hour(14).minute(0).toDate(),
			color: 'bg-yellow-400',
		},
		{
			id: '5',
			title: 'Design Workshop',
			start: moment(today).add(4, 'day').hour(14).minute(0).toDate(),
			end: moment(today).add(4, 'day').hour(16).minute(0).toDate(),
			color: 'bg-pink-400',
		},
		{
			id: '6',
			title: 'Evening Yoga',
			start: moment(today).add(5, 'day').hour(17).minute(0).toDate(),
			end: moment(today).add(5, 'day').hour(18).minute(0).toDate(),
			color: 'bg-indigo-400',
		},
	];
};

export default function WeekCalendar() {
	const [currentDate, setCurrentDate] = useState(moment());
	const [events] = useState<CalendarEvent[]>(() => generateMockEvents(currentDate));
	const isDesktop = window.innerWidth > MinimumWidth.Large;
	const scrollRef = useRef<HTMLDivElement>(null);
	const [currentView, setCurrentView] = useState<CalendarView>('week');

	useMaskImage(scrollRef);

	const [weekDays, setWeekDays] = useState(
		Array.from({ length: isDesktop ? 7 : 5 }, (_, i) =>
			moment(currentDate).startOf(isDesktop ? 'week' : 'day').add(i, 'days')
		)
	);

	const goToPreviousWeek = () => {
		// if (currentView === 'week') {
		// 	const newDate = currentDate.clone().subtract(1, "week");
		// 	setCurrentDate(newDate);
		// 	setWeekDays(
		// 		Array.from({ length: 5 }, (_, i) =>
		// 			moment(newDate).startOf('week').add(i, 'days')
		// 		)
		// 	);
		// } else
		if (currentView === 'week' || currentView === '3day') {
			const newDate = currentDate.clone().subtract(1, "days")
			setCurrentDate(newDate);
			setWeekDays(
				Array.from({ length: currentView === 'week' ? 5 : 3 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}
	};

	const goToNextWeek = () => {
		// if (currentView === 'ddd') {
		// 	const newDate = currentDate.clone().add(1, "week");
		// 	setCurrentDate(newDate);
		// 	setWeekDays(
		// 		Array.from({ length: 5 }, (_, i) =>
		// 			moment(newDate).startOf('week').add(i, 'days')
		// 		)
		// 	);
		// } else
		if (currentView === 'week' || currentView === '3day') {
			const newDate = currentDate.clone().add(1, "days");
			setCurrentDate(newDate);
			setWeekDays(
				Array.from({ length: currentView === 'week' ? 5 : 3 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}
	};

	const goToToday = () => {
		const newDate = moment();
		setCurrentDate(moment());
		if (currentView === 'week') {
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

	useEffect(() => {
		if (currentView === 'week') {
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
			<div className="flex items-center gap-2 w-full mt-4 px-4">
				<CalendarDays className="w-6 h-6 text-primary" />
				<h2 className="text-md lg:text-xl text-primary font-medium">
					{currentDate.format('MMMM YYYY')}
				</h2>
			</div>

			<div className="flex items-center p-4 gap-2">
				<div className="inline-flex -space-x-px rounded-2xl rtl:space-x-reverse shadow-sm border border-neutral-200">
					<Button
						className="rounded-none shadow-none first:rounded-s-2xl last:rounded-e-2xl focus-visible:z-10"
						variant="secondary"
						size="icon"
						aria-label="Previous week"
						onClick={goToPreviousWeek}
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
						onClick={goToNextWeek}
					>
						<ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
					</Button>
				</div>
				{/* <NewEventButton /> */}
				<div className='w-full'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className='rounded-2xl w-full justify-between'>
								<div className='flex flex-row gap-2'>
									{currentView === '3day' && (<><ThreeDayIcon />3 Day</>)}
									{currentView === 'week' && (<><WeekIcon />Week</>)}
								</div>
								<div>
									<ChevronDownIcon />
									<span className='sr-only'>Open menu</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='rounded-2xl'>
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
							<DropdownMenuItem className='flex items-center gap-1'>
								<ScheduleIcon />Schedule
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

			</div>



			<div className="flex-1 overflow-scroll" ref={scrollRef}>
				<WeekHeader days={weekDays} view={currentView} />
				<div className="relative flex-1 overflow-y-auto">
					<WeekViewGrid view={currentView} weekDays={weekDays} />
					<EventLayer events={events} weekDays={weekDays} view={currentView} />
				</div>
			</div>
		</div>
	);
}
