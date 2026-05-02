export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-water-200 border-t-water-600 rounded-full animate-spin" />
      <p className="text-water-600 font-medium">{message}</p>
    </div>
  );
}
