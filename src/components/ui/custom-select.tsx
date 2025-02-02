/**
 * A custom select component that uses the Popover component from Radix UI
 * Encountered an error with the regular Select component interactions inside a Dialog
 *  - it was impossible to click outside of the select to close it.
 *  - could not find a fix for this, so i created this
 *
 * links:
 *  - https://github.com/shadcn-ui/ui/issues/1647
 *  - https://github.com/radix-ui/primitives/issues/2448
 */
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface CustomSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
}

export function CustomSelect({ value, onValueChange, placeholder, options }: CustomSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value ? options.find((option) => option.value === value)?.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--trigger-width] p-0"
        align="start"
        side="bottom"
        sideOffset={4}
        alignOffset={0}
        avoidCollisions
      >
        <div className="flex flex-col">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => {
                onValueChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
