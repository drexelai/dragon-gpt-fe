"use client";

import {
	ChevronLeft,
	Menu,
	X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import RecentConversations from "./RecentConversations";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "./ui/sheet";
import NewChatButton from "./NewChatButton";
import { useEffect, useState } from "react";
import NavComponents from "./NavComponents";
import * as SheetPrimitive from "@radix-ui/react-dialog"

export default function Nav({
	conversations,
	activeConversation,
}: {
	conversations: Conversation[];
	activeConversation?: Conversation;
}) {
	const [open, setOpen] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1024) {
				setOpen(false);
			} else {
				setOpen(true);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);



	return (
		<nav
			className={`fixed md:relative md:bg-almostWhite dark:bg-background-70 m-4 md:border-2 dark:border-solid transition-all ease-in-out duration-300 h-fit md:h-[calc(100vh-4rem)] md:shadow-spread dark:shadow-sm rounded-2xl backdrop-blur border-border/40 items-center ${open ? "lg:w-80 md:w-96 md:overflow-hidden" : "w-32"
				}`}
		>
			{open ? (
				<div
					className="hidden md:flex md:flex-col overflow-x-hidden md:gap-2 p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200"
					id="navbar"
				>
					<div className="flex justify-center items-center transition-all ease-in-out duration-200">
						<Button
							variant="ghost"
							className="ml-auto hover:bg-gray-300/40"
							onClick={() => setOpen(false)}
						>
							<X />
						</Button>
					</div>
					<NewChatButton />

					<Separator className="my-4" />

						<RecentConversations
							conversations={conversations}
							activeConversation={activeConversation}
						/>
					<Separator className="my-6" />
					<div className="flex flex-col items-start gap-2">
						<NavComponents variant="open" />
					</div>
				</div>
			) : (
				<div
					className="hidden md:flex md:flex-col overflow-auto p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200"
					id="navbar"
				>
					<div className="flex flex-col justify-center items-center transition-all ease-in-out duration-200 gap-2">
						<Button
							variant="ghost"
							className="hover:bg-gray-300/40 md:hidden lg:block"
							onClick={() => setOpen(true)}
						>
							<Menu />
						</Button>
						<Sheet>
							<SheetTrigger className="lg:hidden" asChild>
								<Button variant="ghost">
									<Menu />
								</Button>
							</SheetTrigger>
							<SheetContent
								side="left"
								className="w-[webkit-fill-available] sm:w-[540px] md:w-60 transition-all"
							>

								<div
									className="flex flex-col h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200"
									id="navbar"
								>
									<div className="flex flex-row mb-8">
										<SheetPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
											<ChevronLeft className="h-8 w-8" />
											<span className="sr-only">Close</span>
										</SheetPrimitive.Close>
									</div>
									<NewChatButton />

									<Separator className="my-4" />
										<RecentConversations
											conversations={conversations}
											activeConversation={activeConversation}
										/>
									<Separator className="my-6" />
									<div className="flex flex-col items-start gap-4">
										<NavComponents variant="mobile" />
									</div>
								</div>
							</SheetContent>
						</Sheet>
						<NewChatButton state={"closed"} />
					</div>

					<Separator className="my-4" />

						<RecentConversations
							conversations={conversations}
							activeConversation={activeConversation}
							small
						/>
					<Separator className="my-6" />
					<div className="flex flex-col items-start gap-2">
						<NavComponents variant="closed" />
					</div>
				</div>
			)}
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger className="fixed mt-1" asChild>
						<Button variant="ghost">
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-[webkit-fill-available] sm:w-[540px]"
					>

						<div
							className="flex flex-col h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200"
							id="navbar"
						>
							<div className="flex flex-row mb-8">
								<SheetPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
									<ChevronLeft className="h-8 w-8" />
									<span className="sr-only">Close</span>
								</SheetPrimitive.Close>
							</div>
							<NewChatButton />

							<Separator className="my-4" />

								<RecentConversations
									conversations={conversations}
									activeConversation={activeConversation}
								/>
							<Separator className="my-6" />
							<div className="flex flex-col items-start gap-4">
								<NavComponents variant="mobile" />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
