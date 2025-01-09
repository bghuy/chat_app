"use client"

import { createContext, useContext, useEffect, useState } from "react";
import ClientIO from "socket.io-client";  // Use default import

type SocketContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket: any | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socket, setSocket] = useState<any>(null); // Add type for socket
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {  // No need for "new" keyword
            path: "/api/socket/io",
            // addTrailingSlash: false
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
