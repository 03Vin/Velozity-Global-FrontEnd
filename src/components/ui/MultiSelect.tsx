import * as React from "react"
import { cn } from "../../lib/utils"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "./Badge"

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

function MultiSelect({ options, value, onChange, placeholder = "Select...", className, label }: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={cn("relative inline-block text-left w-full", className)} ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{label}</label>}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring transition-all hover:bg-accent/10 cursor-pointer"
      >
        <div className="flex flex-wrap gap-1">
          {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          {value.map((v) => {
            const option = options.find((o) => o.value === v);
            return (
              <Badge key={v} variant="secondary" className="pl-2 pr-1 gap-1 py-0 h-6">
                {option ? option.label : v}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                  onClick={(e) => removeOption(v, e)}
                />
              </Badge>
            );
          })}
        </div>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-800 bg-card/90 backdrop-blur-xl p-1 text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                value.includes(option.value) && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => toggleOption(option.value)}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {value.includes(option.value) && <Check className="h-4 w-4" />}
              </span>
              {option.label}
            </div>
          ))}
          {options.length === 0 && <div className="p-2 text-xs text-center text-muted-foreground">No options available</div>}
        </div>
      )}
    </div>
  );
}

export { MultiSelect }
