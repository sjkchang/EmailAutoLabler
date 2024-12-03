import React, { useState } from "react";
import { getAuthToken, revokeAuthToken } from "./utils/auth-utils";

const AuthButton = () => {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    const handleAuth = async () => {
        try {
            const token = await getAuthToken();
            setToken(token);
            console.log("Token retrieved:", token);
        } catch (err) {
            setError(err);
            console.error("Error retrieving token:", err);
        }
    };

    const handleRevokeToken = async () => {
        try {
            const result = await revokeAuthToken();
            console.log("Token revoked successfully:", result);
            setToken(null);
        } catch (error) {
            console.error("Error revoking token:", error);
        }
    };

    return (
        <div>
            {token ? (
                <button onClick={handleRevokeToken}>
                    Revoke Authentication
                </button>
            ) : (
                <button onClick={handleAuth}>Authenticate</button>
            )}

            {token && <p>Token: {token}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default AuthButton;
