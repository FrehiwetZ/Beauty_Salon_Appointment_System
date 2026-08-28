function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div
        className="h-14 w-14 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"
        aria-label="Loading"
      ></div>
    </div>
  );
}

export default Loading;