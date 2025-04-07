"use client"

import { useCallback, useEffect, useState } from "react";
import { UserData, UserRole, Users } from "../../models/User";
import Search from "../../components/Search";
import User from "../../components/User";
import { ConnectionData, Connections } from "../../models/Connection";
import backendService from "../../services/backend.service";
import { toast } from "sonner";
import Modal from "@/app/components/modals/Modal";
import CreateConnectionModal from "@/app/components/modals/CreateConnectionModal";

export default function AccountConnections() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [connections, setConnections] = useState<string[] | null>(null);
    const [createConnectionIsOpen, setCreateConnectionIsOpen] = useState(false);

    useEffect(() => {
        const fetchUserId = async () => {
            const response = await backendService.get("/users/@me");

            const userId = response.data?.id;
            setCurrentUserId(userId);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchConnections = async () => {
            if (currentUserId) {
                setConnections(await getConnections());
            }
        }

        fetchConnections();
    }, [currentUserId]);

    const getConnections = async () => {
        let response = await backendService.get("/users/" + currentUserId + "/connections");
    
        return (response as Connections).data.results.map(connection => connection.followingId != currentUserId ? 
          connection.followingId : connection.followerId);
    }

    function getListingsNum(userId: string) {
        return 0; //TODO
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

    const onOpenChange = (open: boolean) => {
      if(open) {
        setCreateConnectionIsOpen(false);
      }
    };
    
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
            searchBy={"name"}
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
                        connectionsPage={true}
                        key={user.id}
                        className="mb-8"
                    />
                ))}
        </div>

        <Modal
          isOpen={createConnectionIsOpen}
          onClose={() => setCreateConnectionIsOpen(false)}
        >
          <CreateConnectionModal
            onClose={onCreateConnectionClose}
            currentUserId={"1"}
          />
        </Modal>
    </div>
}