export function TestimonialsPreview() {
  return (
    <div className="w-full aspect-16/7 flex gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-1 bg-surface rounded-md border border-border/40 p-1.5 flex flex-col gap-1"
        >
          <div className="w-full h-1 bg-text-muted/20 rounded-full" />
          <div className="w-full h-1 bg-text-muted/15 rounded-full" />
          <div className="w-2/3 h-1 bg-text-muted/10 rounded-full" />
          <div className="mt-auto flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-primary/30 shrink-0" />
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="w-full h-1 bg-text-muted/25 rounded-full" />
              <div className="w-2/3 h-1 bg-text-muted/15 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
