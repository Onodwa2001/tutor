import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const sendConnectionRequest = async (fromId: string, toId: string, message: string) => {
    return await prisma.connectionRequest.create({
        data: {
            fromUserId: fromId, // User ID of the sender
            toUserId: toId,    // User ID of the recipient
            message: message,      // Optional message for the connection request
        },
    });
}
