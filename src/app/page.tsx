import {Poppins} from "next/font/google"
// import { AuthScreen } from "@/features/auth/components/auth-screen"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { currentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
const font = Poppins({
  subsets: ["latin"],
  weight: ['600']
})
export default async function Home() {
  const user = await currentUser();
  if(user){
    return redirect("/setup")
  }else{
    return redirect("/auth/login")
  }
  return(
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
          <h1 className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className,
            )}>
            🔐Auth
          </h1>
          <p className="text-white text-lg">
            A simple authentication service
          </p>
          <div>
            <LoginButton>
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </LoginButton>
          </div>
      </div>
    </main>
    // <AuthScreen/>
  )
}
