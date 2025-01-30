import { CalendarEvent } from "@/lib/types";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import moment from "moment";
import EventModal from "./components/EventModal";
import { useState } from "react";

export default function EventEmbed({ event }: { event: CalendarEvent }) {
	const [open, setOpen] = useState(false);

	return (
		<div
		className={cn("flex flex-row p-3 gap-2 rounded-xl bg-opacity-70 hover:bg-opacity-100", event.color)}
		onClick={() => setOpen(true)}
		>
			<div onClick={(e) => e.stopPropagation()}>
				<EventModal
					event={event}
					open={open}
					onOpenChange={setOpen}
				/>
			</div>
			<Separator orientation="vertical" className={"bg-primary"} />
			<div className="flex flex-col">
				<p className="text-base font-medium">{event.title}</p>
				<span className="text-sm flex flex-row gap-2 items-center">
					<p className="min-w-20">{event.location}</p>
					<p>{moment(event.start).format("h:mm a")} - {moment(event.end).format("h:mm a")}</p>
				</span>
			</div>
		</div>
	)
}
