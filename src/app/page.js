'use client';
import { useState } from 'react';
import { format, isWithinInterval, parseISO, eachDayOfInterval, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, add } from 'date-fns';
import DateRangePicker from '@/components/custom/DateRangePicker';
import BulkScheduling from '@/components/custom/BulkScheduling';
import JSONOutput from '@/components/custom/JSONOutput';
import PerformanceSummary from '@/components/custom/PerformanceSummary';
import AddIndividualShows from '@/components/custom/AddIndividualShows';

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

      <AddIndividualShows addPerformance={addPerformance} removePerformance={removePerformance} getPerformancesForDate={getPerformancesForDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <PerformanceSummary sortedFilteredPerformances={sortedFilteredPerformances} />

      <JSONOutput generateJSON={generateJSON} />
    </div>
  );
}