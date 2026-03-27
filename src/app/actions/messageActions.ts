'use server';

import { MessageSchema, messageSchema } from "@/lib/schemas/MessageSchema";
import { ActionResult, MessageDto } from "@/types";
import {Message} from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDto } from '@/lib/mappings';
import { getPusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";

const shouldExposeError =
    process.env.DEBUG_ERRORS === 'true' || process.env.NODE_ENV !== 'production';

async function ensureMemberForUserId(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, image: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    await prisma.member.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            name: user.name ?? 'New Member',
            gender: 'unspecified',
            dateOfBirth: new Date('1970-01-01'),
            description: '',
            city: '',
            country: '',
            image: user.image ?? '/images/user.png',
        },
        update: {},
    });
}


export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDto>> {
    try{
        const userId = await getAuthUserId();
        await ensureMemberForUserId(userId);
        await ensureMemberForUserId(recipientUserId);
        const validated = messageSchema.safeParse(data);
        if(!validated.success) return {status: 'error', error : validated.error.errors}

        const {text} = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId
            },
            select: messageSelect,
        });

        const messageDto = mapMessageToMessageDto (message);

        const pusherServer = getPusherServer();

        const chatId = createChatId(userId, recipientUserId);
        await pusherServer.trigger(`private-chat-${chatId}`, 'message:new', messageDto);
        await pusherServer.trigger(`private-${recipientUserId}`, 'message:new', messageDto);
        return {status: 'success', data: messageDto};
    } catch (error){
        console.error('createMessage failed', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {status: 'error', error: shouldExposeError ? message : 'Something went wrong'}
    }

}


export async function getMessageThread(recipientId: string) {



    try {


        const userId = await getAuthUserId();





        const messages = await prisma.message.findMany({


            where: {


                OR: [


                    {


                        senderId: userId,


                        recipientId,


                        senderDeleted: false


                    },


                    {


                        senderId: recipientId,


                        recipientId: userId,


                        recipientDeleted: false


                    }


                ]


            },


            orderBy: {


                created: 'asc'


            },


            select:  messageSelect,


        })





        let readCount = 0;

        if (messages.length > 0) {

            const unreadMessageIds = messages
                .filter(m => m.dateRead == null
                    && m.recipient?.userId === userId
                    && m.sender?.userId === recipientId

                    ).map(m => m.id);

            readCount = unreadMessageIds.length;

                


            await prisma.message.updateMany({


                where: {


                    senderId: recipientId,


                    recipientId: userId,


                    dateRead: null


                },


                data: { dateRead: new Date() }


            })

            if (readCount > 0) {
                const pusherServer = getPusherServer();
                const chatId = createChatId(recipientId, userId);
                await pusherServer.trigger(`private-chat-${chatId}`, 'messages:read', unreadMessageIds);
            }
        }





        return {
            messages: messages.map(message => mapMessageToMessageDto(message)),
            readCount,
        }


    } catch (error) {


        console.log(error);


        throw error;


    }


}


export async function getMessagesByContainer(container?: string|null,cursor?:string, limit=5){

    try {
        
        const userId = await getAuthUserId();

        const conditions = {
            [container ==='outbox'? 'senderId': 'recipientId']: userId,
            ...(container === 'outbox'? {senderDeleted: false}:{recipientDeleted:false} ),
            ...(cursor? {created: {lt:new Date(cursor)}} : {})

        }


        const messages = await prisma.message.findMany({

            where: conditions,
            orderBy:{
                created: 'desc'
            },
            select:messageSelect,
            take: limit + 1

        });

        let nextCursor: string | undefined;

        if(messages.length> limit){
            const nextItem = messages.pop();
            nextCursor = nextItem?.created.toISOString();
        }else {
            nextCursor = undefined;
        }
        const messagesToReturn = messages.map(message => mapMessageToMessageDto(message));
        return {messages: messagesToReturn, nextCursor};

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
    const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted';

    try {
        const userId = await getAuthUserId();

        await prisma.message.update({
            where: { id: messageId },
            data: {
                [selector]: true
            }
        })

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        })

        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({ id: m.id }))
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getUnreadMessageCount() {
    try {
        const userId = await getAuthUserId();

        return prisma.message.count({
            where: {
                recipientId: userId,
                dateRead: null,
                recipientDeleted: false
            }
        })
    } catch (error) {
        console.log(error);
        return 0;
    }
}



const messageSelect = {
    id:true,
                text: true,
                created: true,
                dateRead: true,
                sender: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                },

                recipient: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                }
}