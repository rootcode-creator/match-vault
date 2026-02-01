import { PrismaClient } from "@prisma/client";
import {membersData} from './membersData';
const prisma = new PrismaClient();
import { hash } from "bcryptjs";

async function seedMembers() {
    // Use a deterministic password for seeded users.
    // (You can change this later or randomize per user.)
    const seededPasswordHash = await hash('password', 12);

    for (const member of membersData) {
        if (!member.email) {
            console.warn('Skipping member with missing email', member);
            continue;
        }

        const user = await prisma.user.upsert({
            where: { email: member.email },
            create: {
                email: member.email,
                emailVerified: new Date(),
                name: member.name,
                passwordHash: seededPasswordHash,
                image: member.image,
                member: {
                    create: {
                        dateOfBirth: new Date(member.dateOfBirth),
                        gender: member.gender,
                        name: member.name,
                        created: new Date(member.created),
                        updated: new Date(member.lastActive),
                        description: member.description,
                        city: member.city,
                        country: member.country,
                        image: member.image,
                    },
                },
            },
            update: {
                name: member.name,
                emailVerified: new Date(),
                passwordHash: seededPasswordHash,
                image: member.image,
                member: {
                    upsert: {
                        create: {
                            dateOfBirth: new Date(member.dateOfBirth),
                            gender: member.gender,
                            name: member.name,
                            created: new Date(member.created),
                            updated: new Date(member.lastActive),
                            description: member.description,
                            city: member.city,
                            country: member.country,
                            image: member.image,
                        },
                        update: {
                            dateOfBirth: new Date(member.dateOfBirth),
                            gender: member.gender,
                            name: member.name,
                            updated: new Date(member.lastActive),
                            description: member.description,
                            city: member.city,
                            country: member.country,
                            image: member.image,
                        },
                    },
                },
            },
        });

        // Ensure at least one photo exists for this member without duplicating.
        const memberRow = await prisma.member.findUnique({
            where: { userId: user.id },
            select: { id: true },
        });

        if (memberRow?.id && member.image) {
            const existingPhoto = await prisma.photo.findFirst({
                where: {
                    memberId: memberRow.id,
                    url: member.image,
                },
                select: { id: true },
            });

            if (!existingPhoto) {
                await prisma.photo.create({
                    data: {
                        memberId: memberRow.id,
                        url: member.image,
                    },
                });
            }
        }
    }
}


async function main(){
    await seedMembers();
}


main().catch(e => {
    console.error(e);
    process.exit(1);

}).finally(async () =>{
    await prisma.$disconnect();
})