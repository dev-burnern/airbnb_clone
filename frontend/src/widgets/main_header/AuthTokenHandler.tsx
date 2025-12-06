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
            // 토큰을 localStorage에 저장
            localStorage.setItem("accessToken", token);

            setIsLoggedIn(true);
            // Remove token from URL
            router.replace("/");
        }
    }, [searchParams, router, setIsLoggedIn]);

    return null;
}
