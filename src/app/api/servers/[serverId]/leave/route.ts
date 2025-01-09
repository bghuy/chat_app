import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
) {
    try {
        const user = await currentUser();
        const serverId = params.serverId;
        if(!user) return new NextResponse("Unauthorized", {status: 401});
        if(!serverId) return new NextResponse("Server ID missing", {status: 400});
        
        const server = await db.server.update({
            where: {
                id: serverId,
                userId: {
                    not: user.id
                },
                members: {
                    some: {
                        userId: user.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        userId: user.id
                    }
                }
            }

        })
        
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_LEAVE]",error );
        return new NextResponse("Internal Error", {status: 500});
    }
}