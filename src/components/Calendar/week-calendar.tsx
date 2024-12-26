import { useRef, useState } from 'react';
import moment from 'moment';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { WeekHeader } from './week-header';
import { TimeGrid } from './time-grid';
import { EventLayer } from './event-layer';
import { MinimumWidth, type CalendarEvent } from '@/types';
import { Button } from '../ui/button';
import { useMaskImage } from '@/hooks';
import NewEventButton from './new-event';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const generateMockEvents = (baseDate: moment.Moment): CalendarEvent[] => {
	const today = moment(baseDate).startOf('week').add(1, 'day'); // Start from Monday

	return [
		{
			id: '1',
			title: 'Early Morning Workout',
			start: moment(today).add(1, 'day').hour(6).minute(0).toDate(),
			end: moment(today).add(1, 'day').hour(7).minute(0).toDate(),
			color: 'bg-blue-50 text-blue-700 border-blue-200',
		},
		{
			id: '2',
			title: 'Team Standup',
			start: moment(today).add(1, 'day').hour(9).minute(30).toDate(),
			end: moment(today).add(1, 'day').hour(10).minute(0).toDate(),
			color: 'bg-purple-50 text-purple-700 border-purple-200',
		},
		{
			id: '3',
			title: 'Project Review',
			start: moment(today).add(2, 'day').hour(10).minute(0).toDate(),
			end: moment(today).add(2, 'day').hour(12).minute(0).toDate(),
			color: 'bg-green-50 text-green-700 border-green-200',
		},
		{
			id: '4',
			title: 'Lunch with Clients',
			start: moment(today).add(3, 'day').hour(12).minute(0).toDate(),
			end: moment(today).add(3, 'day').hour(14).minute(0).toDate(),
			color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
		},
		{
			id: '5',
			title: 'Design Workshop',
			start: moment(today).add(4, 'day').hour(14).minute(0).toDate(),
			end: moment(today).add(4, 'day').hour(16).minute(0).toDate(),
			color: 'bg-pink-50 text-pink-700 border-pink-200',
		},
		{
			id: '6',
			title: 'Evening Yoga',
			start: moment(today).add(5, 'day').hour(17).minute(0).toDate(),
			end: moment(today).add(5, 'day').hour(18).minute(0).toDate(),
			color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
		},
	];
};

export default function WeekCalendar() {
	const [currentDate, setCurrentDate] = useState(moment());
	const [events] = useState<CalendarEvent[]>(() => generateMockEvents(currentDate));
	const isDesktop = window.innerWidth > MinimumWidth.Large;
	const scrollRef = useRef<HTMLDivElement>(null);

	useMaskImage(scrollRef);

	const [weekDays, setWeekDays] = useState(
		Array.from({ length: isDesktop ? 7 : 5 }, (_, i) =>
			moment(currentDate).startOf(isDesktop ? 'week' : 'day').add(i, 'days')
		)
	);

	const goToPreviousWeek = () => {
		if (isDesktop) {
			const newDate = currentDate.clone().subtract(1, "week");
			setCurrentDate(newDate);
			setWeekDays(
				Array.from({ length: 7 }, (_, i) =>
					moment(newDate).startOf('week').add(i, 'days')
				)
			);
		} else {
			const newDate = currentDate.clone().subtract(1, "days")
			setCurrentDate(newDate);
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}
	};

	const goToNextWeek = () => {
		if (isDesktop) {
			const newDate = currentDate.clone().add(1, "week");
			setCurrentDate(newDate);
			setWeekDays(
				Array.from({ length: 7 }, (_, i) =>
					moment(newDate).startOf('week').add(i, 'days')
				)
			);
		} else {
			const newDate = currentDate.clone().add(1, "days");
			setCurrentDate(newDate);
			setWeekDays(
				Array.from({ length: 5 }, (_, i) =>
					moment(newDate).add(i, 'days')
				)
			);
		}
	};

	const goToToday = () => {
		const newDate = moment();
		setCurrentDate(moment());
		setWeekDays(
			Array.from({ length: isDesktop ? 7 : 5 }, (_, i) =>
				moment(newDate).startOf(isDesktop ? 'week' : 'day').add(i, 'days')
			)
		);
	};

	return (
		<div className="w-full max-w-4xl flex flex-col h-[800px] bg-background rounded-lg">
			<div className="flex items-center justify-between p-4">
				<div className="inline-flex -space-x-px rounded-lg rtl:space-x-reverse">
					<Button
						className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
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
						className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
						variant="secondary"
						size="icon"
						aria-label="Next week"
						onClick={goToNextWeek}
					>
						<ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
					</Button>
				</div>
				{/* <NewEventButton /> */}
				<div className="flex items-center gap-2">
					<CalendarDays className="w-6 h-6 text-primary" />
					<h2 className="text-md lg:text-xl text-primary">
						{currentDate.format('MMMM YYYY')}
					</h2>
				</div>
			</div>

			<div className='px-16'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className='rounded-2xl w-full justify-start'>
							3 Day
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							3 Day
						</DropdownMenuItem>
						<DropdownMenuItem>Week</DropdownMenuItem>
						<DropdownMenuItem>Month</DropdownMenuItem>
						<DropdownMenuItem>Schedule</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex-1 overflow-scroll" ref={scrollRef}>
				<WeekHeader days={weekDays} />
				<div className="relative flex-1 overflow-y-auto">
					<TimeGrid />
					<EventLayer events={events} weekDays={weekDays} />
				</div>
			</div>
		</div>
	);
}
