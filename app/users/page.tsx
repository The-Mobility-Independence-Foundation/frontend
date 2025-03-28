"use client"

import { useCallback, useState } from "react";
import { UserData, Users } from "../models/User";
import Search from "../components/Search";
import User from "../components/User";
import { ConnectionData } from "../models/Connection";
// import backendService from "../services/backend.service";

const getConnectionsMap = () => {
    const connections: ConnectionData[] = [];

    //TODO Uncomment when backend is hooked up
    // backendService.get("/connections").then(response => {
    //     connections = (response as Connections).data?.connections;
    // }).catch(error => {
    //     console.log("Error getting connections");
    // });

    return new Map(connections.map(connection => [connection.user, connection]));
}

export default function UsersPage() {
    const [connectionsMap, setConnectionsMap] = useState<Map<UserData, ConnectionData>>(getConnectionsMap);

    const onConnectButtonClicked = (userId: string) => {
        //TODO Uncomment when backend is hooked up
        //backendService.put("/connections", {userId: userId});
        if(userId) {
            setConnectionsMap(getConnectionsMap());
        }
    }
    
    const onConnectedButtonClicked = (user: UserData) => {
        //TODO Uncomment when backend is hooked up
        //backendService.delete("/connections/" + connectionsMap.get(user)?.id);

        if(user) {
            setConnectionsMap(getConnectionsMap());
        }
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
            receiveResponse={receiveUsers} 
            placeholderText="Search Users"
        />
        <div className="flex flex-wrap sm:mx-10 mt-8 gap-10 justify-center sm:justify-start">
            {users.data?.results.map(user => 
                <User
                    user={user}
                    onConnectButtonClicked={onConnectButtonClicked}
                    onConnectedButtonClicked={onConnectedButtonClicked}
                    connected={connectionsMap.has(user)}
                    key={user.id}
                    className="mb-8"
                />
            )}
        </div>
    </div>
}