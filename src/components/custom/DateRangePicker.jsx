import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function DateRangePicker({ dateRange, setDateRange, setFirstShowDate, setLastShowDate, openFirstShowDateCalendar, setOpenFirstShowDateCalendar, openLastShowDateCalendar, setOpenLastShowDateCalendar }) {
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle><h2>Performance Date Range</h2></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Popover open={openFirstShowDateCalendar} onOpenChange={setOpenFirstShowDateCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!dateRange.from}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon />
                    {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => {
                      setDateRange(prev => ({ ...prev, from: date }))
                      setFirstShowDate(date)
                      setOpenFirstShowDateCalendar(false)
                    }} />
                </PopoverContent>
              </Popover>
            </div>
          
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Popover open={openLastShowDateCalendar} onOpenChange={setOpenLastShowDateCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!dateRange.to}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon />
                    {dateRange.to ? format(dateRange.to, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => {
                      setDateRange(prev => ({ ...prev, to: date }))
                      setLastShowDate(date)
                      setOpenLastShowDateCalendar(false)
                    }} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {dateRange.from && dateRange.to && (
            <p className="text-sm text-muted-foreground">
              Date range: {format(dateRange.from, 'MMM d, yyyy')} to {format(dateRange.to, 'MMM d, yyyy')}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
