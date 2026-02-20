export function PricingPreview() {
  return (
    <div className="w-full aspect-video flex gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg items-start">
      {[false, true, false].map((active, i) => (
        <div
          key={i}
          className={`flex-1 rounded-md border p-1.5 flex flex-col gap-1 ${
            active
              ? "bg-primary/20 border-primary/40"
              : "bg-surface border-border/40"
          }`}
        >
          <div className="w-2/3 h-1 bg-text-muted/30 rounded-full" />
          <div className="w-full h-2 bg-text-muted/20 rounded-full" />
          <div className="mt-1 space-y-0.5">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="w-full h-1 bg-text-muted/15 rounded-full"
              />
            ))}
          </div>
          <div
            className={`mt-auto h-3 rounded ${active ? "bg-primary/40" : "bg-text-muted/15"}`}
          />
        </div>
      ))}
    </div>
  );
}
