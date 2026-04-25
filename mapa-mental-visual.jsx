import { useState, useRef, useCallback, useEffect } from "react";

const BRANCHES = [
  {
    id: "vieses",
    label: "Vieses\nCognitivos",
    icon: "🧠",
    color: "#3b82f6",
    glow: "#3b82f688",
    angle: -90,
    children: [
      { id: "v1", label: "Tendência\nCognitiva", desc: "Padrões previsíveis de pensamento e comportamento (autoimagem positiva)." },
      { id: "v2", label: "Falácias\nLógicas", desc: "Conclusão sem detalhes — falta de informação ou pensamento 'desejoso'." },
      { id: "v3", label: "Heurística", desc: "Atalhos mentais para resolver problemas comuns." },
      { id: "v4", label: "Viés da\nConfirmação", desc: "Você presta atenção ao que confirma o que acredita e ignora o que desafia." },
      { id: "v5", label: "Tendenciosidade\ndo Leitor", desc: "Evidências internas (crenças, valores, experiência) vs. externas (científicas)." },
      { id: "v6", label: "Tendenciosidade\ndo Autor (SPIN)", desc: "Deturpar resultados para enfatizar efeito benéfico sem dados suficientes." },
    ]
  },
  {
    id: "piramide",
    label: "Pirâmide de\nEvidências",
    icon: "🔬",
    color: "#10b981",
    glow: "#10b98188",
    angle: -30,
    children: [
      { id: "p1", label: "Revisões\nSistemáticas", desc: "Nível mais alto. Síntese rigorosa de múltiplos estudos." },
      { id: "p2", label: "Ensaios Clínicos\nRandomizados", desc: "Padrão-ouro para intervenções. Alta validade interna." },
      { id: "p3", label: "Estudos\nde Coorte", desc: "Acompanhamento prospectivo de grupos com diferentes exposições." },
      { id: "p4", label: "Estudos\nCaso-Controle", desc: "Compara doentes e não-doentes para exposições passadas." },
      { id: "p5", label: "Relato de\nCaso / Série", desc: "Descrições individuais. Gera hipóteses." },
      { id: "p6", label: "Opinião de\nExperts / In vitro", desc: "Nível mais baixo. Estudos animais e opiniões sem dados primários." },
    ]
  },
  {
    id: "estudos",
    label: "Tipos de\nEstudos",
    icon: "📊",
    color: "#f59e0b",
    glow: "#f59e0b88",
    angle: 30,
    children: [
      { id: "e1", label: "Estudo\nEcológico", desc: "Agregado + Transversal. Verifica padrão de ocorrência, gera hipóteses, avalia impacto." },
      { id: "e2", label: "Séries\nTemporais", desc: "Agregado + Longitudinal. Tendência de dados populacionais no tempo." },
      { id: "e3", label: "Ensaio\nComunitário", desc: "Agregado + Intervenção. Ex: fluoração da água e cáries." },
      { id: "e4", label: "Estudo\nTransversal", desc: "Individuado. 'Fotografia' da saúde. Avalia exposição e doença simultaneamente." },
      { id: "e5", label: "Estudo\nde Coorte", desc: "Individuado + Longitudinal. Parte de sadios, compara por exposição ao longo do tempo." },
      { id: "e6", label: "Ensaio\nClínico", desc: "Individuado + Intervenção. Pesquisador manipula a exposição. Profilático ou terapêutico." },
    ]
  },
  {
    id: "leitura",
    label: "Leitura Crítica\nde Artigos",
    icon: "📖",
    color: "#8b5cf6",
    glow: "#8b5cf688",
    angle: 90,
    children: [
      { id: "l1", label: "6 Perguntas\nde Classificação", desc: "Primário/Secundário? Clínico/Experimental/Revisão? Individuado/Agregado? Observacional/Intervencional? Transversal/Longitudinal? Prospectivo/Retrospectivo?" },
      { id: "l2", label: "Leitura\nCompleta", desc: "1. Objetivos: método adequado? 2. Métodos: fontes de vieses. 3. Resultados: interpretação." },
      { id: "l3", label: "Erros\nSistemáticos", desc: "Vieses que desviam resultados em uma direção consistente. Ligados ao método." },
      { id: "l4", label: "Erros\nAleatórios", desc: "Variações por acaso. Minimizados com tamanho amostral adequado." },
      { id: "l5", label: "Postura\nCrítica", desc: "Ler buscando ERROS, não acertos! Questionar objetivo vs. conclusão do autor." },
    ]
  },
  {
    id: "pbe",
    label: "PBE / MBE",
    icon: "⚕️",
    color: "#ec4899",
    glow: "#ec489988",
    angle: 150,
    children: [
      { id: "pb1", label: "3 Pilares\nda PBE", desc: "Evidência Científica + Experiência Profissional + Preferências do Paciente." },
      { id: "pb2", label: "Por que\nEvidências?", desc: "Informações falsas; práticas passadas de geração em geração; profissionais sem criticidade; terceirização do conhecimento." },
      { id: "pb3", label: "Tomada\nde Decisão", desc: "Senso crítico + vivência profissional + expertise clínica. Formação responsável, ética e permanente." },
      { id: "pb4", label: "Descritores\nPICO / MeSH", desc: "Vocabulário controlado para busca em bases. MeSH / DeCS. Inglês = melhor recuperação." },
      { id: "pb5", label: "MBE → PBE\nExpansão", desc: "Enfermagem, Fisioterapia baseadas em evidências. Transformação no pensar do profissional de saúde." },
    ]
  },
  {
    id: "erros",
    label: "Erros\nMetodológicos",
    icon: "⚠️",
    color: "#ef4444",
    glow: "#ef444488",
    angle: -150,
    children: [
      { id: "er1", label: "Estudos\nde Intervenção", desc: "Pesquisador manipula fator de exposição para provocar modificação intencional no estado de saúde." },
      { id: "er2", label: "Estudos\nObservacionais", desc: "Pesquisador não interfere. Apenas observa e registra o que ocorre naturalmente." },
      { id: "er3", label: "Caso-Controle:\nRetrospectivo", desc: "Parte da doença instalada para medir exposição passada. Compara frequência de exposição entre grupos." },
      { id: "er4", label: "Coorte:\nProspectivo", desc: "Parte de indivíduos sadios, classificados por exposição, seguidos no tempo para verificar aparecimento de doença." },
    ]
  },
];

