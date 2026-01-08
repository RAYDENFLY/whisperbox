import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { MessageCard } from "@/components/dashboard/message-card"
import { Button } from "@/components/ui/button"
import { Message } from "@prisma/client"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/sign-in")
    }

    const messages = await prisma.message.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const shareLink = `${baseUrl}/u/${session.user.username}`

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={session.user} />
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Your Inbox</h1>
                </div>

                <div className="mb-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                    <h2 className="text-lg font-semibold mb-2">Get more messages</h2>
                    <p className="text-sm text-muted-foreground mb-4">Share your unique link with your audience.</p>
                    <div className="flex items-center gap-2 max-w-md bg-background p-1.5 rounded-lg border">
                        <code className="flex-1 px-2 text-sm font-mono truncate">
                            {shareLink}
                        </code>
                        <Button size="sm" className="shrink-0" variant="secondary">Copy</Button>
                        {/* Note: Copy button needs client component, skipped for simplicity or can be Hydrated */}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {messages.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <span className="text-2xl">👻</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">It's quiet in here...</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Share your link on Instagram or WhatsApp to start receiving anonymous messages.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg: Message) => <MessageCard key={msg.id} message={msg} />)
                    )}
                </div>
            </main>
        </div>
    )
}
