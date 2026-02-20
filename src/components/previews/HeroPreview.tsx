export function HeroPreview() {
  return (
    <div className="w-full aspect-video bg-background/50 rounded p-3 flex flex-col items-center justify-center gap-2 border border-border/30">
      <div className="w-24 h-1.5 bg-primary/40 rounded-full" />
      <div className="w-full h-2.5 bg-text-muted/20 rounded-full" />
      <div className="w-3/4 h-2 bg-text-muted/15 rounded-full" />
      <div className="w-2/3 h-1.5 bg-text-muted/10 rounded-full" />
      <div className="flex gap-2 mt-1">
        <div className="w-14 h-4 bg-primary/30 border border-primary/30 rounded" />
        <div className="w-12 h-4 bg-text-muted/15 border border-border/30 rounded" />
      </div>
    </div>
  );
}
