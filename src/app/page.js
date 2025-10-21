"use client";
import { useState } from "react";
import {
  format,
  isWithinInterval,
  parseISO,
  eachDayOfInterval,
  isSunday,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  add,
} from "date-fns";
import RangePicker from "@/components/custom/RangePicker";
import BulkScheduling from "@/components/custom/BulkScheduling";
import JSONOutput from "@/components/custom/JSONOutput";
import PerformanceSummary from "@/components/custom/PerformanceSummary";
import { toast } from "sonner";
// import AddIndividualShows from '@/components/custom/AddIndividualShows';

export default function PerformanceCalendar() {
  const [selectedDate, setSelectedDate] = useState();
  const [performances, setPerformances] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [firstShowDate, setFirstShowDate] = useState();
  const [lastShowDate, setLastShowDate] = useState();

  const showtimes = ["2:00", "3:00", "7:00", "7:30", "8:00"];

  // Reusable sort function
  const sortDates = (performances) => {
    return performances.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If same date, compare times
      return a.time.localeCompare(b.time);
    });
  };

  // Reusable filter function
  const filterPerformances = (performances, dateRange) => {
    return performances.filter((perf) => {
      if (!dateRange.from || !dateRange.to) return true;

      const perfDate = parseISO(perf.date);
      return isWithinInterval(perfDate, {
        start: dateRange.from,
        end: dateRange.to,
      });
    });
  };

  // Apply filter and sort
  const filteredShows = filterPerformances(performances, dateRange);
  const sortedFilteredShows = sortDates(filteredShows);

  const addPerformance = (date, time) => {
    const dateString = format(date, "yyyy-MM-dd");
    const exists = performances.find(
      (p) => p.date === dateString && p.time === time
    );

    if (!exists) {
      setPerformances((prev) => {
        const newPerformances = [...prev, { date: dateString, time }];
        return sortDates(newPerformances);
      });
    }
  };

  // Consider the range valid only if both dates are present and from <= to
  const isRangeValid =
    !!dateRange.from && !!dateRange.to && dateRange.from <= dateRange.to;

  const removePerformance = (date, time) => {
    setPerformances((prev) =>
      prev.filter((p) => !(p.date === date && p.time === time))
    );
  };

  const getPerformancesForDate = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return performances
      .filter((p) => p.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Bulk scheduling function
  const scheduleByPattern = (day, time) => {
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
    const matchingDates = allDates.filter((date) => dayFunction(date));

    const newPerformances = matchingDates.map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      time: time,
    }));

    // Filter out duplicates
    const uniquePerformances = newPerformances.filter(
      (newPerf) =>
        !performances.some(
          (existingPerf) =>
            existingPerf.date === newPerf.date &&
            existingPerf.time === newPerf.time
        )
    );

    setPerformances((prev) => {
      const updated = [...prev, ...uniquePerformances];
      return sortDates(updated);
    });

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    toast.success(
      `Added ${uniquePerformances.length} performances for ${capitalize(
        day
      )}s at ${time}`
    );
  };

  // Clear all performances within date range
  const clearPerformancesInRange = () => {
    setPerformances([]);
  };

  // Use sorted performances for JSON generation
  const generateJSON = () => {
    return JSON.stringify(sortedFilteredShows, null, 2);
  };

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Performance Calendar</h1>
        <p className="mb-2 text-lg">
          Generate API-ready JSON of recurring performance dates in seconds.
        </p>
        <p className="text-sm text-muted-foreground">
          Choose a date range → pick days & times → copy JSON.
        </p>
      </header>
      <RangePicker
        dateRange={dateRange}
        setDateRange={setDateRange}
        setFirstShowDate={setFirstShowDate}
        setLastShowDate={setLastShowDate}
        isRangeValid={isRangeValid}
      />

      <BulkScheduling
        scheduleByPattern={scheduleByPattern}
        clearPerformancesInRange={clearPerformancesInRange}
        setPerformances={setPerformances}
        dateRange={dateRange}
        isRangeValid={isRangeValid}
      />

      {/* <AddIndividualShows addPerformance={addPerformance} removePerformance={removePerformance} getPerformancesForDate={getPerformancesForDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}

      <PerformanceSummary sortedFilteredPerformances={sortedFilteredShows} />

      <JSONOutput generateJSON={generateJSON} isRangeValid={isRangeValid} />
    </div>
  );
}
