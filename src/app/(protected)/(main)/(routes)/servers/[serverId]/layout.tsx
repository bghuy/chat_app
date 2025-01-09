import { currentUser } from "@/lib/current-user";
import { signOut } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";
const ServerIdLayout = async({
    children,
    params
}: {
    children: React.ReactNode,
    params: {
        serverId: string
    }
}) =>{
    const user = await currentUser();
    if(!user){
        await signOut();
    }
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    userId: user?.id
                }
            }
        }
    });
    if(!server){
        return redirect("/")
    }
    return(
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
                <ServerSidebar serverId = {params.serverId}/>
            </div>
            <main className="h-full pl-0 md:pl-60">
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout;