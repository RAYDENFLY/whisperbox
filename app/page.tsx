import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-6 h-14 flex items-center border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <span className="font-bold text-lg tracking-tight">WhisperBox</span>
        <nav className="ml-auto flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-24 md:py-32 lg:py-48 px-4 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Quiet conversations. <br />
              Loud impact.
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Send and receive anonymous messages securely. share your link, get honest feedback, and connect without barriers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base">Get Your Link</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">Go to Dashboard</Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto grid place-items-center py-12 lg:py-24 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl">
            <div className="p-6 space-y-2">
              <h3 className="font-bold text-xl">Anonymous</h3>
              <p className="text-muted-foreground">Encryption and privacy first. No IP logging visible to users.</p>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-bold text-xl">Simple</h3>
              <p className="text-muted-foreground">Just a link. No app download required for senders.</p>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-bold text-xl">Safe</h3>
              <p className="text-muted-foreground">Built-in moderation tools and block capabilities.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p>&copy; 2026 WhisperBox. Open Source.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
