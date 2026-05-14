import React, { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Navbar from "./components/Navbar";

export type PageView = "home" | "dashboard" | "analytics";

function App() {
    const [currentPage, setCurrentPage] = useState<PageView>("home");

    return (
        <div style={styles.appContainer}>
            <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main style={styles.mainContent}>
                {currentPage === "home" && <Home onNavigate={setCurrentPage} />}
                {currentPage === "dashboard" && <Dashboard />}
                {currentPage === "analytics" && <Analytics />}
            </main>
        </div>
    );
}

export default App;

const styles: Record<string, React.CSSProperties> = {
    appContainer: {
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
    },
    mainContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
};