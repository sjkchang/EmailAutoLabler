import React, { useState, useEffect } from "react";
import RuleForm from "./RuleForm";
import { getAuthToken } from "../utils/auth-utils";

export class ValidationError extends Error {
    constructor(message, source) {
        super(message);
        this.source = source;
    }
}

const RuleBuilder = () => {
    const [rule, setRule] = useState();
    const [validationError, setValidationError] = useState();

    const emptyRule = {
        id: `rule-${Date.now()}`,
        query: null,
        condition: [{ if: "yes", action: { label: "" } }],
    };

    const addNewRule = () => {
        setRule({ ...emptyRule });
    };

    const saveRule = async () => {
        try {
            const transcribedRule = transcribeRule(rule);
            await postRule(transcribedRule);

            setRule(undefined);
            setValidationError(undefined);
        } catch (error) {
            console.error(error);
            setValidationError(error);
        }
    };

    const postRule = async (transcribedRule) => {
        const authToken = await getAuthToken();

        try {
            const response = await fetch("http://localhost:3000/rule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    name: "Rule",
                    prompt: transcribedRule,
                }),
            });

            if (!response.ok) {
                // Handle HTTP errors
                const errorData = await response.json();
                console.error("Error creating rule:", errorData);
                return null;
            }

            const data = await response.json();
            console.log("Rule created successfully:", data);
            return data; // Return the created rule or response data
        } catch (error) {
            console.error("Failed to create rule:", error);
            return null;
        }
    };

    const cancelRule = () => {
        setRule(undefined);
        setValidationError(undefined);
    };

    // Returns a string representation of the rule
    // or an empty string if the rule is invalid
    const transcribeRule = (rule) => {
        if (!rule) {
            throw new Error({ message: "Rule is required", source: "rule" });
        }
        if (!rule.query) {
            throw new ValidationError(
                "Rule is must have a query and at least one condition",
                "query"
            );
        }
        if (!rule.condition || rule.condition.length === 0) {
            throw new ValidationError(
                "Rule must have at least one condition",
                "condition"
            );
        }
        if (rule.condition.some((condition) => !condition.action.label)) {
            throw new ValidationError(
                "All conditions must have an action",
                "action"
            );
        }

        const query = rule.query?.userInput
            ? `Is/Does this email ${rule.query.userInput}?`
            : "";
        const conditions = rule.condition
            .map(
                (condition) =>
                    `If ${condition.if}, add a/the label ${condition.action.label}.`
            )
            .join(", ");
        return `${query} ${conditions}`;
    };

    return (
        <div>
            <h2>Rule Builder</h2>
            {rule ? (
                <RuleForm
                    key={rule.id}
                    rule={rule}
                    onUpdate={(updatedRule) => setRule(updatedRule)}
                    onCancel={() => cancelRule()}
                    onSave={() => saveRule()}
                    validationError={validationError}
                />
            ) : (
                <button onClick={addNewRule}>Add New Rule</button>
            )}

            <pre>{JSON.stringify(validationError)}</pre>
        </div>
    );
};

export default RuleBuilder;
