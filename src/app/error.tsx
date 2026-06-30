"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>

            {error.digest && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Error ID: <code className="font-mono text-red-500">{error.digest}</code>
                </p>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <p className="text-sm font-mono font-bold text-red-600 dark:text-red-400">
                  {error.name}: {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs mt-2 overflow-auto max-h-40 text-muted-foreground">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={reset} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Please quote the Error ID when contacting support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}