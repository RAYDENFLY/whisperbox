import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Share2, MessageCircle } from "lucide-react"

// @ts-ignore
export default async function SharePage({ params }: { params: { id: string } }) {
    if (!prisma) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 text-center">
                <div className="max-w-md">
                    <h1 className="text-2xl font-bold mb-2">Database not configured</h1>
                    <p className="text-muted-foreground">
                        This deployment is missing <code className="font-mono">DATABASE_URL</code>. Configure it in the environment and redeploy.
                    </p>
                </div>
            </div>
        )
    }

    const message = await prisma.message.findUnique({
        where: { id: params.id },
        include: { replyImage: true }
    })

    if (!message) return notFound()

    // @ts-ignore
    const { reply, senderType, senderName, content, replyImage } = message

    const senderDisplay = senderType === 'ANON'
        ? 'Anonymous'
        : senderType === 'INITIALS'
            ? `Initials: ${senderName}`
            : `Alias: ${senderName}`

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const shareUrl = `${baseUrl}/share/${message.id}`
    const shareText = `Check out this anonymous message! ${shareUrl}`

    const igUrl = `https://www.instagram.com/stories/share/?url=${encodeURIComponent(shareUrl)}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
            {/* 9:16 Card Container */}
            <div className="w-full max-w-md bg-white dark:bg-black shadow-2xl overflow-hidden relative aspect-[9/16] rounded-[2rem] flex flex-col">

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full p-8 items-center justify-center gap-6">

                    {/* Branding */}
                    <div className="absolute top-12 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-white shadow-lg"></div>
                        <span className="text-white font-bold tracking-widest text-xs uppercase shadow-sm">WhisperBox</span>
                    </div>

                    {/* Main Content */}
                    <div className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col gap-4">

                        {/* Question */}
                        <div className="bg-gray-50 dark:bg-black/50 p-4 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                                    ?
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase">{senderDisplay}</span>
                            </div>
                            <p className="text-sm text-white font-medium leading-relaxed">
                                {content}
                            </p>
                        </div>

                        {/* Reply */}
                        {reply ? (
                            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-4 rounded-2xl rounded-tr-sm text-white shadow-lg flex flex-col gap-3">
                                <div className="flex items-center gap-2 mb-1 justify-end">
                                    <span className="text-xs font-bold text-indigo-100 uppercase">You</span>
                                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                                        ✓
                                    </div>
                                </div>

                                {replyImage && (
                                    <div className="rounded-lg overflow-hidden w-full">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={replyImage.data}
                                            alt="Reply attachment"
                                            className="w-full h-auto object-cover max-h-[300px]"
                                        />
                                    </div>
                                )}

                                <p className="text-sm font-medium leading-relaxed text-right">
                                    {reply}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-xs text-white/70 italic">
                                No reply yet
                            </div>
                        )}

                    </div>

                    {/* Footer Link */}
                    <div className="absolute bottom-12 text-center">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                            <p className="text-[10px] font-bold text-white">
                                whisperbox.vercel.app
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions for the User visiting the page (or the owner) */}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
                <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-white items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 hover:brightness-110"
                >
                    <Share2 className="h-5 w-5" />
                    Share to Instagram Story
                </a>
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-white items-center justify-center gap-2 bg-[#25D366] p-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 hover:brightness-110"
                >
                    <MessageCircle className="h-5 w-5" />
                    Share to WhatsApp Status
                </a>
                <p className="text-center text-xs text-muted-foreground mt-2">
                    Tip: Screenshot the card above if sharing directly doesn't work!
                </p>
            </div>
        </div>
    )
}
