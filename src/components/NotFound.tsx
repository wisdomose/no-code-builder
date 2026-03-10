import { Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex flex-col h-dvh w-screen items-center justify-center bg-background text-text-main p-4">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 max-w-md text-center">
        <div className="w-20 h-20 bg-surface border border-border rounded-3xl flex items-center justify-center text-text-muted shadow-2xl">
          <SearchX size={40} className="text-primary" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-text-main">
            404 Not Found
          </h1>
          <p className="text-sm text-text-muted font-medium">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center"
        >
          Return to Editor
        </Link>
      </div>
    </div>
  );
}
