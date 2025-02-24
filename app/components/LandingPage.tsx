import SignUpForm from "./SignUpForm";

export default function LandingPage() {
    return <div className="bg-[#D3E8FF] w-screen h-screen flex items-center justify-center">
        <div className="bg-[#002856] h-screen w-screen lg:h-auto lg:max-w-[40%] pb-10 lg:rounded-md shadow-md flex flex-col items-center text-center">
            <img src="/assets/Header Logo.png" alt={`"The MIF Foundation" company logo`} className="w-[353px] h-[100px] mt-5 mb-2"></img>
            <h5 className="text-white mb-4">DME Parts Exchange Portal</h5>
            <SignUpForm email="example@gmail.com"></SignUpForm>
        </div>
    </div>
}