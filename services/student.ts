import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const signUpStudent = async (user: any) => {
    return await prisma.user.create({
        data: user,
        include: {
            student: true
        }
    });
}

export const getUserByName = async (username: string) => {
    return await prisma.user.findFirst({
        where: {
            name: username
        }
    })
}

// Exclude keys from user
function exclude(user: any, keys: any) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}

export const search = async (city: string, suburb: string, startingPrice: number, endingPrice: number) => {

    // if ()

    const users = await prisma.user.findMany({
        where: {
            // Combine conditions using the `OR` operator
            OR: [
                {
                    tutor: {
                        // Condition to match tutors with city, suburb, and chargePerHour
                        city: {
                            equals: city,
                        },
                        suburb: {
                            equals: suburb,
                        },
                        chargePerHour: {
                            gt: startingPrice,
                            lt: endingPrice 
                        },
                    }
                },
                {
                    tutor: {
                        // Condition to match tutors based on city and chargePerHour
                        city: {
                            equals: city,
                        },
                        chargePerHour: {
                            gt: startingPrice,
                            lt: endingPrice 
                        },
                    }
                },
                {
                    tutor: {
                        // Condition to match tutors based on suburb and chargePerHour
                        suburb: {
                            equals: suburb,
                        },
                        chargePerHour: {
                            gt: startingPrice,
                            lt: endingPrice 
                        },
                    }
                },
            ],
        }, 
        orderBy: [
            { tutor: { city: 'asc' } },
            { tutor: { suburb: 'asc' } },
            { tutor: { chargePerHour: 'asc' } }
        ],
        include: {
            tutor: true
        },
    })

    const userWithoutPassword: any = [];
    
    users.forEach(user => {
        userWithoutPassword.push(exclude(user, ['password']));
    });

    return userWithoutPassword;

}
