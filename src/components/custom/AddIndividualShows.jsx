import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns';

export default function AddIndividualShows({addPerformance, removePerformance, getPerformancesForDate, selectedDate, setSelectedDate}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Performance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle><h2>Add Individual Performances</h2></CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Showtime Picker */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? `Performances for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a Date'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {showtimes.map(time => (
                  <Button
                    key={time}
                    onClick={() => addPerformance(selectedDate, time)}
                    variant="outline"
                  >
                    {time}
                  </Button>
                ))}
              </div>

              <div>
                <h4 className="font-medium mb-2">Current Performances:</h4>
                {getPerformancesForDate(selectedDate).map((perf, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span>{perf.time}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePerformance(perf.date, perf.time)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
