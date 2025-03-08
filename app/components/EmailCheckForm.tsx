"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import backendService from "../services/backend.service";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LandingFormType } from "../types/LandingFormType";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface EmailCheckFormProps {
    onEmailVerified: (email: string) => void
    onRequestAccess: (email: string) => void
    setCurrentForm: (newForm: LandingFormType) => void
}

export default function EmailCheckForm({onEmailVerified, onRequestAccess, setCurrentForm}: EmailCheckFormProps) {
    const [submitClicked, setSubmitClicked] = useState(false);

    const formSchema = z.object({
        email: z.string().nonempty("Please enter your email address").regex(EMAIL_REGEX, {message: "Please enter a valid email address"})
    }).refine((data) => !submitClicked || true, { //TODO call endpoint to check if email is invited
        message: "Email does not have a pending invitation",
        path: ["email"]
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        if(submitClicked) {
            onEmailVerified(values.email);
        } else {
            onRequestAccess(values.email);
        }
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
                <div className="flex justify-between items-center pt-6 gap-[1vw]">
                    <Button type="button" className="button cancel" onClick={() => setCurrentForm(LandingFormType.LoginForm)}>Cancel</Button>

                    <div className="flex items-center gap-2">
                        <Button type="submit" variant="outline" className="px-[2vw] w-[120px]" onClick={() => setSubmitClicked(false)}>Request Access</Button>
                        <Button type="submit" className="button px-[2vw] flex-1" onClick={() => setSubmitClicked(true)}>Continue</Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
}