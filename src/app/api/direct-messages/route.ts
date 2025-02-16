import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { DirectMessage} from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(
    req: Request
) {
    try {
        const user = await currentUser();
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");
        if(!user){
            return new NextResponse("Unauthorized",{status: 400})
        }
        if(!conversationId){
            return new NextResponse("Conversation ID missing",{status: 400})
        }

        let messages : DirectMessage[] = [];

        if(cursor){
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId:  conversationId,
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }else{
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }
        let nextCursor = null;
        if(messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH-1].id;
        }
        return NextResponse.json({
            items: messages,
            nextCursor
        });

    } catch (error) {
        console.error("[DIRECT_MESSAGES_GET]",error);
        return new NextResponse("Internal Server Error", { status: 500 });

    }
}