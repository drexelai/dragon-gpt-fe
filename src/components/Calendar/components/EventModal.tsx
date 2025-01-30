"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarEvent } from "@/lib/types";
import { CircleAlert, SquarePenIcon, Trash, Trash2Icon } from "lucide-react";
import { useId, useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DateTimeInput from "@/components/ui/date-time-input";
import { ColorSelect } from "@/components/ui/color-select";
import { toast } from "sonner";
import React from "react";

const eventForm = z.object({
	title: z.string()
		.min(1, 'Name must be at least 1 character')
		.max(40, 'Name cannot be more than 40 characters'),
	location: z.string()
		.min(1, 'Location must be at least 1 character')
		.max(40, 'Location cannot be more than 40 characters'),
	start: z.date(),
	end: z.date(),
	color: z.string(),
}).refine((data) => {
	return data.end > data.start;
}, {
	message: "End time must be after start time",
	path: ["end"],
}).refine((data) => {
	const duration = data.end.getTime() - data.start.getTime();
	const maxDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
	return duration <= maxDuration;
}, {
	message: "Event cannot be longer than 24 hours",
	path: ["end"],
}).refine((data) => {
	const startHour = data.start.getHours();
	const endHour = data.end.getHours();
	return startHour >= 6 && endHour <= 22; // Example: restrict to 6 AM - 10 PM
}, {
	message: "Events must be between 6 AM and 10 PM",
	path: ["start"],
});

export default function EventModal({ event, open, onOpenChange }: { event: CalendarEvent, open: boolean, onOpenChange: (open: boolean) => void }) {
	const id = useId();
	const [inputValue, setInputValue] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	const form = useForm<z.infer<typeof eventForm>>({
		resolver: zodResolver(eventForm),
		defaultValues: {
			title: event.title,
			location: event.location,
			start: event.start,
			end: event.end,
			color: event.color,
		}
	});

	const startDate = form.watch("start");
	useEffect(() => {
		form.trigger("end");
	}, [startDate, form]);

	useEffect(() => {
		const subscription = form.watch(() => setIsDirty(true));
		return () => subscription.unsubscribe();
	}, [form]);

	const onSubmit = async (values: z.infer<typeof eventForm>, event: CalendarEvent) => {
		setIsSubmitting(true);
		try {
			onOpenChange(false);
			console.log(values);
			event.title = values.title;
			event.location = values.location;
			event.start = values.start;
			event.end = values.end;
			event.color = values.color;
			toast.success('Changes saved successfully');
		} catch (error: unknown) {
			toast.error('Failed to save changes');
		} finally {
			setIsSubmitting(false);
			onOpenChange(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open && isDirty) {
					if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
						setIsDirty(false);
						onOpenChange(false);
					}
					return;
				}
				onOpenChange(open);
			}}
		>
			<DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
				<div className="flex flex-col items-center gap-2 w-full">
					<div
						className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
						aria-hidden="true"
					>
						<SquarePenIcon className="opacity-80" size={16} strokeWidth={2} />
					</div>
					<DialogHeader className="w-full">
						<DialogTitle className="sm:text-center">Edit {event.title}</DialogTitle>
						<DialogDescription className="sm:text-center">
							Make changes to your event here
						</DialogDescription>
						<Form {...form}>
							<form onSubmit={form.handleSubmit((data) => {
								onSubmit(data, event)
							})} className="space-y-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem className="w-full text-start">
											<FormLabel className="text-start text-muted-foreground">Title</FormLabel>
											<FormControl>
												<Input placeholder={event.title} type="text" autoComplete="off" {...field} className="text-base" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem className="w-full text-start">
											<FormLabel className="text-start text-muted-foreground">Location</FormLabel>
											<FormControl>
												<Input placeholder={event.location} type="text" autoComplete="off" {...field} className="text-base" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<div className="flex flex-col sm:flex-row gap-2">
										<FormField
										control={form.control}
										name="start"
										render={({ field }) => (
											<FormItem className="text-start">
												<DateTimeInput label="Start" value={field.value} onChange={field.onChange} />
												<FormMessage />
											</FormItem>
										)} />
										<FormField
										control={form.control}
										name="end"
										render={({ field }) => (
											<FormItem className="text-start">
												<DateTimeInput label="End" value={field.value} onChange={field.onChange} />
												<FormMessage />
											</FormItem>
										)} />
									</div>
									<FormField
									control={form.control}
									name="color"
									render={({ field }) => (
										<FormItem className="w-full text-start">
											<FormLabel className="text-start text-muted-foreground">Color</FormLabel>
											<FormControl>
												<ColorSelect value={field.value} onChange={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex flex-row gap-1">
								<Button type="submit" disabled={isSubmitting} className="mr-2 w-full bg-green-500">
									{isSubmitting ? 'Saving...' : 'Save'}
								</Button>
								<Button
									type="button"
									variant="destructive"
									onClick={() => {
										if (window.confirm('Are you sure you want to delete this event?')) {
											// Handle delete
											onOpenChange(false);
										}
									}}

								>
									<Trash2Icon className="scale-75"/>
									<span className="sr-only">Delete Event</span>
								</Button>
								</div>
							</form>
						</Form>
					</DialogHeader>
				</div>
			</DialogContent>
		</Dialog>
	);
}
