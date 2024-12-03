import React, { useState, useEffect } from "react";
import RuleBuilder from "./RuleBuilder";
import { getAuthToken } from "../utils/auth-utils";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

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

            // Update the rules list
            const updatedRules = rules.filter((rule) => rule._id !== ruleId);
            setRules(updatedRules);

            return data; // Return the fetched rules or response data
        } catch (error) {
            console.error("Failed to delete rule:", error);
            return null;
        }
    };

    return (
        <div>
            <h2>My Rules</h2>
            {rules?.map((rule) => (
                <div key={rule._id}>
                    <p>
                        {rule.prompt}
                        <IconButton
                            color="error"
                            onClick={() => deleteRule(rule._id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </p>
                </div>
            ))}
            <RuleBuilder />
        </div>
    );
};

export default Rules;
