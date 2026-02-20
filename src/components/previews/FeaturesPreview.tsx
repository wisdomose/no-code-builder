export function FeaturesPreview() {
  return (
    <div className="w-full aspect-16/8 grid grid-cols-3 grid-rows-2 gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded border border-border/40 p-1.5 flex flex-col gap-1"
        >
          <div className="w-3 h-3 rounded-full bg-primary/30" />
          <div className="w-full h-1 bg-text-muted/25 rounded-full" />
          <div className="w-3/4 h-1 bg-text-muted/15 rounded-full" />
        </div>
      ))}
    </div>
  );
}
