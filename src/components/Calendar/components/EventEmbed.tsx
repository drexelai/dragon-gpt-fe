import { CalendarEvent } from "@/lib/types";
import { Separator } from "../../ui/separator";
import { cn } from "@/lib/utils";
import moment from "moment";
import EventModal from "./EventModal";
import { useState } from "react";

export default function EventEmbed({ event }: { event: CalendarEvent }) {
	const [open, setOpen] = useState(false);

	return (
		<div
			className={cn("flex flex-row py-3 px-1 gap-2 rounded-xl bg-opacity-70 hover:bg-opacity-100 shadow-md", event.color)}
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
			<div className="flex flex-col w-full">
				<p className="text-base font-medium max-w-64 truncate">{event.title}</p>
				<span className="text-sm flex flex-row gap-2 items-center w-full justify-between">
					<p className="max-w-32 truncate">{event.location}</p>
					<p className="mr-2">{moment(event.start).format("h:mm a")} - {moment(event.end).format("h:mm a")}</p>
				</span>
			</div>
		</div>
	)
}
