import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const makeConnection = async (fromId: string, toId: string) => {
    return await prisma.connection.create({
        data: {
            fromUserId: fromId, // User ID of the sender
            toUserId: toId,    // User ID of the recipient
        },
    });
}
