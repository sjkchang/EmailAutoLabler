import QuerySection from "./QuerySection";
import ConditionSection from "./ConditionSection";
import { ValidationError } from "./RuleBuilder";

const RuleForm = ({ rule, onUpdate, onSave, onCancel, validationError }) => {
    const handleQueryChange = (updatedQuery) =>
        onUpdate({
            ...rule,
            query: updatedQuery,
        });

    const handleConditionsChange = (updatedConditions) =>
        onUpdate({
            ...rule,
            condition: updatedConditions,
        });

    return (
        <div className="rule">
            {validationError?.source == "rule" && ( // Display validation error message
                <div className="error">{validationError.message}</div>
            )}
            <QuerySection
                query={rule.query}
                onQueryChange={handleQueryChange}
                validationError={validationError}
            />
            <ConditionSection
                conditions={rule.condition}
                onConditionsChange={handleConditionsChange}
                validationError={validationError}
            />
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onSave}>Save</button>
        </div>
    );
};

export default RuleForm;
