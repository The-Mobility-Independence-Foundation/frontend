import { useState } from "react";
import { Conversations } from "../models/Conversation";
import Search from "./Search";
import ConversationPreview from "./ConversationPreview";

export interface ConversationsListProps {
    userId: string;
    className: string;
}

export default function ConversationsList({userId, className}: ConversationsListProps) {
    const [conversations, setConversations] = useState<Conversations>({
        message: "Default",
        data: {
            count: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });

    const receiveConversations = (conversations: any) => {
        // received from Search component
        setConversations(conversations as Conversations);
    }

    const getDisplayName = (userId: string) => {
        //TODO api call

        return "User " + userId;
    }

    const getListingName = (listingId: string) => {
        //TODO api call

        return "Listing Title";
    }

    return (
        <div className={"bg-[#F4F4F5] " + className}>
            <Search 
                apiRoute={"/messages"} 
                receiveData={receiveConversations} 
                placeholderText="Search Conversations"
            />

            {conversations.data?.results.map((conversation, index, conversations) => (
                <ConversationPreview 
                    key={conversation.id}
                    displayName={getDisplayName(conversation.initiatorId != userId ? conversation.initiatorId : conversation.participantId)}
                    listing={getListingName(conversation.listingId)}
                    message={conversation.messages[conversation.messages.length - 1].messageContent}
                    lastConversation={index == conversations.length - 1}
                    time={conversation.messages[conversation.messages.length - 1].createdAt.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })}
                    important={index == 0}
                />
            ))}
        </div>
    )
}