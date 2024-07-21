import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const addMessage = async (senderId: string, receiverId: string, content: string) => {
    try {
        const message = await prisma.message.create({
            data: {
                content,
                sender: {
                    connect: { id: senderId }
                },
                receiver: {
                    connect: { id: receiverId }
                }
            }
        });
        return message;
    } catch (err) {
        console.log(err);
    }
}

export const getAllMessages = async (senderId: string, receiverId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId,
                        receiverId
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return messages;
    } catch (err) {
        console.log(err);
    }
}

