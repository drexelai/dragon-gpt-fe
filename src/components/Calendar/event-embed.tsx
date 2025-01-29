import { CalendarEvent } from "@/lib/types";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import moment from "moment";

export default function EventEmbed({ event, key }: { event: CalendarEvent, key: string }) {
	return (
		<div className={cn("flex flex-row p-3 gap-2 rounded-xl bg-opacity-70 hover:bg-opacity-100", event.color)} key={key}>
			{/** Vertical line */}
			<Separator orientation="vertical" className={"bg-primary"} />
			<div className="flex flex-col">
				<p className="text-lg tracking-wide font-medium">{event.title}</p>
				<span className="text-sm flex flex-row gap-2 items-center">
					<p className="min-w-20">{event.location}</p>
					<p>{moment(event.start).format("h:mm a")} - {moment(event.end).format("h:mm a")}</p>
				</span>
			</div>
		</div>
	)
}
