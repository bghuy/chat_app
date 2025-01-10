'use client'
import { CardWrapper } from "./card-wrapper"
import { LoginSchema } from "@/schemas"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormSuccess } from "../form-success"
import { useState, useTransition } from "react"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken';
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { FormError } from "../form-error"
import { LocalLogin } from "@/actions/auth/login"
export const LoginForm = () => {
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("")
    const router = useRouter();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const submitForm = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(async()=>{
            try {
                const {email, password} = values;
                const res = await LocalLogin(email, password);
                const {access_token} = res;
                if(!access_token){
                    throw new Error("Login failed!");
                }
                const decoded = jwt.decode(access_token);
                const {exp} = decoded as {exp: number};
                const expirationTime = exp ? new Date(exp * 1000) : Math.floor(Date.now() / 1000) + 3600;
                Cookies.set('access_token', access_token, { expires: expirationTime });
                // Cookies.set('access_token', access_token, { expires: 7 });
                setSuccess('Login successfully!');
                router.push("/test");
            } catch (error) {
                setError("Login failed!");
            }
        })
    }
    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form 
                    action="" 
                    onSubmit={form.handleSubmit((values)=>{submitForm(values)})}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}