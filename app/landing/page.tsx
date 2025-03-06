"use client"

import { LandingFormType } from "../types/LandingFormType";
import EmailCheckForm from "../components/EmailCheckForm";
import LoginForm from "../components/LoginForm";
import RequestAccessForm from "../components/RequestAccessForm";
import SignUpForm from "../components/SignUpForm";
import { useState } from "react";

export default function LandingPage() {
    const [currentForm, setCurrentForm] = useState(LandingFormType.LoginForm);
    const [email, setEmail] = useState("");
    
    function onEmailVerified(email: string) {
        setEmail(email);
        setCurrentForm(LandingFormType.SignUpForm);
    }

    function onRequestAccess(email: string) {
        setEmail(email);
        setCurrentForm(LandingFormType.RequestAccessForm);
    }

    function getCurrentForm() {
        switch(currentForm) {
            case LandingFormType.LoginForm:
                return <LoginForm setCurrentForm={setCurrentForm}></LoginForm>
            case LandingFormType.EmailCheckForm:
                return <EmailCheckForm onEmailVerified={onEmailVerified} onRequestAccess={onRequestAccess} setCurrentForm={setCurrentForm}></EmailCheckForm>
            case LandingFormType.SignUpForm:
                return <SignUpForm email={email} setCurrentForm={setCurrentForm}></SignUpForm>
            case LandingFormType.RequestAccessForm:
                return <RequestAccessForm email={email} setCurrentForm={setCurrentForm}></RequestAccessForm>
        }
    }

    return <div className="bg-[#D3E8FF] w-screen h-screen flex items-center justify-center">
        <div className="bg-[#002856] h-screen w-screen lg:min-h-[45%] lg:h-auto lg:max-w-[40%] pb-10 lg:rounded-md shadow-md flex flex-col items-center text-center">
            <img src="/assets/Header Logo.png" alt={`"The MIF Foundation" company logo`} className="w-[353px] h-[100px] mt-5 mb-2"></img>
            <h5 className="text-white mb-4">DME Parts Exchange Portal</h5>
            {getCurrentForm()}
        </div>
    </div>
}