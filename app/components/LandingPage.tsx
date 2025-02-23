import SignUpForm from "./SignUpForm";

export default function LandingPage() {
    return <div className="bg-[#D3E8FF] w-screen h-screen flex items-center justify-center">
        <div className="bg-[#002856] w-[50%] h-[80%] rounded-md shadow-md flex flex-col items-center text-center">
            <img src="/assets/Header Logo.png" alt={`"The MIF Foundation" company logo`} className="w-[353px] h-[100px] mt-5"></img>
            <h3 className="text-white my-2">DME Parts Exchange Portal</h3>
            <SignUpForm email="example@gmail.com"></SignUpForm>
        </div>
    </div>
}