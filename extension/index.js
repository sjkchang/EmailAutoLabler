document.getElementById("signout").addEventListener("click", () => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
        if (token) {
            // Revoke the token
            fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
                .then((response) => {
                    if (response.ok) {
                        console.log("Token successfully revoked");
                    } else {
                        console.error(
                            "Failed to revoke token",
                            response.status
                        );
                    }
                })
                .catch((error) =>
                    console.error("Error revoking token:", error)
                );

            // Remove the token from Chrome
            chrome.identity.removeCachedAuthToken({ token }, () => {
                console.log("Cached token removed.");
            });
        }
    });
});

// Get OAuth token
async function getAccessToken() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
}

async function getRules() {
    let token = await getAccessToken();

    fetch(`http://localhost:3000/rule`, {
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
}

async function getLabels() {
    let token = await getAccessToken();

    fetch(`http://localhost:3000/email/labels`, {
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
}

async function triggerCategorization() {
    let token = await getAccessToken();

    fetch(`http://localhost:3000/email/label`, {
        method: "POST",
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
}

async function createRule() {
    let token = getAccessToken();

    fetch(`http://localhost:3000/rules`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: "Job Application",
            prompt: "Is related to Job Applications",
            associated_labels: ["Job Application"],
        }),
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
}

// Add event listener to get the token
document.getElementById("get-token").addEventListener("click", async () => {
    try {
        const token = await getAccessToken();
        console.log("Token:", token);
    } catch (error) {
        console.error("Error getting token:", error);
    }
});

document.getElementById("get-rules").addEventListener("click", async () => {
    try {
        await getRules();
    } catch (error) {
        console.error("Error getting rules:", error);
    }
});

document.getElementById("get-labels").addEventListener("click", async () => {
    try {
        await getLabels();
    } catch (error) {
        console.error("Error getting labels:", error);
    }
});

document
    .getElementById("trigger-categorization")
    .addEventListener("click", async () => {
        try {
            await triggerCategorization();
        } catch (error) {
            console.error("Error getting labels:", error);
        }
    });
