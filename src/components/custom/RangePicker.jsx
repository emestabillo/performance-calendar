import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import DateDropdown from "./DateDropdown";

export default function RangePicker({
  dateRange,
  setDateRange,
  setFirstShowDate,
  setLastShowDate,
  isRangeValid,
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          <h2>Performance Date Range</h2>
        </CardTitle>
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
        {dateRange.from &&
          dateRange.to &&
          (isRangeValid ? (
            <p className="text-sm text-muted-foreground">
              Date range: {format(dateRange.from, "MMM d, yyyy")} to{" "}
              {format(dateRange.to, "MMM d, yyyy")}
            </p>
          ) : (
            <p className="text-sm text-red-500">
              Error: Start date must be the same as or earlier than the end
              date.
            </p>
          ))}
      </CardContent>
    </Card>
  );
}
