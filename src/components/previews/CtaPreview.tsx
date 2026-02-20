export function CtaPreview() {
  return (
    <div className="w-full aspect-16/6 bg-primary/20 border border-primary/30 rounded-lg p-3 flex flex-col items-center justify-center gap-1.5">
      <div className="w-2/3 h-2 bg-text-muted/30 rounded-full" />
      <div className="w-1/2 h-1.5 bg-text-muted/20 rounded-full" />
      <div className="flex gap-1.5 mt-1">
        <div className="w-12 h-3 bg-primary/40 rounded" />
        <div className="w-10 h-3 bg-text-muted/15 rounded" />
      </div>
    </div>
  );
}
