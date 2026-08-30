
export default function QuestionItemSkeleton() {
  return (
    <article className="sm:min-w-90 md:w-140 animate-pulse text-center rounded-3xl border border-white/10 bg-white/[0.06] shadow-indigo-950/40 backdrop-blur-xl">
      <span className="mb-5 inline-flex h-6 w-32 rounded-full bg-white/10" />

      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="h-5 w-4/5 rounded-md bg-white/50" />
        <div className="h-5 w-2/3 rounded-md bg-white/50" />
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <span className="size-9 shrink-0 rounded-xl bg-white/10" />
            <span className="h-4 w-2/3 rounded-md bg-white/10" />
          </div>
        ))}
      </div>
    </article>
  );
}
