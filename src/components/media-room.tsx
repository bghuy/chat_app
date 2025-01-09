"use client"

// import { currentUser } from "@/lib/current-user";
import {LiveKitRoom, VideoConference} from "@livekit/components-react";
import "@livekit/components-styles"
import {User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
    user: User;
}


export const MediaRoom = ({
    chatId,
    video,
    audio,
    user
}: MediaRoomProps) => {
    const [token,setToken] = useState("");
    // const [user, setUser] = useState<User | null>(null);
    // useEffect(()=>{
    //     const  fetchUser = async () => {
    //         try {
    //             const res = await  currentUser();
    //             setUser(res);
    //         } catch (error) {
    //             console.log(error);
    //             setUser(null);
    //         }
    //     }
    //     fetchUser();
    // },[])
    useEffect(()=>{
        if(user && !user?.name) return;
        const name = user?.name;
        (async() =>{
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await res.json();
                setToken(data.token);
            } catch (error) {
                console.log(error);
            }
        })()

    },[user?.name, chatId, user])

    if(token === "") {
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                    className="h-7 w-7 text-zin animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    } 

    return(
        <div className="overflow-hidden h-full">
            <LiveKitRoom
                data-lk-theme = "default"
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                token={token}
                connect={true}
                video={video}
                audio={audio}
            >
                <VideoConference/>
            </LiveKitRoom>
        </div>
    )
}