
import * as React from "react";
import { X, Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type OptionType = {
  label: string;
  value: string | number;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: OptionType[];
  onChange: (selected: OptionType[]) => void;
  placeholder?: string;
  className?: string;
  createNew?: (value: string) => Promise<OptionType>;
  createNewPlaceholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Выберите элементы...",
  className,
  createNew,
  createNewPlaceholder = "Создать новый элемент...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [newItemDialogOpen, setNewItemDialogOpen] = React.useState(false);
  const [newItemValue, setNewItemValue] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: OptionType) => {
    onChange(selected.filter((i) => i.value !== item.value));
  };

  const handleSelect = (item: OptionType) => {
    if (selected.some((i) => i.value === item.value)) {
      handleUnselect(item);
    } else {
      onChange([...selected, item]);
    }
  };

  const handleCreateNewItem = async () => {
    if (!createNew || !newItemValue.trim()) return;
    
    try {
      setCreating(true);
      const newOption = await createNew(newItemValue.trim());
      onChange([...selected, newOption]);
      setNewItemDialogOpen(false);
      setNewItemValue("");
    } catch (error) {
      console.error("Failed to create new item:", error);
    } finally {
      setCreating(false);
    }
  };

  const filteredOptions = inputValue
    ? options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options;

  const showCreateNewOption = 
    createNew && 
    inputValue.trim() !== "" && 
    !options.some(option => option.label.toLowerCase() === inputValue.toLowerCase());

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              selected.length > 0 ? "h-auto" : "h-10"
            )}
          >
            <div className="flex flex-wrap gap-1 py-1">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge
                    key={item.value}
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-0.5"
                  >
                    {item.label}
                    <button
                      type="button"
                      className="rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Поиск элементов..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>Элементы не найдены.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = selected.some((item) => item.value === option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {showCreateNewOption && createNew && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setNewItemDialogOpen(true);
                        setNewItemValue(inputValue);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {createNewPlaceholder.replace('{value}', inputValue)}
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый элемент</DialogTitle>
            <DialogDescription>
              Введите название для нового элемента.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            placeholder="Введите название"
            className="mt-4"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewItemDialogOpen(false)}
              type="button"
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateNewItem}
              disabled={!newItemValue.trim() || creating}
              className="bg-fpm-blue hover:bg-fpm-blue/90"
              type="button"
            >
              {creating ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
