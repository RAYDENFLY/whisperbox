import { SignUpForm } from "@/components/forms/sign-up-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Start receiving anonymous messages today.
                    </p>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    )
}
