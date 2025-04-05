import { ConversationData } from "../models/Conversation";

export interface ConversationPreviewProps {
    displayName: string;
    listing: string;
    message: string;
    lastConversation: boolean;
    time: string;
    important: boolean;
    onClick: () => void;
}

export default function ConversationPreview({displayName, listing, message, lastConversation, time, important, onClick}: ConversationPreviewProps) {
    return (
        <div className="bg-[#D3E8FF80] relative" onClick={onClick}>
            <div className="px-4 pt-1">
                <h5 className="text-xl">{displayName}</h5>
                <p className="text-xs italic">{listing}</p>
                <p className="text-xs mt-1">{message}</p>
            </div>

            <p className="text-xs absolute top-2 right-2 text-gray-600">{time}</p>

            {important && <p className="text-sm absolute top-6 left-1 text-red-600">!</p>}

            <hr className={(!lastConversation ? "w-[90%] " : "") + "mx-auto border-t-2 mt-1"}></hr>
        </div>
    )
}