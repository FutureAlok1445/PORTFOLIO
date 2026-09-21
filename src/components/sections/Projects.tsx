import { useState, useEffect } from 'react';
import { Github, ShieldAlert, GitCommit, Layers, ChevronRight, CheckCircle2, Satellite } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../../data/portfolioData';
import { ProjectModal } from '../ui/ProjectModal';
import { AnimatedHeading } from '../ui/AnimatedHeading';

// ------------------------------------------------------------------------------------------------
// Payload 1: TrustNet-AI Forensic Imaging Satellite Visualizer
// ------------------------------------------------------------------------------------------------
const TrustNetVisualizer = () => {
  const [forensicMode, setForensicMode] = useState<'spectral' | 'ela' | 'gradcam'>('spectral');
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos((prev) => (prev + 1) % 100);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
      {/* Background coordinate grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header & Forensic Switcher Tabs */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <Satellite size={16} className="text-[#c99a5e] animate-pulse" />
          <span className="text-white font-semibold tracking-wide">PAYLOAD 01 // FORENSIC IMAGING SATELLITE</span>
          <span className="text-[#8c919d] text-[10px] hidden sm:inline">SAT-TN-01 · ORBIT 520 KM</span>
        </div>

        {/* Forensic Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06]">
          {(['spectral', 'ela', 'gradcam'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setForensicMode(mode)}
              data-cursor-text="MODE"
              className={`px-2.5 py-1 rounded text-[10px] uppercase font-mono tracking-wider transition-all ${
                forensicMode === mode
                  ? 'bg-[#c99a5e] text-[#050608] font-bold shadow-sm'
                  : 'text-[#8c919d] hover:text-white'
              }`}
            >
              {mode === 'spectral' ? '2D FFT' : mode === 'ela' ? 'ELA Forensics' : 'Grad-CAM XAI'}
            </button>
          ))}
        </div>
      </div>

      {/* Center 2D Face-Mesh Wireframe + Sweeping Scanning Beam Visual */}
      <div className="relative z-10 my-4 h-48 rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex items-center justify-center">
        {/* Dynamic Sweeping Beam */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-r from-transparent via-[#c99a5e] to-transparent pointer-events-none transition-all duration-75 shadow-[0_0_16px_#c99a5e]"
          style={{ left: `${scanPos}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-[#c99a5e]/0 via-[#c99a5e]/15 to-transparent pointer-events-none transition-all duration-75"
          style={{ left: `${Math.max(0, scanPos - 12)}%` }}
        />

        {/* Stylized Face-Mesh Nodes & Overlay based on mode */}
        <svg className="w-64 h-40 opacity-80" viewBox="0 0 200 140" fill="none">
          {/* Wireframe Facial Contour Lines */}
          <path d="M 60 40 Q 100 20 140 40 Q 150 80 135 110 Q 100 130 65 110 Q 50 80 60 40 Z" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 80 50 Q 100 45 120 50" stroke="#c99a5e" strokeWidth="1.2" />
          <path d="M 85 75 Q 100 80 115 75" stroke="#c99a5e" strokeWidth="1.2" />
          <circle cx="85" cy="55" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="115" cy="55" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 100 55 L 97 70 L 103 70 Z" stroke="#38bdf8" strokeWidth="1" />
          <ellipse cx="100" cy="92" rx="16" ry="6" stroke="#c99a5e" strokeWidth="1" strokeDasharray="2 2" />

          {/* Forensic Layer Highlights */}
          {forensicMode === 'spectral' && (
            <g opacity="0.7">
              <circle cx="100" cy="70" r="45" stroke="#c99a5e" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin origin-center" />
              <text x="10" y="20" fill="#c99a5e" fontSize="7" fontFamily="monospace">FFT SPECTRAL PEAK: HIGH-FREQ ANOMALY</text>
            </g>
          )}
          {forensicMode === 'ela' && (
            <g opacity="0.8">
              <rect x="70" y="45" width="60" height="35" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
              <text x="10" y="20" fill="#ef4444" fontSize="7" fontFamily="monospace">ELA: COMPRESSION ERROR LEVEL DISPARITY</text>
            </g>
          )}
          {forensicMode === 'gradcam' && (
            <g opacity="0.75">
              <circle cx="100" cy="65" r="28" fill="url(#gradcam-heat)" />
              <defs>
                <radialGradient id="gradcam-heat">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>
              <text x="10" y="20" fill="#f59e0b" fontSize="7" fontFamily="monospace">GRAD-CAM: EXPLAINABILITY ATTENTION MASK</text>
            </g>
          )}
        </svg>

        {/* Scan Status Badge */}
        <div className="absolute top-2.5 right-3 text-[10px] font-mono text-[#8c919d] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SCANNING BEAM ACTIVE</span>
        </div>
      </div>

      {/* Telemetry Mini-Panel */}
      <div className="relative z-10 pt-3 border-t border-white/[0.06] bg-black/30 p-3 rounded-lg font-mono text-[10px] text-[#8c919d]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.04]">
          <span className="text-[#c99a5e] font-bold tracking-wider">TELEMETRY // SAT-TN-01</span>
          <span className="text-white">STATUS: NOMINAL</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-muted block text-[9px]">BACKBONE</span>
            <span className="text-white">ViT-B/16 + EfficientNet</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">LATENCY</span>
            <span className="text-[#38bdf8]">&lt;48ms [BENCHMARK]</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">DETECTION RATE</span>
            <span className="text-[#c99a5e]">98.4% [EVALUATION RUN]</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">MICROSERVICES</span>
            <span className="text-white">FastAPI / Docker</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// Payload 2: AURA Sentinel Satellite over Earth Visualizer (SIH 2025 Finals)
// ------------------------------------------------------------------------------------------------
const AuraVisualizer = () => {
  const [packetTick, setPacketTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketTick((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <ShieldAlert size={16} className="text-[#c99a5e]" />
          <span className="text-white font-semibold tracking-wide">PAYLOAD 02 // AURA SENTINEL SATELLITE</span>
          <span className="px-2 py-0.5 rounded bg-[#c99a5e]/15 text-[#c99a5e] text-[10px] font-bold">
            SIH 2025 GRAND FINALE
          </span>
        </div>
        <span className="text-[#8c919d] text-[10px]">CYBER THREAT TELEMETRY &amp; 3D TOPOLOGY</span>
      </div>

      {/* Earth Ground Stations & Packet Arcs Visualizer */}
      <div className="relative z-10 my-4 h-48 rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex items-center justify-center p-4">
        <svg className="w-full h-full max-w-lg" viewBox="0 0 400 140" fill="none">
          {/* Orbital Satellite Node */}
          <g transform="translate(200, 20)">
            <circle cx="0" cy="0" r="10" fill="#080b14" stroke="#c99a5e" strokeWidth="1.5" />
            <path d="M -16 -4 L -10 -4 L -10 4 L -16 4 Z" fill="#38bdf8" />
            <path d="M 10 -4 L 16 -4 L 16 4 L 10 4 Z" fill="#38bdf8" />
            <circle cx="0" cy="0" r="3" fill="#c99a5e" className="animate-ping origin-center" />
            <text x="0" y="-12" textAnchor="middle" fill="#c99a5e" fontSize="7" fontFamily="monospace">AURA SENTINEL</text>
          </g>

          {/* Ground Station Nodes (Cities) */}
          <g transform="translate(60, 115)">
            <circle cx="0" cy="0" r="4" fill="#38bdf8" />
            <text x="0" y="14" textAnchor="middle" fill="#8c919d" fontSize="7" fontFamily="monospace">MUMBAI (HQ)</text>
          </g>

          <g transform="translate(150, 115)">
            <circle cx="0" cy="0" r="4" fill="#38bdf8" />
            <text x="0" y="14" textAnchor="middle" fill="#8c919d" fontSize="7" fontFamily="monospace">DELHI</text>
          </g>

          <g transform="translate(250, 115)">
            <circle cx="0" cy="0" r="4" fill="#ef4444" />
            <text x="0" y="14" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">PROBE NODE</text>
          </g>

          <g transform="translate(340, 115)">
            <circle cx="0" cy="0" r="4" fill="#38bdf8" />
            <text x="0" y="14" textAnchor="middle" fill="#8c919d" fontSize="7" fontFamily="monospace">BENGALURU</text>
          </g>

          {/* Packet Arcs */}
          {/* Arc 1: Mumbai <-> Satellite (Normal Cyan) */}
          <path d="M 60 115 Q 120 40 200 20" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          {/* Arc 2: Delhi <-> Satellite (Normal Cyan) */}
          <path d="M 150 115 Q 175 50 200 20" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          {/* Arc 3: Probe Node <-> Satellite (Red Attack Attempt / Breach) */}
          <path d="M 250 115 Q 225 50 200 20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Arc 4: Bengaluru <-> Satellite */}
          <path d="M 340 115 Q 280 40 200 20" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Active Packet Indicator Traveling on Probe Arc */}
          <circle
            cx={250 - packetTick * 12.5}
            cy={115 - packetTick * 23.75}
            r="3"
            fill={packetTick === 3 ? '#ef4444' : '#f59e0b'}
            className="animate-pulse"
          />

          {/* Incident Callout */}
          <g transform="translate(260, 55)">
            <rect x="0" y="0" width="130" height="24" rx="4" fill="rgba(8,11,20,0.9)" stroke={packetTick === 3 ? '#ef4444' : '#f59e0b'} strokeWidth="1" />
            <text x="8" y="11" fill={packetTick === 3 ? '#ef4444' : '#f59e0b'} fontSize="7" fontFamily="monospace" fontWeight="bold">
              {packetTick === 3 ? 'ALERT: CONFIRMED BREACH' : 'ATTEMPT: SUSPICIOUS PROBE'}
            </text>
            <text x="8" y="20" fill="#8c919d" fontSize="6" fontFamily="monospace">
              PORT 8443 EXFILTRATION ENTROPY
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Mini-Panel */}
      <div className="relative z-10 pt-3 border-t border-white/[0.06] bg-black/30 p-3 rounded-lg font-mono text-[10px] text-[#8c919d]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.04]">
          <span className="text-[#c99a5e] font-bold tracking-wider">TELEMETRY // SAT-AURA-02</span>
          <span className="text-[#38bdf8]">SIH EVALUATION BENCHMARK</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-muted block text-[9px]">MY CONTRIBUTION</span>
            <span className="text-white">Analyst Frontend &amp; 3D Vis</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">TOPOLOGY ENGINE</span>
            <span className="text-[#38bdf8]">Three.js + React</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">DATASET CURATION</span>
            <span className="text-[#c99a5e]">PCAP &amp; IPDR Preprocessed</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">INCIDENT CONSOLE</span>
            <span className="text-white">Kibana Dashboards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// Payload 3: Reimbursement Relay Chain of 4 Stations Visualizer
// ------------------------------------------------------------------------------------------------
const ReimbursementVisualizer = () => {
  const [activeStep, setActiveStep] = useState(0);

  const stations = [
    { num: '01', role: 'Faculty', action: 'Claim Lodged & Receipts Uploaded', state: 'Initiated' },
    { num: '02', role: 'HOD', action: 'Departmental Verification', state: 'Verified' },
    { num: '03', role: 'Principal', action: 'Executive Sanction & Sign-Off', state: 'Approved' },
    { num: '04', role: 'Accounts', action: 'Disbursement & Automated PDF', state: 'Reconciled' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <GitCommit size={16} className="text-[#c99a5e]" />
          <span className="text-white font-semibold tracking-wide">
            PAYLOAD 03 // 4-STATION RELAY CHAIN
          </span>
        </div>
        <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          PRODUCTION STATE MACHINE · VERCEL
        </span>
      </div>

      {/* Relay Chain Visualization */}
      <div className="relative z-10 my-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stations.map((s, idx) => {
            const isLit = idx <= activeStep;
            const isCurrent = idx === activeStep;
            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(idx)}
                data-cursor-text="STATION"
                className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-[#c99a5e]/15 border-[#c99a5e] shadow-[0_0_20px_rgba(201,154,94,0.25)]'
                    : isLit
                    ? 'bg-white/[0.04] border-white/20'
                    : 'bg-white/[0.02] border-white/[0.06] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-[#c99a5e]' : 'text-[#8c919d]'}`}>
                    STATION {s.num}
                  </span>
                  {idx < activeStep ? (
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#c99a5e] shadow-[0_0_8px_#c99a5e] animate-ping' : 'bg-white/20'}`} />
                  )}
                </div>
                <h5 className="text-sm font-semibold text-white mb-0.5">{s.role}</h5>
                <p className="text-[10px] font-mono text-[#8c919d] leading-tight">{s.action}</p>
                <div className="mt-2 pt-2 border-t border-white/[0.05] text-[9px] font-mono text-[#c99a5e]">
                  STATE: {s.state}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Telemetry Mini-Panel */}
      <div className="relative z-10 pt-3 border-t border-white/[0.06] bg-black/30 p-3 rounded-lg font-mono text-[10px] text-[#8c919d]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.04]">
          <span className="text-[#c99a5e] font-bold tracking-wider">TELEMETRY // RELAY-INST-03</span>
          <span className="text-emerald-400">ACTIVE DEPLOYMENT</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-muted block text-[9px]">ROLE TIERS</span>
            <span className="text-white">4 Distinct Portals</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">BACKEND SCOPE</span>
            <span className="text-[#38bdf8]">20–30% REST &amp; Schemas</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">AUDIT DIGEST</span>
            <span className="text-white font-mono truncate">SHA256 Automated</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">INFRASTRUCTURE</span>
            <span className="text-white">Node / MongoDB / Vercel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// Payload 4: Logistics Decentralized Domain Microservices Visualizer
// ------------------------------------------------------------------------------------------------
const LogisticsVisualizer = () => {
  const [selectedService, setSelectedService] = useState<'routing' | 'inventory' | 'auth'>('routing');

  const services = [
    { id: 'routing', name: 'Routing Engine', port: '8081', status: 'HEALTHY', latency: '14ms', role: 'Dynamic freight pathfinding & driver allocation' },
    { id: 'inventory', name: 'Inventory Ledger', port: '8082', status: 'HEALTHY', latency: '18ms', role: 'Real-time stock state & warehouse SKU tracking' },
    { id: 'auth', name: 'User & Access', port: '8080', status: 'HEALTHY', latency: '11ms', role: 'RBAC identity boundaries & tenant isolation' },
  ] as const;

  return (
    <div className="w-full rounded-2xl bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <Satellite size={16} className="text-[#38bdf8]" />
          <span className="text-white font-semibold tracking-wide">
            PAYLOAD 04 // DECENTRALIZED DOMAIN MICROSERVICES
          </span>
        </div>
        <span className="text-[#38bdf8] font-mono text-[10px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          DOCKER BRIDGE NETWORK · ISOLATED DOMAINS
        </span>
      </div>

      {/* Microservice Nodes Grid */}
      <div className="relative z-10 my-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {services.map((svc) => {
          const isSelected = selectedService === svc.id;
          return (
            <div
              key={svc.id}
              onClick={() => setSelectedService(svc.id)}
              data-cursor-text="SERVICE"
              className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'bg-[#38bdf8]/15 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#8c919d]">PORT :{svc.port}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {svc.status}
                </span>
              </div>
              <h5 className="text-sm font-semibold text-white mb-1">{svc.name}</h5>
              <p className="text-[10px] font-mono text-[#8c919d] leading-tight mb-2">{svc.role}</p>
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-[#38bdf8]">
                <span>LATENCY:</span>
                <span>{svc.latency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Microservices Telemetry Footer */}
      <div className="relative z-10 pt-3 border-t border-white/[0.06] bg-black/30 p-3 rounded-lg font-mono text-[10px] text-[#8c919d]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-muted block text-[9px]">CONTAINER ENGINE</span>
            <span className="text-white">Docker CE 24.x</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">INTER-SERVICE PROTOCOL</span>
            <span className="text-[#38bdf8]">RESTful JSON contracts</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">SERVICE ISOLATION</span>
            <span className="text-white">Zero Cascading Failure</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">FRONTEND CLIENT</span>
            <span className="text-white">React.js Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// Payload 5: HistoFacts Interactive Historical Intelligence Visualizer
// ------------------------------------------------------------------------------------------------
const HistoFactsVisualizer = () => {
  const [activeDate, setActiveDate] = useState('MAR 21');
  const dateOptions = ['MAR 21', 'JUL 20', 'OCT 04'];

  const eventsMap: Record<string, { year: string; title: string; category: string; detail: string }[]> = {
    'MAR 21': [
      { year: '1965', title: 'Ranger 9 Lunar Impact', category: 'AEROSPACE', detail: 'Sent 5,814 live television photos of the Moon before impact inside Crater Alphonsus.' },
      { year: '1804', title: 'Napoleonic Civil Code Enacted', category: 'GOVERNANCE', detail: 'Established the foundation of modern statutory civil law across Europe.' },
      { year: '1928', title: 'Charles Lindbergh Awarded Medal', category: 'HISTORY', detail: 'Recognized for pioneering the first solo nonstop transatlantic flight.' },
    ],
    'JUL 20': [
      { year: '1969', title: 'Apollo 11 Lunar Landing', category: 'AEROSPACE', detail: 'Apollo Lunar Module Eagle touched down on Tranquility Base.' },
      { year: '1976', title: 'Viking 1 Lands on Mars', category: 'EXPLORATION', detail: 'First successful long-term surface mission transmitting martian telemetry.' },
      { year: '1810', title: 'Bogotá Independence Proclamation', category: 'HISTORY', detail: 'Citizens of Santa Fe established a supreme governing junta.' },
    ],
    'OCT 04': [
      { year: '1957', title: 'Sputnik 1 Launch', category: 'AEROSPACE', detail: 'First artificial Earth satellite launched, initiating the spaceflight epoch.' },
      { year: '2004', title: 'SpaceShipOne Ansari X Prize', category: 'FLIGHT', detail: 'First privately funded human spaceflight to cross the Kármán line.' },
      { year: '1582', title: 'Gregorian Calendar Adopted', category: 'ASTRONOMY', detail: 'Pope Gregory XIII promulgated the reform correcting equinox precession.' },
    ],
  };

  const events = eventsMap[activeDate] || eventsMap['MAR 21'];

  return (
    <div className="w-full rounded-2xl bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <Satellite size={16} className="text-[#c99a5e]" />
          <span className="text-white font-semibold tracking-wide">
            PAYLOAD 05 // HISTORICAL INTELLIGENCE STREAM
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[#8c919d]">QUERY ARCHIVE:</span>
          <div className="flex items-center gap-1">
            {dateOptions.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDate(d)}
                data-cursor-text="DATE"
                className={`px-2 py-0.5 rounded transition-all ${
                  activeDate === d
                    ? 'bg-[#c99a5e] text-[#050608] font-bold shadow-sm'
                    : 'bg-white/[0.03] text-[#8c919d] hover:text-white border border-white/[0.06]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Records Stream */}
      <div className="relative z-10 my-4 space-y-2">
        {events.map((ev, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-4 text-xs font-mono hover:bg-white/[0.04] transition-all"
          >
            <div className="shrink-0 w-14 text-center py-1 rounded bg-[#c99a5e]/10 border border-[#c99a5e]/30 text-[#c99a5e] font-bold">
              {ev.year}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-semibold">{ev.title}</span>
                <span className="text-[9px] text-[#8c919d] px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.06]">
                  {ev.category}
                </span>
              </div>
              <p className="text-[#8c919d] text-[11px] leading-relaxed font-sans">{ev.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Telemetry */}
      <div className="relative z-10 pt-3 border-t border-white/[0.06] bg-black/30 p-3 rounded-lg font-mono text-[10px] text-[#8c919d]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-muted block text-[9px]">RUNTIME ENGINE</span>
            <span className="text-white">Python · Streamlit</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">DATA INGESTION</span>
            <span className="text-[#c99a5e]">REST Archive Endpoints</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">CACHING STRATEGY</span>
            <span className="text-white">In-Memory TTL Buffer</span>
          </div>
          <div>
            <span className="text-muted block text-[9px]">QUERY RESPONSE</span>
            <span className="text-emerald-400">&lt; 85ms Sub-second</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// Main Projects Section
// ------------------------------------------------------------------------------------------------
export const Projects = () => {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const renderSchematic = (variant: 'network' | 'radar' | 'ledger' | 'terminal' | 'stats') => {
    if (variant === 'network') return <TrustNetVisualizer />;
    if (variant === 'radar') return <AuraVisualizer />;
    if (variant === 'ledger') return <ReimbursementVisualizer />;
    if (variant === 'terminal') return <LogisticsVisualizer />;
    return <HistoFactsVisualizer />;
  };

  return (
    <section id="projects" className="relative py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-[#c99a5e] font-bold">02 // SELECTED WORK</span>
        <div className="w-8 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#8c919d]">
          5 ORBITAL PAYLOADS
        </span>
      </div>

      {/* Section Header with Animated GSAP Line Masks */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <AnimatedHeading
            lines={['Core engineering systems', 'and orbital payloads.']}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          />
          <p className="text-sm sm:text-base text-[#8c919d] font-light mt-2 max-w-2xl leading-relaxed">
            Real-world systems spanning explainable deepfake AI forensics, SIH national finalist network inspection telemetry, and institutional workflow automation.
          </p>
        </div>
        <span className="text-xs font-mono text-[#8c919d] shrink-0 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
          05 Payloads Docked
        </span>
      </div>

      {/* Editorial Project Cards Living Inside 3D Orbit on Light Glass Panels */}
      <div className="space-y-20 sm:space-y-28">
        {PORTFOLIO_DATA.projects.map((project) => (
          <article
            key={project.id}
            data-cursor-text="EXPLORE"
            className="group relative p-6 sm:p-10 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all hover:border-white/20"
          >
            {/* Project Eyebrow & Category Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-[#c99a5e] font-bold">
                  PAYLOAD {project.number}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-xs font-mono text-white font-medium uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <span className="text-xs font-mono text-[#8c919d] bg-white/[0.03] px-2.5 py-1 rounded border border-white/[0.06]">
                {project.date}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-[#c99a5e] transition-colors">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#8c919d] mt-1">
                {project.subtitle}
              </p>
            </div>

            {/* High-level Description */}
            <p className="text-sm sm:text-base text-[#f4f5f6] font-light leading-relaxed mb-6 max-w-3xl">
              {project.description}
            </p>

            {/* The Problem / What I Built Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-8 text-xs sm:text-sm font-light leading-relaxed">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8c919d] block">
                  The Problem
                </span>
                <p className="text-[#8c919d]">{project.problem}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#c99a5e] block">
                  What I Built
                </span>
                <p className="text-white">{project.whatIBuilt}</p>
              </div>
            </div>

            {/* Live Interactive Orbital Visualizer Docked to Project */}
            <div className="mb-7">
              {renderSchematic(project.previewVariant)}
            </div>

            {/* Project Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveModalProject(project)}
                  data-cursor-text="DOSSIER"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide uppercase bg-white/[0.08] hover:bg-white hover:text-[#050608] text-white border border-white/[0.12] transition-all shadow-sm group/btn"
                >
                  <Layers size={13} />
                  <span>Architecture Dossier</span>
                  <ChevronRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-text="REPO"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#8c919d] hover:text-white transition-colors"
                >
                  <Github size={14} />
                  <span>Repository</span>
                </a>
              </div>

              {/* Technology Stack Pill */}
              <div className="text-xs font-mono text-[#c99a5e]">
                {project.techStack}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Project Details Architecture Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
