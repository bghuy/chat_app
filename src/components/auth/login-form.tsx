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
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
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
                await LocalLogin(email, password);
                setSuccess('Login successfully!');
                router.push("/test");
            } catch (error) {
                console.log(error);
                // setError("Login failed!");
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