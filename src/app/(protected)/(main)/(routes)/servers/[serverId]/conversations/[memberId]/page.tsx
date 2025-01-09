import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string
    },
    searchParams: {
        video?: boolean;
    },
}

const MemberIdPage = async({
    params,
    searchParams
}: MemberIdPageProps) => {
    const user = await currentUser();
    if(!user) return redirect("/auth/login");

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            userId: user.id
        },
        include: {
            user: true
        }
    })
    if(!currentMember) return redirect("/");

    const conversation = await getOrCreateConversation(currentMember.id,params.memberId);
    if(!conversation) return redirect(`servers/${params.serverId}`);

    const {memberOne, memberTwo} = conversation;
    const otherMember = memberOne.userId === user.id? memberTwo: memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.user.image}
                name={otherMember.user.name}
                serverId={params.serverId}
                type="conversation"
            />
            {searchParams.video && (
                <MediaRoom
                    chatId= {conversation.id}
                    audio = {true}
                    video = {true}
                    user = {user}
                />
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.user.name as string}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                    />
                    <ChatInput
                        name={otherMember.user.name as string}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id
                        }}
                    />
                </>
            )}

        </div>
    );
}
 
export default MemberIdPage;