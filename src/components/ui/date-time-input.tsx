"use client";

import { CalendarDateTime } from "@internationalized/date";
import { DateField, DateInput } from "./datefield-rac";
import { Label } from "react-aria-components";

export default function DateTimeInput({ label, value, onChange }: { label?: string, value: Date | null | undefined, onChange: (date: Date) => void }) {
	return (
		<DateField
			className="space-y-2 flex flex-col w-full"
			granularity="minute"
			hourCycle={12}
			hideTimeZone
			value={value ? new CalendarDateTime(
				value.getFullYear(),
				value.getMonth() + 1,
				value.getDate(),
				value.getHours(),
				value.getMinutes()
			) : null}
			onChange={(date) => {
				if (date) {
					const newDate = date.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone);
					onChange(newDate);
				}
			}}
		>
			{label && <Label className="text-sm font-medium text-muted-foreground">{label}</Label>}
			<DateInput className="relative inline-flex h-9 w-fit items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20 tracking-tighter">
			</DateInput>
		</DateField>
	);
}
