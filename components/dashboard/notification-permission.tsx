"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function NotificationPermission() {
    const [supported, setSupported] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission | "unknown">("unknown")

    useEffect(() => {
        const isSupported = typeof window !== "undefined" && "Notification" in window
        setSupported(isSupported)
        if (isSupported) setPermission(Notification.permission)
    }, [])

    if (!supported) return null

    if (permission === "granted") return null

    if (permission === "denied") {
        return (
            <div className="mb-6 p-4 rounded-xl border bg-muted/20">
                <p className="text-sm">
                    Notifikasi diblokir di browser. Kalau mau aktifkan, ubah izin notifikasi untuk situs ini di setting browser.
                </p>
            </div>
        )
    }

    return (
        <div className="mb-6 p-4 rounded-xl border bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium">Aktifkan notifikasi pesan baru?</p>
                    <p className="text-xs text-muted-foreground">
                        Biar kamu dapat pemberitahuan kalau ada pesan masuk.
                    </p>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                        try {
                            const result = await Notification.requestPermission()
                            setPermission(result)
                        } catch {
                            // ignore
                        }
                    }}
                >
                    Izinkan
                </Button>
            </div>
        </div>
    )
}
