"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const colors = [
	{ value: 'bg-red-300', label: 'Red' },
	{ value: 'bg-orange-300', label: 'Orange' },
	{ value: 'bg-yellow-300', label: 'Yellow' },
	{ value: 'bg-green-300', label: 'Green' },
	{ value: 'bg-blue-300', label: 'Blue' },
	{ value: 'bg-indigo-300', label: 'Indigo' },
	{ value: 'bg-purple-300', label: 'Purple' },
	{ value: 'bg-pink-300', label: 'Pink' },
];

interface ColorSelectProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function ColorSelect({ value, onChange, className }: ColorSelectProps) {
	return (
		<div className={cn("flex flex-row gap-2 flex-wrap", className)}>
			{colors.map((color) => (
				<button
					key={color.value}
					type="button"
					onClick={() => onChange?.(color.value)}
					className={cn(
						"w-8 h-8 rounded-full flex items-center justify-center transition-all",
						color.value,
						"hover:scale-110 hover:shadow-md",
						"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
						value === color.value && "ring-2 ring-ring"
					)}
					aria-label={color.label}
				>
					{value === color.value && (
						<Check className="h-4 w-4 text-primary-foreground" />
					)}
				</button>
			))}
		</div>
	);
}
