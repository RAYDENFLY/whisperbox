import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => new PrismaClient()

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// On Vercel, Next.js may evaluate server modules during build.
// If `DATABASE_URL` isn't defined for the *build* step, Prisma throws and the build fails.
// We only create the Prisma client when a DB URL is available.
const hasDatabaseUrl = !!process.env.DATABASE_URL

const prisma: PrismaClientSingleton | null = hasDatabaseUrl
  ? (globalForPrisma.prisma ?? prismaClientSingleton())
  : null

export default prisma

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma
