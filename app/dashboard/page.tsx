import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { MessageCard } from "@/components/dashboard/message-card"
import { ShareLinkBox } from "@/components/dashboard/share-link-box"
import { AutoRefresh } from "@/components/dashboard/auto-refresh"
import { NotificationPermission } from "@/components/dashboard/notification-permission"
import { Message } from "@prisma/client"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/sign-in")
    }

    if (!prisma) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader user={session.user} />
                <main className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="p-6 rounded-xl border bg-muted/20">
                        <h1 className="text-xl font-semibold mb-2">Database not configured</h1>
                        <p className="text-sm text-muted-foreground">
                            Set <code className="font-mono">DATABASE_URL</code> in your environment (and in Vercel) and redeploy.
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    const messages = await prisma.message.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    const unrepliedCount = await prisma.message.count({
        where: {
            userId: session.user.id,
            reply: null,
        },
    })

    const latestMessage = await prisma.message.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
    })

    const latestMessageAt = latestMessage?.createdAt?.toISOString() ?? null

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const shareLink = `${baseUrl}/u/${session.user.username}`

    return (
        <div className="min-h-screen bg-background">
            <AutoRefresh intervalMs={15000} lastMessageAt={latestMessageAt} unrepliedCount={unrepliedCount} />
            <DashboardHeader user={session.user} />
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <NotificationPermission />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Your Inbox</h1>
                </div>

                <ShareLinkBox shareLink={shareLink} username={session.user.username} />

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
