import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
            <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">404</h2>
                <p className="text-xl text-muted-foreground">Page not found</p>
                <Link href="/" className="inline-block mt-4 text-sm underline underline-offset-4 hover:text-primary">
                    Return Home
                </Link>
            </div>
        </div>
    )
}
