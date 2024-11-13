import React, { useState } from 'react';
import moment from 'moment';

const CalendarGrid: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(moment()); // Set initial date to today

	const goToPreviousMonth = () => {
		setCurrentDate(currentDate.clone().subtract(1, 'month'));
	};

	const goToNextMonth = () => {
		setCurrentDate(currentDate.clone().add(1, 'month'));
	};

	const goToToday = () => {
		setCurrentDate(moment());
	};

	const startOfMonth = currentDate.clone().startOf('month');
	const endOfMonth = currentDate.clone().endOf('month');
	const startDate = startOfMonth.clone().startOf('week'); // Start on Sunday
	const endDate = endOfMonth.clone().endOf('week'); // End on Saturday

	const dates = [];
	const day = startDate.clone();
	while (day.isBefore(endDate, 'day')) {
		dates.push(day.clone());
		day.add(1, 'day');
	}

	return (
		<div className="w-full max-w-4xl mx-auto">
			<header className="flex justify-between items-center mb-4">
				<button className="p-2 bg-gray-200 rounded hover:bg-gray-300" onClick={goToPreviousMonth}>
					Prev
				</button>
				<button className="p-2 bg-gray-200 rounded hover:bg-gray-300" onClick={goToToday}>
					Today
				</button>
				<button className="p-2 bg-gray-200 rounded hover:bg-gray-300" onClick={goToNextMonth}>
					Next
				</button>
				<h2 className="text-xl font-bold">{currentDate.format('MMMM YYYY')}</h2>
			</header>
			<div className="grid grid-cols-7">
				{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
					<div key={dayName} className="text-center font-semibold py-2">
						{dayName}
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 gap-1">
				{dates.map((date) => (
					<div
						key={date.toString()}
						className={`p-4 border rounded ${date.isSame(currentDate, 'month') ? 'bg-white' : 'bg-gray-100 text-gray-400'
							} ${date.isSame(moment(), 'day') ? 'border-blue-500 bg-blue-100' : ''}`}
					>
						<span className="block text-sm">{date.date()}</span>
						{/* Render events/tasks here if needed */}
					</div>
				))}
			</div>
		</div>
	);
};

export default CalendarGrid;
