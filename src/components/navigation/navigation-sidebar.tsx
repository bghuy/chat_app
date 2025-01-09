import { currentUser } from "@/lib/current-user"
import { db } from "@/lib/db";
import { redirect } from "next/navigation"
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "../user-button";
export const NavigationSidebar = async() =>{
    const user = await currentUser();
    if(!user) return redirect("/")
    
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    });


    return(
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction/>
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-sm w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server)=>(
                    <div key={server.id} className="my-2">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.image}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle/>
                <UserButton user={user}/>
            </div>

        </div>
    )
}