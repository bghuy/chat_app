import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

export async function POST(req: Request){
    try {
        const {name, imageUrl} = await req.json();
        const user = await currentUser();
        if(!user) {
            console.log("401 error");
            return new NextResponse("Unauthorized", {status: 401});
        }
        const server = await db.server.create({
            data: {
                userId: user.id,
                name,
                image: imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: "general",
                            userId: user.id
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            userId: user.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("server_post: ",error);
        return new NextResponse("Internal Error", {status: 500})
    }
} 