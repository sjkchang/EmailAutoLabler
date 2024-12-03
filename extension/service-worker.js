chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError) {
        } else {
            chrome.storage.local.set({ authToken: token }, function () {
                // Make a PUT request to the server to store the token at the route /user/:token
                // The server should store the token in the user's document
                // The server should return the user's document.
                fetch(`http://localhost:3000/user/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((data) => {
                        console.log("Success:", data);
                        return data.json();
                    })
                    .then((json) => {
                        console.log("Success:", json);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });

                console.log("Token stored in chrome.storage.local");
            });
        }
    });
});
