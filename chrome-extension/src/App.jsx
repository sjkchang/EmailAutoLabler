import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AuthButton from "./AuthButton";
import Rules from "./Rules/RulePage";
import Categorize from "./Categorize";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <AuthButton />
                <Categorize />
                <Rules />
            </div>
        </>
    );
}

export default App;
