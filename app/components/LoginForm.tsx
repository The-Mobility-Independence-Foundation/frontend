"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import backendService from "../services/backend.service";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { LandingFormType } from "../types/LandingFormType";

const formSchema = z.object({
    email: z.string().nonempty("Please enter your email"),
    password: z.string().nonempty("Please enter your password")
}).refine((data) => false, { //TODO add auth check

});

interface LoginFormProps {
    setCurrentForm: (newForm: LandingFormType) => void
}

export default function SignUpForm({setCurrentForm}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // TODO login
    }

    return <div className= "w-[80%] lg:w-[65%]">
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
                <div className="flex justify-between items-center pt-6 gap-[5vw]">
                    <Button type="button" variant="secondary" className="w-1/4" onClick={() => setCurrentForm(LandingFormType.EmailCheckForm)}>Sign Up</Button>

                    <div className="flex items-center gap-2">
                        <Button type="button" className="w-[40px]">G</Button> {/*TODO Replace with google button */}
                        <Button type="submit" className="button px-[2vw] flex-1">Log In</Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
}