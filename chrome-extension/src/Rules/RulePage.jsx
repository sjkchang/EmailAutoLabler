import React, { useState, useEffect } from "react";
import RuleBuilder from "./RuleBuilder";
import { getAuthToken } from "../utils/auth-utils";

const Rules = () => {
    const [rules, setRules] = useState([]);

    useEffect(() => {
        getRules().then((rules) => setRules(rules));

        // Cleanup
        return () => {
            setRules([]);
        };
    }, []);

    const getRules = async () => {
        const authToken = await getAuthToken();

        try {
            const response = await fetch("http://localhost:3000/rule", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                // Handle HTTP errors
                const errorData = await response.json();
                console.error("Error fetching rules:", errorData);
                return null;
            }

            const data = await response.json();
            console.log("Rules fetched successfully:", data);
            return data; // Return the fetched rules or response data
        } catch (error) {
            console.error("Failed to fetch rules:", error);
            return null;
        }
    };

    const deleteRule = async (ruleId) => {
        const authToken = await getAuthToken();

        try {
            const response = await fetch(
                `http://localhost:3000/rule/${ruleId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!response.ok) {
                // Handle HTTP errors
                const errorData = await response.json();
                console.error("Error deleting rule:", errorData);
                return null;
            }

            const data = await response.json();
            console.log("Rule deleted successfully:", data);
            return data; // Return the fetched rules or response data
        } catch (error) {
            console.error("Failed to delete rule:", error);
            return null;
        }
    };

    return (
        <div>
            {rules?.map((rule) => (
                <div key={rule._id}>
                    <pre>{rule.prompt}</pre>
                    <button onClick={() => deleteRule(rule._id)}>Delete</button>
                </div>
            ))}
            <RuleBuilder />
        </div>
    );
};

export default Rules;
