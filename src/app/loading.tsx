/**
 * Instant loading UI shown by Next.js App Router while the page is streaming.
 *
 * This is a server component (no "use client") so it renders as pure HTML with
 * zero JS cost. It mirrors the hero + workspace skeleton so users see the page
 * structure immediately instead of a blank white screen while chunks download.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar skeleton */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-28 animate-pulse rounded-lg bg-muted/60" />
          <nav className="hidden items-center gap-6 md:flex">
            <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-10 animate-pulse rounded bg-muted/50" />
          </nav>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted/60" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero skeleton */}
        <section className="relative overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-20 text-center sm:px-6 md:pb-12 md:pt-24 lg:px-8">
            <div className="mx-auto h-7 w-56 animate-pulse rounded-full bg-muted/50" />
            <div className="mx-auto mt-5 h-12 w-full max-w-2xl animate-pulse rounded-lg bg-muted/40" />
            <div className="mx-auto mt-3 h-12 w-3/4 max-w-xl animate-pulse rounded-lg bg-muted/40" />
            <div className="mx-auto mt-4 h-5 w-80 animate-pulse rounded bg-muted/30" />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <div className="h-12 w-44 animate-pulse rounded-full bg-muted/40" />
              <div className="h-12 w-40 animate-pulse rounded-full bg-muted/40" />
            </div>
          </div>
        </section>

        {/* Tab switcher skeleton */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-fit animate-pulse rounded-xl border border-border/70 bg-card/60 p-1">
            <div className="h-10 w-28 rounded-lg bg-muted/50" />
            <div className="h-10 w-28 rounded-lg bg-muted/30" />
          </div>
        </div>

        {/* Workspace skeleton */}
        <section className="relative py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-muted/40" />
              <div className="mx-auto mt-2 h-4 w-80 animate-pulse rounded bg-muted/30" />
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <div className="h-48 animate-pulse rounded-3xl border-2 border-dashed border-border bg-card/40" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer skeleton */}
      <footer className="mt-auto border-t border-border/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted/30" />
        </div>
      </footer>
    </div>
  );
}
