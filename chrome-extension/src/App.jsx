import AuthButton from "./AuthButton";
import Rules from "./Rules/RulePage";
import Categorize from "./Categorize";
import { ThemeProvider, CssBaseline, Stack } from "@mui/material";
import { appTheme } from "./themes/theme";

function App() {
    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline enableColorScheme />
            <>
                <Stack
                    spacing={2}
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <Categorize />
                        <AuthButton />
                    </Stack>

                    <Rules />
                </Stack>
            </>
        </ThemeProvider>
    );
}

export default App;
