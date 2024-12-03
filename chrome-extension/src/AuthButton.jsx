import React, { useEffect, useState } from "react";
import { getAuthToken, revokeAuthToken } from "./utils/auth-utils";

const AuthButton = () => {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await getAuthToken(false);
                setToken(token);
            } catch (error) {
                setError(error);
            }
        };

        checkAuthStatus();
    }, []);

    const handleAuth = async () => {
        try {
            const token = await getAuthToken();
            setToken(token);
        } catch (err) {
            setError(err);
        }
    };

    const handleRevokeToken = async () => {
        try {
            const result = await revokeAuthToken();
            setToken(null);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            {token ? (
                <button onClick={handleRevokeToken}>Sign Out</button>
            ) : (
                <button onClick={handleAuth}>Sign In</button>
            )}
        </div>
    );
};

export default AuthButton;
