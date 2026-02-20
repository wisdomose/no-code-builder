export function BentoPreview() {
  return (
    <div className="w-full aspect-16/10 grid grid-cols-5 grid-rows-4 gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      <div className="col-span-3 row-span-2 bg-primary/20 rounded border border-primary/20" />
      <div className="col-span-2 row-span-2 bg-surface rounded border border-border/40" />
      <div className="col-span-2 row-span-2 bg-surface rounded border border-border/40" />
      <div className="col-span-3 row-span-2 bg-amber-500/20 rounded border border-amber-400/20" />
    </div>
  );
}
