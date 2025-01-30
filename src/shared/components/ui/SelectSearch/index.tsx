import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

interface Option {
  id: string;
  nombre: string;
}

interface ComboboxProps {
  options: Option[];
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => void;
  classStyles?: string;
}

export const SelectSearch: React.FC<ComboboxProps> = ({
  options,
  placeholder,
  initialValue,
  onChange,
  classStyles,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue || '');
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);

    useEffect(() => {
      setFilteredOptions(options);
    }, [options]);

  const handleSearch = (searchTerm: string) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const newFilteredOptions = options.filter((option) =>
      option.nombre.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredOptions(newFilteredOptions);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.id === value)?.nombre
            : placeholder || 'Select an option...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <Input
            type="text"
            placeholder="Search..."
            className={cn(
              'w-full outline-none border-none focus-visible:ring-0 bg-transparent',
              classStyles
            )}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {option.nombre}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === option.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
