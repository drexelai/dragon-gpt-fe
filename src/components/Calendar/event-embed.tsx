import { CalendarEvent } from "@/lib/types";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

export default function EventEmbed({ event, key }: { event: CalendarEvent, key: string }) {
	return (
		<div className={cn("flex flex-row p-4 gap-2 rounded-xl", event.color)} key={key}>
			{/** Vertical line */}
			<Separator orientation="vertical" className={"bg-primary"} />
			<div className="flex flex-col">
				<p className="text-lg font-semibold">{event.title}</p>
				<p className="text-sm">{event.location}</p>
			</div>
		</div>
	)
}
