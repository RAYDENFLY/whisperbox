"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { toPng } from "html-to-image"
import { toast } from "react-hot-toast"

type DownloadShareImageProps = {
    fileName?: string
    children: React.ReactNode
    actionsPosition?: "below" | "right"
}

export function DownloadShareImage({ fileName = "whisperbox.png", children, actionsPosition = "below" }: DownloadShareImageProps) {
    const ref = useRef<HTMLDivElement | null>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    const onDownload = useCallback(async () => {
        if (!ref.current) return

        setIsDownloading(true)
        try {
            const dataUrl = await toPng(ref.current, {
                cacheBust: true,
                pixelRatio: 2,
                // Prevent transparent background turning black in some viewers
                backgroundColor: "#000000",
            })

            const a = document.createElement("a")
            a.href = dataUrl
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)

            toast.success("Gambar berhasil diunduh")
        } catch (e) {
            console.error(e)
            toast.error("Gagal membuat gambar. Coba screenshot ya.")
        } finally {
            setIsDownloading(false)
        }
    }, [fileName])

    return (
        <div className={actionsPosition === "right" ? "w-full lg:grid lg:grid-cols-[420px_1fr] lg:gap-6" : "w-full flex flex-col items-center"}>
            <div ref={ref} className={actionsPosition === "right" ? "w-full" : "w-full"}>
                {children}
            </div>

            <div className={actionsPosition === "right" ? "mt-6 lg:mt-0" : "mt-8 w-full max-w-sm"}>
                <div className={actionsPosition === "right" ? "bg-background rounded-xl border p-5 shadow-sm" : ""}>
                    <Button onClick={onDownload} disabled={isDownloading} className="w-full">
                        {isDownloading ? "Membuat gambar..." : "Download gambar"}
                    </Button>
                    <p className={actionsPosition === "right" ? "mt-3 text-xs text-muted-foreground" : "mt-3 text-center text-xs text-muted-foreground"}>
                        Setelah diunduh, kamu bisa upload ke WhatsApp / Instagram Story.
                    </p>
                </div>
            </div>
        </div>
    )
}
