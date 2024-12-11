import moment from 'moment';
import { cn } from '@/lib/utils';

export function TimeGrid() {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div className="grid grid-cols-8 h-[1440px]">
			{/* Time column */}
			<div className="border-r">
				{hours.map((hour) => (
					<div
						key={hour}
						className="h-[60px] relative border-b border-border/50"
					>
						<span className="absolute -translate-y-1/2 text-xs text-muted-foreground px-2">
							{moment().hour(hour).format('ha')}
						</span>
					</div>
				))}
			</div>

			{/* Day columns */}
			{Array.from({ length: 7 }).map((_, dayIndex) => (
				<div
					key={dayIndex}
					className={cn("border-r", dayIndex === 6 && "border-r-0")}
				>
					{hours.map((hour) => (
						<div
							key={hour}
							className="h-[60px] border-b border-border/50"
						/>
					))}
				</div>
			))}
		</div>
	);
}
