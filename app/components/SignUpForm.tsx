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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image"

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[\d\W]).*$/;

const formSchema = z.object({
    firstName: z.string().nonempty("Please enter your first name"),
    lastName: z.string().nonempty("Please enter your last name"),
    email: z.string().nonempty("Please enter your email"),
    username: z.string().nonempty("Please enter your username"),
    password: z.string().nonempty("Please enter your password").min(8, "Password must contain at least 8 characters")
        .regex(PASSWORD_REGEX, "Password must contain at least one letter and one number or special character"),
    passwordConfirmation: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
});

interface SignUpFormProps {
    setCurrentForm: (newForm: LandingFormType) => void
    onRequestAccess: (firstName: string, lastName: string, email: string) => void
}

export default function SignUpForm({setCurrentForm, onRequestAccess}: SignUpFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const router = useRouter();

    function onSubmit(values: z.infer<typeof formSchema>) {
        backendService.post("/auth/register", {
            "firstName": values.firstName,
            "lastName": values.lastName,
            "displayName": values.username,
            "email": values.email,
            "password": values.password
        }).then(() => {
            backendService.get("/users/id/request").then(() => {
                onRequestAccess(values.firstName, values.lastName, values.email);
            }).catch((() => {
                backendService.post("/auth/login", {
                    "email":  values.email,
                    "password": values.password
                }).then(response => {
                    localStorage.setItem('token', response.accessToken);
    
                    router.push('/listings');
                }).catch(() => {
                    toast.error("There was an issue signing you up. Please try again.");
                })
            }))
        }).catch(() => {
            toast.error("There was an issue signing you up. Please try again.");
        })
    }

    return <div className= "w-[80%]">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-left">
                <div className="flex w-full gap-8">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input {...field} placeholder="First Name" className="bg-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input {...field} placeholder="Last Name" className="bg-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} placeholder="Email" className="bg-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="mt-5">
                                <Input {...field} placeholder="Username" className="bg-white" />
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
                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type={!showPasswordConfirmation ? "password" : "text"} placeholder="Confirm your password" className="bg-white" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPasswordConfirmation((state) => !state)}
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeNoneIcon className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <EyeOpenIcon className="h-4 w-4" aria-hidden="true" />
                                        )}
                                        <span className="sr-only">{showPasswordConfirmation ? 'Hide password' : 'Show password'}</span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between items-center pt-6 gap-[5vw]">
                    <Button type="button" className="button cancel w-1/4" onClick={() => setCurrentForm(LandingFormType.LoginForm)}>Cancel</Button>

                    <div className="flex items-center gap-2">
                        <Button type="button" className="relative w-[40px]" size="icon">
                            <Image 
                                src="/assets/google.svg" 
                                alt="Sign Up with Google"
                                fill
                                className="!relative"
                            />
                        </Button>
                        <Button type="submit" className="button px-[2vw] flex-1">Sign Up</Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
}