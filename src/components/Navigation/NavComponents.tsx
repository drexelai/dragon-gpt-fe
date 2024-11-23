import Link from "next/link";
import ClearAllChatsButton from "./ClearAllChatsButton";
import { Button, buttonVariants } from "../ui/button";
import { CalendarDaysIcon, SquareArrowOutUpRight } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Badge } from "../ui/badge";
import { useCalendarStore } from "@/stores/useCalendarStore";

export default function NavComponents({
	variant,
}: {
	variant: "open" | "closed" | "mobile";
}) {
	const { setCalendarOpen } = useCalendarStore();
	const handleCalendarClick = () => {
		setCalendarOpen();
	}

	return (
		<>
			<ClearAllChatsButton iconOnly={variant === "closed"} />
			<Button variant="ghost" className="hover:bg-gray-300/40" onClick={setCalendarOpen}>
				<CalendarDaysIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
				{variant !== "closed" && (
					<>
						<p>Calendar</p>
						<Badge className="ml-2 font-normal">New</Badge>
					</>
				)}
			</Button>
			<Button
				variant={"ghost"}
				className="hover:bg-gray-300/40 py-4"
				asChild
			>
				<Link
					href="/faq"
					className={`${buttonVariants({
						variant: "ghost",
					})} text-black dark:text-white no-underline`}
				>
					<SquareArrowOutUpRight className="h-[1.2rem] w-[1.2rem] mr-2" />
					{variant !== "closed" && "Learn more"}
				</Link>
			</Button>
			<ModeToggle iconOnly={variant === "closed"} />
		</>
	)
}
