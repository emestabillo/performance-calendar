"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function BulkScheduling({
  scheduleByPattern,
  setPerformances,
  isRangeValid,
}) {
  const schedulingPatterns = [
    { label: "Sundays at 3pm", day: "sunday", time: "3:00" },
    { label: "Tuesdays at 7pm", day: "tuesday", time: "7:00" },
    { label: "Wednesdays at 2pm", day: "wednesday", time: "2:00" },
    { label: "Wednesdays at 7:30pm", day: "wednesday", time: "7:30" },
    { label: "Thursdays at 7pm", day: "thursday", time: "7:00" },
    { label: "Fridays at 7pm", day: "friday", time: "7:00" },
    { label: "Saturdays at 2pm", day: "saturday", time: "2:00" },
    { label: "Saturdays at 7:00pm", day: "saturday", time: "7:00" },
    { label: "Saturdays at 7:30pm", day: "saturday", time: "7:30" },
  ];

  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const dayLabel = {
    monday: "Mondays",
    tuesday: "Tuesdays",
    wednesday: "Wednesdays",
    thursday: "Thursdays",
    friday: "Fridays",
    saturday: "Saturdays",
    sunday: "Sundays",
  };

  // Group patterns by day
  const grouped = schedulingPatterns.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  // Sort times within each day
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  dayOrder.forEach((d) => {
    if (grouped[d]) {
      grouped[d].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
    }
  });

  const addAllForDay = (day) => {
    if (!isRangeValid || !grouped[day]) return;
    grouped[day].forEach(({ day: d, time }) => scheduleByPattern(d, time));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          <h2>Bulk Scheduling</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dayOrder
            .filter((d) => grouped[d] && grouped[d].length)
            .map((d) => (
              <div key={d} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{dayLabel[d]}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addAllForDay(d)}
                    disabled={!isRangeValid}
                  >
                    Add all
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {grouped[d].map(({ label, day, time }, idx) => (
                    <Button
                      key={`${d}-${time}-${idx}`}
                      onClick={() => scheduleByPattern(day, time)}
                      variant="outline"
                      className="h-auto py-2 hover:bg-secondary"
                      disabled={!isRangeValid}
                      aria-label={label}
                      title={label}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="flex gap-2 mt-6">
          <Button
            onClick={() => setPerformances([])}
            variant="destructive"
            disabled={!isRangeValid}
          >
            Clear All Performances
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
