"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DateTimeInput from "@/components/ui/date-time-input";
import { ColorSelect } from "@/components/ui/color-select";
import { toast } from "sonner";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";
import { useEventStore } from '@/stores/useEventStore';
import { DaySelect, Day } from "@/components/ui/day-select";

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
	recurring: z.boolean().optional(),
	recurrence: z.string().optional(), // "daily", "weekly", "specific-days",
	recurrenceInterval: z.number().optional(), // 1, 2, 3, 4, 5
	recurrenceDays: z.array(z.string()).optional(), // ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
	recurrenceEnd: z.date().optional().nullable(),
}).refine((data) => {
	return data.end > data.start;
}, {
	message: "End time must be after start time",
	path: ["end"],
}).refine((data) => {
	const duration = data.end.getTime() - data.start.getTime();
	const maxDuration = 24 * 60 * 60 * 1000;
	return duration <= maxDuration;
}, {
	message: "Event cannot be longer than 24 hours",
	path: ["end"],
}).refine((data) => {
	const startHour = data.start.getHours();
	const endHour = data.end.getHours();
	return startHour >= 6 && endHour <= 22;
}, {
	message: "Events must be between 6 AM and 10 PM",
	path: ["start"],
}).refine((data) => {
	if (data.recurring && !data.recurrence) {
		return false;
	}
	return true;
}, {
	message: "Please select a recurrence type",
	path: ["recurrence"],
}).refine((data) => {
	if (data.recurring && (!data.recurrenceEnd || moment(data.recurrenceEnd).isSameOrBefore(moment(), 'day'))) {
		return false;
	}
	return true;
}, {
	message: "End date must be set and must be in the future",
	path: ["recurrenceEnd"],
}).refine((data) => {
	if (data.recurrence === 'specific-days' && (!data.recurrenceDays || data.recurrenceDays.length === 0)) {
		return false;
	}
	return true;
}, {
	message: "Please select at least one day",
	path: ["recurrenceDays"],
}).refine((data) => {
	if ((data.recurrence === 'weekly' || data.recurrence === 'specific-days') && !data.recurrenceInterval) {
		return false;
	}
	return true;
}, {
	message: "Please select an interval",
	path: ["recurrenceInterval"],
});

