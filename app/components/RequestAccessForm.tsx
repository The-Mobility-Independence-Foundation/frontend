"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import backendService from "../services/backend.service";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "sonner"
import { LandingFormType } from "../types/LandingFormType";
import { isValidPhoneNumber } from "react-phone-number-input";

const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    ein: z.string().nonempty("Please enter your EIN"),
    phoneNumber: z.string().nonempty("Please enter your phone number").refine(isValidPhoneNumber, { message: "Please enter a valid phone number" }),
    requestBody: z.string().nonempty("Please enter a request description")
});

interface RequestAccessFormProps {
    firstName: string,
    lastName: string,
    email: string,
    setCurrentForm: (newForm: LandingFormType) => void
}

export default function RequestAccessForm({firstName, lastName, email, setCurrentForm}: RequestAccessFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            ein: "",
            phoneNumber: "",
            requestBody: ""
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        backendService.post("/requests", {
            "ein": values.ein,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "email": values.email,
            "description": values.requestBody,
            "phone": values.phoneNumber
        }).then(() => {
            setCurrentForm(LandingFormType.RequestSubmitted);
        }).catch(() => {
            toast.error("There was an issue processing your request. Please try again.");
        })
    }

    return <div className= "w-[80%]">
        <p className="text-white text-md mb-6">The MIF DME Parts Exchange Portal is currently operating on an <b>invite only</b> basis.
            You can request access to the site using the form below.</p>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-left">
            <div className="flex w-full gap-8">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input {...field} placeholder={firstName} disabled className="bg-white" />
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
                                    <Input {...field} placeholder={lastName} disabled className="bg-white" />
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
                    name="ein"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} placeholder="Employer Identification Number" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PhoneInput {...field} placeholder="Phone Number" className="bg-white rounded-md" defaultCountry="US" />
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
                    <Button type="button" className="button cancel" onClick={() => setCurrentForm(LandingFormType.SignUpForm)}>Back</Button>
                    <Button type="submit" className="button px-[2vw]">Submit</Button>
                </div>
            </form>
        </Form>
    </div>
}