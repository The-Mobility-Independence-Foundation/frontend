"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import backendService from "../services/backend.service";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StateCode } from "../types/StateCode";

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[\d\W]).*$/;

const formSchema = z.object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    email: z.string(),
    addressLine1: z.string().min(1, "Please enter your address"),
    addressLine2: z.string(),
    city: z.string().min(1, "Please enter your city"),
    state: z.string(),
    zipCode: z.string().min(1, "Please enter your zip code"),
    username: z.string().min(1, "Please enter your username"),
    password: z.string().min(1, "Please enter your password").min(8, "Password must contain at least 8 characters")
        .regex(PASSWORD_REGEX, "Password must contain at least one letter and one number or special character"),
    passwordConfirmation: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
});

interface SignUpFormProps {
    email: string
}

export default function SignUpForm({email}: SignUpFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: email,
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            username: "",
            password: "",
            passwordConfirmation: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // TODO send email
    }

    return <div className="w-[65%]">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                                <Input {...field} placeholder={email} disabled className="bg-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="mt-5">
                                <Input {...field} placeholder="Address" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} placeholder="Appt, suite, unit, etc." className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input {...field} placeholder="City" className="bg-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="min-w-[20%]">
                                <FormControl>
                                    <Select>
                                        <SelectTrigger className="bg-white text-black font-normal">
                                            <SelectValue placeholder="State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(StateCode).map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem className="w-[50%]">
                                <FormControl>
                                    <Input {...field} placeholder="Zip Code" className="bg-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
                                <Input {...field} placeholder="Password" className="bg-white" />
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
                            <FormControl className="mb-3">
                                <Input {...field} placeholder="Confirm your password" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            <Button type="submit">Sign Up</Button>
            </form>
        </Form>
    </div>
}