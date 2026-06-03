import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div style={{padding: 50, color: "red", background: "black"}}><h1>Something went wrong.</h1><pre>{this.state.error && this.state.error.toString()}</pre><pre>{this.state.error && this.state.error.stack}</pre></div>;
    }
    return this.props.children;
  }
}

import EditorComponent from "react-simple-code-editor";
const Editor = EditorComponent.default || EditorComponent;
import Prism from "prismjs";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-java.js";
import "prismjs/themes/prism-tomorrow.css";

/* ═══════════════════════════════════════════════════════════════
   LEETCODE PROBLEM LINKS — every DSA problem mapped to its URL
   ═══════════════════════════════════════════════════════════════ */
import { PLAN as DEFAULT_PLAN, LC, PHASES, TAG_META, DIFF_META, CAT_COLORS } from "./data.js";
import { getPatternData } from "./patterns.js";
import PatternVisualizer from "./PatternVisualizer.jsx";


/* ═══════════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════════ */
const I = {
  Check:({s=16})=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Close:({s=18})=><svg width={s} height={s} viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Sun:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Fire:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c0 0-5 4-5 10a5 5 0 0 0 10 0c0-2-1-4-2-5 0 2-1 3-2 3-1 0-2-1-2-2 0-3 1-4 1-6z"/></svg>,
  Grid:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  List:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Chart:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Search:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Note:({s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Timer:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 3"/><path d="M9 3h6M12 1v2"/></svg>,
  Download:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Reset:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Link:({s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Target:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Zap:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Ext:({s=12})=><svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 10L14 2M14 2H9M14 2v5M12 9v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4"/></svg>,
  Play:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Users:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
};

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */
function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)); }, [key, val]);
  return [val, setVal];
}

function useTheme() {
  const [theme, setTheme] = useLocalStorage("dsa45-theme", "dark");
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");
  return { theme, toggle };
}

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running) ref.current = setInterval(() => setSeconds(s => s + 1), 1000);
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);
  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return { seconds, running, setRunning, fmt, reset: () => { setSeconds(0); setRunning(false); } };
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function spawnConfetti() {
  const colors = ["#F5B731","#2DD4BF","#818CF8","#F87171","#E879F9","#34D399","#60A5FA"];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div"); el.className = "confetti-particle";
    el.style.left = Math.random()*100+"vw"; el.style.top = "-10px";
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDelay = Math.random()*0.8+"s";
    el.style.animationDuration = 1.5+Math.random()*1.5+"s";
    el.style.width = 6+Math.random()*8+"px"; el.style.height = 6+Math.random()*8+"px";
    el.style.borderRadius = Math.random()>0.5?"50%":"2px";
    document.body.appendChild(el); setTimeout(()=>el.remove(),3000);
  }
}

/* Renders a task name, auto-linking to LeetCode if found in the LC map */
function TaskItem({ text, checked, onToggle, accent }) {
  const url = LC[text];
  return (
    <div style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
      <div className={`task-check ${checked?"checked":""}`} onClick={(e)=>{e.stopPropagation();onToggle();}}>
        {checked && <I.Check s={12}/>}
      </div>
      <span style={{ fontSize:14, color: checked ? "var(--text-muted)" : "var(--text-secondary)", lineHeight:1.6, fontWeight:500, textDecoration: checked?"line-through":"none", flex:1 }}>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="task-link" onClick={e=>e.stopPropagation()} style={{ color: checked ? "var(--text-muted)" : accent }}>
            {text} <I.Ext s={10}/>
          </a>
        ) : text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );}

