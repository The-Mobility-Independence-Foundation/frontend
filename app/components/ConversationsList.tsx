import { useState } from "react";
import { ConversationData, Conversations } from "../models/Conversation";
import Search from "./Search";
import ConversationPreview from "./ConversationPreview";
import backendService from "../services/backend.service";
import { MessageData, Messages } from "../models/Message";
import { User } from "../models/User";
import { SingleListing } from "../models/Listings";

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

    const getName = async (userId: string) => {
        let response = await backendService.get("/users/" + userId);
        return (response as User).data.firstName + " " + (response as User).data.lastName;
    }

    const getListingName = async (listingId: string) => {
        let response = await backendService.get("/listing/" + listingId);
        return (response as SingleListing).data.title;
    }

    return (
        <div className={"bg-[#F4F4F5] " + className}>
            <Search 
                apiRoute={`/users/${userId}/conversations`}
                receiveResponse={receiveConversations}
                placeholderText="Search Conversations" 
                searchBy={"id"}
            />

            {conversations.data?.results.map(async (conversation, index, conversations) => {
                let messages = conversationMessagesMap.get(conversation);

                return <ConversationPreview 
                    key={conversation.id}
                    userName={await getName(conversation.initiatorId != userId ? conversation.initiatorId : conversation.participantId)}
                    listing={conversation.listingId != null ? await getListingName(conversation.listingId) : undefined}
                    message={messages != null && messages.length != 0 ? messages[messages.length - 1].content : undefined}
                    lastConversation={index == conversations.length - 1}
                    time={messages && messages.length != 0 ? new Date(messages[messages.length - 1].createdAt).toLocaleTimeString([], {
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