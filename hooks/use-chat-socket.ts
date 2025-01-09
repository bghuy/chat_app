"use client"
import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string
}

type MessageWithMemberWithUser = Message & {
    member: Member & {
        user: User
    }
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}:  ChatSocketProps) => {
    const {socket} = useSocket();
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket) {
            return;
        }
        socket.on(updateKey,(message: MessageWithMemberWithUser)=>{    
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData([queryKey],(oldData: any)=>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newData = oldData.pages.map((page:any)=>{
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithUser)=>{
                            if(item.id === message.id){
                                return message;
                            }
                            return item;
                        })
                    }
                });
                return {
                    ...oldData,
                    pages: newData
                }
            })
            
        })

        socket.on(addKey,(message: MessageWithMemberWithUser)=>{
            console.log(addKey, "addKey hook");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData([queryKey],(oldData: any)=>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return {
                        pages: [{
                            items: [message]
                        }]
                    };
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newData = [...oldData.pages];
                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]
                }
                return {
                    ...oldData,
                    pages: newData
                }
            })
        });

        return () =>{
            socket.off(addKey);
            socket.off(updateKey);
        }
    },[socket,updateKey,queryClient,queryKey,addKey])
}
