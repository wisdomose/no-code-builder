export function FaqPreview() {
  return (
    <div className="w-full aspect-video flex flex-col gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-surface rounded border border-border/40 px-2 py-1.5 flex items-center justify-between gap-2"
        >
          <div className="flex-1 h-1.5 bg-text-muted/25 rounded-full" />
          <div className="w-1.5 h-1.5 border border-text-muted/30 rounded-[2px] shrink-0" />
        </div>
      ))}
    </div>
  );
}
