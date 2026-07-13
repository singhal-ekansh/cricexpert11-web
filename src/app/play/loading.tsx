export default function PlayLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      <p className="text-sm text-cream-muted">Loading…</p>
    </div>
  );
}
