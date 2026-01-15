"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  SCHEDULING_PATTERNS,
  DAY_LABELS,
  DAY_ORDER,
} from "@/constants/schedule";

export default function BulkScheduling({
  scheduleByPattern,
  setPerformances,
  isRangeValid,
}) {
  const [patterns, setPatterns] = useState(SCHEDULING_PATTERNS);
  const [day, setDay] = useState("monday");
  const [time, setTime] = useState("");

  // Group patterns by day
  const grouped = SCHEDULING_PATTERNS.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  // Sort times within each day
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  DAY_ORDER.forEach((d) => {
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
          {DAY_ORDER.filter((d) => grouped[d] && grouped[d].length).map((d) => (
            <div key={d} className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{DAY_LABELS[d]}</h3>
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
