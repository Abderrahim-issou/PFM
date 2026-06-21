import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  createTrackedPlant,
  getTrackedPlants,
  getTrackedPlantDetails,
  scanTrackedPlant,
  deleteTrackedPlant,
} from "../api/api";

import type {
  TrackedPlant,
  TrackedPlantDetails,
  TrackingEntry,
} from "../types/Global";

const statusEmoji = (status?: string) => {
  if (status === "Improving") return "📈";
  if (status === "Deteriorating") return "📉";
  if (status === "Stable") return "➖";
  return "🌱";
};

const severityClass = (severity?: string) => {
  if (severity === "High") return "danger";
  if (severity === "Medium") return "warning";
  return "success";
};

const TrackingPage = () => {
  const { access_token } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [trackedPlants, setTrackedPlants] = useState<TrackedPlant[]>([]);
  const [selectedTrackingPlantId, setSelectedTrackingPlantId] =
    useState<number | null>(null);

  const [selectedTrackingDetails, setSelectedTrackingDetails] =
    useState<TrackedPlantDetails | null>(null);

  const [trackingFile, setTrackingFile] = useState<File | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [latestTrackingEntry, setLatestTrackingEntry] =
    useState<TrackingEntry | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const loadTrackedPlants = async () => {
    if (!access_token) return;

    try {
      setTrackingLoading(true);
      const response = await getTrackedPlants(access_token);
      setTrackedPlants(response.data);

      if (response.data.length > 0 && !selectedTrackingPlantId) {
        await loadTrackedPlantDetails(response.data[0].id);
      }
    } catch (error) {
      console.error("Failed to load tracked plants:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const loadTrackedPlantDetails = async (plantId: number) => {
    if (!access_token) return;

    try {
      setTrackingLoading(true);
      const response = await getTrackedPlantDetails(plantId, access_token);

      setSelectedTrackingDetails(response.data);
      setSelectedTrackingPlantId(plantId);
    } catch (error) {
      console.error("Failed to load tracked plant details:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleStartNewTracking = async () => {
    if (!access_token) return;

    const nextNumber = trackedPlants.length + 1;
    const icons = ["🌱", "🌿", "🌾", "🌻", "🌲", "🪴"];
    const newIcon = icons[(nextNumber - 1) % icons.length];

    try {
      setTrackingLoading(true);

      const response = await createTrackedPlant(
        {
          name: `Plant ${nextNumber}`,
          icon: newIcon,
        },
        access_token
      );

      const newPlant = response.data;

      setTrackedPlants((prev) => [newPlant, ...prev]);
      setSelectedTrackingPlantId(newPlant.id);
      await loadTrackedPlantDetails(newPlant.id);
    } catch (error) {
      console.error("Failed to create tracked plant:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleScanTrackedPlant = async () => {
    if (!access_token || !selectedTrackingPlantId || !trackingFile) return;

    const formData = new FormData();
    formData.append("file", trackingFile);

    try {
      setTrackingLoading(true);

      const response = await scanTrackedPlant(
        selectedTrackingPlantId,
        formData,
        access_token
      );

      setLatestTrackingEntry(response.data);
      setTrackingFile(null);

      await loadTrackedPlants();
      await loadTrackedPlantDetails(selectedTrackingPlantId);
    } catch (error) {
      console.error("Failed to scan tracked plant:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleDeleteTrackedPlant = async () => {
    if (!access_token || !selectedTrackingPlantId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this tracked plant?"
    );

    if (!confirmed) return;

    try {
      setTrackingLoading(true);

      await deleteTrackedPlant(selectedTrackingPlantId, access_token);

      setTrackedPlants((prev) =>
        prev.filter((plant) => plant.id !== selectedTrackingPlantId)
      );

      setSelectedTrackingPlantId(null);
      setSelectedTrackingDetails(null);
      setLatestTrackingEntry(null);
      setTrackingFile(null);
    } catch (error) {
      console.error("Failed to delete tracked plant:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    loadTrackedPlants();
  }, [access_token]);

  const stats = useMemo(() => {
    const total = trackedPlants.length;

    const healthy = trackedPlants.filter(
      (plant) => (plant.current_health ?? 0) >= 80
    ).length;

    const risky = trackedPlants.filter(
      (plant) =>
        plant.current_health !== null && plant.current_health < 60
    ).length;

    const plantsWithHealth = trackedPlants.filter(
      (plant) => plant.current_health !== null
    );

    const averageHealth =
      plantsWithHealth.length > 0
        ? plantsWithHealth.reduce(
            (sum, plant) => sum + (plant.current_health ?? 0),
            0
          ) / plantsWithHealth.length
        : 0;

    const entries = selectedTrackingDetails?.tracking_entries ?? [];

    const recoveryScore =
      entries.length >= 2
        ? entries[entries.length - 1].health - entries[0].health
        : 0;

    return {
      total,
      healthy,
      risky,
      averageHealth: averageHealth.toFixed(1),
      recoveryScore: recoveryScore.toFixed(1),
    };
  }, [trackedPlants, selectedTrackingDetails]);

  const chartPath = useMemo(() => {
    const entries = selectedTrackingDetails?.tracking_entries ?? [];

    if (entries.length === 0) return "";

    return entries
      .map((entry, index) => {
        const x = 50 + index * 90;
        const y = 170 - (entry.health! / 100) * 140;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [selectedTrackingDetails]);

  return (
    <main
      className="dashboard"
      style={{
        position: "relative",
        zIndex: 10,
        padding: "clamp(16px, 3vw, 40px)",
        maxWidth: "1800px",
        margin: "0 auto",
      }}
    >
      <section
        className="glass-card animate-fade-in"
        style={{ marginBottom: "22px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow">Plant Evolution Monitoring</span>
            <h2 style={{ marginTop: "8px" }}>Disease Tracking Dashboard</h2>
            <p style={{ maxWidth: "720px" }}>
              Track every plant over time by comparing new diagnosis results
              with previous scans. Monitor disease evolution, health
              progression, severity changes, and treatment response.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="secondary"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              className="primary"
              type="button"
              onClick={handleStartNewTracking}
              disabled={trackingLoading}
            >
              + Start New Plant Tracking
            </button>
          </div>
        </div>
      </section>

      <section className="analytics-grid" style={{ marginBottom: "22px" }}>
        <div className="glass-card analytics-stat-card">
          <span className="label">Tracked Plants</span>
          <h2 style={{ fontSize: "32px" }}>{stats.total}</h2>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            Active monitoring subjects
          </p>
        </div>

        <div className="glass-card analytics-stat-card">
          <span className="label">Average Health</span>
          <h2 style={{ fontSize: "32px" }}>{stats.averageHealth}%</h2>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            Based on latest scans
          </p>
        </div>

        <div className="glass-card analytics-stat-card">
          <span className="label">Recovery Score</span>
          <h2 style={{ fontSize: "32px" }}>
            {Number(stats.recoveryScore) >= 0 ? "+" : ""}
            {stats.recoveryScore}%
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            First scan vs latest scan
          </p>
        </div>

        <div className="glass-card analytics-stat-card">
          <span className="label">Healthy / Risky</span>
          <h2 style={{ fontSize: "32px" }}>
            {stats.healthy} / {stats.risky}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            Healthy above 80%, risky below 60%
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "22px",
          alignItems: "start",
        }}
      >
        <aside className="glass-card" style={{ padding: "22px" }}>
          <h3 style={{ marginBottom: "16px" }}>Tracked Plants</h3>

          {trackingLoading && (
            <p style={{ color: "var(--muted)", textAlign: "center" }}>
              Loading tracking data...
            </p>
          )}

          <div style={{ display: "grid", gap: "12px" }}>
            {trackedPlants.map((plant) => (
              <button
                key={plant.id}
                type="button"
                onClick={() => loadTrackedPlantDetails(plant.id)}
                className="glass-card"
                style={{
                  padding: "16px",
                  textAlign: "left",
                  border:
                    selectedTrackingPlantId === plant.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--card-border)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>
                    {plant.icon || "🌱"}
                  </span>

                  <div style={{ flex: 1 }}>
                    <strong>{plant.name}</strong>
                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {plant.current_disease || "No scan yet"}
                    </p>
                  </div>

                  <span
                    className={`pill ${
                      (plant.current_health ?? 0) >= 80
                        ? "success"
                        : (plant.current_health ?? 0) >= 60
                        ? "warning"
                        : "danger"
                    }`}
                  >
                    {plant.current_health !== null
                      ? `${plant.current_health}%`
                      : "New"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {!trackingLoading && trackedPlants.length === 0 && (
            <p
              style={{
                color: "var(--muted)",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              No tracked plants yet.
            </p>
          )}
        </aside>

        {selectedTrackingDetails ? (
          <section style={{ display: "grid", gap: "22px" }}>
            <div className="glass-card" style={{ padding: "26px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2>
                    {selectedTrackingDetails.icon || "🌱"}{" "}
                    {selectedTrackingDetails.name}
                  </h2>

                  <p style={{ color: "var(--muted)", marginTop: "6px" }}>
                    Current disease:{" "}
                    <strong style={{ color: "var(--text)" }}>
                      {selectedTrackingDetails.current_disease || "No scan yet"}
                    </strong>
                  </p>

                  <p style={{ color: "var(--muted)", marginTop: "4px" }}>
                    Current health:{" "}
                    <strong style={{ color: "var(--text)" }}>
                      {selectedTrackingDetails.current_health !== null
                        ? `${selectedTrackingDetails.current_health}%`
                        : "Not available"}
                    </strong>
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "44px", fontWeight: 800 }}>
                    {selectedTrackingDetails.current_health !== null
                      ? `${selectedTrackingDetails.current_health}%`
                      : "--"}
                  </div>
                  <span className="label">Current Health Score</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "22px",
                  padding: "20px",
                  borderRadius: "18px",
                  border: "1px dashed rgba(16,185,129,0.25)",
                  background: "rgba(16,185,129,0.03)",
                }}
              >
                <h4 style={{ marginBottom: "12px" }}>Upload New Scan</h4>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setTrackingFile(e.target.files?.[0] || null)
                  }
                />

                {trackingFile && (
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "13px",
                      marginTop: "8px",
                    }}
                  >
                    Selected file: {trackingFile.name}
                  </p>
                )}

                <button
                  className="primary"
                  type="button"
                  onClick={handleScanTrackedPlant}
                  disabled={trackingLoading || !trackingFile}
                  style={{ marginTop: "14px" }}
                >
                  Scan and Compare Evolution
                </button>
              </div>

              {latestTrackingEntry && (
                <div className="glass-card" style={{ padding: "20px", marginTop: "18px" }}>
                  <h4>
                    {statusEmoji(latestTrackingEntry.progress_status!)} Latest
                    Progress: {latestTrackingEntry.progress_status}
                  </h4>

                  <p
                    style={{
                      color: "var(--muted)",
                      lineHeight: "1.6",
                      marginTop: "8px",
                    }}
                  >
                    {latestTrackingEntry.progress_message}
                  </p>

                  <p style={{ marginTop: "8px" }}>
                    Health score:{" "}
                    <strong>{latestTrackingEntry.health}%</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="glass-card chart-card">
              <h3 style={{ marginBottom: "8px" }}>Health Evolution Graph</h3>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "13px",
                  marginBottom: "18px",
                }}
              >
                This graph shows how the plant health score changed across
                scans.
              </p>

              {selectedTrackingDetails.tracking_entries.length > 0 ? (
                <div className="line-chart-svg">
                  <svg viewBox="0 0 500 200" width="100%" height="100%">
                    <line
                      x1="50"
                      y1="30"
                      x2="450"
                      y2="30"
                      stroke="rgba(16,185,129,0.08)"
                      strokeDasharray="4"
                    />
                    <line
                      x1="50"
                      y1="100"
                      x2="450"
                      y2="100"
                      stroke="rgba(16,185,129,0.08)"
                      strokeDasharray="4"
                    />
                    <line
                      x1="50"
                      y1="170"
                      x2="450"
                      y2="170"
                      stroke="rgba(16,185,129,0.15)"
                    />

                    <path
                      d={chartPath}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {selectedTrackingDetails.tracking_entries.map(
                      (entry, index) => {
                        const x = 50 + index * 90;
                        const y = 170 - (entry.health! / 100) * 140;

                        return (
                          <g key={entry.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r="6"
                              fill="var(--primary)"
                            />

                            <text
                              x={x}
                              y={y - 12}
                              fill="var(--text)"
                              fontSize="10"
                              textAnchor="middle"
                            >
                              {entry.health}%
                            </text>

                            <text
                              x={x}
                              y="190"
                              fill="var(--muted)"
                              fontSize="10"
                              textAnchor="middle"
                            >
                              Scan {index + 1}
                            </text>
                          </g>
                        );
                      }
                    )}

                    <text
                      x="40"
                      y="34"
                      fill="var(--muted)"
                      fontSize="10"
                      textAnchor="end"
                    >
                      100%
                    </text>
                    <text
                      x="40"
                      y="104"
                      fill="var(--muted)"
                      fontSize="10"
                      textAnchor="end"
                    >
                      50%
                    </text>
                    <text
                      x="40"
                      y="174"
                      fill="var(--muted)"
                      fontSize="10"
                      textAnchor="end"
                    >
                      0%
                    </text>
                  </svg>
                </div>
              ) : (
                <p
                  style={{
                    color: "var(--muted)",
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  No graph available yet. Upload the first scan to start
                  monitoring.
                </p>
              )}
            </div>

            <div className="glass-card" style={{ padding: "26px" }}>
              <h3 style={{ marginBottom: "18px" }}>Tracking Timeline</h3>

              {selectedTrackingDetails.tracking_entries.length > 0 ? (
                <div style={{ display: "grid", gap: "14px" }}>
                  {[...selectedTrackingDetails.tracking_entries]
                    .reverse()
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="glass-card"
                        style={{
                          padding: "18px",
                          borderLeft: "4px solid var(--primary)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "14px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div>
                            <h4>
                              {statusEmoji(entry.progress_status!)}{" "}
                              {entry.progress_status || "Scan"}
                            </h4>

                            <p
                              style={{
                                color: "var(--muted)",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              {new Date(entry.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <span
                            className={`pill ${severityClass(
                              entry.diagnostic_report?.severity
                            )}`}
                          >
                            {entry.diagnostic_report?.severity || "Unknown"} Risk
                          </span>
                        </div>

                        <p
                          style={{
                            marginTop: "12px",
                            color: "var(--muted)",
                            lineHeight: 1.6,
                          }}
                        >
                          {entry.progress_message}
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "12px",
                            marginTop: "16px",
                          }}
                        >
                          <div>
                            <span className="label">Disease</span>
                            <p className="value">
                              {entry.diagnostic_report?.disease || "Unknown"}
                            </p>
                          </div>

                          <div>
                            <span className="label">Confidence</span>
                            <p className="value">
                              {entry.diagnostic_report?.confidence ?? "--"}%
                            </p>
                          </div>

                          <div>
                            <span className="label">Health</span>
                            <p className="value">{entry.health}%</p>
                          </div>
                        </div>

                        {entry.diagnostic_report?.id && (
                          <button
                            className="secondary"
                            type="button"
                            onClick={() =>
                              navigate(
                                `/playground/${entry.diagnostic_report?.id}`
                              )
                            }
                            style={{ marginTop: "16px" }}
                          >
                            🔬 Open Leaf Regions and Grad-CAM
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p style={{ color: "var(--muted)" }}>
                  No scans yet. Upload the first image to create the baseline
                  diagnosis.
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                }}
              >
                <button
                  className="secondary"
                  type="button"
                  onClick={() => {
                    setSelectedTrackingPlantId(null);
                    setSelectedTrackingDetails(null);
                    setLatestTrackingEntry(null);
                    setTrackingFile(null);
                  }}
                >
                  Close Tracking View
                </button>

                <button
                  className="secondary"
                  type="button"
                  onClick={handleDeleteTrackedPlant}
                  disabled={trackingLoading}
                >
                  Delete Tracked Plant
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section
            className="glass-card"
            style={{
              padding: "40px",
              minHeight: "420px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "56px", marginBottom: "18px" }}>👁️</span>

            <h3>Select a Plant to Track</h3>

            <p
              style={{
                color: "var(--muted)",
                maxWidth: "360px",
                lineHeight: 1.6,
                marginTop: "12px",
              }}
            >
              Choose one of your tracked plants from the list or start a new
              tracking session.
            </p>

            <button
              className="primary"
              type="button"
              onClick={handleStartNewTracking}
              disabled={trackingLoading}
              style={{ marginTop: "24px" }}
            >
              + Start New Tracking
            </button>
          </section>
        )}
      </section>
    </main>
  );
};

export default TrackingPage;