// ═════════════════════════════════════════════════════════
// LOGIN SCREEN COMPONENT
// ═════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError("Please fill out all fields.");
      return;
    }
    
    // Mock Authentication Logic
    const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
    
    if (isRegister) {
      if (users[email]) {
        setError("Account already exists with this email.");
        return;
      }
      users[email] = { name, password };
      localStorage.setItem("mock_users", JSON.stringify(users));
      onLogin({ email, name });
    } else {
      if (!users[email] || users[email].password !== password) {
        setError("Invalid email or password.");
        return;
      }
      onLogin({ email, name: users[email].name });
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"radial-gradient(circle at center, var(--surface) 0%, var(--bg) 100%)" }}>
      <div className="fade-in-up" style={{ width:"100%", maxWidth:400, background:"var(--card)", border:"1px solid var(--border)", borderRadius:24, padding:40, boxShadow:"var(--shadow-lg)", position:"relative", overflow:"hidden" }}>
        
        {/* Decorative elements */}
        <div style={{ position:"absolute", top:-50, right:-50, width:150, height:150, background:"var(--gold-glow)", borderRadius:"50%", filter:"blur(40px)" }}/>
        <div style={{ position:"absolute", bottom:-50, left:-50, width:150, height:150, background:"var(--teal-glow)", borderRadius:"50%", filter:"blur(40px)" }}/>

        <div style={{ textAlign:"center", marginBottom:30, position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:60, height:60, borderRadius:16, background:"var(--dim)", color:"var(--gold)", marginBottom:16, border:"1px solid var(--border)" }}>
            <I.Zap s={30} />
          </div>
          <h1 style={{ fontSize:24, fontWeight:900 }}>{isRegister ? "Create Account" : "Welcome Back"}</h1>
          <p style={{ color:"var(--text-secondary)", fontSize:14, marginTop:8 }}>
            {isRegister ? "Join the 60 Days Mastery Challenge." : "Log in to continue your progress."}
          </p>
        </div>

        {error && (
          <div className="fade-in" style={{ padding:"12px 16px", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:12, color:"var(--red)", fontSize:13, fontWeight:600, marginBottom:20, textAlign:"center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16, position:"relative" }}>
          {isRegister && (
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-secondary)", marginBottom:6, letterSpacing:"0.05em" }}>NAME</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" style={{ width:"100%", padding:"12px 16px", borderRadius:12, background:"var(--input-bg)", border:"1px solid var(--border)", color:"var(--text)", outline:"none" }} />
            </div>
          )}
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-secondary)", marginBottom:6, letterSpacing:"0.05em" }}>EMAIL</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hello@example.com" style={{ width:"100%", padding:"12px 16px", borderRadius:12, background:"var(--input-bg)", border:"1px solid var(--border)", color:"var(--text)", outline:"none" }} />
          </div>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-secondary)", marginBottom:6, letterSpacing:"0.05em" }}>PASSWORD</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{ width:"100%", padding:"12px 16px", borderRadius:12, background:"var(--input-bg)", border:"1px solid var(--border)", color:"var(--text)", outline:"none" }} />
          </div>
          
          <button type="submit" className="btn" style={{ width:"100%", padding:14, borderRadius:12, background:"var(--text)", color:"var(--bg)", fontSize:15, fontWeight:800, marginTop:10 }}>
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div style={{ display:"flex", alignItems:"center", gap:16, margin:"24px 0" }}>
          <div style={{ flex:1, height:1, background:"var(--border)" }}/>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.05em" }}>OR</div>
          <div style={{ flex:1, height:1, background:"var(--border)" }}/>
        </div>

        <button className="btn" onClick={() => {
          // Mock Google Auth
          const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
          users["google@demo.com"] = { name: "Google User", password: "oauth-bypass" };
          localStorage.setItem("mock_users", JSON.stringify(users));
          onLogin({ email: "google@demo.com", name: "Google User" });
        }} style={{ width:"100%", padding:14, borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:15, fontWeight:800, display:"flex", justifyContent:"center", gap:12 }}>
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign:"center", marginTop:24, position:"relative" }}>
          <span style={{ fontSize:14, color:"var(--text-muted)" }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }} style={{ background:"none", border:"none", color:"var(--gold)", fontSize:14, fontWeight:700, cursor:"pointer", marginLeft:8, padding:0 }}>
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState("grid");
  const [activePhase, setActivePhase] = useState(0);
  const [customPlan, setCustomPlan] = useLocalStorage("dsa_plan", DEFAULT_PLAN);
  const [completed, setCompleted] = useLocalStorage("dsa_completed", {});
  const [notes, setNotes] = useLocalStorage("dsa45-notes", {});
  const [taskChecks, setTaskChecks] = useLocalStorage("dsa45-tasks", {});
  const [quizScores, setQuizScores] = useLocalStorage("dsa60-quizzes", {});
  const [exp, setExp] = useLocalStorage("dsa60-exp", 0);
  const [unlockedBadges, setUnlockedBadges] = useLocalStorage("dsa60-badges", {});
  const [modal, setModal] = useState(null);
  const [modalTab, setModalTab] = useState("tasks");

  const [srsData, setSrsData] = useLocalStorage("dsa60-srs", {});
  const [codeLang, setCodeLang] = useState("javascript");
  const [code, setCode] = useState("// Write your JavaScript here\nconsole.log('Hello, World!');");
  const [codeOutput, setCodeOutput] = useState("");

  const LANGUAGES = useMemo(() => ({
    javascript: { label: "JavaScript", prism: "javascript", piston: "javascript", version: "18.15.0", defaultCode: "// Write your JavaScript here\nconsole.log('Hello, World!');" },
    python: { label: "Python", prism: "python", piston: "python", version: "3.10.0", defaultCode: "# Write your Python here\nprint('Hello, World!')" },
    cpp: { label: "C++", prism: "cpp", piston: "c++", version: "10.2.0", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World!\";\n    return 0;\n}" },
    java: { label: "Java", prism: "java", piston: "java", version: "15.0.2", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}" }
  }), []);
  const [builderCode, setBuilderCode] = useState(() => JSON.stringify(DEFAULT_PLAN, null, 2));
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [draftNote, setDraftNote] = useState("");

  const [fcFlipped, setFcFlipped] = useState(false);
  const [mockRunning, setMockRunning] = useState(false);
  const [mockTime, setMockTime] = useState(45*60);
  const [mockQ, setMockQ] = useState(null);
  const mockIntervalRef = useRef(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const timer = useTimer();
  const searchRef = useRef(null);
  const fileInputRef = useRef(null);
  const statsRef = useRef(null);

  /* keyboard */
  useEffect(() => {
    const h = (e) => {
      if (e.key==="Escape") { setModal(null); setShowSearch(false); }
      if ((e.ctrlKey||e.metaKey)&&e.key==="k") { e.preventDefault(); setShowSearch(s=>!s); }
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  }, []);

  useEffect(() => { if (showSearch && searchRef.current) searchRef.current.focus(); }, [showSearch]);

  const toggle = useCallback((day, e) => {
    e?.stopPropagation();
    setCompleted(p => { const next={...p,[day]:!p[day]}; if(!p[day]) { setTimeout(spawnConfetti,100); setExp(e => e + 50); } return next; });
  }, [setCompleted, setExp]);

  const toggleTask = useCallback((day, session, idx) => {
    const key = `${day}-${session}-${idx}`;
    setTaskChecks(p => { const next = {...p, [key]: !p[key]}; if(next[key]) setExp(e => e + 10); return next; });
  }, [setTaskChecks, setExp]);

  /* computed */
  const level = Math.floor(Math.sqrt(exp / 100)) + 1;
  const currentLevelExp = Math.pow(level - 1, 2) * 100;
  const nextLevelExp = Math.pow(level, 2) * 100;
  const levelProgress = ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

  const totalDone = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((totalDone/60)*100);
  const streak = (()=>{ let s=0; for(let d=60;d>=1;d--){if(completed[d])s++;else if(s>0)break;} return s; })();
  const phaseProg = (pid) => { const pd=customPlan.filter(d=>d.phase===pid); const done=pd.filter(d=>completed[d.day]).length; return{done,total:pd.length,pct:Math.round((done/pd.length)*100)}; };
  const nextDay = customPlan.find(d => !completed[d.day]) || customPlan[0];

  const totalTasks = customPlan.reduce((a,d) => a+d.morning.tasks.length+d.evening.tasks.length, 0);
  const doneTasks = Object.values(taskChecks).filter(Boolean).length;

  const BADGES = useMemo(() => [
    { id: "first_blood", label: "First Step", desc: "Complete your first day", condition: () => totalDone > 0, icon: "🎯" },
    { id: "streak_7", label: "On Fire", desc: "Maintain a 7-day streak", condition: () => streak >= 7, icon: "🔥" },
    { id: "phase_1", label: "Phase I Master", desc: "Complete Phase I", condition: () => phaseProg(1).pct === 100, icon: "🥉" },
    { id: "phase_2", label: "Phase II Master", desc: "Complete Phase II", condition: () => phaseProg(2).pct === 100, icon: "🥈" },
    { id: "phase_3", label: "Phase III Master", desc: "Complete Phase III", condition: () => phaseProg(3).pct === 100, icon: "🥇" },
    { id: "phase_4", label: "Grandmaster", desc: "Complete the entire curriculum", condition: () => totalDone === 60, icon: "👑" },
    { id: "quiz_master", label: "Flawless", desc: "Score 100% on any Quiz", condition: () => Object.values(quizScores).some(q => q.score === q.total && q.total > 0), icon: "🧠" },
    { id: "halfway", label: "Halfway There", desc: "Complete 30 Days", condition: () => totalDone >= 30, icon: "⭐" },
  ], [totalDone, streak, quizScores, phaseProg]);

  useEffect(() => {
    let changed = false;
    const next = { ...unlockedBadges };
    BADGES.forEach(b => { if (!next[b.id] && b.condition()) { next[b.id] = true; changed = true; } });
    if (changed) { setUnlockedBadges(next); setTimeout(spawnConfetti, 100); }
  }, [BADGES, unlockedBadges, setUnlockedBadges]);

  const filteredDays = (()=>{
    let days = activePhase===0 ? customPlan : customPlan.filter(d=>d.phase===activePhase);
    if (search.trim()) {
      const q=search.toLowerCase();
      days=days.filter(d=>d.morning.label.toLowerCase().includes(q)||d.evening.label.toLowerCase().includes(q)||d.morning.tasks.some(t=>t.toLowerCase().includes(q))||d.evening.tasks.some(t=>t.toLowerCase().includes(q))||d.tag.toLowerCase().includes(q)||String(d.day)===q);
    }
    return days;
  })();

  const allFlashcards = useMemo(()=> {
    let cards = [];
    customPlan.forEach(d => { if(d.quiz) cards.push(...d.quiz.map(q=>({q:q.q, a:q.exp, day:d.day}))); });
    return cards;
  }, [customPlan]);

  const srsCards = useMemo(() => {
    const now = Date.now();
    return allFlashcards
      .map((c, i) => {
        const srs = srsData[i] || { nextReview: 0, interval: 0, ease: 2.5 };
        return { ...c, id: i, srs };
      })
      .filter(c => c.srs.nextReview <= now)
      .sort((a,b) => a.srs.nextReview - b.srs.nextReview);
  }, [allFlashcards, srsData]);

  const weeks = Array.from({length:12},(_,i)=>customPlan.slice(i*5,i*5+5));
  const openModal = (d) => { setModal(d); setModalTab("tasks"); setDraftNote(notes[d.day]||""); setQuizAnswers({}); setShowQuizResult(false); timer.reset(); };

  const exportProgress = () => {
    const data={completed,notes,taskChecks,exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="dsa45-progress.json"; a.click(); URL.revokeObjectURL(url);
  };
  const exportImage = async () => {
    if (!statsRef.current) return;
    try {
      const canvas = await html2canvas(statsRef.current, { backgroundColor: "#09090b", scale: 2 });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a"); a.href = url; a.download = "dsa60-stats.png"; a.click();
    } catch(err) { console.error("Export failed", err); }
  };
  const exportPDF = async () => {
    if (!statsRef.current) return;
    try {
      const canvas = await html2canvas(statsRef.current, { backgroundColor: "#09090b", scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dsa60-portfolio.pdf");
    } catch(err) { console.error("PDF Export failed", err); }
  };
  const importProgress = (e) => {
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{ try{ const data=JSON.parse(ev.target.result); if(data.completed)setCompleted(data.completed); if(data.notes)setNotes(data.notes); if(data.taskChecks)setTaskChecks(data.taskChecks); }catch{} };
    reader.readAsText(file); e.target.value="";
  };
  const resetAll = () => { if(confirm("Reset all progress? This cannot be undone.")){setCompleted({});setNotes({});setTaskChecks({});} };

  if (!user) {
    return <LoginScreen onLogin={(u) => {
      localStorage.setItem("auth_user", JSON.stringify(u));
      setUser(u);
    }} />
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>

      {/* ═══ NAV ═══ */}
      <nav style={{ background:"var(--nav-bg)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <div className="nav-inner" style={{ maxWidth:1280, margin:"0 auto", padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>

          {/* brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#F5B731,#2DD4BF)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"#000" }}>60</div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>DSA + Full-Stack</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", fontWeight:500 }}>60-Day Mastery Plan</div>
            </div>
          </div>

          {/* view tabs */}
          <div style={{ display:"flex", gap:4, background:"var(--dim)", borderRadius:10, padding:3, border:"1px solid var(--border)", overflowX:"auto" }}>
            {[["grid","Grid",<I.Grid s={14} key="g"/>],["week","Weekly",<I.List s={14} key="w"/>],["stats","Stats",<I.Chart s={14} key="s"/>],["trophies","Trophies",<I.Target s={14} key="t"/>],["flashcards","Flashcards",<I.Note s={14} key="f"/>],["interview","Mock",<I.Zap s={14} key="m"/>],["squads","Squads",<I.Users s={14} key="sq"/>],["builder","Builder",<I.List s={14} key="b"/>]].map(([v,label,icon])=>(
              <button key={v} className="btn" onClick={()=>setView(v)} style={{
                display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:600,
                background:view===v?"var(--card)":"transparent",color:view===v?"var(--gold)":"var(--text-muted)",
                boxShadow:view===v?"var(--shadow-sm)":"none",
              }}>{icon}{label}</button>
            ))}
          </div>

          {/* right section */}
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", justifyContent:"flex-end" }}>
            
            <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 14px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg, var(--gold), var(--orange))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#000" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{user?.name}</span>
            </div>

            <button className="btn hide-mobile" onClick={() => {
              localStorage.removeItem("auth_user");
              setUser(null);
            }} style={{ background:"transparent", color:"var(--text-muted)", fontSize:12, padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8 }}>
              Sign Out
            </button>

            {/* search */}
            <button className="btn" onClick={()=>setShowSearch(s=>!s)} style={{ background:showSearch?"var(--gold-glow)":"transparent",color:showSearch?"var(--gold)":"var(--text-muted)",padding:8,borderRadius:8,border:`1px solid ${showSearch?"var(--gold)":"var(--border)"}` }}>
              <I.Search s={16}/>
            </button>

            {/* theme toggle */}
            <div className={`theme-toggle ${theme==="light"?"light":""}`} onClick={toggleTheme} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}>
              <div className="toggle-knob">
                {theme==="dark" ? <I.Moon s={11}/> : <I.Sun s={11}/>}
              </div>
            </div>

            {/* level & exp */}
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(245,183,49,0.05)", padding:"4px 12px 4px 6px", borderRadius:12, border:"1px solid var(--gold-glow)" }}>
              <div style={{ width:30, height:30, borderRadius:8, background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#000" }}>L{level}</div>
              <div className="hide-mobile">
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.05em" }}>EXP</span>
                  <span style={{ fontSize:10, fontWeight:700, color:"var(--gold)" }}>{exp} / {nextLevelExp}</span>
                </div>
                <div style={{ width:100, height:6, background:"var(--dim)", borderRadius:10, overflow:"hidden", border:"1px solid rgba(245,183,49,0.2)" }}>
                  <div style={{ width:`${levelProgress}%`, height:"100%", background:"var(--gold)", borderRadius:10, transition:"width .5s ease" }}/>
                </div>
              </div>
            </div>

            {/* streak */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ color:"var(--orange)" }}><I.Fire s={20}/></span>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:streak>0?"var(--orange)":"var(--text-muted)", lineHeight:1 }}>{streak}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)", fontWeight:500 }}>streak</div>
              </div>
            </div>

            {/* progress */}
            <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:80, height:6, background:"var(--dim)", borderRadius:10, overflow:"hidden", border:"1px solid var(--border)" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#F5B731,#2DD4BF,#818CF8)", borderRadius:10, transition:"width .5s ease" }}/>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:pct===100?"var(--green)":"var(--gold)", minWidth:44 }}>{totalDone}/60</span>
            </div>
          </div>
        </div>

        {/* search bar */}
        {showSearch && (
          <div className="fade-in" style={{ borderTop:"1px solid var(--border)", padding:"12px 28px", maxWidth:1280, margin:"0 auto" }}>
            <div style={{ position:"relative", maxWidth:500 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }}><I.Search s={16}/></span>
              <input ref={searchRef} type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search topics, patterns, or problems... (Ctrl+K)"
                style={{ paddingLeft:42 }}
              />
              {search && <button className="btn" onClick={()=>setSearch("")} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",color:"var(--text-muted)",padding:4 }}><I.Close s={14}/></button>}
            </div>
          </div>
        )}
      </nav>

      {/* ═══ MAIN ═══ */}
      <main style={{ maxWidth:1280, margin:"0 auto", padding:"24px 28px 80px" }}>

        {/* schedule banner */}
        {view !== "stats" && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:8, background:"rgba(245,183,49,0.06)", border:"1px solid rgba(245,183,49,0.15)" }}>
              <I.Sun s={14}/><span style={{ fontSize:13, color:"var(--gold)", fontWeight:600 }}>Morning = DSA (1–1.5 hrs)</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:8, background:"rgba(45,212,191,0.06)", border:"1px solid rgba(45,212,191,0.15)" }}>
              <I.Moon s={14}/><span style={{ fontSize:13, color:"var(--teal)", fontWeight:600 }}>Evening = Dev/Build (1.5–2 hrs)</span>
            </div>
          </div>
        )}

        {/* ═══ TODAY'S FOCUS ═══ */}
        {view==="grid" && !search && (
          <div onClick={()=>openModal(nextDay)} className="fade-in-up" style={{
            background:`linear-gradient(135deg,${PHASES[nextDay.phase-1].glow},var(--surface))`,
            border:`1px solid ${PHASES[nextDay.phase-1].accent}30`, borderRadius:16, padding:"24px 28px",
            marginBottom:24, cursor:"pointer", position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${PHASES[nextDay.phase-1].accent},transparent)` }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ color:PHASES[nextDay.phase-1].accent }}><I.Target s={18}/></span>
                  <span style={{ fontSize:12, fontWeight:700, color:PHASES[nextDay.phase-1].accent, letterSpacing:"0.1em" }}>TODAY'S FOCUS — DAY {nextDay.day}</span>
                  <span className={DIFF_META[nextDay.diff].cls}>{DIFF_META[nextDay.diff].label}</span>
                </div>
                <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginBottom:6 }}>☀️ {nextDay.morning.label}</div>
                <div style={{ fontSize:16, fontWeight:600, color:"var(--teal)", marginBottom:8 }}>🌙 {nextDay.evening.label}</div>
                <div style={{ fontSize:13, color:"var(--text-secondary)", maxWidth:550, lineHeight:1.6 }}>{nextDay.note}</div>
              </div>
              <button className="btn" onClick={e=>toggle(nextDay.day,e)} style={{
                padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:700,
                background:completed[nextDay.day]?`${PHASES[nextDay.phase-1].accent}20`:`${PHASES[nextDay.phase-1].accent}10`,
                border:`1px solid ${PHASES[nextDay.phase-1].accent}`, color:PHASES[nextDay.phase-1].accent,
              }}>{completed[nextDay.day]?"✓ Completed":"Mark Complete"}</button>
            </div>
          </div>
        )}

        {/* ═══ GRID VIEW ═══ */}
        {view==="grid" && (
          <>
            {/* phase selector */}
            <div className="phase-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
              {PHASES.map(ph => {
                const pg = phaseProg(ph.id); const active = activePhase===ph.id;
                return (
                  <button key={ph.id} className="btn" onClick={()=>setActivePhase(active?0:ph.id)} style={{
                    background:active?ph.glow:"var(--surface)", border:`1px solid ${active?ph.accent:"var(--border)"}`,
                    borderRadius:14, padding:"16px 20px", textAlign:"left", display:"block", width:"100%",
                    boxShadow:active?`0 0 20px ${ph.glow}`:"none",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:16, fontWeight:800, color:active?ph.accent:"var(--text)" }}>{ph.label}</div>
                        <div style={{ fontSize:13, color:active?`${ph.accent}BB`:"var(--text-muted)", marginTop:3, fontWeight:500 }}>{ph.sub}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:20, fontWeight:800, color:active?ph.accent:"var(--text-secondary)" }}>{pg.pct}%</div>
                        <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{ph.days}</div>
                      </div>
                    </div>
                    <div style={{ height:4, background:"var(--dim)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ width:`${pg.pct}%`, height:"100%", background:ph.accent, borderRadius:4, transition:"width .5s ease" }}/>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* tags + search results */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20, alignItems:"center" }}>
              {Object.entries(TAG_META).map(([k,v])=>(
                <span key={k} style={{ fontSize:12, padding:"5px 12px", borderRadius:6, background:v.bg, color:v.color, border:`1px solid ${v.color}25`, fontWeight:600 }}>{v.label}</span>
              ))}
              {search && <span style={{ fontSize:14, color:"var(--text-muted)", fontWeight:500, marginLeft:8 }}>{filteredDays.length} result{filteredDays.length!==1?"s":""}</span>}
            </div>

            {/* cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:12 }}>
              {filteredDays.map((d,i) => {
                const ph=PHASES[d.phase-1]; const tm=TAG_META[d.tag]; const done=!!completed[d.day]; const hasNote=!!(notes[d.day]?.trim()); const isNext=d.day===nextDay.day; const dm=DIFF_META[d.diff];
                return (
                  <div key={d.day} className={`day-card fade-in-up ${done?"completed":""}`}
                    style={{ animationDelay:`${Math.min(i*.03,.5)}s`, borderColor:isNext?`${ph.accent}50`:done?`${ph.accent}25`:undefined, boxShadow:isNext?`0 0 20px ${ph.glow}`:undefined }}
                    onClick={()=>openModal(d)}>
                    <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${ph.accent},${ph.accent}40)`,borderRadius:"12px 12px 0 0" }}/>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, marginTop:4 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:done?ph.accent:"var(--text-secondary)", letterSpacing:"0.05em" }}>DAY {d.day}</span>
                        {isNext&&!done&&<span style={{ fontSize:10,padding:"2px 8px",borderRadius:4,background:`${ph.accent}15`,color:ph.accent,fontWeight:700,animation:"pulse 2s ease-in-out infinite" }}>NEXT</span>}
                        <span className={dm.cls}>{dm.label}</span>
                      </div>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        {hasNote&&<span style={{ color:"var(--teal)", display:"flex" }}><I.Note s={12}/></span>}
                        <span style={{ fontSize:11, padding:"3px 10px", borderRadius:5, background:tm.bg, color:tm.color, fontWeight:700 }}>{tm.label}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:"var(--gold)", marginBottom:6, lineHeight:1.4 }}>☀️ {d.morning.label}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--teal)", marginBottom:16, lineHeight:1.4 }}>🌙 {d.evening.label}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:500 }}>
                        {d.morning.tasks.length+d.evening.tasks.length} tasks · {d.links?.length||0} resources
                      </span>
                      <button className="btn" onClick={e=>toggle(d.day,e)} style={{
                        width:28,height:28,borderRadius:7,background:done?`${ph.accent}20`:"var(--dim)",
                        border:`2px solid ${done?ph.accent:"var(--border)"}`,color:done?ph.accent:"var(--text-muted)",
                      }}>{done&&<I.Check s={14}/>}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ═══ WEEKLY VIEW ═══ */}
        {view==="week" && (
          <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
            {weeks.map((wk,wi)=>{ const wkDone=wk.filter(d=>completed[d.day]).length;
              return (
                <div key={wi} className="fade-in-up" style={{ animationDelay:`${wi*0.05}s` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                    <span style={{ fontSize:14, fontWeight:800, color:"var(--text)", letterSpacing:"0.1em" }}>WEEK {wi+1}</span>
                    <div style={{ flex:1, height:1, background:"var(--border)" }}/>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:60, height:4, background:"var(--dim)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ width:`${(wkDone/wk.length)*100}%`, height:"100%", background:"var(--gold)", borderRadius:4, transition:"width .4s ease" }}/>
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color:wkDone===wk.length?"var(--green)":"var(--text-muted)" }}>{wkDone}/{wk.length}</span>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
                    {wk.map(d => {
                      const ph=PHASES[d.phase-1]; const tm=TAG_META[d.tag]; const done=!!completed[d.day];
                      return (
                        <div key={d.day} className="day-card" style={{ padding:"18px 20px", opacity:done?.5:1 }} onClick={()=>openModal(d)}>
                          <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:ph.accent,borderRadius:"12px 12px 0 0" }}/>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, marginTop:4 }}>
                            <span style={{ fontSize:18, fontWeight:800, color:done?ph.accent:"var(--text)" }}>Day {d.day}</span>
                            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                              <span className={DIFF_META[d.diff].cls}>{DIFF_META[d.diff].label}</span>
                              <span style={{ fontSize:11,padding:"3px 10px",borderRadius:5,background:tm.bg,color:tm.color,fontWeight:700 }}>{tm.label}</span>
                            </div>
                          </div>
                          <div style={{ marginBottom:8 }}>
                            <div style={{ fontSize:11,fontWeight:700,color:"var(--gold)",letterSpacing:"0.08em",marginBottom:4 }}>☀️ MORNING</div>
                            <div style={{ fontSize:14,color:"var(--text-secondary)",fontWeight:600,lineHeight:1.45 }}>{d.morning.label}</div>
                          </div>
                          <div style={{ marginBottom:12 }}>
                            <div style={{ fontSize:11,fontWeight:700,color:"var(--teal)",letterSpacing:"0.08em",marginBottom:4 }}>🌙 EVENING</div>
                            <div style={{ fontSize:14,color:"var(--text-secondary)",fontWeight:600,lineHeight:1.45 }}>{d.evening.label}</div>
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:12, color:"var(--text-muted)" }}>{d.links?.length||0} resources</span>
                            <button className="btn" onClick={e=>toggle(d.day,e)} style={{
                              width:28,height:28,borderRadius:7,background:done?`${ph.accent}20`:"var(--dim)",
                              border:`2px solid ${done?ph.accent:"var(--border)"}`,color:done?ph.accent:"var(--text-muted)",
                            }}>{done&&<I.Check s={14}/>}</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ STATS VIEW ═══ */}
        {view==="stats" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div ref={statsRef} style={{ display:"flex", flexDirection:"column", gap:20, padding:"20px", background:"var(--bg)", borderRadius:"16px" }}>
            {/* stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
              {[
                {label:"DAYS DONE",val:`${totalDone}/60`,color:"var(--gold)",icon:<I.Check s={20}/>},
                {label:"OVERALL",val:`${pct}%`,color:"var(--teal)",icon:<I.Chart s={20}/>},
                {label:"STREAK",val:`${streak} day${streak!==1?"s":""}`,color:"var(--orange)",icon:<I.Fire s={20}/>},
                {label:"TASKS DONE",val:`${doneTasks}/${totalTasks}`,color:"var(--purple)",icon:<I.Zap s={20}/>},
                {label:"QUIZZES DONE",val:`${Object.keys(quizScores).length}/60`,color:"#FBBF24",icon:<I.Target s={20}/>},
                {label:"PHASE I",val:`${phaseProg(1).pct}%`,color:PHASES[0].accent,icon:null},
                {label:"PHASE II",val:`${phaseProg(2).pct}%`,color:PHASES[1].accent,icon:null},
                {label:"PHASE III",val:`${phaseProg(3).pct}%`,color:PHASES[2].accent,icon:null},
                {label:"PHASE IV",val:`${phaseProg(4).pct}%`,color:PHASES[3].accent,icon:null},
                {label:"NOTES",val:`${Object.values(notes).filter(n=>n?.trim()).length}`,color:"var(--teal)",icon:<I.Note s={20}/>},
              ].map(s=>(
                <div key={s.label} className="fade-in-up" style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"20px 22px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:700, letterSpacing:"0.12em" }}>{s.label}</span>
                    {s.icon && <span style={{ color:s.color, opacity:0.6 }}>{s.icon}</span>}
                  </div>
                  <div style={{ fontSize:32, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* heatmap */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"0.08em", marginBottom:20 }}>COMPLETION HEATMAP</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {customPlan.map(d => { const ph=PHASES[d.phase-1]; const done=!!completed[d.day];
                  return (
                    <div key={d.day} title={`Day ${d.day}: ${d.morning.label}`} onClick={()=>openModal(d)}
                      style={{ width:38,height:38,borderRadius:8,cursor:"pointer",background:done?ph.accent:"var(--dim)",
                        border:`1px solid ${done?`${ph.accent}60`:"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:12,fontWeight:700,color:done?"var(--check-dark)":"var(--text-muted)",transition:"all .15s ease",opacity:done?1:.5,
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.15)";e.currentTarget.style.opacity="1";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.opacity=done?"1":"0.5";}}
                    >{d.day}</div>
                  );
                })}
              </div>
              <div style={{ display:"flex", gap:20, marginTop:16, flexWrap:"wrap" }}>
                {PHASES.map(ph=>(<div key={ph.id} style={{ display:"flex",alignItems:"center",gap:8 }}><div style={{ width:14,height:14,borderRadius:4,background:ph.accent }}/><span style={{ fontSize:13,color:"var(--text-secondary)",fontWeight:500 }}>{ph.label}</span></div>))}
              </div>
            </div>

            {/* phase bars */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"0.08em", marginBottom:20 }}>PHASE BREAKDOWN</div>
              {PHASES.map(ph => { const pg=phaseProg(ph.id);
                return (<div key={ph.id} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{ph.label} — {ph.sub}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:ph.accent }}>{pg.done}/{pg.total} ({pg.pct}%)</span>
                  </div>
                  <div style={{ height:8, background:"var(--dim)", borderRadius:6, overflow:"hidden" }}>
                    <div style={{ width:`${pg.pct}%`, height:"100%", background:ph.accent, borderRadius:6, transition:"width .5s ease" }}/>
                  </div>
                </div>);
              })}
            </div>
            </div>

            {/* notes */}
            {Object.keys(notes).filter(k=>notes[k]?.trim()).length>0 && (
              <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"24px 28px" }}>
                <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"0.08em", marginBottom:20 }}>YOUR NOTES</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {Object.entries(notes).filter(([,v])=>v?.trim()).map(([day,note])=>{
                    const d=customPlan.find(x=>x.day===+day); if(!d)return null; const ph=PHASES[d.phase-1];
                    return (<div key={day} className="day-card" style={{ padding:"16px 20px" }} onClick={()=>openModal(d)}>
                      <div style={{ fontSize:13,fontWeight:700,color:ph.accent,letterSpacing:"0.06em",marginBottom:8 }}>DAY {day} — {d.morning.label}</div>
                      <div style={{ fontSize:14,color:"var(--text-secondary)",whiteSpace:"pre-wrap",lineHeight:1.7 }}>{note}</div>
                    </div>);
                  })}
                </div>
              </div>
            )}

            {/* data management */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"0.08em", marginBottom:16 }}>DATA MANAGEMENT</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button className="btn" onClick={exportProgress} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,background:"rgba(45,212,191,0.08)",border:"1px solid rgba(45,212,191,0.3)",color:"var(--teal)" }}><I.Download s={14}/>Export Data</button>
                <button className="btn" onClick={exportImage} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,background:"rgba(245,183,49,0.08)",border:"1px solid rgba(245,183,49,0.3)",color:"var(--gold)" }}><I.Download s={14}/>Export Image</button>
                <button className="btn" onClick={exportPDF} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,background:"rgba(245,183,49,0.08)",border:"1px solid rgba(245,183,49,0.3)",color:"var(--gold)" }}><I.Download s={14}/>Export PDF</button>
                <button className="btn" onClick={()=>fileInputRef.current?.click()} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,background:"rgba(129,140,248,0.08)",border:"1px solid rgba(129,140,248,0.3)",color:"var(--purple)" }}><I.Upload s={14}/>Import Data</button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={importProgress} style={{ display:"none" }}/>
                <button className="btn" onClick={resetAll} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.3)",color:"var(--red)" }}><I.Reset s={14}/>Reset All</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TROPHIES VIEW ═══ */}
        {view==="trophies" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:16, maxWidth:1280, margin:"0 auto", padding:"28px" }}>
            {BADGES.map(b => {
              const unlocked = !!unlockedBadges[b.id];
              return (
                <div key={b.id} className="day-card" style={{ padding:"24px", display:"flex", alignItems:"center", gap:16, opacity:unlocked?1:0.5, filter:unlocked?"none":"grayscale(1)", transform:unlocked?"scale(1)":"scale(0.98)" }}>
                  <div style={{ fontSize:40 }}>{b.icon}</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:800, color:unlocked?"var(--gold)":"var(--text)" }}>{b.label}</div>
                    <div style={{ fontSize:13, color:"var(--text-secondary)", marginTop:4 }}>{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ FLASHCARDS VIEW ═══ */}
        {view==="flashcards" && (()=>{
          const card = srsCards[0];
          
          if (!card) {
            return (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"80px 20px" }}>
                <div style={{ fontSize:60, marginBottom:20 }}>🎉</div>
                <h2 style={{ fontSize:28, fontWeight:800, color:"var(--text)", marginBottom:10 }}>All Caught Up!</h2>
                <p style={{ fontSize:16, color:"var(--text-secondary)" }}>You have reviewed all due flashcards for today.</p>
              </div>
            )
          }

          const handleReview = (quality) => {
            const ease = Math.max(1.3, card.srs.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
            let interval = 1;
            if (quality >= 3) {
              if (card.srs.interval === 0) interval = 1;
              else if (card.srs.interval === 1) interval = 6;
              else interval = Math.round(card.srs.interval * ease);
            }
            const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
            
            setSrsData(prev => ({
              ...prev,
              [card.id]: { nextReview, interval, ease }
            }));
            setFcFlipped(false);
          };

          return (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.1em", marginBottom:20 }}>SPACED REPETITION • {srsCards.length} DUE</div>
              {card && (
                <div onClick={()=>setFcFlipped(!fcFlipped)} style={{ width:"100%", maxWidth:600, height:400, perspective:1000, cursor:"pointer" }}>
                  <div style={{ width:"100%", height:"100%", position:"relative", transition:"transform 0.6s", transformStyle:"preserve-3d", transform:fcFlipped?"rotateY(180deg)":"none" }}>
                    <div style={{ position:"absolute", width:"100%", height:"100%", backfaceVisibility:"hidden", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, padding:40, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", boxShadow:"var(--shadow-lg)" }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"var(--gold)", marginBottom:20 }}>QUESTION (DAY {card.day})</span>
                      <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text)", lineHeight:1.4 }}>{card.q}</h2>
                      <div style={{ marginTop:40, fontSize:13, color:"var(--text-muted)" }}>Tap to reveal answer</div>
                    </div>
                    <div style={{ position:"absolute", width:"100%", height:"100%", backfaceVisibility:"hidden", background:"linear-gradient(135deg,rgba(45,212,191,0.1),rgba(129,140,248,0.1))", border:"1px solid var(--teal)", borderRadius:20, padding:40, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", transform:"rotateY(180deg)", boxShadow:`0 0 40px rgba(45,212,191,0.1)` }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"var(--teal)", marginBottom:20 }}>EXPLANATION</span>
                      <p style={{ fontSize:18, fontWeight:600, color:"var(--text)", lineHeight:1.6 }}>{card.a}</p>
                    </div>
                  </div>
                </div>
              )}
              {fcFlipped ? (
                <div style={{ display:"flex", gap:20, marginTop:40 }}>
                  <button className="btn" onClick={()=>handleReview(1)} style={{ padding:"14px 30px", borderRadius:12, background:"rgba(248,113,113,0.1)", border:"1px solid var(--red)", color:"var(--red)", fontWeight:700 }}>Hard (Again)</button>
                  <button className="btn" onClick={()=>handleReview(4)} style={{ padding:"14px 30px", borderRadius:12, background:"rgba(45,212,191,0.1)", border:"1px solid var(--teal)", color:"var(--teal)", fontWeight:700 }}>Good (Days)</button>
                  <button className="btn" onClick={()=>handleReview(5)} style={{ padding:"14px 30px", borderRadius:12, background:"var(--gold-glow)", border:"1px solid var(--gold)", color:"var(--gold)", fontWeight:800 }}>Easy (Weeks)</button>
                </div>
              ) : (
                <div style={{ display:"flex", gap:20, marginTop:40 }}>
                  <div style={{ padding:"14px 24px", color:"var(--text-muted)", fontSize:14 }}>Think of the answer before flipping!</div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ═══ MOCK INTERVIEW VIEW ═══ */}
        {view==="interview" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px" }}>
            {!mockRunning ? (
              <div className="day-card" style={{ maxWidth:500, width:"100%", padding:40, textAlign:"center" }}>
                <div style={{ fontSize:60, marginBottom:20 }}>🎤</div>
                <h2 style={{ fontSize:24, fontWeight:800, color:"var(--text)", marginBottom:10 }}>Mock Interview</h2>
                <p style={{ fontSize:15, color:"var(--text-secondary)", lineHeight:1.6, marginBottom:30 }}>Start a 45-minute strict timer. You will be given a random DSA question from the 60-day plan. You cannot pause the timer.</p>
                <button className="btn" onClick={()=>{
                  const dsaDays = customPlan.filter(d=>d.morning.tasks && d.morning.tasks.length > 0);
                  const randomDay = dsaDays[Math.floor(Math.random()*dsaDays.length)];
                  const randomProblem = randomDay.morning.tasks[Math.floor(Math.random()*randomDay.morning.tasks.length)];
                  setMockQ({ day: randomDay.day, topic: randomDay.morning.label, desc: randomDay.morning.what, problem: randomProblem });
                  setMockTime(45*60);
                  setMockRunning(true);
                  if(mockIntervalRef.current) clearInterval(mockIntervalRef.current);
                  mockIntervalRef.current = setInterval(() => {
                    setMockTime(t => { if(t<=1) { clearInterval(mockIntervalRef.current); setMockRunning(false); alert("Time is up!"); return 0; } return t-1; });
                  }, 1000);
                }} style={{ width:"100%", padding:"16px", borderRadius:12, background:"var(--red)", color:"#fff", fontSize:16, fontWeight:800 }}>Start Interview</button>
              </div>
            ) : (
              <div style={{ width:"100%", maxWidth:900 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:30, padding:"20px", background:"rgba(248,113,113,0.1)", border:"1px solid var(--red)", borderRadius:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:"var(--red)", animation:"pulse 1.5s infinite" }}/>
                    <span style={{ fontSize:16, fontWeight:800, color:"var(--red)", letterSpacing:"0.1em" }}>INTERVIEW IN PROGRESS</span>
                  </div>
                  <div style={{ fontSize:32, fontWeight:900, color:"var(--text)", fontFamily:"'JetBrains Mono', monospace" }}>
                    {String(Math.floor(mockTime/60)).padStart(2,"0")}:{String(mockTime%60).padStart(2,"0")}
                  </div>
                </div>
                <div className="day-card" style={{ padding:40 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--gold)", letterSpacing:"0.1em", marginBottom:10 }}>PROBLEM (DAY {mockQ.day})</div>
                  <h2 style={{ fontSize:28, fontWeight:800, color:"var(--text)", marginBottom:20 }}>{mockQ.problem}</h2>
                  <p style={{ fontSize:16, color:"var(--text-secondary)", lineHeight:1.7, marginBottom:30 }}><strong>Topic: {mockQ.topic}</strong><br/>{mockQ.desc}</p>
                  <a href={LC[mockQ.problem] || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(mockQ.problem)}`} target="_blank" rel="noopener noreferrer" className="btn" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 24px", background:"#1A1A1A", border:"1px solid #333", borderRadius:8, color:"#FFA116", fontWeight:700 }}>
                    Solve on LeetCode <I.Ext s={14}/>
                  </a>
                </div>
                <button className="btn" onClick={()=>{clearInterval(mockIntervalRef.current); setMockRunning(false);}} style={{ marginTop:30, padding:"12px 24px", borderRadius:8, background:"var(--dim)", color:"var(--text-muted)", fontWeight:700 }}>End Interview Early</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ SQUADS VIEW (MOCK MULTIPLAYER) ═══ */}
        {view==="squads" && (() => {
          const SQUAD_DATA = [
            { id: "s1", name: "You", exp: exp, streak: streak, level: level, avatar: "🟢", bg:"rgba(45,212,191,0.1)", border:"var(--teal)" },
            { id: "s2", name: "Priya (React Ninja)", exp: 8450, streak: 12, level: Math.floor(Math.sqrt(8450/100))+1, avatar: "🦊", bg:"var(--dim)", border:"var(--border)" },
            { id: "s3", name: "Rahul (DSA God)", exp: 12400, streak: 35, level: Math.floor(Math.sqrt(12400/100))+1, avatar: "🐉", bg:"var(--dim)", border:"var(--border)" },
            { id: "s4", name: "Aisha (Fullstack)", exp: 3200, streak: 4, level: Math.floor(Math.sqrt(3200/100))+1, avatar: "🚀", bg:"var(--dim)", border:"var(--border)" },
            { id: "s5", name: "Karan (Beginner)", exp: 800, streak: 1, level: Math.floor(Math.sqrt(800/100))+1, avatar: "🐣", bg:"var(--dim)", border:"var(--border)" },
          ].sort((a,b) => b.exp - a.exp);

          return (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px" }}>
              <div style={{ width:"100%", maxWidth:900 }}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:20, justifyContent:"space-between", alignItems:"center", marginBottom:30, padding:"30px", background:"linear-gradient(135deg,rgba(45,212,191,0.1),rgba(129,140,248,0.1))", border:"1px solid var(--border)", borderRadius:20 }}>
                  <div>
                    <h2 style={{ fontSize:28, fontWeight:900, color:"var(--text)" }}>Study Squad: Alpha Team</h2>
                    <p style={{ color:"var(--text-secondary)", marginTop:8 }}>Compete with your friends and climb the leaderboard! (Mock Offline Mode)</p>
                  </div>
                  <div style={{ fontSize:60 }}>🏆</div>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {SQUAD_DATA.map((user, idx) => (
                    <div key={user.id} className="day-card" style={{ display:"flex", alignItems:"center", padding:"20px", background:user.bg, border:`1px solid ${user.border}`, transform: user.id==="s1"?"scale(1.02)":"none" }}>
                      <div style={{ width:40, fontSize:20, fontWeight:900, color:idx===0?"var(--gold)":idx===1?"var(--silver, #C0C0C0)":idx===2?"var(--bronze, #CD7F32)":"var(--text-muted)" }}>#{idx+1}</div>
                      <div style={{ fontSize:40, marginRight:20 }}>{user.avatar}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:18, fontWeight:800, color:"var(--text)" }}>{user.name}</div>
                        <div style={{ fontSize:13, color:"var(--text-secondary)", marginTop:4 }}><span style={{color:"var(--gold)"}}>Level {user.level}</span> • 🔥 {user.streak} day streak</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:24, fontWeight:900, color:"var(--text)", fontFamily:"'JetBrains Mono', monospace" }}>{user.exp}</div>
                        <div style={{ fontSize:11, color:"var(--text-muted)", letterSpacing:"0.1em" }}>EXP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ ROADMAP BUILDER ═══ */}
        {view==="builder" && (() => {
          return (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px" }}>
              <div style={{ width:"100%", maxWidth:900 }}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h2 style={{ fontSize:28, fontWeight:900, color:"var(--text)" }}>Custom Roadmap Builder</h2>
                  <div style={{display:"flex", gap:10}}>
                    <button className="btn" onClick={() => setBuilderCode(JSON.stringify(customPlan, null, 2))} style={{ padding:"10px 20px", borderRadius:8, background:"var(--dim)", color:"var(--text-muted)", fontWeight:800 }}>Reset to Current</button>
                    <button className="btn" onClick={() => {
                      try {
                        const parsed = JSON.parse(builderCode);
                        setCustomPlan(parsed);
                        alert("Plan updated successfully!");
                      } catch(e) { alert("Invalid JSON: " + e.message); }
                    }} style={{ padding:"10px 20px", borderRadius:8, background:"var(--gold)", color:"#000", fontWeight:800 }}>Save Changes</button>
                  </div>
                </div>
                <div style={{ background:"#1A1A1A", borderRadius:12, padding:20, border:"1px solid var(--border)" }}>
                  <Editor
                    value={builderCode}
                    onValueChange={code => setBuilderCode(code)}
                    highlight={code => (Prism.languages && Prism.languages.json) ? Prism.highlight(code, Prism.languages.json, 'json') : code}
                    padding={15}
                    style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace', fontSize: 14, minHeight: 600, color:"#fff" }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

      </main>

      {/* ═══ MODAL ═══ */}
      {modal && (()=>{
        const ph=PHASES[modal.phase-1]; const tm=TAG_META[modal.tag]; const done=!!completed[modal.day]; const dm=DIFF_META[modal.diff];
        return (
          <div className="fade-in" onClick={()=>setModal(null)} style={{ position:"fixed",inset:0,background:"var(--overlay)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20 }}>
            <div className="slide-up" onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,maxWidth:640,width:"100%",boxShadow:"var(--shadow-lg)",position:"relative",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${ph.accent},${ph.accent}20)`,borderRadius:"20px 20px 0 0" }}/>

              {/* header */}
              <div style={{ padding:"24px 28px 0", flexShrink:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12,fontWeight:700,color:ph.accent,letterSpacing:"0.12em" }}>{ph.label.toUpperCase()}</span>
                      <span style={{ color:"var(--border)" }}>•</span>
                      <span style={{ fontSize:12,fontWeight:700,color:"var(--text-secondary)",letterSpacing:"0.12em" }}>DAY {modal.day}</span>
                      <span style={{ fontSize:11,padding:"2px 10px",borderRadius:5,background:tm.bg,color:tm.color,fontWeight:700 }}>{tm.label}</span>
                      <span className={dm.cls}>{dm.label}</span>
                    </div>
                    <div style={{ fontSize:22,fontWeight:800,color:"var(--text)",lineHeight:1.2,marginBottom:4 }}>{modal.morning.label}</div>
                    <div style={{ fontSize:15,fontWeight:600,color:"var(--teal)" }}>{modal.evening.label}</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn" onClick={() => { const u = new SpeechSynthesisUtterance(`Day ${modal.day}. Morning task: ${modal.morning.label}. ${modal.morning.what}. Evening task: ${modal.evening.label}. ${modal.evening.what}`); window.speechSynthesis.speak(u); }} style={{ background:"var(--dim)",color:"var(--text-muted)",padding:8,borderRadius:8,border:"1px solid var(--border)" }} title="Listen to Tasks"><I.Play s={16}/></button>
                    <button onClick={()=>setModal(null)} className="btn" style={{ background:"var(--dim)",color:"var(--text-muted)",padding:8,borderRadius:8,border:"1px solid var(--border)" }}><I.Close s={16}/></button>
                  </div>
                </div>
                <div className="modal-tabs-scroll" style={{ display:"flex", gap:0, borderBottom:"1px solid var(--border)", overflowX:"auto" }}>
                  {[["pattern", "🧠 Pattern"], ["tasks","☀️🌙 Tasks"],["quiz","🎯 Quiz"],["notes","📝 Notes"],["timer","⏱️ Timer"],["code","💻 Code"]].map(([t,label])=>(
                    <button key={t} className="btn" onClick={()=>setModalTab(t)} style={{
                      padding:"12px 20px",fontSize:13,fontWeight:700,borderRadius:0,
                      background:"none",color:modalTab===t?"var(--gold)":"var(--text-muted)",
                      borderBottom:`2px solid ${modalTab===t?"var(--gold)":"transparent"}`,
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* body */}
              <div style={{ flex:1, overflowY:"auto", padding:"20px 28px 28px" }}>

                {/* TASKS TAB */}
                {modalTab==="tasks" && (
                  <div>
                    {/* morning */}
                    <div style={{ background:"rgba(245,183,49,0.05)",border:"1px solid rgba(245,183,49,0.15)",borderRadius:12,padding:"18px 22px",marginBottom:14 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                        <I.Sun s={16}/><span style={{ fontSize:12,fontWeight:700,color:"var(--gold)",letterSpacing:"0.1em" }}>MORNING — DSA</span>
                      </div>
                      <div style={{ fontSize:17,fontWeight:800,color:"var(--text)",marginBottom:6 }}>{modal.morning.label}</div>
                      <div style={{ fontSize:14,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:14 }}>{modal.morning.what}</div>
                      {modal.morning.tasks.map((t,i)=>(
                        <TaskItem key={i} text={t} checked={!!taskChecks[`${modal.day}-m-${i}`]} onToggle={()=>toggleTask(modal.day,"m",i)} accent="var(--gold)" />
                      ))}
                    </div>

                    {/* evening */}
                    <div style={{ background:"rgba(45,212,191,0.05)",border:"1px solid rgba(45,212,191,0.15)",borderRadius:12,padding:"18px 22px",marginBottom:14 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                        <I.Moon s={16}/><span style={{ fontSize:12,fontWeight:700,color:"var(--teal)",letterSpacing:"0.1em" }}>EVENING — DEV</span>
                      </div>
                      <div style={{ fontSize:17,fontWeight:800,color:"var(--text)",marginBottom:6 }}>{modal.evening.label}</div>
                      <div style={{ fontSize:14,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:14 }}>{modal.evening.what}</div>
                      {modal.evening.tasks.map((t,i)=>(
                        <TaskItem key={i} text={t} checked={!!taskChecks[`${modal.day}-e-${i}`]} onToggle={()=>toggleTask(modal.day,"e",i)} accent="var(--teal)" />
                      ))}
                    </div>

                    {/* note */}
                    <div style={{ background:`${ph.accent}08`,border:`1px solid ${ph.accent}20`,borderRadius:10,padding:"14px 18px",marginBottom:16 }}>
                      <div style={{ fontSize:12,fontWeight:700,color:ph.accent,letterSpacing:"0.1em",marginBottom:6 }}>💡 PRO TIP</div>
                      <div style={{ fontSize:14,color:`${ph.accent}CC`,lineHeight:1.7,fontStyle:"italic",fontWeight:500 }}>{modal.note}</div>
                    </div>

                    {/* resources */}
                    {modal.links?.length>0 && (
                      <div style={{ marginBottom:20 }}>
                        <div style={{ fontSize:12,fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.1em",marginBottom:10 }}>🔗 RESOURCES ({modal.links.length})</div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          {modal.links.map((l,i)=>(
                            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="resource-pill"
                              onClick={e=>e.stopPropagation()}
                              style={{ background:`${CAT_COLORS[l.cat]||ph.accent}10`, color:CAT_COLORS[l.cat]||ph.accent, border:`1px solid ${CAT_COLORS[l.cat]||ph.accent}25` }}>
                              <I.Link s={12}/>{l.label}
                              <span style={{ fontSize:9,padding:"1px 5px",borderRadius:3,background:`${CAT_COLORS[l.cat]||ph.accent}15`,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em" }}>{l.cat}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <button className="btn" onClick={()=>{toggle(modal.day);setModal(null);}} style={{
                      width:"100%",padding:14,borderRadius:12,fontSize:14,fontWeight:700,letterSpacing:"0.08em",
                      background:done?`${ph.accent}15`:`${ph.accent}08`,border:`1px solid ${done?ph.accent:`${ph.accent}40`}`,
                      color:done?ph.accent:`${ph.accent}90`,
                    }}>{done?"✓  MARKED COMPLETE":"MARK DAY COMPLETE"}</button>
                  </div>
                )}

                {/* QUIZ TAB */}
                {modalTab==="quiz" && (
                  <div>
                    <div style={{ fontSize:14,color:"var(--text-secondary)",marginBottom:14,fontWeight:500 }}>Test your knowledge for Day {modal.day}</div>
                    {modal.quiz && modal.quiz.length > 0 ? (
                      <div>
                        {modal.quiz.map((q, i) => (
                          <div key={i} style={{ background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"20px",marginBottom:16 }}>
                            <div style={{ fontSize:15,fontWeight:700,color:"var(--text)",marginBottom:12 }}>{i+1}. {q.q}</div>
                            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                              {q.opts.map((opt, oIdx) => {
                                const isSelected = quizAnswers[i] === oIdx;
                                const showCorrect = showQuizResult && q.ans === oIdx;
                                const showWrong = showQuizResult && isSelected && q.ans !== oIdx;
                                let bg = "var(--dim)";
                                let br = "var(--border)";
                                let c = "var(--text-secondary)";
                                if (showCorrect) { bg = "rgba(45,212,191,0.1)"; br = "var(--teal)"; c = "var(--teal)"; }
                                else if (showWrong) { bg = "rgba(248,113,113,0.1)"; br = "var(--red)"; c = "var(--red)"; }
                                else if (isSelected) { bg = `${ph.accent}15`; br = ph.accent; c = ph.accent; }
                                return (
                                  <button key={oIdx} className="btn" onClick={() => !showQuizResult && setQuizAnswers(p => ({...p, [i]: oIdx}))} style={{
                                    textAlign:"left",padding:"12px 16px",borderRadius:8,fontSize:14,fontWeight:500,background:bg,border:`1px solid ${br}`,color:c,transition:"all 0.2s"
                                  }}>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {showQuizResult && (
                              <div style={{ marginTop:14,padding:12,background:"rgba(245,183,49,0.05)",borderLeft:"3px solid var(--gold)",fontSize:13,color:"var(--text-muted)",lineHeight:1.6 }}>
                                <strong style={{color:"var(--gold)"}}>Explanation:</strong> {q.exp}
                              </div>
                            )}
                          </div>
                        ))}
                        <div style={{ display:"flex", gap:10, marginTop:10 }}>
                          {!showQuizResult ? (
                            <button className="btn" onClick={() => {
                              if(Object.keys(quizAnswers).length < modal.quiz.length) return alert("Please answer all questions!");
                              setShowQuizResult(true);
                              let score = 0;
                              modal.quiz.forEach((q, i) => { if(quizAnswers[i] === q.ans) score++; });
                              setQuizScores(p => ({...p, [modal.day]: { score, total: modal.quiz.length }}));
                              setExp(e => e + (score * 20));
                            }} style={{ width:"100%",padding:14,borderRadius:10,fontSize:14,fontWeight:700,background:ph.accent,color:"#fff" }}>Submit Quiz</button>
                          ) : (
                            <button className="btn" onClick={() => { setShowQuizResult(false); setQuizAnswers({}); }} style={{ width:"100%",padding:14,borderRadius:10,fontSize:14,fontWeight:700,background:"var(--dim)",border:"1px solid var(--border)",color:"var(--text)" }}>Retake Quiz</button>
                          )}
                        </div>
                        {showQuizResult && quizScores[modal.day] && (
                          <div style={{ textAlign:"center",marginTop:16,fontSize:18,fontWeight:800,color:quizScores[modal.day].score === modal.quiz.length ? "var(--green)" : "var(--text)" }}>
                            Score: {quizScores[modal.day].score} / {quizScores[modal.day].total}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign:"center",padding:40,color:"var(--text-muted)",background:"var(--dim)",borderRadius:12,border:"1px dashed var(--border)" }}>Quiz questions are being formulated...</div>
                    )}
                  </div>
                )}

                {/* NOTES TAB */}
                {modalTab==="notes" && (
                  <div>
                    <div style={{ fontSize:14,color:"var(--text-secondary)",marginBottom:14,fontWeight:500 }}>Your notes for Day {modal.day} — {modal.morning.label}</div>
                    <textarea value={draftNote} onChange={e=>setDraftNote(e.target.value)} placeholder="Write your notes here... what you learned, what was hard, questions to revisit..."/>
                    <div style={{ display:"flex", gap:10, marginTop:14 }}>
                      <button className="btn" onClick={()=>setNotes(p=>({...p,[modal.day]:draftNote}))} style={{ flex:1,padding:12,borderRadius:10,fontSize:14,fontWeight:700,background:"rgba(45,212,191,0.08)",border:"1px solid rgba(45,212,191,0.3)",color:"var(--teal)" }}>Save Note</button>
                      <button className="btn" onClick={()=>{setDraftNote("");setNotes(p=>({...p,[modal.day]:""}));}} style={{ padding:"12px 20px",borderRadius:10,fontSize:14,fontWeight:700,background:"var(--dim)",border:"1px solid var(--border)",color:"var(--text-muted)" }}>Clear</button>
                    </div>
                    {notes[modal.day]?.trim() && (
                      <div style={{ marginTop:18,padding:"16px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:10 }}>
                        <div style={{ fontSize:12,fontWeight:700,color:"var(--teal)",letterSpacing:"0.1em",marginBottom:8 }}>SAVED ✓</div>
                        <div style={{ fontSize:14,color:"var(--text-secondary)",whiteSpace:"pre-wrap",lineHeight:1.7 }}>{notes[modal.day]}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* PATTERN TAB */}
                {modalTab === "pattern" && (() => {
                  const pattern = getPatternData(modal.morning.label);
                  if (!pattern) return <div style={{padding:24, color:"var(--text-muted)", textAlign:"center"}}>No pattern data available for this topic.</div>;
                  return (
                    <div className="fade-in" style={{ padding:24, flex:1, overflowY:"auto" }}>
                      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:24 }}>
                        <h2 style={{ fontSize:22, fontWeight:900, color:"var(--gold)", marginBottom:10 }}>{pattern.title}</h2>
                        <p style={{ color:"var(--text)", fontSize:15, lineHeight:1.6, marginBottom:20 }}>{pattern.description}</p>
                        
                        <h3 style={{ fontSize:15, fontWeight:800, color:"var(--text)", marginBottom:10 }}>How it works:</h3>
                        <ul style={{ paddingLeft:20, color:"var(--text-secondary)", fontSize:14, lineHeight:1.6, marginBottom:24 }}>
                          {pattern.howItWorks.map((step, idx) => <li key={idx} style={{ marginBottom:6 }}>{step}</li>)}
                        </ul>

                        <h3 style={{ fontSize:15, fontWeight:800, color:"var(--text)", marginBottom:10 }}>Example Code:</h3>
                        <div style={{ background:"#1e1e1e", padding:16, borderRadius:12, overflowX:"auto" }}>
                          <pre style={{ margin:0, color:"#d4d4d4", fontSize:13, fontFamily:"monospace" }}>{pattern.codeSnippet}</pre>
                        </div>
                        
                        {/* The new Interactive Visualizer Engine */}
                        {pattern.visType && (
                          <div style={{ marginTop: 30 }}>
                            <h3 style={{ fontSize:15, fontWeight:800, color:"var(--text)", marginBottom:10 }}>Interactive Visualizer:</h3>
                            <PatternVisualizer type={pattern.visType} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* CODE SANDBOX TAB */}
                {modalTab==="code" && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontSize:14,color:"var(--text-secondary)",fontWeight:500 }}>Live Code Sandbox</div>
                      <select className="btn" value={codeLang} onChange={e => {
                        setCodeLang(e.target.value);
                        setCode(LANGUAGES[e.target.value].defaultCode);
                        setCodeOutput("");
                      }} style={{ padding:"8px 12px", background:"#1A1A1A", border:"1px solid var(--border)", color:"var(--text)", borderRadius:8, fontSize:13, fontWeight:600, outline:"none", cursor:"pointer" }}>
                        {Object.entries(LANGUAGES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div style={{ background:"#1A1A1A", borderRadius:12, padding:20, border:"1px solid var(--border)" }}>
                      <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => {
                          const lang = LANGUAGES[codeLang].prism;
                          return (Prism.languages && Prism.languages[lang]) ? Prism.highlight(code, Prism.languages[lang], lang) : code;
                        }}
                        padding={15}
                        style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace', fontSize: 14, minHeight: 300, color:"#fff" }}
                      />
                    </div>
                    <div style={{ display:"flex", gap:10, marginTop:14, alignItems:"center" }}>
                      <button className="btn" disabled={codeLang !== "javascript"} onClick={async () => {
                        if (codeLang === "javascript") {
                          let logs = [];
                          const oldLog = console.log;
                          console.log = (...args) => { logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ")); };
                          try { new Function(code)(); setCodeOutput(logs.join("\n")); } 
                          catch(e) { setCodeOutput(e.toString()); } 
                          finally { console.log = oldLog; }
                        }
                      }} style={{ padding:14,borderRadius:10,fontSize:14,fontWeight:700,background:codeLang === "javascript" ? "var(--gold)" : "var(--dim)",color:codeLang === "javascript" ? "#000" : "var(--text-muted)", cursor:codeLang === "javascript" ? "pointer" : "not-allowed" }}>{codeLang === "javascript" ? "Run Code" : "Notepad Mode"}</button>
                      
                      {codeLang !== "javascript" && (
                        <span style={{ fontSize:13, color:"var(--text-muted)" }}>⚠️ Live execution is only supported for JavaScript.</span>
                      )}
                    </div>
                    {codeOutput && (
                      <div style={{ marginTop:18,padding:"16px 20px",background:"#000",border:"1px solid var(--border)",borderRadius:10 }}>
                        <div style={{ fontSize:12,fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.1em",marginBottom:8 }}>OUTPUT</div>
                        <pre style={{ fontSize:13,color:"var(--gold)",whiteSpace:"pre-wrap",fontFamily:"'JetBrains Mono', monospace" }}>{codeOutput}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* TIMER TAB */}
                {modalTab==="timer" && (
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 0" }}>
                    <div style={{ fontSize:12,fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.15em",marginBottom:24 }}>STUDY SESSION TIMER</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:56,fontWeight:800,color:timer.running?ph.accent:"var(--text)",letterSpacing:"0.04em",marginBottom:28,textShadow:timer.running?`0 0 30px ${ph.glow}`:"none" }}>
                      {timer.fmt(timer.seconds)}
                    </div>
                    <div style={{ display:"flex",gap:12,marginBottom:28 }}>
                      <button className="btn" onClick={()=>timer.setRunning(r=>!r)} style={{
                        padding:"12px 32px",borderRadius:12,fontSize:14,fontWeight:700,
                        background:timer.running?"rgba(248,113,113,0.1)":`${ph.accent}10`,
                        border:`1px solid ${timer.running?"var(--red)":ph.accent}`,color:timer.running?"var(--red)":ph.accent,
                      }}>{timer.running?"⏸ Pause":timer.seconds>0?"▶ Resume":"▶ Start"}</button>
                      <button className="btn" onClick={timer.reset} style={{ padding:"12px 24px",borderRadius:12,fontSize:14,fontWeight:700,background:"var(--dim)",border:"1px solid var(--border)",color:"var(--text-muted)" }}>↺ Reset</button>
                    </div>
                    <div style={{ background:"var(--dim)",border:"1px solid var(--border)",borderRadius:12,padding:"18px 22px",width:"100%" }}>
                      <div style={{ fontSize:12,fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.1em",marginBottom:12 }}>POMODORO GUIDE</div>
                      {[["25 min","Focus session"],["5 min","Short break"],["25 min","Focus session"],["15 min","Long break (after 4)"]].map(([t,l],i)=>(
                        <div key={i} style={{ display:"flex",gap:14,marginBottom:8 }}>
                          <span style={{ fontSize:14,color:ph.accent,minWidth:55,fontWeight:700 }}>{t}</span>
                          <span style={{ fontSize:14,color:"var(--text-secondary)" }}>{l}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:18,fontSize:14,color:"var(--text-muted)",textAlign:"center",lineHeight:1.7 }}>
                      Target: <span style={{ color:"var(--gold)",fontWeight:600 }}>90 min morning DSA</span> + <span style={{ color:"var(--teal)",fontWeight:600 }}>2 hrs evening dev</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
