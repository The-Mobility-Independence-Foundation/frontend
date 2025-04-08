"use client"

import { useCallback, useEffect, useState } from "react";
import { UserRole, Users } from "../../models/User";
import Search from "../../components/Search";
import User from "../../components/User";
import backendService from "../../services/backend.service";
import Modal from "@/app/components/modals/Modal";
import InviteUserModal from "@/app/components/modals/InviteUserModal";

export default function AccountUsers() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [inviteUserIsOpen, setInviteUserIsOpen] = useState(false);

    useEffect(() => {
        const fetchUserId = async () => {
            const response = await backendService.get("/users/@me");

            const userId = response.data?.id;
            setCurrentUserId(userId);
        };

        fetchUserId();
    }, []);

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
    
    const onInviteUserClose = (submit: boolean) => {
        setInviteUserIsOpen(false);
      if(submit) {
        window.location.reload();
      }
    }

    return <div>
        <Search 
            apiRoute={"/users"} 
            searchBy={"username"}
            newButtonEvent={() => setInviteUserIsOpen(true)}
            newButtonText="Invite User"
            receiveResponse={receiveUsers} 
            placeholderText="Search Users"
        />
        <div className="flex flex-wrap sm:mx-10 mt-8 gap-10 justify-center sm:justify-start">
            {users.data?.results.map(user => 
                (currentUserId != null && user.id != currentUserId && user.type != UserRole.GUEST &&
                    <User
                        user={user}
                        listings={getListingsNum(user.id)}
                        accountsPage={true}
                        key={user.id}
                        className="mb-8"
                    />
                ))}
        </div>

        <Modal
          isOpen={inviteUserIsOpen}
          onClose={() => setInviteUserIsOpen(false)}
        >
          <InviteUserModal
            onClose={onInviteUserClose}
          />
        </Modal>
    </div>
}