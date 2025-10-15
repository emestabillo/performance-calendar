import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export default function DateRangePicker({ dateRange, setDateRange }) {
  return (
    <>
      {/* Date Range Picker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Date Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                className="rounded-md border"
              />
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
