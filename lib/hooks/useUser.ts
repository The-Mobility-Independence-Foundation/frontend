"use client"

import backendService from "@/app/services/backend.service";
import { usePathname, useRouter } from "next/navigation";
import {useEffect} from "react";
import useSWR from "swr";

const fetcher = (url: string) => {
    let token = localStorage.getItem("token");

    return fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token != null ? token : ""}`,
            "accept": "application/json",
            "Content-Type": "application/json"
        },
    }).then((res) => res.json());
};

export const useUser = () => {
    const router = useRouter();
    const pathName = usePathname();

    const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/users/@me`, fetcher);
 
    useEffect(() => {
        if (error && pathName !== "/landing") {
            router.push('/landing');
        } else if (data) {
            if (!data.success && pathName !== "/landing") {
                router.push("/landing");
            } else if (data.success && pathName === "/landing") {
                router.push("/listings");
            }
        }
    }, [error, data, pathName]);

    return {data: data, mutate, isLoading: !error && !data, isError: error};
};