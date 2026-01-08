"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Share, Send, Image as ImageIcon, Trash2 } from "lucide-react"
import { saveReply } from "@/lib/actions"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function ReplyModal({ message, onClose }: { message: any, onClose: () => void }) {
    const [reply, setReply] = useState(message.reply || "")
    const [isSaving, setIsSaving] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const senderDisplay = message.senderType === 'ANON'
        ? 'Anonymous'
        : message.senderType === 'INITIALS'
            ? `Initials: ${message.senderName}`
            : `Alias: ${message.senderName}`

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 4.5 * 1024 * 1024) { // ~4.5MB
            toast.error("Image too large. Max 4.5MB")
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    async function handleSave() {
        if (!reply.trim() && !imagePreview) return
        setIsSaving(true)

        const formData = new FormData()
        formData.append("messageId", message.id)
        formData.append("reply", reply)
        if (imagePreview) {
            formData.append("replyImage", imagePreview)
        }

        const result = await saveReply(undefined, formData)

        if (result.error) {
            toast.error(result.error)
            setIsSaving(false)
        } else {
            toast.success("Reply saved!")
            // Navigate to share page or just close
            router.push(`/share/${message.id}`)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden border">
                {/* PREVIEW SECTION (Mobile 9:16 style) */}
                <div className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>

                    {/* The Card */}
                    <div className="w-[300px] bg-white dark:bg-zinc-950 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative z-10 font-sans">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">WhisperBox</span>
                        </div>

                        {/* Question Bubble */}
                        <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">
                            <div className="text-xs  text-muted-foreground mb-1 uppercase tracking-wide">{senderDisplay} asks:</div>
                            <div className="text-white"> {message.content}</div> 
                        </div>

                        {/* Reply Bubble */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-2xl rounded-tr-sm text-sm text-white font-medium flex flex-col gap-2">
                            <div className="text-xs text-indigo-100 mb-1 uppercase tracking-wide">You replied:</div>
                            {imagePreview && (
                                <div className="rounded-lg overflow-hidden mb-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imagePreview} alt="Reply attachment" className="w-full object-cover max-h-40" />
                                </div>
                            )}
                            {reply || (!imagePreview && <span className="italic opacity-50">Type your reply...</span>)}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-900 text-center">
                            <p className="text-[10px] text-muted-foreground font-medium">
                                send me anonymous messages at <br />
                                <span className="text-indigo-600 dark:text-indigo-400">whisperbox.vercel.app</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* EDIT SECTION */}
                <div className="flex-1 flex flex-col p-6 bg-background">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Reply to Message</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Original Message</label>
                            <div className="p-3 bg-muted/50 rounded-lg text-sm">{message.content}</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Reply</label>

                            {/* Image Preview in Edit Mode */}
                            {imagePreview && (
                                <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => {
                                            setImagePreview(null)
                                            if (fileInputRef.current) fileInputRef.current.value = ""
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <Textarea
                                placeholder="Type your reply here..."
                                className="min-h-[120px] resize-none text-base"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                autoFocus={!imagePreview}
                            />

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 text-xs"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon className="h-3.5 w-3.5" />
                                        Add Image
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                    {reply.length}/500
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button className="flex-1 gap-2" onClick={handleSave} disabled={isSaving || (!reply && !imagePreview)}>
                            <Share className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Reply & Share"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
