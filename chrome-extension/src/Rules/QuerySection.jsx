import TextField from "@mui/material/TextField";

const QuerySection = ({ query, onQueryChange, validationError }) => (
    <div className="condition">
        <label>
            Is/Does this email{" "}
            <TextField
                error={validationError?.source === "query"}
                helperText={
                    validationError?.source == "query"
                        ? validationError?.message
                        : ""
                }
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
    </div>
);

export default QuerySection;
