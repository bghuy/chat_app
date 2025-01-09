
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async({
    children
}:{
    children: React.ReactNode
}) => {
    return (
        <div className="h-full flex">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col inset-y-0">
                <NavigationSidebar/>
            </div>
            <div className="h-full w-full">
                {children}
            </div>
        </div>
    );
}
 
export default MainLayout;