"use client"

import { useCallback, useEffect, useState } from "react";
import { UserData, UserRole, Users } from "../../models/User";
import Search from "../../components/Search";
import User from "../../components/User";
import { Connections } from "../../models/Connection";
import backendService from "../../services/backend.service";
import Modal from "@/app/components/modals/Modal";
import CreateConnectionModal from "@/app/components/modals/CreateConnectionModal";
import { userEmitterBus } from "@/app/layout";

export default function AccountConnections() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [connections, setConnections] = useState<string[] | null>(null);
    const [createConnectionIsOpen, setCreateConnectionIsOpen] = useState(false);

    useEffect(() => {
      userEmitterBus.on("user", (userEmitted: UserData) => {
        setCurrentUserId(userEmitted.id);
      })
    });

    useEffect(() => {
        const fetchConnections = async () => {
            if (currentUserId) {
              const response = await backendService.get("/users/" + currentUserId + "/connections");
    
              setConnections((response as Connections).data.results.map(connection => connection.followingId != currentUserId ? 
                connection.followingId : connection.followerId));
            }
        }

        fetchConnections();
    }, [currentUserId]);

    const getConnections = async () => {
        const response = await backendService.get("/users/" + currentUserId + "/connections");
    
        return (response as Connections).data.results.map(connection => connection.followingId != currentUserId ? 
          connection.followingId : connection.followerId);
    }

    function getListingsNum(userId: string) {
        return userId; //TODO
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
    
    const onCreateConnectionClose = (submit: boolean) => {
      setCreateConnectionIsOpen(false);
      if(submit) {
        getConnections();
        window.location.reload();
      }
    }

    return <div>
        <Search 
            apiRoute={"/users"} 
            searchBy={"username"}
            newButtonEvent={() => setCreateConnectionIsOpen(true)}
            newButtonText="Create Connection"
            receiveResponse={receiveUsers} 
            placeholderText="Search Connections"
        />
        <div className="flex flex-wrap sm:mx-10 mt-8 gap-10 justify-center sm:justify-start">
            {users.data?.results.map(user => 
                (currentUserId != null && connections != null && user.id != currentUserId && connections.includes(user.id) && user.type != UserRole.GUEST &&
                    <User
                        user={user}
                        listings={getListingsNum(user.id)}
                        accountsPage={true}
                        key={user.id}
                        className="mb-8"
                    />
                ))}
        </div>

        {currentUserId && <Modal
          isOpen={createConnectionIsOpen}
          onClose={() => setCreateConnectionIsOpen(false)}
        >
          <CreateConnectionModal
            onClose={onCreateConnectionClose}
            currentUserId={currentUserId}
          />
        </Modal>}
    </div>
}