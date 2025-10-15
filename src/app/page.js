'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isWithinInterval, parseISO, eachDayOfInterval, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday } from 'date-fns';
import DateRangePicker from '@/components/custom/DateRangePicker';
import BulkScheduling from '@/components/custom/BulkScheduling';

export default function PerformanceCalendar() {
  const [selectedDate, setSelectedDate] = useState();
  const [performances, setPerformances] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const showtimes = ['2:00', '3:00', '7:00', '7:30', '8:00'];

  // Sort performances by date, then by time
  const sortedPerformances = performances.sort((a, b) => {
    // First compare dates
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    // If same date, compare times
    return a.time.localeCompare(b.time);
  });

  const filteredPerformances = sortedPerformances.filter(perf => {
    if (!dateRange.from || !dateRange.to) return true;
    
    const perfDate = parseISO(perf.date);
    return isWithinInterval(perfDate, {
      start: dateRange.from,
      end: dateRange.to,
    });
  });

  // Also sort the filtered performances for display
  const sortedFilteredPerformances = filteredPerformances.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.time.localeCompare(b.time);
  });

  const addPerformance = (date, time) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const exists = performances.find(p => 
      p.date === dateString && p.time === time
    );
    
    if (!exists) {
      setPerformances(prev => {
        const newPerformances = [...prev, { date: dateString, time }];
        // Sort immediately when adding
        return newPerformances.sort((a, b) => {
          const dateComparison = a.date.localeCompare(b.date);
          if (dateComparison !== 0) return dateComparison;
          return a.time.localeCompare(b.time);
        });
      });
    }
  };

  const removePerformance = (date, time) => {
    setPerformances(prev => 
      prev.filter(p => !(p.date === date && p.time === time))
    );
  };

  const getPerformancesForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return performances.filter(p => p.date === dateString).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Bulk scheduling function
  const scheduleByPattern = (day, time) => {
    if (!dateRange.from || !dateRange.to) {
      alert('Please set a date range first');
      return;
    }

    const allDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    const dayFunctions = {
      sunday: isSunday,
      monday: isMonday,
      tuesday: isTuesday,
      wednesday: isWednesday,
      thursday: isThursday,
      friday: isFriday,
      saturday: isSaturday,
    };

    const dayFunction = dayFunctions[day];
    const matchingDates = allDates.filter(date => dayFunction(date));

    const newPerformances = matchingDates.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      time: time,
    }));

    // Filter out duplicates
    const uniquePerformances = newPerformances.filter(newPerf => 
      !performances.some(existingPerf => 
        existingPerf.date === newPerf.date && existingPerf.time === newPerf.time
      )
    );

    setPerformances(prev => {
      const updated = [...prev, ...uniquePerformances];
      // Sort after bulk adding
      return updated.sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;
        return a.time.localeCompare(b.time);
      });
    });
    
    alert(`Added ${uniquePerformances.length} performances for ${day}s at ${time}`);
  };

  // Clear all performances within date range
  const clearPerformancesInRange = () => {
    if (!dateRange.from || !dateRange.to) {
      setPerformances([]);
      return;
    }

    setPerformances(prev => 
      prev.filter(perf => {
        const perfDate = parseISO(perf.date);
        return !isWithinInterval(perfDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      })
    );
  };

  // Use sorted performances for JSON generation
  const generateJSON = () => {
    return JSON.stringify(sortedFilteredPerformances, null, 2);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Performance Calendar</h1>
      <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />

      <BulkScheduling scheduleByPattern={scheduleByPattern} clearPerformancesInRange={clearPerformancesInRange} setPerformances={setPerformances} dateRange={dateRange} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Add Individual Performances</CardTitle>
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

      {/* Performance Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            Performance Summary ({sortedFilteredPerformances.length} in range) - Sorted by Date/Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {sortedFilteredPerformances.map((perf, index) => (
              <div key={index} className="bg-muted p-3 rounded-md text-sm">
                <strong>{perf.date}</strong> at {perf.time}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* JSON Output */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Generated JSON (Sorted Chronologically)
            <Button onClick={() => navigator.clipboard.writeText(generateJSON())}>
              Copy JSON
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            {generateJSON()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}