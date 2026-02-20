export function NavPreview() {
  return (
    <div className="w-full h-8 bg-background/60 border border-border/30 rounded-lg flex items-center justify-between px-3 gap-2">
      <div className="w-8 h-2 bg-primary/60 rounded-full" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-5 h-1.5 bg-text-muted/30 rounded-full" />
        ))}
      </div>
      <div className="w-10 h-4 bg-primary/20 border border-primary/40 rounded" />
    </div>
  );
}
