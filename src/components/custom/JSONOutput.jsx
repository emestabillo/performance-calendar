import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '../ui/button'

export default function JSONOutput({generateJSON}) {
  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Generated JSON (Sorted Chronologically)
            <Button className="bg-foreground" onClick={() => navigator.clipboard.writeText(generateJSON())}>
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
    </>
  )
}
