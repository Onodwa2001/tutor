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

export const removeConnectionRequest = async (fromId: string, toId: string) => {
    return await prisma.connectionRequest.deleteMany({
        where: {
            fromUserId: fromId,
            toUserId: toId
        }
    });
}

export const connectionRequestAlreadySent = async (fromUserId: string, toUserId: string) => {
    const connRequest = await prisma.connectionRequest.findFirst({
        where: {
            fromUserId,
            toUserId,
        }
    })

    return connRequest !== null;
}

export const getFriendRequests = async (id: string) => {
    const users: Array<any> = [];

    console.log(id);

    const requests = await prisma.connectionRequest.findMany({
        where: {
            toUserId: id
        }
    })

    await Promise.all(requests.map(async (request: any) => {
        const user = await prisma.user.findFirst({
            where: {
                id: request.fromUserId
            }
        });
    
        users.push(user);
    }));

    console.log(users);

    return users;
}