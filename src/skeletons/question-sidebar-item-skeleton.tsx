export function QuestionItemSkeleton() {
  return (
    <div
      className="
        group relative flex items-start gap-2 rounded-lg border px-3 py-2.5
        border-border bg-card animate-pulse
      "
    >
      <div className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-sm bg-muted-foreground/10" />
      <div className="flex-1 min-w-0">

        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="h-2.5 w-6 rounded bg-muted-foreground/15" />
          <div className="h-2 w-8 rounded bg-muted-foreground/10" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded bg-muted-foreground/10" />
          <div className="h-2.5 w-3/4 rounded bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  );
}