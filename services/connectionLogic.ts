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

export const getConnections = async (id: string) => {
    const users: Array<any> = [];

    console.log(id);

    const connections = await prisma.connection.findMany({
        where: {
            fromUserId: id
        }
    })

    await Promise.all(connections.map(async (request: any) => {
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