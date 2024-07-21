import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const signUpTutor = async (user: any) => {
    const connectionObject = await prisma.user.create({
        data: user,
        include: {
            tutor: true
        }
    });

    return connectionObject !== null;
}

export const findTutors = async () => {
    return await prisma.user.findMany({
        where: {
            role: 'TUTOR'
        },
        include: {
            tutor: true
        }
    });
}
