"use client"

import { useState } from "react";
import { Users } from "../models/User";
import Search from "../components/Search";
import User from "../components/User";

export default function UsersPage() {
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

    const receiveUsers = (users: any) => {
        // received from Search component
        setUsers(users as Users);
    }

    return <div>
        <Search 
            apiRoute={"/users"} 
            receiveData={receiveUsers} 
            placeholderText="Search Users"
        />
        <div className="flex ml-10 mt-8">
            {users.data?.results.map(user => 
                <User
                    user={user}
                    key={user.id}
                    className="mr-20"
                />
            )}
        </div>
    </div>
}