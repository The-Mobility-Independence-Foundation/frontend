"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[\d\W]).*$/;

const formSchema = z.object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    addressLine1: z.string().min(1, "Please enter your address"),
    addressLine2: z.string(),
    city: z.string().min(1, "Please enter your city"),
    state: z.string().min(1, "Please enter your state"),
    zipCode: z.string().min(1, "Please enter your zip code"),
    username: z.string().min(1, "Please enter your username"),
    password: z.string().min(1, "Please enter your password").min(8, "Password must contain at least 8 characters")
        .regex(PASSWORD_REGEX, "Password must contain at least one letter and one number or special character"),
    passwordConfirmation: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
});