export function QuizItemSkeleton() {
  return (
    <div className="relative flex flex-col gap-2 h-[250px] items-start text-start justify-between px-6 py-4 bg-grey rounded-md animate-pulse">
      {/* Draft badge placeholder */}
      <div className="h-6 w-20 bg-gray-300 rounded-2xl" />

      {/* Title placeholder */}
      <div className="h-5 w-3/4 bg-gray-300 rounded-md" />

      {/* Action buttons placeholder */}
      <div className="flex items-center self-center gap-2">
        <div className="h-7 w-7 bg-gray-300 rounded-md" />
        <div className="h-7 w-7 bg-gray-300 rounded-md" />
      </div>
    </div>
  );
}
