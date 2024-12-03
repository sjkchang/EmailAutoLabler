export const getAuthToken = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "GET_AUTH_TOKEN" }, (response) => {
            if (response && response.success) {
                resolve(response.token);
            } else {
                reject(response.error || "Failed to get auth token");
            }
        });
    });
};

export const revokeAuthToken = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: "REVOKE_AUTH_TOKEN" },
            (response) => {
                if (chrome.runtime.lastError) {
                    return reject(
                        `Runtime error: ${chrome.runtime.lastError.message}`
                    );
                }

                if (response?.success) {
                    resolve(response.success);
                } else {
                    reject(response?.error || "Failed to revoke token");
                }
            }
        );
    });
};
