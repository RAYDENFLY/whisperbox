"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

type AutoRefreshProps = {
    intervalMs?: number
    lastMessageAt?: string | null
    unrepliedCount?: number
}

export function AutoRefresh({ intervalMs = 15000, lastMessageAt = null, unrepliedCount }: AutoRefreshProps) {
    const router = useRouter()

    // Ask permission once (user-initiated prompt isn't strictly required for Notifications,
    // but we keep it lightweight and only ask on dashboard).
    useEffect(() => {
        if (typeof window === "undefined") return
        if (!("Notification" in window)) return

        const asked = window.localStorage.getItem("wb:notificationAsked")
        if (asked) return
        window.localStorage.setItem("wb:notificationAsked", "1")

        // Only ask if still default.
        if (Notification.permission === "default") {
            toast(
                (t) => (
                    <div className="flex items-center gap-3">
                        <div className="text-sm">
                            Aktifkan notifikasi saat ada pesan masuk?
                        </div>
                        <button
                            className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                            onClick={async () => {
                                try {
                                    await Notification.requestPermission()
                                } catch {
                                    // ignore
                                }
                                toast.dismiss(t.id)
                            }}
                        >
                            Aktifkan
                        </button>
                        <button
                            className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Nanti
                        </button>
                    </div>
                ),
                { duration: 15000 }
            )
        }
    }, [])

    // Detect new messages and show a browser notification (if permitted).
    useEffect(() => {
        if (typeof window === "undefined") return

        const prevLast = window.localStorage.getItem("wb:lastMessageAt")
        const prevCountRaw = window.localStorage.getItem("wb:unrepliedCount")
        const prevCount = prevCountRaw ? Number(prevCountRaw) : undefined

        const hasNewMessage = !!(prevLast && lastMessageAt && prevLast !== lastMessageAt)
        const increasedUnreplied =
            typeof prevCount === "number" && typeof unrepliedCount === "number"
                ? unrepliedCount > prevCount
                : false

        // Notify only when we detect a new message.
        if (hasNewMessage || increasedUnreplied) {
            if ("Notification" in window && Notification.permission === "granted") {
                const body = typeof unrepliedCount === "number"
                    ? `Ada pesan baru. ${unrepliedCount} pesan belum dibalas.`
                    : "Ada pesan baru di WhisperBox."

                try {
                    // eslint-disable-next-line no-new
                    new Notification("WhisperBox", { body })
                } catch {
                    // ignore
                }
            }
        }

        // Persist latest values for next comparison.
        if (lastMessageAt) window.localStorage.setItem("wb:lastMessageAt", lastMessageAt)
        if (typeof unrepliedCount === "number") {
            window.localStorage.setItem("wb:unrepliedCount", String(unrepliedCount))
        }
    }, [lastMessageAt, unrepliedCount])

    useEffect(() => {
        const id = window.setInterval(() => {
            router.refresh()
        }, intervalMs)

        return () => window.clearInterval(id)
    }, [router, intervalMs])

    return null
}
