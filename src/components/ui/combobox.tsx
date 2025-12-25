import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover';

export interface ComboboxOption {
    value: string;
    label: string;
    searchText?: string; // Additional text to search by
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    className,
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const selectedOption = options.find((option) => option.value === value);

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options;

        const query = searchQuery.toLowerCase();
        return options.filter((option) => {
            const labelMatch = option.label.toLowerCase().includes(query);
            const searchTextMatch = option.searchText?.toLowerCase().includes(query);
            return labelMatch || searchTextMatch;
        });
    }, [options, searchQuery]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    disabled={disabled}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.slice(0, 100).map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                        onValueChange(option.value === value ? '' : option.value);
                                        setOpen(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === option.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <span className="truncate">{option.label}</span>
                                </CommandItem>
                            ))}
                            {filteredOptions.length > 100 && (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                                    Showing first 100 results. Refine your search for more.
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
