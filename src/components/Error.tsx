import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-dvh w-screen items-center justify-center bg-background text-text-main p-4">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 text-center relative z-10 w-full max-w-xl mx-auto">
        <div className="w-20 h-20 bg-surface border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/10">
          <AlertTriangle size={40} />
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <h1 className="text-4xl font-bold tracking-tight text-text-main">
            Something went wrong
          </h1>
          <p className="text-sm text-text-muted font-medium">
            An unexpected error occurred while loading this page.
          </p>
          {import.meta.env.DEV && (
            <div className="mt-4 text-left p-4 bg-surface border border-border rounded-lg overflow-auto w-full text-red-400">
              <pre className="text-xs whitespace-pre-wrap font-mono">
                {error.message || "Unknown error"}
              </pre>
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              if (reset) reset();
              else router.invalidate();
            }}
            className="px-6 py-2.5 bg-surface hover:bg-border border border-border text-text-main font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center cursor-pointer"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center"
          >
            Return to Editor
          </Link>
        </div>
      </div>
    </div>
  );
}
