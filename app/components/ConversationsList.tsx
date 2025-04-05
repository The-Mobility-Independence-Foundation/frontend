import { useState } from "react";
import { ConversationData, Conversations } from "../models/Conversation";
import Search from "./Search";
import ConversationPreview from "./ConversationPreview";
import backendService from "../services/backend.service";
import { MessageData, Messages } from "../models/Message";

export interface ConversationsListProps {
    userId: string;
    className: string;
    selectConversation: (conversation: ConversationData) => void;
}

export default function ConversationsList({userId, className, selectConversation}: ConversationsListProps) {
    const [conversations, setConversations] = useState<Conversations>({
        message: "Default",
        data: {
            count: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });
    const [conversationMessagesMap, setConversationMessagesMap] = useState<Map<ConversationData, MessageData[]>>(new Map())

    const receiveConversations = async (conversations: any) => {
        // received from Search component
        setConversations(conversations as Conversations);

        const conversationMessages: [ConversationData, MessageData[]][] = await Promise.all(
            (conversations as Conversations).data.results.map(async (conversation) => {
                let response = await backendService.get(`/conversations/${conversation.id}/messages`);
                return [conversation, (response as Messages).data.results];
            })
        );
        setConversationMessagesMap(new Map(conversationMessages));
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
                apiRoute={`/users/${userId}/conversations`}
                receiveResponse={receiveConversations}
                placeholderText="Search Conversations" 
                searchBy={"id"}
            />

            {conversations.data?.results.map((conversation, index, conversations) => {
                let messages = conversationMessagesMap.get(conversation);

                return <ConversationPreview 
                    key={conversation.id}
                    displayName={getDisplayName(conversation.initiatorId != userId ? conversation.initiatorId : conversation.participantId)}
                    listing={getListingName(conversation.listingId)}
                    message={messages && messages.length != 0 ? conversation.messages[conversation.messages.length - 1].messageContent : undefined}
                    lastConversation={index == conversations.length - 1}
                    time={messages && messages.length != 0 ? new Date(conversation.messages[conversation.messages.length - 1].createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }) : new Date(conversation.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })}
                    important={index == 0}
                    onClick={() => selectConversation(conversation)}
                />
            })}
        </div>
    )
}