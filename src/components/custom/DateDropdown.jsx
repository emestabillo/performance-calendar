import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button';
import { format } from 'date-fns';

export default function DateDropdown({dateRange, setDateRange, label, setShowDate, dateKey, placeholder}) {
  const [open, setOpen] = useState(false)
  
  const selectedDate = dateRange[dateKey] // Gets either dateRange.from or dateRange.to
  
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!selectedDate}
            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setDateRange(prev => ({ ...prev, [dateKey]: date }))
              setShowDate(date)
              setOpen(false)
            }} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