export default function EventModal({ event, open, onOpenChange }: { event: CalendarEvent, open: boolean, onOpenChange: (open: boolean) => void }) {
	const { baseEvents, updateEvent, deleteEvent } = useEventStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDirty, setIsDirty] = useState(false);
	const [isRecurring, setIsRecurring] = useState(!!event.recurrence);

	const form = useForm<z.infer<typeof eventForm>>({
		resolver: zodResolver(eventForm),
		defaultValues: {
			title: event.title,
			location: event.location,
			start: event.start,
			end: event.end,
			color: event.color,
			recurring: !!event.recurrence,
			recurrence: event.recurrence?.type,
			recurrenceInterval: event.recurrence?.interval,
			recurrenceDays: event.recurrence?.days,
			recurrenceEnd: event.recurrence?.endDate || null,
		}
	});

	const startDate = form.watch("start");
	useEffect(() => {
		form.trigger("end");
	}, [startDate, form]);

	useEffect(() => {
		const subscription = form.watch(() => {
			const currentValues = form.getValues();
			const hasChanges =
				currentValues.title !== event.title ||
				currentValues.location !== event.location ||
				currentValues.color !== event.color ||
				!moment(currentValues.start).isSame(event.start) ||
				!moment(currentValues.end).isSame(event.end) ||
				!!currentValues.recurring !== !!event.recurrence ||
				currentValues.recurrence !== event.recurrence?.type ||
				currentValues.recurrenceInterval !== event.recurrence?.interval ||
				JSON.stringify(currentValues.recurrenceDays) !== JSON.stringify(event.recurrence?.days) ||
				(currentValues.recurrenceEnd && event.recurrence?.endDate &&
					!moment(currentValues.recurrenceEnd).isSame(event.recurrence.endDate));

			setIsDirty(hasChanges ?? false);
		});
		return () => subscription.unsubscribe();
	}, [form, event]);

	useEffect(() => {
		form.reset({
			title: event.title,
			location: event.location,
			start: event.start,
			end: event.end,
			color: event.color,
			recurring: !!event.recurrence,
			recurrence: event.recurrence?.type,
			recurrenceInterval: event.recurrence?.interval,
			recurrenceDays: event.recurrence?.days,
			recurrenceEnd: event.recurrence?.endDate || null,
		});
		setIsRecurring(!!event.recurrence);
		setIsDirty(false);
	}, [event, form]);

	const onSubmit = async (values: z.infer<typeof eventForm>) => {
		setIsSubmitting(true);
		try {
			onOpenChange(false);

			// Find and update all instances of this recurring event
			const baseEvent = baseEvents.find(e => e.id === event.id);
			if (baseEvent) {
				updateEvent({
					...baseEvent,
					title: values.title,
					location: values.location,
					color: values.color,
					start: values.start,
					end: values.end,
					recurrence: values.recurring ? {
						type: values.recurrence as "daily" | "weekly" | "specific-days",
						interval: values.recurrenceInterval,
						days: values.recurrenceDays as ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[],
						endDate: values.recurrenceEnd || undefined,
					} : undefined,
				});
			}

			toast.success('Changes saved successfully');
		} catch (error: unknown) {
			console.error(error);
			toast.error('Failed to save changes');
		} finally {
			setIsSubmitting(false);
			onOpenChange(false);
			setIsDirty(false);
		}
	}

	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this event?')) {
			try {
				deleteEvent(event.id);
				toast.success('Event deleted successfully');
				onOpenChange(false);
			} catch (error) {
				console.error(error);
				toast.error('Failed to delete event');
			}
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) {
					if (isDirty) {
						if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
							form.reset({
								title: event.title,
								location: event.location,
								start: event.start,
								end: event.end,
								color: event.color,
								recurring: !!event.recurrence,
								recurrence: event.recurrence?.type,
								recurrenceInterval: event.recurrence?.interval,
								recurrenceDays: event.recurrence?.days,
								recurrenceEnd: event.recurrence?.endDate || null,
							});
							setIsRecurring(!!event.recurrence);
							setIsDirty(false);
							onOpenChange(false);
						}
						return;
					}
					// Reset form even when no changes were made
					form.reset({
						title: event.title,
						location: event.location,
						start: event.start,
						end: event.end,
						color: event.color,
						recurring: !!event.recurrence,
						recurrence: event.recurrence?.type,
						recurrenceInterval: event.recurrence?.interval,
						recurrenceDays: event.recurrence?.days,
						recurrenceEnd: event.recurrence?.endDate || null,
					});
					setIsRecurring(!!event.recurrence);
					onOpenChange(false);
				} else {
					onOpenChange(true);
				}
			}}
		>
			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="max-h-[90dvh] overflow-y-scroll"
			>
				<div className="flex flex-col items-center gap-2 w-full">
					<div
						className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
						aria-hidden="true"
					>
						<SquarePenIcon className="opacity-80" size={16} strokeWidth={2} />
					</div>
					<DialogHeader className="w-full">
						<div className="flex justify-center">
							<DialogTitle className="text-center truncate max-w-[20rem] px-4 pb-1">
								Edit {event.title}
							</DialogTitle>
						</div>
						<DialogDescription className="hidden">
							Make changes to your event here
						</DialogDescription>
						<Form {...form}>
							<form onSubmit={form.handleSubmit((data) => {
								onSubmit(data)
							})} className="space-y-4 overflow-auto">
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
								<div className="flex flex-row sm:flex-col gap-4">
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
								</div>

								<div className="flex flex-row gap-2 items-center">
									<FormField
										control={form.control}
										name="recurring"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center space-x-2 space-y-0">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(checked) => {
															field.onChange(checked);
															setIsRecurring(!!checked);
														}}
														id="recurring"
													/>
												</FormControl>
												<Label htmlFor="recurring">Recurring</Label>
											</FormItem>
										)}
									/>
								</div>

								{isRecurring && (
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="recurrence"
											render={({ field }) => (
												<FormItem className="w-full text-start">
													<FormLabel className="text-start text-muted-foreground">Recurrence Type</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select recurrence type" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="weekly">Weekly</SelectItem>
															<SelectItem value="daily">Daily</SelectItem>
															<SelectItem value="specific-days">Specific Days</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{(form.watch("recurrence") === "weekly" || form.watch("recurrence") === "specific-days") && (
											<FormField
												control={form.control}
												name="recurrenceInterval"
												render={({ field }) => (
													<FormItem className="w-full text-start">
														<FormLabel className="text-start text-muted-foreground">Repeat every</FormLabel>
														<Select
															onValueChange={(value) => field.onChange(parseInt(value))}
															value={field.value?.toString() || "1"}
														>
															<SelectTrigger>
																<SelectValue placeholder="Select interval" />
															</SelectTrigger>
															<SelectContent>
																{[1, 2, 3, 4].map((num) => (
																	<SelectItem key={num} value={num.toString()}>
																		{num} {num === 1 ? 'week' : 'weeks'}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}

										{form.watch("recurrence") === "specific-days" && (
											<FormField
												control={form.control}
												name="recurrenceDays"
												render={({ field }) => (
													<FormItem className="w-full text-start">
														<FormLabel className="text-start text-muted-foreground">Repeat on</FormLabel>
														<FormControl>
															<DaySelect
																value={(field.value || []) as Day[]}
																onChange={field.onChange}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}

										<FormField
											control={form.control}
											name="recurrenceEnd"
											render={({ field }) => (
												<FormItem className="w-full text-start">
													<DateTimeInput
														label="End Date"
														value={field.value || new Date()}
														onChange={field.onChange}
													/>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								)}

								<div className="flex flex-row gap-1">
									<Button type="submit" disabled={isSubmitting} className="mr-2 w-full bg-green-500">
										{isSubmitting ? 'Saving...' : 'Save'}
									</Button>
									<Button
										type="button"
										variant="destructive"
										onClick={handleDelete}
									>
										<Trash2Icon className="scale-75" />
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
