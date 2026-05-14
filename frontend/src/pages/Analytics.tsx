import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ScanHistory {
    disease: string;
    confidence: number;
    severity: number;
    timestamp: number;
}

const Analytics: React.FC = () => {
    const [history, setHistory] = useState<ScanHistory[]>([]);

    useEffect(() => {
        // Load local history or mock data
        const saved = localStorage.getItem("cropAI_history");
        if (saved) {
            setHistory(JSON.parse(saved));
        } else {
            // Inject Mock Data if history empty
            const mockData = [
                { disease: "Apple Scab", confidence: 92, severity: 40, timestamp: Date.now() - 86400000 * 5 },
                { disease: "Late Blight", confidence: 88, severity: 65, timestamp: Date.now() - 86400000 * 3 },
                { disease: "Healthy", confidence: 98, severity: 0, timestamp: Date.now() - 86400000 * 2 },
                { disease: "Late Blight", confidence: 95, severity: 72, timestamp: Date.now() - 86400000 * 1 },
                { disease: "Tomato Early Blight", confidence: 91, severity: 35, timestamp: Date.now() },
            ];
            setHistory(mockData);
            localStorage.setItem("cropAI_history", JSON.stringify(mockData));
        }
    }, []);

    const getDiseaseFrequency = () => {
        const counts: Record<string, number> = {};
        history.forEach(h => {
            counts[h.disease] = (counts[h.disease] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
    };

    const getTrendData = () => {
        return history.map(h => ({
            date: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            severity: h.severity,
            confidence: h.confidence
        }));
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.pageTitle}>Field Analytics & History</h2>

            <div style={styles.grid}>

                {/* Main Trend Chart */}
                <div style={styles.chartCardFull}>
                    <h3 style={styles.chartTitle}>Severity Trends Over Time</h3>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={getTrendData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#a1a1aa" />
                                <YAxis stroke="#a1a1aa" />
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Area type="monotone" dataKey="severity" stroke="#fbbf24" fillOpacity={1} fill="url(#colorSev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Frequency Bar Chart */}
                <div style={styles.chartCardHalf}>
                    <h3 style={styles.chartTitle}>Top Detected Diseases</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={getDiseaseFrequency()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="count" fill="#4ade80" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Scan History List */}
                <div style={styles.chartCardHalf}>
                    <h3 style={styles.chartTitle}>Recent Scans</h3>
                    <div style={styles.historyList}>
                        {history.slice().reverse().map((scan, i) => (
                            <div key={i} style={styles.historyItem}>
                                <div style={styles.historyLeft}>
                                    <p style={styles.historyName}>{scan.disease}</p>
                                    <p style={styles.historyDate}>{new Date(scan.timestamp).toLocaleString()}</p>
                                </div>
                                <div style={styles.historyRight}>
                                    <span style={{ color: '#4ade80' }}>Acc: {scan.confidence}%</span>
                                    <span style={{ color: '#fbbf24' }}>Sev: {scan.severity}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px",
        width: "100%",
    },
    pageTitle: {
        margin: "0 0 32px 0",
        fontSize: "32px",
        fontWeight: "700",
        color: "#fff",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px",
    },
    chartCardFull: {
        gridColumn: "1 / -1",
        backgroundColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        padding: "32px",
        border: "1px solid rgba(255,255,255,0.05)",
    },
    chartCardHalf: {
        backgroundColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        padding: "32px",
        border: "1px solid rgba(255,255,255,0.05)",
    },
    chartTitle: {
        margin: "0 0 24px 0",
        fontSize: "20px",
        color: "#fff",
    },
    historyList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxHeight: "250px",
        overflowY: "auto",
    },
    historyItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: "16px",
        borderRadius: "12px",
    },
    historyLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    historyName: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "600",
        color: "#fff",
    },
    historyDate: {
        margin: 0,
        fontSize: "12px",
        color: "#a1a1aa",
    },
    historyRight: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "4px",
        fontSize: "14px",
        fontWeight: "500",
    },
};
