import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function JSONOutput({ generateJSON, isRangeValid }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateJSON());
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Generated JSON (Sorted Chronologically)</h2>
          <div className="flex items-center gap-2">
            <Button
              className={`${
                copied ? "bg-primary text-white" : "bg-foreground"
              }`}
              onClick={handleCopy}
              disabled={!isRangeValid}
            >
              {copied ? (
                <span className="inline-flex items-center gap-1">
                  <Image
                    src="/check.svg"
                    alt=""
                    aria-hidden={true}
                    width={22}
                    height={22}
                    priority
                  />
                  Copied!
                </span>
              ) : (
                "Copy JSON"
              )}
            </Button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Copied!" : ""}
            </span>
          </div>
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
