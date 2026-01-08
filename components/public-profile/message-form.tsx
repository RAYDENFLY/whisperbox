"use client"
import { useState } from "react"
import { sendMessage } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { Ghost, Type, User } from "lucide-react"

export function MessageForm({ username }: { username: string }) {
    const [senderType, setSenderType] = useState<'ANON' | 'INITIALS' | 'NAME'>('ANON')
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append('username', username)
        formData.append('senderType', senderType)

        try {
            const result = await sendMessage(undefined, formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                setIsSent(true)
                toast.success("Message sent privately!")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSent) {
        return (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold">Message Sent!</h3>
                <p className="text-muted-foreground">Your anonymous message has been safely delivered.</p>
                <Button onClick={() => setIsSent(false)} variant="outline">Send Another</Button>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Your Message</label>
                <Textarea
                    name="content"
                    placeholder="Say something nice..."
                    required
                    className="min-h-[150px] text-base resize-none"
                />
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium">Choose Identity</label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant={senderType === 'ANON' ? 'default' : 'outline'}
                        onClick={() => setSenderType('ANON')}
                        className="flex-1"
                    >
                        <Ghost className="w-4 h-4 mr-2" /> Anonymous
                    </Button>
                    <Button
                        type="button"
                        variant={senderType === 'INITIALS' ? 'default' : 'outline'}
                        onClick={() => setSenderType('INITIALS')}
                        className="flex-1"
                    >
                        <Type className="w-4 h-4 mr-2" /> Initials
                    </Button>
                </div>

                {senderType === 'INITIALS' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <Input
                            name="senderValue"
                            placeholder="Enter your initials (e.g. JD)"
                            maxLength={4}
                            required
                            className="bg-muted/50"
                        />
                    </div>
                )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
            </Button>
        </form>
    )
}
