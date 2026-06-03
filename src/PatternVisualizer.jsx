import React, { useState, useEffect } from 'react';

const Box = ({ val, active, highlight, success, fade, removed, style = {} }) => {
  let className = "vis-cell";
  if (active) className += " active";
  if (highlight) className += " highlight";
  if (success) className += " success";
  if (fade) className += " fade";
  if (removed) className += " removed";
  return (
    <div className={className} style={style}>
      {val}
    </div>
  );
};

const Pointer = ({ label, index, color = "var(--gold)" }) => (
  <div className="vis-pointer" style={{ top: 52, left: index * 52 }}>
    <div className="vis-pointer-arrow" style={{ borderBottomColor: color }}></div>
    <span className="vis-pointer-label" style={{ color, borderColor: color, background: `${color}15` }}>{label}</span>
  </div>
);

const StateBadge = ({ label, val }) => (
  <div className="vis-badge">
    {label}: <span className="vis-badge-val">{val}</span>
  </div>
);

const CodeStep = ({ code }) => (
  code ? <div className="vis-code">{code}</div> : null
);

const Controls = ({ step, setStep, total }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let timer;
    if (isPlaying && step < total - 1) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, speed);
    } else if (isPlaying && step === total - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, total, speed]);

  const togglePlay = () => {
    if (step === total - 1) setStep(0);
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <div className="vis-progress-wrap">
        <div className="vis-progress-bar">
          <div className="vis-progress-fill" style={{ width: `${((step + 1) / total) * 100}%` }}></div>
        </div>
        <div className="vis-step-badge">{step + 1} / {total}</div>
      </div>
      <div className="vis-controls">
        <button onClick={togglePlay} className={`vis-btn ${isPlaying ? 'playing' : 'primary'}`}>
          {isPlaying ? '⏸ Pause' : '▶ Auto-Play'}
        </button>
        <select className="vis-speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}>
          <option value={2000}>0.5x Speed</option>
          <option value={1000}>1x Speed</option>
          <option value={500}>2x Speed</option>
        </select>
        <div style={{ flex: 1 }}></div>
        <button onClick={() => { setIsPlaying(false); setStep(Math.max(0, step - 1)); }} disabled={step === 0} className="vis-btn">Prev</button>
        <button onClick={() => { setIsPlaying(false); setStep(Math.min(total - 1, step + 1)); }} disabled={step === total - 1} className="vis-btn">Next</button>
        <button onClick={() => { setIsPlaying(false); setStep(0); }} className="vis-btn">Reset</button>
      </div>
    </div>
  );
};

