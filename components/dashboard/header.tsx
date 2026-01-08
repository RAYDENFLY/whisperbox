"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function DashboardHeader({ user }: { user: { username: string } }) {
    return (
        <header className="border-b h-16 flex items-center px-6 bg-card sticky top-0 z-10 w-full shadow-sm">
            <Link href="/dashboard" className="font-bold text-lg tracking-tight">WhisperBox</Link>
            <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">@{user.username}</span>
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>Log out</Button>
            </div>
        </header>
    )
}
