import React from "react";
import { PageView } from "../App";

interface NavbarProps {
    currentPage: PageView;
    onNavigate: (page: PageView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
    return (
        <nav style={styles.nav}>
            <div style={styles.logoContainer} onClick={() => onNavigate("home")}>
                <span style={styles.logoIcon}>🌿</span>
                <h1 style={styles.logoText}>Crop Health AI</h1>
            </div>

            <div style={styles.links}>
                <button
                    onClick={() => onNavigate("home")}
                    style={currentPage === "home" ? { ...styles.btn, ...styles.activeBtn } : styles.btn}
                >
                    Overview
                </button>
                <button
                    onClick={() => onNavigate("dashboard")}
                    style={currentPage === "dashboard" ? { ...styles.btn, ...styles.activeBtn } : styles.btn}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => onNavigate("analytics")}
                    style={currentPage === "analytics" ? { ...styles.btn, ...styles.activeBtn } : styles.btn}
                >
                    Analytics
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

const styles: Record<string, React.CSSProperties> = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        backgroundColor: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 50,
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        gap: "12px",
    },
    logoIcon: {
        fontSize: "24px",
    },
    logoText: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
        letterSpacing: "-0.5px",
        color: "#fff",
    },
    links: {
        display: "flex",
        gap: "16px",
    },
    btn: {
        background: "transparent",
        border: "none",
        color: "#a1a1aa",
        fontSize: "15px",
        fontWeight: "500",
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
    },
    activeBtn: {
        color: "#fff",
        backgroundColor: "rgba(255,255,255,0.1)",
    },
};