function TwoPointersVis() {
  const arr = [2, 7, 11, 15, 20];
  const target = 18;
  const steps = [
    { L: 0, R: 4, msg: "Sum = 2 + 20 = 22. 22 > 18. Move R left." },
    { L: 0, R: 3, msg: "Sum = 2 + 15 = 17. 17 < 18. Move L right." },
    { L: 1, R: 3, msg: "Sum = 7 + 15 = 22. 22 > 18. Move R left." },
    { L: 1, R: 2, msg: "Sum = 7 + 11 = 18. Target Found!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Two Sum II - Target: {target}</div>
      </div>
      <div style={{ position: "relative", height: 100, display: "flex", gap: 8 }}>
        {arr.map((val, i) => <Box key={i} val={val} active={i === cur.L || i === cur.R} success={cur.match && (i === cur.L || i === cur.R)} />)}
        <Pointer label="L" index={cur.L} color="var(--gold)" />
        <Pointer label="R" index={cur.R} color="var(--teal)" />
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function SlidingWindowVis() {
  const arr = [2, 1, 5, 1, 3, 2];
  const steps = [
    { L: 0, R: 0, msg: "Start window. Add 2. Sum = 2" },
    { L: 0, R: 1, msg: "Expand window. Add 1. Sum = 3" },
    { L: 0, R: 2, msg: "Expand window. Add 5. Sum = 8 (Max so far!)", match: true },
    { L: 1, R: 3, msg: "Shift window. Remove 2, Add 1. Sum = 7" },
    { L: 2, R: 4, msg: "Shift window. Remove 1, Add 3. Sum = 9 (New Max!)", match: true },
    { L: 3, R: 5, msg: "Shift window. Remove 5, Add 2. Sum = 6" }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Max Subarray Sum (k=3)</div>
      </div>
      <div style={{ position: "relative", height: 100, display: "flex", gap: 8 }}>
        {arr.map((val, i) => {
          const inWindow = i >= cur.L && i <= cur.R;
          return <Box key={i} val={val} active={inWindow} success={inWindow && cur.match} fade={!inWindow} />;
        })}
        <Pointer label="L" index={cur.L} color="var(--gold)" />
        <Pointer label="R" index={cur.R} color="var(--teal)" />
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function BinarySearchVis() {
  const arr = [1, 3, 5, 7, 9, 11, 15, 18, 21];
  const steps = [
    { L: 0, R: 8, M: 4, msg: "Mid = 9. 9 < 15. Search right half." },
    { L: 5, R: 8, M: 6, msg: "Mid = 15. Target Found!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Binary Search - Target: 15</div>
      </div>
      <div style={{ position: "relative", height: 100, display: "flex", gap: 8 }}>
        {arr.map((val, i) => <Box key={i} val={val} active={i === cur.M} success={cur.match && i === cur.M} fade={i < cur.L || i > cur.R} />)}
        <Pointer label="L" index={cur.L} color="var(--text-muted)" />
        <Pointer label="M" index={cur.M} color="var(--gold)" />
        <Pointer label="R" index={cur.R} color="var(--text-muted)" />
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function DPVis() {
  const arr = [0, 1, 2, 3, 5];
  const steps = [
    { dp: ["0", "1", "2", "?", "?"], i: 3, msg: "dp[3] = dp[2] + dp[1] = 2 + 1 = 3" },
    { dp: ["0", "1", "2", "3", "?"], i: 4, msg: "dp[4] = dp[3] + dp[2] = 3 + 2 = 5", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">DP - Climbing Stairs (n=4)</div>
      </div>
      <div style={{ position: "relative", height: 100, display: "flex", gap: 8 }}>
        {cur.dp.map((val, i) => <Box key={i} val={val} active={i === cur.i} success={cur.match && i === cur.i} />)}
        <Pointer label={`i=${cur.i}`} index={cur.i} color="var(--gold)" />
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function HashingVis() {
  const arr = [2, 7, 11, 15];
  const target = 9;
  const steps = [
    { idx: 0, map: {}, msg: "Target=9. Diff=9-2=7. Map doesn't have 7. Add 2 to Map." },
    { idx: 1, map: { 2: 0 }, msg: "Diff=9-7=2. Map has 2! Target Found.", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Two Sum (Hash Map) - Target: {target}</div>
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ position: "relative", height: 100, display: "flex", gap: 8 }}>
          {arr.map((val, i) => <Box key={i} val={val} active={i === cur.idx} success={cur.match && i === cur.idx} />)}
          <Pointer label="i" index={cur.idx} color="var(--gold)" />
        </div>
        <div style={{ background: "var(--surface)", padding: 16, borderRadius: 8, border: "1px solid var(--border)", minWidth: 120 }}>
          <div style={{ fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, fontSize: 12 }}>HASH MAP</div>
          {Object.entries(cur.map).length === 0 ? <div style={{ color: "var(--dim)", fontStyle: "italic" }}>Empty</div> : null}
          {Object.entries(cur.map).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", color: cur.match && k === "2" ? "var(--teal)" : "var(--text)" }}>
              <span>Key: <b>{k}</b></span><span>Val: {v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function StackVis() {
  const arr = [2, 1, 2, 4, 3];
  const steps = [
    { i: 0, stack: [], res: [-1, -1, -1, -1, -1], msg: "Stack empty. Push index 0 (val 2)." },
    { i: 1, stack: [0], res: [-1, -1, -1, -1, -1], msg: "1 < 2. Push index 1 (val 1)." },
    { i: 2, stack: [0, 1], res: [-1, -1, -1, -1, -1], msg: "2 > 1. Pop index 1! Next greater for 1 is 2." },
    { i: 2, stack: [0], res: [-1, 2, -1, -1, -1], msg: "2 == 2. Push index 2 (val 2)." },
    { i: 3, stack: [0, 2], res: [-1, 2, -1, -1, -1], msg: "4 > 2. Pop index 2! Next greater for 2 is 4." },
    { i: 3, stack: [0], res: [-1, 2, 4, -1, -1], msg: "4 > 2. Pop index 0! Next greater for 2 is 4.", match: true },
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Monotonic Stack - Next Greater Element</div>
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ position: "relative", height: 100, display: "flex", gap: 8 }}>
          {arr.map((val, i) => <Box key={i} val={val} active={i === cur.i} />)}
          <Pointer label="i" index={cur.i} color="var(--gold)" />
        </div>
        <div style={{ display: "flex", flexDirection: "column-reverse", border: "2px solid var(--border)", borderTop: "none", width: 60, height: 100, borderRadius: "0 0 8px 8px", padding: 4, background: "rgba(0,0,0,0.2)" }}>
          {cur.stack.map((s, idx) => (
            <div key={idx} style={{ background: "var(--teal)", color: "#000", fontWeight: 800, textAlign: "center", borderRadius: 4, padding: "4px 0", marginTop: 4 }}>{arr[s]}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Result Array:</span>
          <div style={{ display: "flex", gap: 4 }}>{cur.res.map((r, i) => <Box key={i} val={r === -1 ? "_" : r} success={r !== -1} style={{ width: 30, height: 30 }} />)}</div>
        </div>
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function LinkedListVis() {
  const steps = [
    { slow: 0, fast: 0, msg: "Start slow and fast pointers at Head." },
    { slow: 1, fast: 2, msg: "Slow moves 1 step, Fast moves 2 steps." },
    { slow: 2, fast: 4, msg: "Slow moves 1 step, Fast moves 2 steps (loops to node 1)." },
    { slow: 3, fast: 3, msg: "Slow == Fast! Cycle Detected.", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Fast & Slow Pointers (Cycle Detection)</div>
      </div>
      <div style={{ position: "relative", height: 100, display: "flex", gap: 16, alignItems: "center", paddingLeft: 10 }}>
        {[3, 2, 0, -4].map((v, i) => (
          <React.Fragment key={i}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: cur.slow === i || cur.fast === i ? "var(--gold)" : "var(--surface)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: cur.slow === i || cur.fast === i ? "#000" : "var(--text)", fontWeight: 800 }}>{v}</div>
            {i < 3 && <div style={{ width: 20, height: 2, background: "var(--text-muted)", position: "relative" }}><div style={{ position: "absolute", right: -4, top: -4, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid var(--text-muted)" }}></div></div>}
          </React.Fragment>
        ))}
        {/* Cycle arrow approximation */}
        <svg style={{ position: "absolute", left: 100, top: 40, width: 150, height: 50, pointerEvents: "none" }}>
          <path d="M 130 0 Q 130 40 65 40 Q 0 40 0 10" fill="transparent" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="-3,12 3,12 0,4" fill="var(--text-muted)" transform="translate(0, 10)" />
        </svg>
        <div style={{ position: "absolute", top: -20, left: cur.slow * 60 + 10, color: "var(--gold)", fontWeight: 800, fontSize: 12, transition: "left 0.3s" }}>SLOW</div>
        <div style={{ position: "absolute", top: 60, left: (cur.fast === 4 ? 1 : cur.fast) * 60 + 10, color: "var(--teal)", fontWeight: 800, fontSize: 12, transition: "left 0.3s" }}>FAST</div>
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function BacktrackingVis() {
  const steps = [
    { path: [], msg: "Start with empty path." },
    { path: [1], msg: "Choose 1. Recurse." },
    { path: [1, 2], msg: "Choose 2. Recurse. Subset [1,2] found!", match: true },
    { path: [1], msg: "Backtrack (Undo 2)." },
    { path: [1, 3], msg: "Choose 3. Recurse. Subset [1,3] found!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Backtracking - Subsets</div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", height: 60 }}>
        <span style={{ color: "var(--text-muted)" }}>Current Path:</span>
        <div style={{ display: "flex", gap: 8 }}>
          {cur.path.map((v, i) => <Box key={i} val={v} success={cur.match} style={{ width: 30, height: 30 }} />)}
          {cur.path.length === 0 && <span style={{ color: "var(--dim)" }}>[ Empty ]</span>}
        </div>
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function TreeDFSVis() {
  const steps = [
    { n: 1, msg: "Visit Root (1)" },
    { n: 2, msg: "Go Left -> Visit (2)" },
    { n: 4, msg: "Go Left -> Visit (4)" },
    { n: 2, msg: "Backtrack to (2), Go Right -> null" },
    { n: 5, msg: "Go Right -> Visit (5)", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  const Node = ({ id, x, y }) => (
    <div style={{ position: "absolute", left: x, top: y, width: 30, height: 30, borderRadius: 15, background: cur.n === id ? "var(--gold)" : "var(--surface)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: cur.n === id ? "#000" : "var(--text)", fontWeight: 800, zIndex: 2 }}>{id}</div>
  );
  const Line = ({ x1, y1, x2, y2 }) => (
    <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 1 }}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-muted)" strokeWidth="2" /></svg>
  );

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Tree DFS (Depth-First)</div>
      </div>
      <div style={{ position: "relative", height: 120, width: 200, margin: "0 auto" }}>
        <Line x1={100} y1={15} x2={60} y2={60} />
        <Line x1={100} y1={15} x2={140} y2={60} />
        <Line x1={60} y1={60} x2={30} y2={100} />
        <Line x1={60} y1={60} x2={90} y2={100} />
        <Node id={1} x={85} y={0} />
        <Node id={2} x={45} y={45} />
        <Node id={3} x={125} y={45} />
        <Node id={4} x={15} y={85} />
        <Node id={5} x={75} y={85} />
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function TreeBFSVis() {
  const steps = [
    { n: 1, q: [1], res: [], msg: "Push root to Queue." },
    { n: 1, q: [2, 3], res: [1], msg: "Pop 1. Push children 2, 3." },
    { n: 2, q: [3, 4, 5], res: [1, 2], msg: "Pop 2. Push children 4, 5." },
    { n: 3, q: [4, 5], res: [1, 2, 3], msg: "Pop 3. No children.", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Tree BFS (Level-Order)</div>
      </div>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ position: "relative", height: 100, width: 150 }}>
           <div style={{ position: "absolute", left: 60, top: 0, color: cur.n === 1 ? "var(--teal)" : "var(--text)", fontWeight: 800 }}>1</div>
           <div style={{ position: "absolute", left: 30, top: 30, color: cur.n === 2 ? "var(--teal)" : "var(--text)", fontWeight: 800 }}>2</div>
           <div style={{ position: "absolute", left: 90, top: 30, color: cur.n === 3 ? "var(--teal)" : "var(--text)", fontWeight: 800 }}>3</div>
           <div style={{ position: "absolute", left: 10, top: 60, color: cur.n === 4 ? "var(--teal)" : "var(--text)", fontWeight: 800 }}>4</div>
           <div style={{ position: "absolute", left: 50, top: 60, color: cur.n === 5 ? "var(--teal)" : "var(--text)", fontWeight: 800 }}>5</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>Queue:</div>
          <div style={{ display: "flex", gap: 4, height: 40, border: "1px solid var(--border)", padding: 4, borderRadius: 4, minWidth: 100 }}>
             {cur.q.map((v, i) => <Box key={i} val={v} style={{ width: 30, height: 30 }} />)}
          </div>
        </div>
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function GraphVis() {
  const steps = [
    { n: 0, visited: [0], msg: "Start at Node 0. Mark as visited." },
    { n: 1, visited: [0, 1], msg: "Explore neighbor 1. Mark visited." },
    { n: 2, visited: [0, 1, 2], msg: "Explore neighbor 2. Mark visited.", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const Node = ({ id, x, y }) => (
    <div style={{ position: "absolute", left: x, top: y, width: 30, height: 30, borderRadius: 15, background: cur.n === id ? "var(--gold)" : cur.visited.includes(id) ? "var(--teal)" : "var(--surface)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: cur.visited.includes(id) ? "#000" : "var(--text)", fontWeight: 800, zIndex: 2 }}>{id}</div>
  );
  
  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Graph Traversal</div>
      </div>
      <div style={{ position: "relative", height: 120, width: 200 }}>
         <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}>
           <line x1={30} y1={30} x2={100} y2={30} stroke="var(--text-muted)" strokeWidth="2" />
           <line x1={100} y1={30} x2={65} y2={85} stroke="var(--text-muted)" strokeWidth="2" />
           <line x1={30} y1={30} x2={65} y2={85} stroke="var(--text-muted)" strokeWidth="2" />
         </svg>
         <Node id={0} x={15} y={15} />
         <Node id={1} x={85} y={15} />
         <Node id={2} x={50} y={70} />
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function GreedyVis() {
  const prices = [7, 1, 5, 3, 6, 4];
  const steps = [
    { i: 1, p: 0, msg: "Price=1. 1 < 7. No profit." },
    { i: 2, p: 4, msg: "Price=5. 5 > 1. Buy at 1, Sell at 5. Profit += 4." },
    { i: 3, p: 4, msg: "Price=3. 3 < 5. No profit." },
    { i: 4, p: 7, msg: "Price=6. 6 > 3. Buy at 3, Sell at 6. Profit += 3. Total=7", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Greedy - Best Time to Buy/Sell Stock II</div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120, paddingBottom: 20, position: "relative" }}>
         {prices.map((v, i) => (
           <div key={i} style={{ width: 30, height: v * 15, background: i === cur.i ? "var(--teal)" : i === cur.i - 1 && cur.match ? "var(--gold)" : "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px 4px 0 0", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, fontWeight: 800, color: i === cur.i ? "#000" : "var(--text)" }}>{v}</div>
         ))}
         <div style={{ position: "absolute", top: 10, right: 10, fontSize: 18, fontWeight: 800, color: "var(--gold)" }}>Total Profit: {cur.p}</div>
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function HeapVis() {
  const steps = [
    { arr: [10, 20, 15], msg: "Initial Min-Heap: [10, 20, 15]" },
    { arr: [10, 20, 15, 5], hl: 3, msg: "Insert 5 at the end." },
    { arr: [10, 5, 15, 20], hl: 1, msg: "Bubble Up: Swap 5 and 20." },
    { arr: [5, 10, 15, 20], hl: 0, msg: "Bubble Up: Swap 5 and 10. Heap restored!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Min-Heap Insertion</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {cur.arr.map((v, i) => <Box key={i} val={v} success={cur.hl === i} />)}
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function TrieVis() {
  const steps = [
    { hl: "", msg: "Empty Trie (Root)." },
    { hl: "c", msg: "Insert 'c'." },
    { hl: "ca", msg: "Insert 'a'." },
    { hl: "cat", msg: "Insert 't'. Mark as EndOfWord!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Trie - Insert "cat"</div>
      </div>
      <div style={{ position: "relative", height: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
         <div style={{ width: 30, height: 30, borderRadius: 15, background: "var(--surface)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>*</div>
         {cur.hl.length > 0 && <div style={{ width: 2, height: 10, background: "var(--text-muted)" }}></div>}
         {cur.hl.length > 0 && <div style={{ width: 30, height: 30, borderRadius: 15, background: cur.hl === "c" ? "var(--gold)" : "var(--surface)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>c</div>}
         {cur.hl.length > 1 && <div style={{ width: 2, height: 10, background: "var(--text-muted)" }}></div>}
         {cur.hl.length > 1 && <div style={{ width: 30, height: 30, borderRadius: 15, background: cur.hl === "ca" ? "var(--gold)" : "var(--surface)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>a</div>}
         {cur.hl.length > 2 && <div style={{ width: 2, height: 10, background: "var(--text-muted)" }}></div>}
         {cur.hl.length > 2 && <div style={{ width: 30, height: 30, borderRadius: 15, background: cur.hl === "cat" ? "var(--teal)" : "var(--surface)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 800 }}>t</div>}
      </div>
      <div style={{ background: "var(--surface)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", color: cur.match ? "var(--teal)" : "var(--text)", fontWeight: 700, marginTop: 16 }}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function RecursionVis() {
  const steps = [
    { level: 0, arrays: [["[38, 27, 43, 3, 9, 82, 10]"]], msg: "Start: unsorted array. Divide it in half." },
    { level: 1, arrays: [["[38, 27, 43]", "[3, 9, 82, 10]"]], msg: "Split into two halves." },
    { level: 2, arrays: [["[38]", "[27, 43]", "[3, 9]", "[82, 10]"]], msg: "Keep splitting recursively..." },
    { level: 3, arrays: [["[38]", "[27]", "[43]", "[3]", "[9]", "[82]", "[10]"]], msg: "Base case reached! Each sub-array has 1 element (already sorted)." },
    { level: 2, arrays: [["[38]", "[27, 43]", "[3, 9]", "[10, 82]"]], merge: [1, 3], msg: "Merge step: [27]+[43] → [27,43] | [82]+[10] → [10,82]" },
    { level: 1, arrays: [["[27, 38, 43]", "[3, 9, 10, 82]"]], merge: [0, 1], msg: "Merge: [38]+[27,43] → [27,38,43] | [3,9]+[10,82] → [3,9,10,82]" },
    { level: 0, arrays: [["[3, 9, 10, 27, 38, 43, 82]"]], merge: [0], msg: "Final merge complete! Array is sorted.", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const colors = ["var(--gold)", "var(--teal)", "#818CF8", "#E879F9", "#F87171", "#34D399", "#60A5FA"];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Merge Sort — Divide & Conquer</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", minHeight: 80, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          {cur.level === 3 ? "BASE CASE" : step >= 4 ? `MERGE (Level ${cur.level})` : `DIVIDE (Level ${cur.level})`}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {cur.arrays[0].map((arr, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 14, fontWeight: 800,
              background: cur.merge && cur.merge.includes(i) ? "var(--teal)" : cur.match ? "var(--teal)" : `${colors[i % colors.length]}20`,
              color: cur.merge && cur.merge.includes(i) ? "#000" : cur.match ? "#000" : colors[i % colors.length],
              border: `2px solid ${cur.match ? "var(--teal)" : colors[i % colors.length]}`,
              transition: "all 0.3s ease"
            }}>{arr}</div>
          ))}
        </div>
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function BitManipulationVis() {
  const nums = [4, 1, 2, 1, 2];
  const steps = [
    { idx: 0, result: 0, xorBin: "000", numBin: "100", resBin: "100", msg: "result = 0 ^ 4 = 4. Binary: 000 ^ 100 = 100" },
    { idx: 1, result: 4, xorBin: "100", numBin: "001", resBin: "101", msg: "result = 4 ^ 1 = 5. Binary: 100 ^ 001 = 101" },
    { idx: 2, result: 5, xorBin: "101", numBin: "010", resBin: "111", msg: "result = 5 ^ 2 = 7. Binary: 101 ^ 010 = 111" },
    { idx: 3, result: 7, xorBin: "111", numBin: "001", resBin: "110", msg: "result = 7 ^ 1 = 6. Binary: 111 ^ 001 = 110. (1s cancel!)" },
    { idx: 4, result: 6, xorBin: "110", numBin: "010", resBin: "100", msg: "result = 6 ^ 2 = 4. Binary: 110 ^ 010 = 100. Answer: 4!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  const BitRow = ({ label, bits, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 65, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {bits.split("").map((b, i) => (
          <div key={i} style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            background: b === "1" ? `${color}30` : "var(--surface)",
            color: b === "1" ? color : "var(--text-muted)",
            border: `2px solid ${b === "1" ? color : "var(--border)"}`,
            borderRadius: 6, fontSize: 16, fontWeight: 900, fontFamily: "monospace"
          }}>{b}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">XOR — Single Number</div>
      </div>
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.1em" }}>ARRAY</div>
          <div style={{ display: "flex", gap: 8 }}>
            {nums.map((v, i) => (
              <Box key={i} val={v} active={i === cur.idx} success={cur.match && v === 4} fade={i < cur.idx} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.1em" }}>BINARY XOR</div>
          <BitRow label="result" bits={cur.xorBin} color="var(--gold)" />
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, fontWeight: 900, margin: "2px 0", paddingLeft: 73 }}>XOR ^</div>
          <BitRow label={`nums[${cur.idx}]`} bits={cur.numBin} color="var(--teal)" />
          <div style={{ borderTop: "2px solid var(--border)", margin: "6px 0", marginLeft: 73 }} />
          <BitRow label="= result" bits={cur.resBin} color={cur.match ? "var(--teal)" : "#818CF8"} />
        </div>
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function BSTVis() {
  // BST:       8
  //          /   \
  //         3    10
  //        / \     \
  //       1   6    14
  const steps = [
    { n: null, order: [], msg: "Validate BST via In-Order traversal. Should produce sorted output." },
    { n: 1, order: [1], msg: "Visit leftmost node: 1. In-order: [1]" },
    { n: 3, order: [1, 3], msg: "Visit parent: 3. 3 > 1 ✓. In-order: [1, 3]" },
    { n: 6, order: [1, 3, 6], msg: "Visit right child: 6. 6 > 3 ✓. In-order: [1, 3, 6]" },
    { n: 8, order: [1, 3, 6, 8], msg: "Visit root: 8. 8 > 6 ✓. In-order: [1, 3, 6, 8]" },
    { n: 10, order: [1, 3, 6, 8, 10], msg: "Visit right subtree: 10. 10 > 8 ✓. In-order: [1, 3, 6, 8, 10]" },
    { n: 14, order: [1, 3, 6, 8, 10, 14], msg: "Visit rightmost: 14. 14 > 10 ✓. Valid BST!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];

  const visited = cur.order;
  const BSTNode = ({ id, x, y }) => (
    <div style={{
      position: "absolute", left: x, top: y, width: 32, height: 32, borderRadius: 16,
      background: cur.n === id ? "var(--gold)" : visited.includes(id) ? "var(--teal)" : "var(--surface)",
      border: `2px solid ${cur.n === id ? "var(--gold)" : visited.includes(id) ? "var(--teal)" : "var(--border)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: cur.n === id || visited.includes(id) ? "#000" : "var(--text)",
      fontWeight: 800, fontSize: 13, zIndex: 2,
      boxShadow: cur.n === id ? "0 0 12px var(--gold-glow)" : "none",
      transition: "all 0.3s ease"
    }}>{id}</div>
  );
  const BSTLine = ({ x1, y1, x2, y2 }) => (
    <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 1 }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-muted)" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">BST Validation — In-Order Traversal</div>
      </div>
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ position: "relative", height: 130, width: 220, margin: "0 auto" }}>
          <BSTLine x1={110} y1={16} x2={55} y2={56} />
          <BSTLine x1={110} y1={16} x2={165} y2={56} />
          <BSTLine x1={55} y1={56} x2={25} y2={96} />
          <BSTLine x1={55} y1={56} x2={85} y2={96} />
          <BSTLine x1={165} y1={56} x2={195} y2={96} />
          <BSTNode id={8} x={94} y={0} />
          <BSTNode id={3} x={39} y={40} />
          <BSTNode id={10} x={149} y={40} />
          <BSTNode id={1} x={9} y={80} />
          <BSTNode id={6} x={69} y={80} />
          <BSTNode id={14} x={179} y={80} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>IN-ORDER RESULT</div>
          <div style={{ display: "flex", gap: 4 }}>
            {cur.order.map((v, i) => (
              <Box key={i} val={v} success={cur.match} active={v === cur.n} style={{ width: 30, height: 30, fontSize: 13 }} />
            ))}
            {cur.order.length === 0 && <span style={{ color: "var(--dim)", fontStyle: "italic" }}>[ Empty ]</span>}
          </div>
        </div>
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function UnionFindVis() {
  const steps = [
    { parents: [0, 1, 2, 3, 4], components: 5, edges: [], hl: [], msg: "Initialize: 5 nodes, each is its own parent. Components = 5" },
    { parents: [0, 0, 2, 3, 4], components: 4, edges: [[0, 1]], hl: [0, 1], msg: "Union(0, 1): node 1's parent → 0. Components = 4" },
    { parents: [0, 0, 0, 3, 4], components: 3, edges: [[0, 1], [1, 2]], hl: [1, 2], msg: "Union(1, 2): Find(1)=0, Find(2)=2. Attach 2 → 0. Components = 3" },
    { parents: [0, 0, 0, 3, 3], components: 2, edges: [[0, 1], [1, 2], [3, 4]], hl: [3, 4], msg: "Union(3, 4): node 4's parent → 3. Components = 2" },
    { parents: [0, 0, 0, 0, 3], components: 1, edges: [[0, 1], [1, 2], [3, 4], [0, 3]], hl: [0, 3], msg: "Union(0, 3): merge the two components. Components = 1", match: true },
    { parents: [0, 0, 0, 0, 0], components: 1, edges: [[0, 1], [1, 2], [3, 4], [0, 3]], hl: [4], compress: true, msg: "Path Compression: Find(4) → 4→3→0. Flatten: 4 points directly to 0!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const nodePositions = [
    { x: 20, y: 20 },
    { x: 90, y: 5 },
    { x: 160, y: 20 },
    { x: 55, y: 75 },
    { x: 130, y: 75 }
  ];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Union-Find — Connected Components</div>
      </div>
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ position: "relative", height: 120, width: 210 }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}>
            {cur.edges.map(([a, b], i) => (
              <line key={i}
                x1={nodePositions[a].x + 16} y1={nodePositions[a].y + 16}
                x2={nodePositions[b].x + 16} y2={nodePositions[b].y + 16}
                stroke={cur.hl.includes(a) && cur.hl.includes(b) ? "var(--gold)" : "var(--text-muted)"}
                strokeWidth={cur.hl.includes(a) && cur.hl.includes(b) ? 3 : 2}
                strokeDasharray={cur.compress && ((a === 4 && b === 3) || (a === 3 && b === 4)) ? "4 4" : "none"}
              />
            ))}
            {cur.compress && (
              <line x1={nodePositions[4].x + 16} y1={nodePositions[4].y + 16}
                x2={nodePositions[0].x + 16} y2={nodePositions[0].y + 16}
                stroke="var(--teal)" strokeWidth={3} />
            )}
          </svg>
          {[0, 1, 2, 3, 4].map(id => (
            <div key={id} style={{
              position: "absolute", left: nodePositions[id].x, top: nodePositions[id].y,
              width: 32, height: 32, borderRadius: 16,
              background: cur.hl.includes(id) ? "var(--gold)" : cur.parents[id] === id ? "var(--teal)" : "var(--surface)",
              border: `2px solid ${cur.hl.includes(id) ? "var(--gold)" : "var(--border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: cur.hl.includes(id) || cur.parents[id] === id ? "#000" : "var(--text)",
              fontWeight: 800, fontSize: 14, zIndex: 2,
              boxShadow: cur.hl.includes(id) ? "0 0 12px var(--gold-glow)" : "none",
              transition: "all 0.3s ease"
            }}>{id}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>PARENT ARRAY</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {cur.parents.map((p, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{i}</span>
                <Box val={p} active={cur.hl.includes(i)} success={cur.parents[i] === i && cur.match} style={{ width: 28, height: 28, fontSize: 12 }} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: cur.components === 1 ? "var(--teal)" : "var(--gold)" }}>
            Components: {cur.components}
          </div>
        </div>
      </div>
      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

function IntervalsVis() {
  const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
  const steps = [
    { sorted: [[1, 3], [2, 6], [8, 10], [15, 18]], result: [[1, 3]], idx: 0, msg: "Sorted by start. Init result with first interval [1,3]." },
    { sorted: [[1, 3], [2, 6], [8, 10], [15, 18]], result: [[1, 6]], idx: 1, compare: [0, 1], msg: "[2,6]: start 2 ≤ end 3 → Overlap! Merge → [1, max(3,6)] = [1,6]" },
    { sorted: [[1, 3], [2, 6], [8, 10], [15, 18]], result: [[1, 6], [8, 10]], idx: 2, compare: [1, 2], msg: "[8,10]: start 8 > end 6 → No overlap. Add new interval." },
    { sorted: [[1, 3], [2, 6], [8, 10], [15, 18]], result: [[1, 6], [8, 10], [15, 18]], idx: 3, compare: [2, 3], msg: "[15,18]: start 15 > end 10 → No overlap. Add new interval. Done!", match: true }
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const scale = 12;
  const maxEnd = 20;
  const barColors = ["var(--gold)", "var(--teal)", "#818CF8", "#E879F9"];

  return (
    <div className="vis-arena">
      <div className="vis-arena-header">
        <div className="vis-arena-title">Merge Intervals</div>
      </div>

      {/* Timeline view */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>INPUT INTERVALS</div>
        <div style={{ position: "relative", height: intervals.length * 28 + 20, borderLeft: "2px solid var(--border)", marginLeft: 10, paddingLeft: 8 }}>
          {intervals.map(([s, e], i) => (
            <div key={i} style={{
              position: "absolute", top: i * 28 + 2,
              left: s * scale, width: (e - s) * scale, height: 22,
              background: cur.compare && cur.compare.includes(i) ? `${barColors[i]}` : `${barColors[i]}60`,
              border: `2px solid ${barColors[i]}`,
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: cur.compare && cur.compare.includes(i) ? "#000" : barColors[i],
              opacity: i <= cur.idx ? 1 : 0.3,
              transition: "all 0.3s ease"
            }}>[{s},{e}]</div>
          ))}
          {/* Timeline ticks */}
          <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, display: "flex" }}>
            {Array.from({ length: maxEnd + 1 }, (_, i) => i % 5 === 0 ? (
              <span key={i} style={{ position: "absolute", left: i * scale - 3, fontSize: 9, color: "var(--text-muted)" }}>{i}</span>
            ) : null)}
          </div>
        </div>
      </div>

      {/* Result */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>MERGED RESULT</div>
        <div style={{ display: "flex", gap: 8 }}>
          {cur.result.map(([s, e], i) => (
            <div key={i} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 800,
              background: cur.match ? "var(--teal)" : "var(--surface)",
              color: cur.match ? "#000" : "var(--teal)",
              border: `2px solid var(--teal)`,
              transition: "all 0.3s ease"
            }}>[{s}, {e}]</div>
          ))}
        </div>
      </div>

      <div className={`vis-msg ${cur.match ? 'done' : ''}`}>{cur.msg}</div>
      <Controls step={step} setStep={setStep} total={steps.length} />
    </div>
  );
}

export default function PatternVisualizer({ type }) {
  if (type === "two-pointers") return <TwoPointersVis />;
  if (type === "sliding-window") return <SlidingWindowVis />;
  if (type === "binary-search") return <BinarySearchVis />;
  if (type === "dp") return <DPVis />;
  if (type === "hashing") return <HashingVis />;
  if (type === "stack") return <StackVis />;
  if (type === "linked-list") return <LinkedListVis />;
  if (type === "backtracking") return <BacktrackingVis />;
  if (type === "tree-dfs") return <TreeDFSVis />;
  if (type === "tree-bfs") return <TreeBFSVis />;
  if (type === "graph") return <GraphVis />;
  if (type === "greedy") return <GreedyVis />;
  if (type === "heap") return <HeapVis />;
  if (type === "trie") return <TrieVis />;
  if (type === "recursion") return <RecursionVis />;
  if (type === "bit-manipulation") return <BitManipulationVis />;
  if (type === "bst") return <BSTVis />;
  if (type === "union-find") return <UnionFindVis />;
  if (type === "intervals") return <IntervalsVis />;
  
  return null;
}
