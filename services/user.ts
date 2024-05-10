import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

// Exclude keys from user
function exclude(user: any, keys: any) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}

export const findUser = async (userId: string) => {

    const userObject = await prisma.user.findFirst({
        where: {
            id: userId
        }
    });

    let includeTutor = false;
    let includeStudent = false;
    let includeAdmin = false;

    if (userObject?.role === 'TUTOR') {
        includeTutor = true;
    } else if (userObject?.role === 'STUDENT') {
        includeStudent = true;
    } else if (userObject?.role === 'ADMIN') {
        includeAdmin = true;
    }

    const userWithRelations = await prisma.user.findFirst({
        where: {
            id: userId
        },
        include: {
            tutor: includeTutor,
            student: includeStudent,
            admin: includeAdmin
        }
    });

    const userWithoutPassword = exclude(userWithRelations, 'password');

    return userWithoutPassword;
}

export const updateUser = async (userId: string, user: any) => {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {...user}
    });
}
