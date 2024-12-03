import { ValidationError } from "./RuleBuilder";

const QuerySection = ({ query, onQueryChange, validationError }) => (
    <label>
        {validationError?.source == "query" && ( // Display validation error message
            <div className="error">{validationError.message}</div>
        )}
        Is/Does this email{" "}
        <input
            type="text"
            value={query?.userInput || ""}
            onChange={(e) =>
                onQueryChange({
                    ...query,
                    userInput: e.target.value,
                })
            }
            placeholder="e.g., relate to job applications"
        />
        ?
    </label>
);

export default QuerySection;
