export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 border border-brand/20 mb-4">
          <span className="text-3xl">🎁</span>
        </div>
        <h1 className="text-4xl font-bold text-gradient-brand">
          Mystery Bundle Hub
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Production foundation is ready. Homepage coming next.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm text-brand font-medium">Foundation Active</span>
        </div>
      </div>
    </main>
  );
}
