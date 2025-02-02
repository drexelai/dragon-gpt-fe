import { formatHourIntl } from "@/lib/utils";

export default function CalendarHours() {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div className="mt-2 row-start-1 col-start-1">
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
	)
}
