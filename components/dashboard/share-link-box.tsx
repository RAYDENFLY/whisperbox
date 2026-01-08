"use client"

import { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

type ShareLinkBoxProps = {
    shareLink: string
    username: string
}

export function ShareLinkBox({ shareLink, username }: ShareLinkBoxProps) {
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const shareText = useMemo(() => {
        return [
            `Hai! Yuk kirim pesan anonim buat aku di WhisperBox 🙂`,
            `Klik link ini: ${shareLink}`,
            `Tenang aja, pesannya anonim kok.`
        ].join("\n")
    }, [shareLink])

    const onCopy = useCallback(async () => {
        try {
            setError(null)

            // Prefer copying the full invite message.
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareText)
            } else {
                // Fallback for older browsers.
                const textarea = document.createElement("textarea")
                textarea.value = shareText
                textarea.setAttribute("readonly", "")
                textarea.style.position = "fixed"
                textarea.style.top = "-9999px"
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand("copy")
                document.body.removeChild(textarea)
            }

            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        } catch (e) {
            console.error(e)
            setError("Gagal menyalin. Coba salin manual ya.")
        }
    }, [shareText])

    return (
        <div className="mb-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <h2 className="text-lg font-semibold mb-2">Dapatkan lebih banyak pesan</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Bagikan link unik kamu supaya orang lain bisa kirim pesan anonim.
            </p>

            <div className="flex items-center gap-2 max-w-md bg-background p-1.5 rounded-lg border">
                <code className="flex-1 px-2 text-sm font-mono truncate" title={shareLink}>
                    {shareLink}
                </code>
                <Button
                    size="sm"
                    className="shrink-0"
                    variant="secondary"
                    onClick={onCopy}
                    aria-label="Salin pesan ajakan + link"
                >
                    {copied ? "Tersalin" : "Copy"}
                </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
                Tombol <strong>Copy</strong> akan menyalin teks ajakan + link (bukan cuma link).
            </p>

            {error && (
                <p className="mt-2 text-xs text-destructive">
                    {error} Link: <span className="font-mono">{shareLink}</span>
                </p>
            )}
        </div>
    )
}
