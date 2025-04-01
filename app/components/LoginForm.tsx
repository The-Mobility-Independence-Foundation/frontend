"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import backendService from "../services/backend.service";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { LandingFormType } from "../types/LandingFormType";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

const formSchema = z.object({
    email: z.string().nonempty("Please enter your email"),
    password: z.string().nonempty("Please enter your password")
});

interface LoginFormProps {
    setCurrentForm: (newForm: LandingFormType) => void
}

export default function SignUpForm({setCurrentForm}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        backendService.post("/auth/login", {
            "email":  values.email,
            "password": values.password
        }).then(response => {
            if(response.success) {
                setLoginFailed(false);
                setInvalidLogin(false);
                localStorage.setItem('token', response.data.accessToken);
                window.location.reload();
            } else {
                setLoginFailed(false);
                setInvalidLogin(true);
            }
        }).catch(error => {
            setLoginFailed(true);
            setInvalidLogin(false);
        })
    }

    return <div className= "w-[80%]">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-left">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} placeholder={"Email"} className="bg-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type={!showPassword ? "password" : "text"} placeholder="Password" className="bg-white" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword((state) => !state)}
                                    >
                                        {showPassword ? (
                                            <EyeNoneIcon className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <EyeOpenIcon className="h-4 w-4" aria-hidden="true" />
                                        )}
                                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {invalidLogin && <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-left text-sm font-semibold text-red-500">Login Invalid</AlertTitle>
                    <AlertDescription className="text-left">
                        Your login is invalid, please try again.
                    </AlertDescription>
                </Alert>}
                {loginFailed && <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-left text-sm font-semibold text-red-500">Login Failed</AlertTitle>
                    <AlertDescription className="text-left">
                        Your login failed, please try again.
                    </AlertDescription>
                </Alert>}
                <div className="flex justify-between items-center gap-[5vw] pt-3">
                    <Button type="button" variant="secondary" className="w-1/4" onClick={() => setCurrentForm(LandingFormType.SignUpForm)}>Sign Up</Button>

                    <div className="flex items-center gap-2">
                        <Button type="button" className="relative w-[40px]" size="icon">
                            <Image 
                                src="/assets/google.svg" 
                                alt="Login with Google"
                                fill
                                className="!relative"
                            />
                        </Button>
                        <Button type="submit" className="button px-[2vw] flex-1">Log In</Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
}