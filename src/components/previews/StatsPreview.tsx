export function StatsPreview() {
  return (
    <div className="w-full h-10 bg-background/50 border border-border/30 rounded-lg flex items-center justify-around px-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="w-8 h-2 bg-primary/40 rounded-full" />
          <div className="w-6 h-1.5 bg-text-muted/20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
