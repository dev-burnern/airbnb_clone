'use client';

import { FaGithub } from 'react-icons/fa';

export default function SocialLogin() {
    const handleGithubLogin = () => {
        // Redirect to backend GitHub auth endpoint
        window.location.href = 'http://localhost:8080/auth/github';
    };

    return (
        <div className="grid grid-cols-1 gap-3">
            <button
                type="button"
                onClick={handleGithubLogin}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
            >
                <span className="sr-only">Sign in with GitHub</span>
                <FaGithub className="h-5 w-5" />
                <span className="ml-2">GitHub</span>
            </button>
        </div>
    );
}
