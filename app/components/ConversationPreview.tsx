export interface ConversationPreviewProps {
    userName?: string;
    listing?: string;
    message?: string;
    lastConversation: boolean;
    time: string;
    important: boolean;
    onClick: () => void;
}

export default function ConversationPreview({userName, listing, message, lastConversation, time, important, onClick}: ConversationPreviewProps) {
    return (
        <div className="bg-[#D3E8FF80] relative" onClick={onClick}>
            <div className="flex items-center px-4 py-1">
                {important && <p className="text-sm text-red-600 mr-2">!</p>}

                <div className="px-4">
                    <h5 className="text-xl">{userName ? userName : listing}</h5>
                    {listing && <p className="text-xs italic">{listing}</p>}
                    {message && <p className="text-xs mt-1">{message}</p>}
                </div>

                <p className="text-xs absolute top-2 right-2 text-gray-600">{time}</p>

                <hr className={(!lastConversation ? "w-[90%] " : "") + "mx-auto border-t-2 mt-1"}></hr>
            </div>
        </div>
    )
}