const DEG = Math.PI / 180;
const CX = 500, CY = 420;
const BRANCH_R = 195;
const CHILD_R = 120;

function getPos(cx, cy, r, angleDeg) {
  return {
    x: cx + r * Math.cos(angleDeg * DEG),
    y: cy + r * Math.sin(angleDeg * DEG),
  };
}

function getChildPositions(branch) {
  const n = branch.children.length;
  const spread = Math.min(70, (n - 1) * 22);
  return branch.children.map((child, i) => {
    const offset = n === 1 ? 0 : -spread + (i * spread * 2) / (n - 1);
    const childAngle = branch.angle + offset;
    const bp = getPos(CX, CY, BRANCH_R, branch.angle);
    return {
      ...child,
      x: bp.x + CHILD_R * Math.cos(childAngle * DEG),
      y: bp.y + CHILD_R * Math.sin(childAngle * DEG),
      angle: childAngle,
      color: branch.color,
    };
  });
}

function CurvedLine({ x1, y1, x2, y2, color, opacity = 1, width = 2 }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ctrl1x = x1 + dx * 0.35 - dy * 0.1;
  const ctrl1y = y1 + dy * 0.35 + dx * 0.1;
  const ctrl2x = x2 - dx * 0.35 - dy * 0.1;
  const ctrl2y = y2 - dy * 0.35 + dx * 0.1;
  return (
    <path
      d={`M${x1},${y1} C${ctrl1x},${ctrl1y} ${ctrl2x},${ctrl2y} ${x2},${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap="round"
    />
  );
}

function BranchNode({ branch, isActive, onClick }) {
  const pos = getPos(CX, CY, BRANCH_R, branch.angle);
  const W = 88, H = 52;
  return (
    <g
      transform={`translate(${pos.x},${pos.y})`}
      style={{ cursor: "pointer" }}
      onClick={() => onClick(branch.id)}
    >
      <rect
        x={-W / 2} y={-H / 2} width={W} height={H}
        rx={14}
        fill={isActive ? branch.color : "#1e293b"}
        stroke={branch.color}
        strokeWidth={isActive ? 3 : 2}
        style={{ filter: isActive ? `drop-shadow(0 0 12px ${branch.color})` : "none", transition: "all 0.25s" }}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={-8}
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: "11px", fill: isActive ? "#fff" : branch.color, fontWeight: 700, pointerEvents: "none" }}
      >
        {branch.icon}
      </text>
      {branch.label.split("\n").map((line, i, arr) => (
        <text
          key={i}
          x={0} y={4 + (i - (arr.length - 1) / 2) * 13}
          textAnchor="middle"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: "9.5px", fill: isActive ? "#fff" : "#cbd5e1", fontWeight: 700, pointerEvents: "none" }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function ChildNode({ node, isSelected, onClick }) {
  const W = 84, H = 44;
  const lines = node.label.split("\n");
  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      style={{ cursor: "pointer" }}
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
    >
      <rect
        x={-W / 2} y={-H / 2} width={W} height={H}
        rx={10}
        fill={isSelected ? node.color + "dd" : node.color + "22"}
        stroke={node.color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        strokeOpacity={isSelected ? 1 : 0.7}
        style={{ filter: isSelected ? `drop-shadow(0 0 8px ${node.color})` : "none", transition: "all 0.2s" }}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={0} y={(i - (lines.length - 1) / 2) * 13}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: "Georgia, serif", fontSize: "8.5px", fill: isSelected ? "#fff" : "#e2e8f0", fontWeight: isSelected ? 700 : 400, pointerEvents: "none" }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export default function MindMap() {
  const [activeBranch, setActiveBranch] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const lastPos = useRef(null);

  const handleBranchClick = (id) => {
    setActiveBranch(prev => prev === id ? null : id);
    setSelectedChild(null);
  };

  const handleChildClick = (node) => {
    setSelectedChild(prev => prev?.id === node.id ? null : node);
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setScale(s => Math.min(2, Math.max(0.4, s - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { dragging.current = false; };

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const activeBranchData = BRANCHES.find(b => b.id === activeBranch);

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 40% 30%, #0a1628 0%, #040810 70%)",
      overflow: "hidden", position: "relative",
      fontFamily: "Georgia, serif",
      cursor: dragging.current ? "grabbing" : "grab",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* dot grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(148,163,184,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(180deg, rgba(4,8,16,0.95) 0%, transparent 100%)",
        pointerEvents: "none",
      }}>
        <div>
          <div style={{ color: "#64748b", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase" }}>Mapa Mental Interativo</div>
          <div style={{ color: "#e2e8f0", fontSize: "15px", fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}>
            Epidemiologia & Prática Baseada em Evidências
          </div>
        </div>
        <div style={{ color: "#475569", fontSize: "9px", letterSpacing: "0.1em", textAlign: "right" }}>
          <div>Clique nos nós para expandir</div>
          <div>Scroll para zoom · Arraste para mover</div>
        </div>
      </div>

      {/* SVG canvas */}
      <svg
        ref={svgRef}
        width="100%" height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => { if (e.target === e.currentTarget) { setActiveBranch(null); setSelectedChild(null); } }}
      >
        <defs>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f1e35" />
          </radialGradient>
          {BRANCHES.map(b => (
            <radialGradient key={b.id} id={`grad-${b.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={b.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={b.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale}) translate(${(1000 * (1 - scale)) / (2 * scale)}, ${(840 * (1 - scale)) / (2 * scale)})`}>

          {/* Ambient glows for active branches */}
          {activeBranchData && (() => {
            const pos = getPos(CX, CY, BRANCH_R, activeBranchData.angle);
            return (
              <ellipse
                cx={(CX + pos.x) / 2} cy={(CY + pos.y) / 2}
                rx={160} ry={100}
                fill={`url(#grad-${activeBranchData.id})`}
                style={{ transition: "all 0.4s" }}
              />
            );
          })()}

          {/* Lines from center to branches */}
          {BRANCHES.map(branch => {
            const pos = getPos(CX, CY, BRANCH_R, branch.angle);
            const isActive = activeBranch === branch.id;
            return (
              <CurvedLine
                key={branch.id}
                x1={CX} y1={CY}
                x2={pos.x} y2={pos.y}
                color={branch.color}
                opacity={isActive ? 0.9 : 0.35}
                width={isActive ? 3 : 1.5}
              />
            );
          })}

          {/* Lines from branch to children */}
          {BRANCHES.map(branch => {
            if (activeBranch !== branch.id) return null;
            const bp = getPos(CX, CY, BRANCH_R, branch.angle);
            return getChildPositions(branch).map(child => (
              <CurvedLine
                key={child.id}
                x1={bp.x} y1={bp.y}
                x2={child.x} y2={child.y}
                color={branch.color}
                opacity={0.6}
                width={1.5}
              />
            ));
          })}

          {/* Child nodes */}
          {BRANCHES.map(branch => {
            if (activeBranch !== branch.id) return null;
            return getChildPositions(branch).map(child => (
              <ChildNode
                key={child.id}
                node={child}
                isSelected={selectedChild?.id === child.id}
                onClick={handleChildClick}
              />
            ));
          })}

          {/* Branch nodes */}
          {BRANCHES.map(branch => (
            <BranchNode
              key={branch.id}
              branch={branch}
              isActive={activeBranch === branch.id}
              onClick={handleBranchClick}
            />
          ))}

          {/* Center node */}
          <g>
            <circle cx={CX} cy={CY} r={62} fill="url(#centerGrad)" stroke="#38bdf8" strokeWidth={2.5}
              style={{ filter: "drop-shadow(0 0 18px #38bdf866)" }} />
            <circle cx={CX} cy={CY} r={56} fill="none" stroke="#38bdf8" strokeWidth={0.5} strokeOpacity={0.3} />
            <text x={CX} y={CY - 18} textAnchor="middle" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "11px", fill: "#38bdf8", fontWeight: 700, letterSpacing: "0.08em" }}>
              PRÁTICA
            </text>
            <text x={CX} y={CY - 4} textAnchor="middle" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "11px", fill: "#38bdf8", fontWeight: 700, letterSpacing: "0.08em" }}>
              BASEADA EM
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "11px", fill: "#38bdf8", fontWeight: 700, letterSpacing: "0.08em" }}>
              EVIDÊNCIAS
            </text>
            <text x={CX} y={CY + 28} textAnchor="middle" style={{ fontFamily: "Georgia, serif", fontSize: "18px", fill: "#60a5fa" }}>
              🎯
            </text>
            <text x={CX} y={CY + 50} textAnchor="middle" style={{ fontFamily: "Georgia, serif", fontSize: "8px", fill: "#475569" }}>
              {BRANCHES.length} ramificações
            </text>
          </g>

        </g>
      </svg>

      {/* Detail panel */}
      {selectedChild && (
        <div style={{
          position: "absolute",
          bottom: "24px", left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(8,12,24,0.97))",
          border: `1px solid ${selectedChild.color}`,
          borderRadius: "16px",
          padding: "18px 24px",
          maxWidth: "480px",
          width: "calc(100vw - 48px)",
          boxShadow: `0 0 32px ${selectedChild.color}44, 0 8px 32px rgba(0,0,0,0.7)`,
          zIndex: 30,
          pointerEvents: "none",
        }}>
          <div style={{ color: selectedChild.color, fontFamily: "'DM Serif Display', serif", fontSize: "14px", marginBottom: "8px", fontStyle: "italic" }}>
            📌 {selectedChild.label.replace(/\n/g, " ")}
          </div>
          <div style={{ color: "#cbd5e1", fontFamily: "Georgia, serif", fontSize: "12px", lineHeight: 1.7 }}>
            {selectedChild.desc}
          </div>
        </div>
      )}

      {/* Branch pills legend */}
      <div style={{
        position: "absolute",
        top: "64px", right: "16px",
        display: "flex", flexDirection: "column", gap: "5px",
        zIndex: 20,
        pointerEvents: "none",
      }}>
        {BRANCHES.map(b => (
          <div key={b.id} style={{
            display: "flex", alignItems: "center", gap: "6px",
            opacity: activeBranch === b.id || !activeBranch ? 1 : 0.4,
            transition: "opacity 0.2s",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
            <span style={{ color: "#94a3b8", fontSize: "9px", fontFamily: "Georgia, serif" }}>
              {b.icon} {b.label.replace(/\n/g, " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Zoom controls */}
      <div style={{
        position: "absolute", bottom: "100px", right: "16px",
        display: "flex", flexDirection: "column", gap: "4px",
        zIndex: 20,
      }}>
        {[
          { label: "+", action: () => setScale(s => Math.min(2, s + 0.15)) },
          { label: "⌂", action: () => { setScale(1); setPan({ x: 0, y: 0 }); } },
          { label: "−", action: () => setScale(s => Math.max(0.4, s - 0.15)) },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              width: "32px", height: "32px",
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(56,189,248,0.3)",
              borderRadius: "8px",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "monospace",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
