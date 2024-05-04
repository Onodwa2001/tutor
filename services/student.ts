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

export const search = async (city: string, suburb: string, startingPrice: number, endingPrice: number) => {
    return await prisma.tutor.findMany({
        where: {
            // Combine conditions using the `OR` operator
            OR: [
                {
                    // Condition to match tutors with both city, suburb, and chargePerHour
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
                },
                {
                    // Condition to match tutors based on city and chargePerHour
                    city: {
                        equals: city,
                    },
                    chargePerHour: {
                        gt: startingPrice,
                        lt: endingPrice 
                    },
                },
                {
                    // Condition to match tutors based on suburb and chargePerHour
                    suburb: {
                        equals: suburb,
                    },
                    chargePerHour: {
                        gt: startingPrice,
                        lt: endingPrice 
                    },
                },
            ],
        },
        orderBy: [
            { city: 'asc' },
            { suburb: 'asc' },
            { chargePerHour: 'asc' }
        ]
    })
}
