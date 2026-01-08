"use client"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Reply } from "lucide-react"
import { ReplyModal } from "./reply-modal"
import { formatDistanceToNow } from "date-fns"
import { deleteMessage } from "@/lib/actions"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function MessageCard({ message }: { message: any }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [dismissedUnread, setDismissedUnread] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setIsDeleting(true)
        const result = await deleteMessage(message.id)
        if (result.error) {
            toast.error(result.error)
            setIsDeleting(false)
        } else {
            toast.success("Message deleted")
            router.refresh()
        }
    }

    const senderDisplay = message.senderType === 'ANON'
        ? 'Anonymous'
        : message.senderType === 'INITIALS'
            ? `Initials: ${message.senderName}`
            : `Alias: ${message.senderName}`

    const isUnreplied = !message.reply && !message.repliedAt
    const showGreenDot = isUnreplied && !dismissedUnread

    return (
        <Card className="flex flex-col h-full transition-all hover:shadow-md">
            <CardHeader className="text-xs text-muted-foreground flex flex-row justify-between items-center space-y-0 pb-2">
                <span className="font-medium flex items-center gap-2">
                    {showGreenDot && (
                        <span
                            className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                            title="Belum dibalas"
                            aria-label="Belum dibalas"
                        />
                    )}
                    {senderDisplay}
                </span>
                <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
            </CardHeader>
            <CardContent className="pt-4 flex-grow">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </CardContent>
            <CardFooter className="pt-4 pb-4 flex justify-between gap-2">
                <Button
                    className="flex-1 gap-2"
                    variant="default"
                    onClick={() => {
                        setDismissedUnread(true)
                        setIsReplying(true)
                    }}
                >
                    <Reply className="h-4 w-4" />
                    Reply & Share
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </CardFooter>
            {isReplying && (
                <ReplyModal
                    message={message}
                    onClose={() => {
                        setIsReplying(false)
                    }}
                />
            )
            }
        </Card >
    )
}
