"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import backendService from "../services/backend.service";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LandingFormType } from "../types/LandingFormType";

const formSchema = z.object({
    firstName: z.string().nonempty("Please enter your first name"),
    lastName: z.string().nonempty("Please enter your last name"),
    email: z.string(),
    organization: z.string().nonempty("Please enter your organization name"),
    requestBody: z.string()
});

interface RequestAccessFormProps {
    email: string,
    setCurrentForm: (newForm: LandingFormType) => void
}

export default function RequestAccessForm({email, setCurrentForm}: RequestAccessFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: email,
            organization: "",
            requestBody: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        //TODO call endpoint to request access
    }

    return <div className= "w-[80%] lg:w-[65%]">
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
                                <Input {...field} placeholder={email} disabled className="bg-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} placeholder="Organization Name" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="requestBody"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea {...field} placeholder="Please provide some information on how you intend to use the site." rows={4} className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between items-center pt-6 gap-[5vw]">
                    <Button type="button" className="button cancel" onClick={() => setCurrentForm(LandingFormType.EmailCheckForm)}>Back</Button>
                    <Button type="submit" className="button px-[2vw]">Submit</Button>
                </div>
            </form>
        </Form>
    </div>
}