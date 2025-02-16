import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    {params} : {params: {
        serverId: string
    }}
){
    try {
        const user = await currentUser();
        const {name, imageUrl} = await req.json();
        if(!user) new NextResponse("Unauthorized", {status: 401});
        const server = await db.server.update({
            where: {
                id: params.serverId,
                userId: user?.id
            },
            data: {
                name,
                image: imageUrl
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVER_ID_PATCH]',error);
        return new NextResponse("Internal Error", {status: 500});
        
        
    }
} 

export async function DELETE (
    req: Request,
    {params} : {params: {
        serverId: string
    }}
){
    try {
        const user = await currentUser();
        if(!user) new NextResponse("Unauthorized", {status: 401});
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                userId: user?.id
            },
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVER_ID_DELETE]',error);
        return new NextResponse("Internal Error", {status: 500});
    }
}