chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_AUTH_TOKEN") {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    success: false,
                    error: chrome.runtime.lastError.message,
                });
            } else {
                sendResponse({ success: true, token });
            }
        });
        // Indicate that the response is asynchronous
        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "REVOKE_AUTH_TOKEN") {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError || !token) {
                return sendResponse({
                    success: false,
                    error:
                        chrome.runtime.lastError?.message ||
                        "No token available",
                });
            }

            // Remove the token from Chrome
            chrome.identity.removeCachedAuthToken({ token }, () => {
                console.log("Cached token removed.");
            });

            // Revoke the token via Google API
            fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
                .then((response) => {
                    if (response.ok) {
                        sendResponse({ success: true });
                    } else {
                        return response.text().then((errorText) => {
                            sendResponse({
                                success: false,
                                error: `Failed to revoke token: ${errorText}`,
                            });
                        });
                    }
                })
                .catch((error) => {
                    sendResponse({
                        success: false,
                        error: `Error revoking token: ${error.message}`,
                    });
                });

            // Indicate that the response is asynchronous
            return true;
        });

        // Ensure the listener expects an asynchronous response
        return true;
    }
});
