import { Separator } from "../../ui/separator";
import { cn } from "@/lib/utils";
import moment from "moment";
import EventModal from "./EventModal";
import { useState } from "react";
import { RepeatIcon } from "lucide-react";

export default function EventEmbed({ event }: { event: CalendarEvent }) {
	const [open, setOpen] = useState(false);

	return (
		<div
			className={cn("flex flex-row py-3 px-1 gap-2 rounded-xl bg-opacity-70 dark:bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-md hover:cursor-pointer", event.color)}
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
			<div className="flex flex-col w-full pr-4">
				<div className="flex flex-row gap-2 items-center">
					<p className="text-base font-medium max-w-64 truncate">{event.title}</p>
					{event.recurrence && <RepeatIcon size={16} className="ml-auto opacity-75" />}
				</div>
				<span className="text-sm flex flex-row gap-2 items-center w-full justify-between">
					<p className="max-w-32 truncate">{event.location}</p>
					<p>{moment(event.start).format("h:mm a")} - {moment(event.end).format("h:mm a")}</p>
				</span>
			</div>
		</div>
	)
}
