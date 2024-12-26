import Link from "next/link";
import ClearAllChatsButton from "./ClearAllChatsButton";
import { Button, buttonVariants } from "../ui/button";
import { CalendarDaysIcon, SquareArrowOutUpRight } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Badge } from "../ui/badge";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { useRouter } from "next/navigation";

export default function NavComponents({
	variant,
}: {
	variant: "open" | "closed" | "mobile";
}) {
	const { setCalendarOpen } = useCalendarStore();
	const router = useRouter();

	const handleScheduleClick = () => {
		router.push(`/scheduler`);
	}

	return (
		<>
			<Button variant="default" className="hover:bg-gray-300/40" onClick={handleScheduleClick}>
				<CalendarDaysIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
				{variant !== "closed" && (
					<>
						<p>Dragon Scheduler</p>
						<Badge className="ml-2 font-normal bg-sage-primary">New</Badge>
					</>
				)}
			</Button>
			<ClearAllChatsButton iconOnly={variant === "closed"} />

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
