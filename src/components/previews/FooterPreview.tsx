export function FooterPreview() {
  return (
    <div className="w-full aspect-16/7 bg-[#0a0a0a]/80 border border-white/10 rounded-lg p-2 flex flex-col gap-1.5">
      <div className="flex gap-3 flex-1">
        <div className="flex flex-col gap-1 w-1/3">
          <div className="w-10 h-2 bg-white/40 rounded-full" />
          <div className="w-full h-1 bg-white/15 rounded-full" />
          <div className="w-3/4 h-1 bg-white/10 rounded-full" />
        </div>
        <div className="flex gap-4 flex-1">
          {[1, 2, 3].map((c) => (
            <div key={c} className="flex flex-col gap-1">
              <div className="w-8 h-1.5 bg-white/25 rounded-full" />
              {[1, 2, 3].map((l) => (
                <div key={l} className="w-6 h-1 bg-white/10 rounded-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="h-px bg-white/10" />
      <div className="flex justify-between">
        <div className="w-20 h-1 bg-white/15 rounded-full" />
        <div className="w-16 h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}
