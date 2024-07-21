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
            OR: [
                { fromUserId: id },
                { toUserId: id }
            ]
        }
    })

    await Promise.all(connections.map(async (request: any) => {
        let user: any = null;

        if (id === request.toUserId) {
            const userObj = await prisma.user.findFirst({
                where: {
                    id: request.fromUserId
                }
            });

            user = userObj;
        } else if (id === request.fromUserId) {
            const userObj = await prisma.user.findFirst({
                where: {
                    id: request.toUserId
                }
            });

            user = userObj;
        }

        users.push(user);
    }));

    console.log(users);

    return users;
}