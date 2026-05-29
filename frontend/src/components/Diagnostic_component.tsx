import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Region {
  id: number;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  crop_url: string | null;
  gradcam_url: string | null;
  disease: string;
  severity: "Low" | "Medium" | "High" | string;
  diagnosis_confidence: number;
}

interface DiagnosticReportWithRegions {
  id: number;
  plant: string;
  disease: string;
  confidence: number;
  severity: "Low" | "Medium" | "High" | string;
  image_url: string | null;
  boxed_image_url?: string | null;
  regions: Region[];
}

interface DetectedRegionsPlaygroundProps {
  report: DiagnosticReportWithRegions;
}

const API_BASE_URL = "http://localhost:8000";

const resolveImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

const severityClass = (severity: string) => {
  if (severity === "High") return "#ef4444";
  if (severity === "Medium") return "#f59e0b";
  return "#22c55e";
};


const DetectedRegionsPlayground = ({
  report,
}: DetectedRegionsPlaygroundProps) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<number | null>(null);
  const navigate = useNavigate();


  const mainImage = useMemo(() => {
    return resolveImageUrl(report.boxed_image_url || report.image_url);
  }, [report]);



  if (!report) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        No report selected
      </div>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        background:
          "radial-gradient(circle at top left, rgba(34,197,94,0.16), transparent 36%), #030712",
        color: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <header style={{ marginBottom: "28px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            
              padding: "10px 16px",
              marginBottom: "18px",
            
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.12)",
            
              background: "rgba(255,255,255,0.05)",
              color: "#f9fafb",
            
              fontWeight: 700,
              fontSize: "14px",
            
              cursor: "pointer",
            
              transition: "all .25s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(-4px)";
              e.currentTarget.style.background =
                "rgba(34,197,94,0.12)";
              e.currentTarget.style.border =
                "1px solid rgba(34,197,94,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.background =
                "rgba(255,255,255,0.05)";
              e.currentTarget.style.border =
                "1px solid rgba(255,255,255,0.12)";
            }}
          >
            <span style={{ fontSize: "18px" }}>←</span>
          
            <span>
              Back to Dashboard
            </span>
          </button>
          <p
            style={{
              color: "#22c55e",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            AI Region Inspection Playground
          </p>

          <h1 style={{ fontSize: "36px", margin: "8px 0" }}>
            Click a detected leaf region
          </h1>

          <p style={{ color: "#9ca3af", maxWidth: "680px", lineHeight: 1.7 }}>
            Explore detected tomato leaves, crop previews, Grad-CAM heatmaps,
            disease classification, severity, and confidence.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "rgba(15,23,42,0.82)",
              border: "1px solid rgba(34,197,94,0.18)",
              borderRadius: "28px",
              padding: "20px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>{report.plant} Diagnosis</h2>
                <p style={{ margin: "6px 0 0", color: "#9ca3af" }}>
                  Main disease:{" "}
                  <strong style={{ color: "#fff" }}>{report.disease}</strong>
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: `${severityClass(report.severity)}22`,
                    color: severityClass(report.severity),
                    fontWeight: 800,
                    border: `1px solid ${severityClass(report.severity)}55`,
                  }}
                >
                  {report.severity} risk
                </span>

                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.06)",
                    color: "#d1d5db",
                    fontWeight: 700,
                  }}
                >
                  {report.confidence}% confidence
                </span>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#020617",
              }}
            >
              <img
                src={mainImage}
                alt="Detected tomato leaves"
                style={{
                  width: "100%",
                  display: "block",
                  userSelect: "none",
                }}
              />

              {report.regions.map((region) => {
                const active =
                  selectedRegion?.id === region.id ||
                  hoveredRegionId === region.id;

                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    style={{
                      position: "absolute",
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      width: `${region.width}%`,
                      height: `${region.height}%`,
                      cursor: "pointer",
                      borderRadius: "12px",
                      border: `2px solid ${severityClass(region.severity)}`,
                      background: active
                        ? `${severityClass(region.severity)}33`
                        : `${severityClass(region.severity)}18`,
                      boxShadow: active
                        ? `0 0 0 4px ${severityClass(
                            region.severity
                          )}33, 0 0 28px ${severityClass(region.severity)}`
                        : "none",
                      transform: active ? "scale(1.02)" : "scale(1)",
                      transition: "all 220ms ease",
                    }}
                    title={`Leaf ${region.id} - ${region.disease}`}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "-30px",
                        left: "0",
                        padding: "5px 9px",
                        borderRadius: "999px",
                        background: severityClass(region.severity),
                        color: "#020617",
                        fontWeight: 900,
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                      }}
                    >
                      #{region.id} {region.severity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside
            style={{
              background: "rgba(15,23,42,0.82)",
              border: "1px solid rgba(34,197,94,0.18)",
              borderRadius: "28px",
              padding: "18px",
              maxHeight: "780px",
              overflow: "auto",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Detected regions</h3>

            <div style={{ display: "grid", gap: "12px" }}>
              {report.regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  style={{
                    textAlign: "left",
                    padding: "14px",
                    borderRadius: "18px",
                    border:
                      hoveredRegionId === region.id
                        ? `1px solid ${severityClass(region.severity)}`
                        : "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.045)",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <strong>Leaf #{region.id}</strong>
                    <span style={{ color: severityClass(region.severity) }}>
                      {region.severity}
                    </span>
                  </div>

                  <p style={{ margin: "8px 0 4px", color: "#d1d5db" }}>
                    {region.disease}
                  </p>

                  <p style={{ margin: 0, color: "#9ca3af", fontSize: "12px" }}>
                    Detection: {region.confidence}% • Diagnosis:{" "}
                    {region.diagnosis_confidence}%
                  </p>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>

      {selectedRegion && (
        <div
          onClick={() => setSelectedRegion(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.76)",
            backdropFilter: "blur(14px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            animation: "fadeIn 180ms ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(980px, 100%)",
              maxHeight: "92vh",
              overflow: "auto",
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(3,7,18,0.98))",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: "32px",
              padding: "24px",
              boxShadow: "0 30px 110px rgba(0,0,0,0.65)",
              animation: "popIn 220ms ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#22c55e",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Region #{selectedRegion.id}
                </p>

                <h2 style={{ margin: "8px 0 0" }}>
                  {selectedRegion.disease}
                </h2>
              </div>

              <button
                onClick={() => setSelectedRegion(null)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <ImagePanel
                title="Leaf crop"
                url={resolveImageUrl(selectedRegion.crop_url)}
              />

              <ImagePanel
                title="Grad-CAM heatmap"
                url={resolveImageUrl(selectedRegion.gradcam_url)}
              />
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <InfoCard
                label="Severity"
                value={selectedRegion.severity}
                color={severityClass(selectedRegion.severity)}
              />
              <InfoCard
                label="YOLO detection"
                value={`${selectedRegion.confidence}%`}
              />
              <InfoCard
                label="Disease confidence"
                value={`${selectedRegion.diagnosis_confidence}%`}
              />
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes popIn {
            from {
              opacity: 0;
              transform: translateY(18px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

const ImagePanel = ({ title, url }: { title: string; url: string }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "14px",
      }}
    >
      <h4 style={{ marginTop: 0 }}>{title}</h4>

      {url ? (
        <img
          src={url}
          alt={title}
          style={{
            width: "100%",
            height: "320px",
            objectFit: "contain",
            borderRadius: "18px",
            background: "#020617",
          }}
        />
      ) : (
        <div
          style={{
            height: "320px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
          }}
        >
          No image available
        </div>
      )}
    </div>
  );
};

const InfoCard = ({
  label,
  value,
  color = "#e5e7eb",
}: {
  label: string;
  value: string;
  color?: string;
}) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "18px",
        padding: "14px",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          color: "#9ca3af",
          fontSize: "12px",
        }}
      >
        {label}
      </p>
      <strong style={{ color }}>{value}</strong>
    </div>
  );
};

export default DetectedRegionsPlayground;