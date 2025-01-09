'use client'
import { useRouter } from "next/navigation";
interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild? : boolean;
};

export const LoginButton = ({
    children,
    mode = "redirect",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asChild
}:LoginButtonProps)=>{
    const router = useRouter();
    const OnClick = () =>{
        router.push("/auth/login")
    }
    if(mode === "modal"){
        return(
            <span>
                TODO: Implement modal
            </span>
        )
    }
    return(
        <span onClick={()=>{OnClick()}} className="cursor-pointer">
            {children}
        </span>
    )
}