import React, { useEffect, useState } from "react";
import {
  getContainers,
  startContainer,
  stopContainer,
  deleteContainer,
  getLogs,
} from "./api";

interface Container {
  id: string;
  name: string[];
  status: string;
}

function App() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [logs, setLogs] = useState<{ [key: string]: string }>({});
  const [expandedLogs, setExpandedLogs] = useState<string | null>(null);

  const fetchContainers = async () => {
    try {
      const data = await getContainers();
      setContainers(data);
    } catch (error) {
      console.error("Error fetching containers:", error);
    }
  };

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogs = async (id: string) => {
    if (logs[id]) {
      setExpandedLogs(expandedLogs === id ? null : id);
      return;
    }

    const fetchedLogs = await getLogs(id);
    setLogs((prev) => ({ ...prev, [id]: fetchedLogs }));
    setExpandedLogs(id);
  };

  const getStatusColor = (status: string) => {
    if (status.includes("running")) return "#4CAF50";
    if (status.includes("exited")) return "#f44336";
    return "#999";
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        🐳 Docker Dashboard
      </h1>
      {containers.length === 0 ? (
        <p>No containers found.</p>
      ) : (
        containers.map((container) => (
          <div
            key={container.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1.5rem",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>{container.name?.[0] || container.id}</h3>
              <span
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  background: getStatusColor(container.status),
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {container.status}
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                disabled={container.status.includes("running")}
                onClick={() =>
                  startContainer(container.id).then(fetchContainers)
                }
              >
                ▶️ Start
              </button>
              <button
                disabled={container.status.includes("exited")}
                onClick={() =>
                  stopContainer(container.id).then(fetchContainers)
                }
              >
                ⏹️ Stop
              </button>
              <button
                onClick={() =>
                  deleteContainer(container.id).then(fetchContainers)
                }
              >
                🗑️ Delete
              </button>
              <button onClick={() => handleLogs(container.id)}>
                📄 {expandedLogs === container.id ? "Hide" : "Show"} Logs
              </button>
            </div>

            {expandedLogs === container.id && logs[container.id] && (
              <pre
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#111",
                  color: "#0f0",
                  borderRadius: "5px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  fontSize: "0.85rem",
                }}
              >
                {logs[container.id]}
              </pre>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
