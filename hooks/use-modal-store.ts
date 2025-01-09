import { Channel, ChannelType, Server } from "@prisma/client";
import {create} from "zustand";

export type ModalType = "CreateServer" | "invite" | "EditServer" | "members" | "CreateChannel" | "LeaveServer" | "DeleteServer" | "DeleteChannel" | "EditChannel" | "MessageFile" | "DeleteMessage" ;
interface ModalData {
    server?: Server;
    channelType?: ChannelType;
    channel?: Channel;
    apiUrl?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query?: Record<string,any>;
}
interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?:ModalData) => void;
    onClose: ()=> void;
}

export const useModal = create<ModalStore>((set)=>({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type,data={}) => set({isOpen: true, type,data}),
    onClose: ()=> set({type: null, isOpen: false}),
}))