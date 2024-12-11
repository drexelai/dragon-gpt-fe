import moment from 'moment';
import { cn, formatHourIntl } from '@/lib/utils';

export function TimeGrid() {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div
			className="ml-20 grid h-[1440px]"
			style={{
				gridTemplateColumns: 'auto repeat(7, 1fr)',
				gridTemplateRows: 'repeat(288, minmax(0, 1fr))',
			}}
		>
			{/* Time column */}
			<div className="relative right-14">
				{hours.map((hour) => (
					<div
						key={hour}
						className="h-[60px] relative border-b border-border/50 w-max"
						style={{
							gridRow: `span 12`, // 12 5-minute slots per hour
						}}
					>
						<span className="absolute -translate-y-1/2 text-xs text-muted-foreground px-2 w-max">
							{formatHourIntl(hour)}
						</span>
					</div>
				))}
			</div>

			{/* Day columns */}
			{Array.from({ length: 7 }).map((_, dayIndex) => (
				<div
					key={dayIndex}
					className={cn("border-r relative", dayIndex === 6 && "border-r-0")}
				>
					{hours.map((hour) => (
						<div
							key={hour}
							className="h-[60px] border-r border-t border-border/50 dark:border-neutral-200/10"
							style={{
								gridRow: `span 12`, // 12 5-minute slots per hour
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}
