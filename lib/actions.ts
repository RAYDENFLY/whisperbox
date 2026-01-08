"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers" // For IP rate limiting if needed

const RegisterSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

const MessageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
    username: z.string(),
    senderType: z.enum(['ANON', 'INITIALS', 'NAME']),
    senderValue: z.string().optional()
})

const ReplySchema = z.object({
    messageId: z.string(),
    reply: z.string().min(1, "Reply cannot be empty").max(500, "Reply too long"),
    // FormData.get() returns `FormDataEntryValue | null`, so accept null as "no image".
    replyImage: z.union([z.string(), z.null()]).optional() // Base64 string
})

export type FormState = {
    error?: string
    success?: boolean
}

export async function registerUser(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    if (!prisma) return { error: "Database is not configured" }

    const rawData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const validated = RegisterSchema.safeParse(rawData)
    if (!validated.success) return { error: validated.error.errors[0].message }

    const { username, email, password } = validated.data

    try {
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        })
        if (existing) return { error: "Username or email already taken" }

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: { username, email, password: hashedPassword }
        })
        return { success: true }
    } catch (e) {
        console.error("Registration Error:", e)
        return { error: "Registration failed" }
    }
}

export async function sendMessage(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    if (!prisma) return { error: "Database is not configured" }

    const rawData = {
        content: formData.get('content'),
        username: formData.get('username'),
        senderType: formData.get('senderType'),
        senderValue: formData.get('senderValue') || undefined
    }

    const validated = MessageSchema.safeParse(rawData)
    if (!validated.success) return { error: validated.error.errors[0].message }

    const { content, username, senderType, senderValue } = validated.data

    try {
        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) return { error: "User not found" }
        if (!user.isAcceptingMessages) return { error: "User is not accepting messages right now" }

        // Simple Bad Word Filter (Mock)
        const badWords = ["badword", "spam"]
        if (badWords.some(w => content.toLowerCase().includes(w))) {
            return { error: "Message contains inappropriate content" }
        }

        await prisma.message.create({
            data: {
                content,
                senderType: senderType as any,
                senderName: senderValue,
                userId: user.id
            }
        })

        return { success: true }
    } catch (e) {
        console.error("SendMessage Error:", e)
        return { error: "Failed to send message" }
    }
}

export async function deleteMessage(messageId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { error: "Unauthorized" }

    if (!prisma) return { error: "Database is not configured" }

    try {
        const message = await prisma.message.findUnique({ where: { id: messageId } })
        if (!message) return { error: "Not found" }
        if (message.userId !== session.user.id) return { error: "Unauthorized" }

        await prisma.message.delete({ where: { id: messageId } })
        revalidatePath('/dashboard')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete" }
    }
}

export async function saveReply(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    if (!prisma) return { error: "Database is not configured" }

    const rawData = {
        messageId: formData.get('messageId'),
        reply: formData.get('reply'),
        replyImage: formData.get('replyImage')
    }

    const validated = ReplySchema.safeParse(rawData)
    if (!validated.success) return { error: validated.error.errors[0].message }

    const { messageId, reply } = validated.data

    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user) return { error: "Unauthorized" }

    try {
        const message = await prisma.message.findUnique({ where: { id: messageId } })
        if (!message) return { error: "Message not found" }
        if (message.userId !== session.user.id) return { error: "Unauthorized" }

    const { replyImage, ...rest } = validated.data;
    const replyImageString = typeof replyImage === "string" ? replyImage : undefined

        await prisma.message.update({
            where: { id: messageId },
            data: {
                reply: rest.reply,
                repliedAt: new Date(),
        replyImage: replyImageString ? {
                    create: {
            data: replyImageString
                    }
                } : undefined
            }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (e) {
        console.error("SaveReply Error:", e)
        return { error: "Failed to save reply" }
    }
}
