import { LandingFormType } from "../types/LandingFormType";
import EmailCheckForm from "./EmailCheckForm";
import SignUpForm from "./SignUpForm";
import { useState } from "react";

export default function LandingPage() {
    const [currentForm, setCurrentForm] = useState(LandingFormType.EmailCheckForm);
    const [email, setEmail] = useState("");
    
    function onEmailVerified(email: string) {
        setEmail(email);
        setCurrentForm(LandingFormType.SignUpForm);
    }

    function getCurrentForm() {
        switch(currentForm) {
            case LandingFormType.EmailCheckForm:
                return <EmailCheckForm onEmailVerified={onEmailVerified}></EmailCheckForm>
            case LandingFormType.SignUpForm:
                return <SignUpForm email={email}></SignUpForm>
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