import { auth } from "@/auth";
import { db } from "./db";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/types";
export const currentUserPages = async (req: NextApiRequest, res: NextApiResponseServerIo) =>{
    try {
        const session = await auth(req,res);
        if(!session || !session.user) return null
        const {id} = session?.user;
        if(!id) return null
    
        const user = await db.user.findUnique({
            where:{
                id: id
            }
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}