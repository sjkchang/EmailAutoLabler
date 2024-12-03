import { ValidationError } from "./RuleBuilder";

const ConditionSection = ({
    conditions,
    onConditionsChange,
    validationError,
}) => (
    <div className="condition-section">
        {validationError?.source == "action" && ( // Display validation error message
            <div className="error">{validationError.message}</div>
        )}
        {conditions.map((condition, i) => (
            <div key={i} className="condition">
                <label>
                    If{" "}
                    <select
                        value={condition.if}
                        onChange={(e) => {
                            const updatedConditions = [...conditions];
                            updatedConditions[i] = {
                                ...updatedConditions[i],
                                if: e.target.value,
                            };
                            onConditionsChange(updatedConditions);
                        }}
                        disabled={conditions.length === 2} // Disable when max conditions exist
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                    ,
                </label>
                <label>
                    add a/the label{" "}
                    <input
                        type="text"
                        value={condition.action?.label || ""}
                        onChange={(e) => {
                            const updatedConditions = [...conditions];
                            updatedConditions[i] = {
                                ...updatedConditions[i],
                                action: {
                                    ...updatedConditions[i].action,
                                    label: e.target.value,
                                },
                            };
                            onConditionsChange(updatedConditions);
                        }}
                        placeholder="e.g., Job Application"
                    />
                    .
                </label>
                <button
                    onClick={() =>
                        onConditionsChange(
                            conditions.filter((_, idx) => idx !== i)
                        )
                    }
                    disabled={conditions.length <= 1}
                >
                    Delete Condition
                </button>
            </div>
        ))}
        {conditions.length < 2 && ( // Allow only up to 2 conditions
            <button
                onClick={() => {
                    const newConditionType =
                        conditions[0].if === "yes" ? "no" : "yes";
                    onConditionsChange([
                        ...conditions,
                        {
                            if: newConditionType,
                            action: { label: "" },
                        },
                    ]);
                }}
            >
                Add Condition
            </button>
        )}
    </div>
);

export default ConditionSection;
