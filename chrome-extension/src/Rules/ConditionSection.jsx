import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const ConditionForm = ({
    condition,
    conditionIdx,
    onConditionChange,
    onActionChange,
    selectDisabled,
    validationError,
    renderConditionButtons,
}) => {
    return (
        <div key={conditionIdx} className="condition">
            <label>
                If{" "}
                <Select
                    value={condition.if}
                    onChange={(e) => {
                        onConditionChange(conditionIdx, e.target.value);
                    }}
                    disabled={selectDisabled} // Disable when max conditions exist
                >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                , then add a/the label{" "}
                <TextField
                    error={
                        validationError?.source === "action" &&
                        validationError?.index === conditionIdx
                    }
                    helperText={
                        validationError?.source == "action" &&
                        validationError?.index === conditionIdx
                            ? validationError?.message
                            : ""
                    }
                    type="text"
                    value={condition.action?.label || ""}
                    onChange={(e) => {
                        onActionChange(conditionIdx, e.target.value);
                    }}
                    placeholder="e.g., Job Application"
                />
                . {renderConditionButtons}
            </label>
        </div>
    );
};

const ConditionSection = ({
    conditions,
    onConditionsChange,
    validationError,
}) => {
    const setConditionValue = (index, value) => {
        const updatedConditions = [...conditions];
        updatedConditions[index] = {
            ...updatedConditions[index],
            if: value,
        };
        onConditionsChange(updatedConditions);
    };

    const setActionValue = (index, value) => {
        const updatedConditions = [...conditions];
        updatedConditions[index] = {
            ...updatedConditions[index],
            action: {
                ...updatedConditions[index].action,
                label: value,
            },
        };
        onConditionsChange(updatedConditions);
    };

    const renderConditionButtons = (i) => {
        if (conditions.length == 1) {
            return (
                <IconButton
                    size="small"
                    aria-label="Add condition"
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
                    <AddIcon />
                </IconButton>
            );
        } else if (conditions.length == 2) {
            return (
                <IconButton
                    size="small"
                    aria-label="Delete condition"
                    onClick={() =>
                        onConditionsChange(
                            conditions.filter((_, idx) => idx !== i)
                        )
                    }
                >
                    <RemoveIcon />
                </IconButton>
            );
        }
    };

    return (
        <div className="condition-section">
            {conditions.map((condition, i) => (
                <div>
                    <ConditionForm
                        condition={condition}
                        conditionIdx={i}
                        onConditionChange={setConditionValue}
                        onActionChange={setActionValue}
                        selectDisabled={conditions.length === 2}
                        validationError={validationError}
                        renderConditionButtons={renderConditionButtons(i)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ConditionSection;
