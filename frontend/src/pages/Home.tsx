import React from "react";
import { PageView } from "../App";

interface HomeProps {
    onNavigate: (page: PageView) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    return (
        <div style={styles.container}>
            <div style={styles.heroSection}>
                <div style={styles.badge}>Production Ready AI</div>
                <h1 style={styles.title}>
                    Empower Your Field with <br />
                    <span style={styles.highlight}>Real-Time Diagnostics.</span>
                </h1>
                <p style={styles.subtitle}>
                    Detect over 15+ crop diseases instantly using state-of-the-art computer vision models. Get actionable fertility and treatment insights directly from your camera.
                </p>
                <button style={styles.ctaButton} onClick={() => onNavigate("dashboard")}>
                    Launch Dashboard →
                </button>
            </div>

            <div style={styles.featuresGrid}>
                <FeatureCard
                    icon="🎥"
                    title="Real-Time Detection"
                    desc="Scan crops natively through your browser via edge-optimized models mapped for high throughput."
                />
                <FeatureCard
                    icon="📁"
                    title="Batch Analysis"
                    desc="Upload high-res images directly from drone footage or DSLR for maximum accuracy scans."
                />
                <FeatureCard
                    icon="💊"
                    title="Clinical Insights"
                    desc="Receive calculated severity percentages alongside exact chemical fungicide prescriptions."
                />
            </div>
        </div>
    );
};

export default Home;

const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
    <div style={styles.card}>
        <div style={styles.cardIcon}>{icon}</div>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDesc}>{desc}</p>
    </div>
);

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 24px",
        gap: "64px",
        flex: 1,
    },
    heroSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        maxWidth: "800px",
    },
    badge: {
        padding: "6px 16px",
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        color: "#4ade80",
        borderRadius: "999px",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "24px",
        border: "1px solid rgba(74, 222, 128, 0.2)",
    },
    title: {
        fontSize: "56px",
        lineHeight: "1.1",
        fontWeight: "800",
        letterSpacing: "-1px",
        margin: "0 0 24px 0",
        color: "#ffffff",
    },
    highlight: {
        color: "#4ade80",
    },
    subtitle: {
        fontSize: "18px",
        color: "#a1a1aa",
        lineHeight: "1.6",
        marginBottom: "40px",
        maxWidth: "600px",
    },
    ctaButton: {
        padding: "16px 32px",
        fontSize: "18px",
        fontWeight: "600",
        color: "#0a0a0a",
        backgroundColor: "#fff",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(255, 255, 255, 0.25)",
        transition: "transform 0.2s ease",
    },
    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        width: "100%",
    },
    card: {
        backgroundColor: "rgba(24, 24, 27, 0.6)",
        border: "1px solid rgba(255,255,255,0.05)",
        padding: "32px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    cardIcon: {
        fontSize: "32px",
        marginBottom: "20px",
        backgroundColor: "rgba(255,255,255,0.05)",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
    },
    cardTitle: {
        margin: "0 0 12px 0",
        fontSize: "20px",
        fontWeight: "700",
        color: "#f4f4f5",
    },
    cardDesc: {
        margin: 0,
        color: "#a1a1aa",
        lineHeight: "1.5",
        fontSize: "15px",
    },
};
