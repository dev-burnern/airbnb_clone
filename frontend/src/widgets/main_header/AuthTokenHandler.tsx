"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    setIsLoggedIn: (value: boolean) => void;
}

export default function AuthTokenHandler({ setIsLoggedIn }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams?.get("token");
        if (token) {
            // Store token (optional, depending on your auth strategy)
            // localStorage.setItem("accessToken", token);

            setIsLoggedIn(true);
            // Remove token from URL
            router.replace("/");
        }
    }, [searchParams, router, setIsLoggedIn]);

    return null;
}
