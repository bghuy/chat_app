
import { auth } from "@/auth";
import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const ChannelsPage = async() => {
    const session = await auth()

    const server = await db.server.findFirst({
        where:{
            members:{
                some: {
                    userId: session?.user.id
                }
            }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`)
    }

    return (
        <InitialModal/>
        // <div>
        //     <p>Create a Server</p>
        //     {JSON.stringify(session)}
        //     <form action={
        //         async ()=>{
        //             "use server";
        //             await signOut();
        //         }
        //     }>
        //         <button type="submit">
        //             Sign out
        //         </button>
        //     </form>
        // </div>
    );
}
 
export default ChannelsPage;