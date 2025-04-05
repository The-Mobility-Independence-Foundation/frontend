"use client"

import { LandingFormType } from "../types/LandingFormType";
import LoginForm from "../components/LoginForm";
import RequestAccessForm from "../components/RequestAccessForm";
import SignUpForm from "../components/SignUpForm";
import { useState } from "react";
import RequestSubmitted from "../components/RequestSubmitted";
import Image from "next/image"

export default function LandingPage() {
    const [currentForm, setCurrentForm] = useState(LandingFormType.LoginForm);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    function onRequestAccess(firstName: string, lastName: string, email: string) {
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
        setCurrentForm(LandingFormType.RequestAccessForm);
    }

    function getCurrentForm() {
        switch(currentForm) {
            case LandingFormType.LoginForm:
                return <LoginForm setCurrentForm={setCurrentForm}></LoginForm>
            case LandingFormType.SignUpForm:
                return <SignUpForm setCurrentForm={setCurrentForm} onRequestAccess={onRequestAccess}></SignUpForm>
            case LandingFormType.RequestAccessForm:
                return <RequestAccessForm firstName={firstName} lastName={lastName} email={email} setCurrentForm={setCurrentForm}></RequestAccessForm>
            case LandingFormType.RequestSubmitted:
                return <RequestSubmitted></RequestSubmitted>
        }
    }

    return <div className="bg-[#D3E8FF] w-screen h-screen flex items-center justify-center">
        <div className="bg-[#002856] h-screen w-screen sm:h-fit sm:w-[550px] pb-10 sm:rounded-md shadow-md flex flex-col items-center text-center">
            <Image 
                src="/assets/Header Logo.png" 
                alt={`"The MIF Foundation" company logo`} 
                className="mt-5 mb-2"
                width="353"
                height="100"
                priority
            />
            <h5 className="text-white mb-4">DME Parts Exchange Portal</h5>
            {getCurrentForm()}
        </div>
    </div>
}