import { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Layers,
  AlertTriangle,
  RotateCcw,
  Activity,
  CheckCircle,
} from "lucide-react";

export default function SystemSandbox({ project }) {
  const slug = project?.slug || "";

  // COSMEON-FS-LITE Sandbox State
  const [cosmeonPartition, setCosmeonPartition] = useState(false);
  const [offlineNodeIndex, setOfflineNodeIndex] = useState(null);

  // AURA Sandbox State
  const [selectedPkt, setSelectedPkt] = useState(0);

  // TRUSTNET-AI Sandbox State
  const [selectedModality, setSelectedModality] = useState(0);

  if (slug === "cosmeon-fs-lite") {
    const nodes = [
      { id: "node-01", name: "LEO-Alpha", role: "Leader", latency: "14ms", shard: "0x4F1A" },
      { id: "node-02", name: "LEO-Beta", role: "Follower", latency: "22ms", shard: "0x4F1B" },
      { id: "node-03", name: "GEO-Relay", role: "Follower", latency: "118ms", shard: "0x4F1C" },
      { id: "node-04", name: "Ground-Station", role: "Follower", latency: "38ms", shard: "0x4F1D" },
    ];

    const isDegraded = cosmeonPartition || offlineNodeIndex !== null;

    return (
      <div className="interactive-sandbox">
        <div className="sandbox-header">
          <div>
            <div className="sandbox-badge">
              <Cpu size={15} /> DISTRIBUTED RAFT & ORBITAL SHARDS
            </div>
            <h3>Orbital DTN & Quorum Telemetry</h3>
          </div>
          <div className="sandbox-actions">
            <button
              className="sandbox-btn-warn"
              onClick={() => {
                setCosmeonPartition((prev) => !prev);
                setOfflineNodeIndex(null);
              }}
            >
              <AlertTriangle size={14} />
              {cosmeonPartition ? "Restore Orbit Links" : "Inject Orbit Fault"}
            </button>
            <button
              className="sandbox-btn-reset"
              onClick={() => {
                setCosmeonPartition(false);
                setOfflineNodeIndex(null);
              }}
            >
              <RotateCcw size={14} /> Rebalance Quorum
            </button>
          </div>
        </div>

        <div className="sandbox-metrics-row">
          <div className={`metric-pill ${isDegraded ? "status-critical" : "status-ok"}`}>
            <strong>Consensus:</strong>{" "}
            {isDegraded ? "Degraded Quorum (3/4 Active)" : "Synchronized (4/4 Active)"}
          </div>
          <div className="metric-pill status-ok">
            <strong>Merkle Proof:</strong> 100% Verified
          </div>
          <div className="metric-pill">
            <strong>DTN Custody:</strong> {isDegraded ? "3 Bundles Buffered" : "0 Pending"}
          </div>
        </div>

        <p className="sandbox-hint">
          Click any orbital node below to inspect shard state or simulate downlink disruptions.
        </p>

        <div className="orbital-node-grid">
          {nodes.map((node, i) => {
            const isOffline = (cosmeonPartition && i === 2) || offlineNodeIndex === i;
            return (
              <button
                key={node.id}
                type="button"
                className={`orbital-node-card ${isOffline ? "is-offline" : "is-online"}`}
                onClick={() =>
                  setOfflineNodeIndex((prev) => (prev === i ? null : i))
                }
              >
                <div className="node-top">
                  <strong>{node.name}</strong>
                  <span className="node-state-badge">
                    {isOffline ? "OFFLINE" : node.role.toUpperCase()}
                  </span>
                </div>
                <div className="node-shard">{node.shard}</div>
                <div className="node-meta">
                  <span>Latency: {isOffline ? "TIMEOUT" : node.latency}</span>
                  <span>{isOffline ? "Unreachable" : "In Quorum"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (slug === "aura") {
    const packets = [
      {
        id: "pkt-01",
        method: "POST",
        uri: "/api/v1/auth/exchange?redirect=internal_cfg",
        status: 403,
        statusText: "BLOCKED 403",
        verdict: "Threat Intercepted: Auth Bypass Heuristic",
        blocked: true,
        confidence: "98.7%",
        latency: "1.4ms",
        tokens: [
          { name: "redirect=internal_cfg", weight: 0.94 },
          { name: "grant_type=implicit", weight: 0.88 },
          { name: "x-forwarded-host", weight: 0.72 },
          { name: "csrf_token_len=0", weight: 0.65 },
        ],
      },
      {
        id: "pkt-02",
        method: "GET",
        uri: "/telemetry/nodes/health?filter=active",
        status: 200,
        statusText: "ALLOW 200",
        verdict: "Benign Signal: Standard Telemetry Polling",
        blocked: false,
        confidence: "99.2%",
        latency: "0.8ms",
        tokens: [
          { name: "filter=active", weight: 0.12 },
          { name: "keepalive=true", weight: 0.08 },
          { name: "content_type=json", weight: 0.05 },
        ],
      },
      {
        id: "pkt-03",
        method: "POST",
        uri: "/v2/query/sql?batch=true&exec=schema_dump",
        status: 403,
        statusText: "BLOCKED 403",
        verdict: "Threat Intercepted: Injection Signature",
        blocked: true,
        confidence: "99.8%",
        latency: "2.1ms",
        tokens: [
          { name: "exec=schema_dump", weight: 0.97 },
          { name: "batch=true", weight: 0.81 },
          { name: "union_select", weight: 0.92 },
        ],
      },
    ];

    const current = packets[selectedPkt] || packets[0];

    return (
      <div className="interactive-sandbox">
        <div className="sandbox-header">
          <div>
            <div className="sandbox-badge">
              <ShieldCheck size={15} /> EXPLAINABLE AI TELEMETRY INTERCEPTOR
            </div>
            <h3>Real-Time Packet & HTTP Correlation Inspector</h3>
          </div>
        </div>

        <p className="sandbox-hint">
          Select an intercepted network trace to review XAI attention gradient weights and policy verdicts.
        </p>

        <div className="aura-packet-list">
          {packets.map((pkt, i) => (
            <button
              key={pkt.id}
              type="button"
              className={`aura-packet-tab ${selectedPkt === i ? "active" : ""}`}
              onClick={() => setSelectedPkt(i)}
            >
              <strong>{pkt.method}</strong>
              <span className="pkt-uri">{pkt.uri}</span>
              <span className={`pkt-status ${pkt.status === 403 ? "status-403" : "status-200"}`}>
                {pkt.statusText}
              </span>
            </button>
          ))}
        </div>

        <div className="aura-inspector-panel">
          <div className="aura-verdict-row">
            <span className={`verdict-pill ${current.blocked ? "is-blocked" : "is-breach"}`}>
              {current.verdict}
            </span>
            <span>
              Model Confidence: <strong>{current.confidence}</strong>
            </span>
            <span>
              Inference Latency: <strong>{current.latency}</strong>
            </span>
          </div>

          <div className="xai-heatmap-box">
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--muted)" }}>
              XAI Attention Weights (Feature Salience):
            </p>
            <div className="token-strip">
              {current.tokens.map((tok) => (
                <span
                  key={tok.name}
                  className="xai-token"
                  style={{ "--token-alpha": tok.weight }}
                >
                  {tok.name} <em>+{tok.weight}</em>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "trustnet-ai") {
    const modalities = [
      {
        name: "Spatial Noise (Residuals)",
        bars: [
          { label: "Facial Boundary Edge Discontinuity", value: 89 },
          { label: "High-Frequency GAN Fingerprint", value: 76 },
          { label: "Sensor PRNU Noise Inconsistency", value: 82 },
        ],
      },
      {
        name: "Frequency Domain (FFT)",
        bars: [
          { label: "Azimuthal Spectrum Anomaly", value: 92 },
          { label: "Checkerboard Artifact Power", value: 84 },
          { label: "Upsampling Spectral Grid Leakage", value: 78 },
        ],
      },
      {
        name: "Temporal Consistency",
        bars: [
          { label: "Inter-frame Optical Flow Jitter", value: 68 },
          { label: "Biometric Blink Micro-cadence", value: 74 },
          { label: "Specular Reflection Coherence", value: 85 },
        ],
      },
    ];

    const currentMod = modalities[selectedModality] || modalities[0];

    return (
      <div className="interactive-sandbox">
        <div className="sandbox-header">
          <div>
            <div className="sandbox-badge">
              <Layers size={15} /> MULTIMODAL FORENSICS DECOMPOSITION
            </div>
            <h3>Spectral & Artifact Layer Decomposition</h3>
          </div>
        </div>

        <p className="sandbox-hint">
          Switch between forensic analysis modalities to observe synthetic generation indicators.
        </p>

        <div className="modality-tabs">
          {modalities.map((mod, i) => (
            <button
              key={mod.name}
              type="button"
              className={selectedModality === i ? "active" : ""}
              onClick={() => setSelectedModality(i)}
            >
              {mod.name}
            </button>
          ))}
        </div>

        <div className="trustnet-readout">
          {currentMod.bars.map((bar) => (
            <div key={bar.label} className="forensic-bar-item">
              <div className="bar-label-row">
                <span>{bar.label}</span>
                <strong>{bar.value}%</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generic System Telemetry for other projects
  return (
    <div className="interactive-sandbox">
      <div className="sandbox-header">
        <div>
          <div className="sandbox-badge">
            <Activity size={15} /> SYSTEM TELEMETRY
          </div>
          <h3>{project?.title || "System"} Runtime Architecture Model</h3>
        </div>
      </div>

      <div className="sandbox-metrics-row">
        <div className="metric-pill status-ok">
          <CheckCircle size={14} style={{ color: "var(--mint)" }} />
          <strong>Pipeline:</strong> Nominal
        </div>
        <div className="metric-pill">
          <strong>Category:</strong> {project?.category || "Engineering"}
        </div>
        <div className="metric-pill">
          <strong>Status:</strong> {project?.status || "Active"}
        </div>
      </div>

      <p className="sandbox-hint">
        Documented architectural layers and execution contracts for this system.
      </p>
    </div>
  );
}
