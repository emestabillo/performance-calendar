import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PerformanceSummary({sortedFilteredPerformances}) {
  return (
    <>
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
    </>
  )
}
