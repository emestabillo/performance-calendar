import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function JSONOutput({ generateJSON, isRangeValid }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Generated JSON (Sorted Chronologically)</h2>
          <Button
            className="bg-foreground"
            onClick={() => navigator.clipboard.writeText(generateJSON())}
            disabled={!isRangeValid}
          >
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
  );
}
