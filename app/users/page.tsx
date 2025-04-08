"use client"

import { useCallback, useEffect, useState } from "react";
import { UserData, UserRole, Users } from "../models/User";
import Search from "../components/Search";
import User from "../components/User";
import { Connections } from "../models/Connection";
import backendService from "../services/backend.service";
import { userEmitterBus } from "../layout";
import { toastErrors } from "../models/Generic";

export default function UsersPage() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [connections, setConnections] = useState<string[] | null>(null);

    useEffect(() => {
        userEmitterBus.on("user", (userEmitted: UserData) => {
        setCurrentUserId(userEmitted.id);
        })
    });

    useEffect(() => {
        const fetchConnections = async () => {
            if (currentUserId) {
                const response = await backendService.get(`/users/${currentUserId}/connections`);

                setConnections((response as Connections).data.results.map(connection => connection.followingId != currentUserId ? 
                    connection.followingId : connection.followerId));
            }
        }

        fetchConnections();
    }, [currentUserId]);

    const onConnectButtonClicked = async (userId: string) => {
        backendService.post(`/users/${currentUserId}/connections/${userId}`, {}).then(response => {
            if(!response.success) {
                toastErrors(response);
                return;
            }

            const currentConnections = connections;
            if(currentConnections) {
                setConnections([...currentConnections, userId]);
            }
        })
    }
    
    const onConnectedButtonClicked = async (userId: string) => {
        backendService.delete(`/users/${currentUserId}/connections/${userId}`).then(response => {
            if(!response.success) {
                toastErrors(response);
                return;
            }

            const currentConnections = connections;
            if(currentConnections) {
                setConnections([...currentConnections.slice(0, currentConnections.indexOf(userId)), 
                ...currentConnections.slice(currentConnections.indexOf(userId) + 1)]);
            }
        })
    }

    function getListingsNum(userId: string) {
        return userId; //TODO get listings num from endpoint
    }

    function getConnectionsNum(userId: string) {
        return userId; //TODO get connections num from endpoint
    }
    
    const [users, setUsers] = useState<Users>({
        message: "Default",
        data: {
            count: 0,
            totalCount: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });

    const receiveUsers = useCallback((users: object) => {
        // received from Search component
        setUsers(users as Users);
    }, []);

    return <div>
        <Search 
            apiRoute={"/users"} 
            searchBy={"name"}
            receiveResponse={receiveUsers} 
            placeholderText="Search Users"
        />
        <div className="flex flex-wrap sm:mx-10 mt-8 gap-10 justify-center sm:justify-start">
            {users.data?.results.map(user => 
                (currentUserId != null && connections != null && user.id != currentUserId && user.type != UserRole.GUEST &&
                    <User
                        user={user}
                        listings={getListingsNum(user.id)}
                        connections={getConnectionsNum(user.id)}
                        onConnectButtonClicked={onConnectButtonClicked}
                        onConnectedButtonClicked={onConnectedButtonClicked}
                        connected={connections.includes(user.id)}
                        key={user.id}
                        className="mb-8"
                    />
                ))}
        </div>
    </div>
}