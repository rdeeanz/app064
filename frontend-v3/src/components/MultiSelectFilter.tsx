import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MultiSelectFilterProps {
    title: string
    options: string[]
    selectedValues: Set<string>
    onChange: (values: Set<string>) => void
    placeholder?: string
}

export function MultiSelectFilter({
    title,
    options = [],
    selectedValues,
    onChange,
    placeholder,
}: MultiSelectFilterProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed bg-slate-600 border-slate-500 text-white hover:bg-slate-500 hover:text-white"
                >
                    <span className="text-xs">{title}</span>
                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4 bg-slate-400" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden bg-slate-200 text-slate-800"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal bg-slate-200 text-slate-800"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    Array.from(selectedValues).map((option) => (
                                        <Badge
                                            variant="secondary"
                                            key={option}
                                            className="rounded-sm px-1 font-normal bg-slate-200 text-slate-800"
                                        >
                                            {option}
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={placeholder || title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option)
                                return (
                                    <CommandItem
                                        key={option}
                                        onSelect={() => {
                                            const newSelectedValues = new Set(selectedValues)
                                            if (isSelected) {
                                                newSelectedValues.delete(option)
                                            } else {
                                                newSelectedValues.add(option)
                                            }
                                            onChange(newSelectedValues)
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        {/* Add span for accessibility */}
                                        <span>{option}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onChange(new Set())}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
