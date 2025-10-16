import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import DateDropdown from './DateDropdown'

export default function DateRangePicker({ dateRange, setDateRange, setFirstShowDate, setLastShowDate }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle><h2>Performance Date Range</h2></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <DateDropdown 
            dateRange={dateRange} 
            setDateRange={setDateRange}
            setShowDate={setFirstShowDate}
            dateKey="from"
            label={"Start date"}
            placeholder={"Pick a start date"}
          />
          <DateDropdown 
            dateRange={dateRange}
            setDateRange={setDateRange}
            setShowDate={setLastShowDate}
            dateKey="to"
            label={"End date"}
            placeholder={"Pick an end date"}
          />
        </div>
        {dateRange.from && dateRange.to && (
          <p className="text-sm text-muted-foreground">
            Date range: {format(dateRange.from, 'MMM d, yyyy')} to {format(dateRange.to, 'MMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
