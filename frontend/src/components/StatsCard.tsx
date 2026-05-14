import React from "react";

interface StatsCardProps {
    label: string;
    value: string | number;
    color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, color = "#fff" }) => {
    return (
        <div style={styles.card}>
            <span style={styles.label}>{label}</span>
            <span style={{ ...styles.value, color }}>{value}</span>
        </div>
    );
};

export default StatsCard;

const styles: Record<string, React.CSSProperties> = {
    card: {
        backgroundColor: "rgba(24, 24, 27, 0.8)",
        border: "1px solid rgba(255,255,255,0.05)",
        padding: "20px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#a1a1aa",
        textTransform: "uppercase",
    },
    value: {
        fontSize: "32px",
        fontWeight: "800",
        letterSpacing: "-1px",
    },
};
