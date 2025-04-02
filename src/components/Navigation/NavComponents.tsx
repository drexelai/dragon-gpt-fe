import Link from "next/link";
import ClearAllChatsButton from "./ClearAllChatsButton";
import { Button, buttonVariants } from "../ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { ModeToggle } from "../ModeToggle";

export default function NavComponents({
	variant,
}: {
	variant: "open" | "closed" | "mobile";
}) {
	return (
		<>
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
