export function TeamPreview() {
  const colors = [
    "bg-primary/40",
    "bg-rose-500/40",
    "bg-emerald-500/40",
    "bg-amber-500/40",
  ];
  return (
    <div className="w-full aspect-16/7 flex gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {colors.map((c, i) => (
        <div
          key={i}
          className="flex-1 bg-surface rounded-md border border-border/40 p-2 flex flex-col items-center gap-1.5"
        >
          <div className={`w-6 h-6 rounded-full ${c}`} />
          <div className="w-full h-1 bg-text-muted/25 rounded-full" />
          <div className="w-3/4 h-1 bg-text-muted/15 rounded-full" />
        </div>
      ))}
    </div>
  );
}
