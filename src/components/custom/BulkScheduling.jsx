import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '../ui/button'

export default function BulkScheduling({scheduleByPattern, clearPerformancesInRange, setPerformances, dateRange}) {
  const schedulingPatterns = [
    { label: 'Sundays at 3pm', day: 'sunday', time: '3:00' },
    { label: 'Tuesdays at 7pm', day: 'tuesday', time: '7:00' },
    { label: 'Wednesdays at 2pm', day: 'wednesday', time: '2:00' },
    { label: 'Wednesdays at 7:30pm', day: 'wednesday', time: '7:30' },
    { label: 'Thursdays at 7pm', day: 'thursday', time: '7:00' },
    { label: 'Fridays at 7pm', day: 'friday', time: '7:00' },
    { label: 'Saturdays at 2pm', day: 'saturday', time: '2:00' },
    { label: 'Saturdays at 7:30pm', day: 'saturday', time: '7:30' },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle><h2>Bulk Scheduling</h2></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {schedulingPatterns.map((pattern, index) => (
            <Button
              key={index}
              onClick={() => scheduleByPattern(pattern.day, pattern.time)}
              variant="outline"
              className="h-auto py-3"
              disabled={!dateRange.from || !dateRange.to}
            >
              <div className="text-left">
                <div className="font-medium">{pattern.label}</div>
              </div>
            </Button>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {/* <Button 
            onClick={clearPerformancesInRange}
            variant="destructive"
          >
            Clear Performances in Range
          </Button> */}
          <Button 
            onClick={() => setPerformances([])}
            variant="destructive"
          >
            Clear All Performances
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
