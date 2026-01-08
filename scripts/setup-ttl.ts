import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Setting up TTL index for ReplyImage...')

    try {
        // Run raw command to create index
        // Expires after 24 hours (86400 seconds)
        await prisma.$runCommandRaw({
            createIndexes: "reply_images",
            indexes: [
                {
                    key: { createdAt: 1 },
                    name: "createdAt_ttl_index",
                    expireAfterSeconds: 86400
                }
            ]
        })
        console.log('✅ TTL index created successfully')
    } catch (e) {
        console.error('❌ Error creating index:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
