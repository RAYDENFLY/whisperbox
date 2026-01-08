import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MessageForm } from "@/components/public-profile/message-form"
import Link from "next/link"

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
    if (!prisma) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Database not configured</h1>
                <p className="text-muted-foreground max-w-md">
                    This deployment is missing <code className="font-mono">DATABASE_URL</code>. Configure it in the environment and redeploy.
                </p>
                <Link href="/" className="mt-8 text-primary hover:underline">Go home</Link>
            </div>
        )
    }

    const user = await prisma.user.findUnique({
        where: { username: params.username }
    })

    if (!user) {
        notFound()
    }

    if (!user.isAcceptingMessages) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">@{user.username} is taking a break.</h1>
                <p className="text-muted-foreground">They are not accepting new messages right now.</p>
                <Link href="/" className="mt-8 text-primary hover:underline">Create your own box</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-lg">
                <header className="mb-10 text-center space-y-2">
                    <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Send a message to</div>
                    <h1 className="text-4xl text-white font-extrabold tracking-tight">@{user.username}</h1>
                </header>

                <div className="bg-background shadow-xl rounded-2xl p-6 md:p-8 border border-border/50">
                    <MessageForm username={user.username} />
                </div>

                <footer className="mt-12 text-center text-sm text-muted-foreground">
                    <p>
                        It's confidential. <br />
                        <Link href="/" className="font-semibold text-white underline hover:text-blue">Get your own WhisperBox link</Link>
                    </p>
                </footer>
            </div>
        </div>
    )
}
