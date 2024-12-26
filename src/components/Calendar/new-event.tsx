// Dependencies: pnpm install lucide-react

"use client";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AvatarImg from "@/public/avatar-72-01.jpg";
import ProfileBgImg from "@/public/profile-bg.jpg";
import { Check, ImagePlus, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

export default function NewEventButton() {
	const maxLength = 180;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">New Event</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
				<DialogHeader className="contents space-y-0 text-left">
					<DialogTitle className="border-b border-border px-6 py-4 text-base">
						New Event
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="sr-only">
					Make changes to your profile here. You can change your photo and set a username.
				</DialogDescription>
				<div className="overflow-y-auto">
					<div className="px-6 pb-6 pt-4">
						<form className="space-y-4">
							{/* <div className="flex flex-col gap-4 sm:flex-row">
								<div className="flex-1 space-y-2">
									<Label htmlFor="edit-first-name">Event Name</Label>
									<Input
										id="edit-first-name"
										placeholder="Matt"
										defaultValue="Margaret"
										type="text"
										required
									/>
								</div>
								<div className="flex-1 space-y-2">
									<Label htmlFor="edit-last-name">Last name</Label>
									<Input
										id="edit-last-name"
										placeholder="Welsh"
										defaultValue="Villard"
										type="text"
										required
									/>
								</div>
							</div> */}
							<div className="space-y-2">
								<Label htmlFor="edit-event-name">Event Name</Label>
								<div className="relative">
									<Input
										id="edit-event-name"
										className="peer pe-9"
										placeholder="Hanging out with friends"
										type="text"
										required
									/>
									<div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
										<Check
											size={16}
											strokeWidth={2}
											className="text-emerald-500"
											aria-hidden="true"
										/>
									</div>
								</div>
							</div>
							<div>
							<DatePicker />
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-website">Website</Label>
								<div className="flex rounded-lg shadow-sm shadow-black/5">
									<span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
										https://
									</span>
									<Input
										id="edit-website"
										className="-ms-px rounded-s-none shadow-none"
										placeholder="yourwebsite.com"
										defaultValue="www.margaret.com"
										type="text"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-bio">Biography</Label>
								<Textarea
									id="edit-bio"
									placeholder="Write a few sentences about yourself"
									aria-describedby="characters-left-textarea"
								/>
								<p
									id="characters-left-textarea"
									className="mt-2 text-right text-xs text-muted-foreground"
									role="status"
									aria-live="polite"
								>
								</p>
							</div>
						</form>
					</div>
				</div>
				<DialogFooter className="border-t border-border px-6 py-4">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button type="button">Save changes</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}


import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? moment(date).format("PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
