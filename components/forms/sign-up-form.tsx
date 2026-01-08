"use client"

// @ts-ignore - useFormState is available in React 18 Canary/Next 14 but types might lag
import { useFormState } from "react-dom"
import { registerUser } from "@/lib/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const initialState = {
    error: '',
    success: false
}

export function SignUpForm() {
    // @ts-ignore
    const [state, formAction] = useFormState(registerUser, initialState)
    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            toast.success("Account created! Redirecting to login...", { duration: 4000 })
            setTimeout(() => router.push("/sign-in"), 2000)
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="username">Username</label>
                <Input id="username" name="username" placeholder="johndoe" required />
                <p className="text-xs text-muted-foreground">This will be your public handle.</p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account? <Link href="/sign-in" className="underline hover:text-primary">Sign in</Link>
            </div>
        </form>
    )
}
