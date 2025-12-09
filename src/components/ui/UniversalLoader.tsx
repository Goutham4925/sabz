export default function PulseRingsLoader() {
  return (
    <div className="fixed inset-0 bg-background/85 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-4 border-2 border-primary/40 rounded-full animate-ping" />
      </div>
    </div>
  );
}