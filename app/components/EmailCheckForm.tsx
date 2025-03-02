"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import backendService from "../services/backend.service";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    email: z.string().nonempty("Please enter your email address").includes("@", {message: "Please enter a valid email address"})
}).refine((data) => true, { //TODO call endpoint to check if email is invited
    message: "Email does not have a pending invitation",
    path: ["email"]
});

interface EmailCheckFormProps {
    onEmailVerified: (email: string) => void
}

export default function EmailCheckForm({onEmailVerified}: EmailCheckFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        onEmailVerified(values.email);
    }

    return <div className= "w-[80%] lg:w-[65%]">
        <p className="text-white text-lg mb-6">The MIF DME Parts Exchange Portal is currently operating on an <b>invite only</b> basis. If you 
        have already received an invite, enter your email below and continue. Otherwise, you can request access to the site.</p>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-left">
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
                <div className="flex justify-between items-center pt-6 gap-[5vw]">
                    <Button type="button" className="button cancel">Cancel</Button>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" className="px-[2vw]">Request Access</Button>
                        <Button type="submit" className="button px-[2vw]">Continue</Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
}