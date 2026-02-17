import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════ */
const GRADES = ["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"];
const SUBJECTS = ["Mathematics","English","Kiswahili","Science","Social Studies","CRE","Art & Craft","Physical Education","Computer Studies"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const PERIODS = ["8:00-8:40","8:40-9:20","9:20-10:00","10:20-11:00","11:00-11:40","11:40-12:20","1:00-1:40","1:40-2:20"];

const SEED_STUDENTS = [
  { id:"st1", name:"Amara Wanjiku", grade:"Grade 7", fees:12000, paid:9000, parent:"parent1", phone:"0712345678", admNo:"2024/001" },
  { id:"st2", name:"Kofi Otieno",   grade:"Grade 7", fees:12000, paid:12000, parent:"parent2", phone:"0723456789", admNo:"2024/002" },
  { id:"st3", name:"Zara Kamau",    grade:"Grade 8", fees:14000, paid:7000, parent:"parent3", phone:"0734567890", admNo:"2024/003" },
  { id:"st4", name:"Emeka Njoroge", grade:"Grade 8", fees:14000, paid:14000, parent:"parent4", phone:"0745678901", admNo:"2024/004" },
  { id:"st5", name:"Fatuma Hassan", grade:"Grade 9", fees:16000, paid:8000, parent:"parent5", phone:"0756789012", admNo:"2024/005" },
  { id:"st6", name:"Liam Mwangi",   grade:"Grade 6", fees:10000, paid:10000, parent:"parent6", phone:"0767890123", admNo:"2024/006" },
  { id:"st7", name:"Nia Achieng",   grade:"Grade 5", fees:9000, paid:4500, parent:"parent7", phone:"0778901234", admNo:"2024/007" },
  { id:"st8", name:"Kwame Gitonga", grade:"Grade 9", fees:16000, paid:16000, parent:"parent8", phone:"0789012345", admNo:"2024/008" },
];

const SEED_TEACHERS = [
  { id:"tc1", name:"Mrs. Abena Owusu",  subjects:["Mathematics","Computer Studies"], salary:45000, paid:true,  email:"abena@school.ke" },
  { id:"tc2", name:"Mr. Samuel Tetteh", subjects:["English","CRE"],                  salary:42000, paid:true,  email:"samuel@school.ke" },
  { id:"tc3", name:"Ms. Grace Mwenda",  subjects:["Science"],                         salary:44000, paid:false, email:"grace@school.ke" },
  { id:"tc4", name:"Mr. Kofi Barasa",   subjects:["Social Studies","CRE"],            salary:40000, paid:true,  email:"kofi@school.ke" },
  { id:"tc5", name:"Ms. Jane Njeri",    subjects:["Kiswahili","Art & Craft"],          salary:41000, paid:false, email:"jane@school.ke" },
  { id:"tc6", name:"Mr. Peter Ouma",    subjects:["Physical Education"],               salary:38000, paid:true,  email:"peter@school.ke" },
];

const SEED_STAFF = [
  { id:"sf1", name:"John Kariuki",   role:"Security Guard",  salary:18000, paid:true  },
  { id:"sf2", name:"Mary Wambua",    role:"Cleaner",          salary:12000, paid:false },
  { id:"sf3", name:"Peter Mutua",    role:"Driver",           salary:22000, paid:true  },
  { id:"sf4", name:"Agnes Chebet",   role:"Cook",             salary:16000, paid:true  },
  { id:"sf5", name:"James Kilonzo",  role:"Librarian",        salary:20000, paid:false },
];

const SEED_EXAMS = {
  st1: { Mathematics:78, English:85, Kiswahili:72, Science:80, "Social Studies":75, CRE:88, "Art & Craft":90, "Physical Education":82, "Computer Studies":79 },
  st2: { Mathematics:92, English:88, Kiswahili:85, Science:90, "Social Studies":87, CRE:80, "Art & Craft":75, "Physical Education":95, "Computer Studies":88 },
  st3: { Mathematics:65, English:70, Kiswahili:68, Science:72, "Social Studies":66, CRE:74, "Art & Craft":80, "Physical Education":77, "Computer Studies":69 },
  st4: { Mathematics:88, English:82, Kiswahili:79, Science:85, "Social Studies":83, CRE:86, "Art & Craft":70, "Physical Education":80, "Computer Studies":84 },
  st5: { Mathematics:55, English:62, Kiswahili:58, Science:60, "Social Studies":64, CRE:70, "Art & Craft":75, "Physical Education":68, "Computer Studies":57 },
  st6: { Mathematics:95, English:91, Kiswahili:89, Science:93, "Social Studies":90, CRE:88, "Art & Craft":85, "Physical Education":92, "Computer Studies":94 },
  st7: { Mathematics:73, English:77, Kiswahili:75, Science:70, "Social Studies":72, CRE:78, "Art & Craft":88, "Physical Education":85, "Computer Studies":71 },
  st8: { Mathematics:82, English:79, Kiswahili:80, Science:84, "Social Studies":81, CRE:76, "Art & Craft":72, "Physical Education":88, "Computer Studies":83 },
};

const SEED_TIMETABLE = {
  "Grade 7": {
    Monday:    { "8:00-8:40":"tc1", "8:40-9:20":"tc2", "9:20-10:00":"tc3", "10:20-11:00":"tc4", "11:00-11:40":"tc5", "11:40-12:20":"tc1", "1:00-1:40":"tc6", "1:40-2:20":"tc2" },
    Tuesday:   { "8:00-8:40":"tc3", "8:40-9:20":"tc1", "9:20-10:00":"tc2", "10:20-11:00":"tc5", "11:00-11:40":"tc4", "11:40-12:20":"tc6", "1:00-1:40":"tc1", "1:40-2:20":"tc3" },
    Wednesday: { "8:00-8:40":"tc2", "8:40-9:20":"tc4", "9:20-10:00":"tc1", "10:20-11:00":"tc3", "11:00-11:40":"tc6", "11:40-12:20":"tc5", "1:00-1:40":"tc4", "1:40-2:20":"tc1" },
    Thursday:  { "8:00-8:40":"tc5", "8:40-9:20":"tc3", "9:20-10:00":"tc4", "10:20-11:00":"tc1", "11:00-11:40":"tc2", "11:40-12:20":"tc4", "1:00-1:40":"tc3", "1:40-2:20":"tc5" },
    Friday:    { "8:00-8:40":"tc1", "8:40-9:20":"tc5", "9:20-10:00":"tc6", "10:20-11:00":"tc2", "11:00-11:40":"tc3", "11:40-12:20":"tc1", "1:00-1:40":"tc2", "1:40-2:20":"tc4" },
  }
};

const SEED_EVENTS = [
  { id:"ev1", title:"Term 2 Exams Begin", date:"2025-03-10", audience:"all",     sent:false },
  { id:"ev2", title:"School Fees Deadline", date:"2025-02-28", audience:"parents", sent:true  },
  { id:"ev3", title:"Sports Day",          date:"2025-03-21", audience:"all",     sent:false },
  { id:"ev4", title:"Parent-Teacher Meeting", date:"2025-04-05", audience:"parents", sent:true },
];

const USERS = [
  { id:"admin1",   role:"admin",   name:"Mr. Principal Kamau", email:"admin@school.ke",    password:"admin123" },
  { id:"tc1",      role:"teacher", name:"Mrs. Abena Owusu",    email:"abena@school.ke",    password:"teach123" },
  { id:"tc2",      role:"teacher", name:"Mr. Samuel Tetteh",   email:"samuel@school.ke",   password:"teach123" },
  { id:"parent1",  role:"parent",  name:"Parent of Amara",     email:"parent1@school.ke",  password:"parent123", studentId:"st1" },
  { id:"parent2",  role:"parent",  name:"Parent of Kofi",      email:"parent2@school.ke",  password:"parent123", studentId:"st2" },
  { id:"parent3",  role:"parent",  name:"Parent of Zara",      email:"parent3@school.ke",  password:"parent123", studentId:"st3" },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const uid  = () => Math.random().toString(36).slice(2,9);
const fmt  = (n) => `KES ${n.toLocaleString()}`;
const pct  = (a,b) => b===0 ? 0 : Math.round((a/b)*100);
const avg  = (obj) => { const v=Object.values(obj); return v.length ? Math.round(v.reduce((a,b)=>a+b,0)/v.length) : 0; };
const grade = (s) => s>=80?"A":s>=70?"B":s>=60?"C":s>=50?"D":"E";
const TODAY = new Date().toISOString().split("T")[0];

function clamp(n,min,max){ return Math.min(Math.max(n,min),max); }

/* ═══════════════════════════════════════════════════════════
   UI COMPONENTS
═══════════════════════════════════════════════════════════ */
function Toast({ msg, type }) {
  const bg = type==="success"?"#10b981":type==="error"?"#ef4444":"#f59e0b";
  return (
    <div style={{ position:"fixed", top:20, right:20, zIndex:9999,
      background:bg, color:"#fff", padding:"12px 20px", borderRadius:12,
      fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
      boxShadow:"0 8px 30px rgba(0,0,0,.2)", animation:"slideIn .3s ease" }}>
      {type==="success"?"✓ ":type==="error"?"✗ ":"⚠ "}{msg}
    </div>
  );
}

function Badge({ color, children }) {
  const map = {
    green:"#d1fae5|#065f46", red:"#fee2e2|#991b1b", amber:"#fef3c7|#92400e",
    blue:"#dbeafe|#1e40af", violet:"#ede9fe|#5b21b6", gray:"#f3f4f6|#374151",
    teal:"#ccfbf1|#134e4a"
  };
  const [bg,fg]=map[color]?.split("|")||["#f3f4f6","#374151"];
  return <span style={{ background:bg, color:fg, padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{children}</span>;
}

function Card({ children, style={} }) {
  return <div style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"0 1px 4px rgba(0,0,0,.06)", border:"1px solid #f0f0f0", ...style }}>{children}</div>;
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <Card style={{ display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ width:52, height:52, borderRadius:14, background:accent,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:11, color:"#9ca3af", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:800, color:"#111827" }}>{value}</div>
        {sub && <div style={{ fontSize:12, color:"#6b7280" }}>{sub}</div>}
      </div>
    </Card>
  );
}

function Modal({ title, onClose, children, wide=false }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:wide?760:520,
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.25)" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 24px", borderBottom:"1px solid #f0f0f0" }}>
          <h3 style={{ margin:0, fontFamily:"'Playfair Display',serif", fontSize:20, color:"#111827" }}>{title}</h3>
          <button onClick={onClose} style={{ border:"none", background:"none", cursor:"pointer",
            fontSize:20, color:"#9ca3af", width:32, height:32, borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, color="primary", small=false, full=false, disabled=false }) {
  const colors = {
    primary: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    success: "linear-gradient(135deg,#10b981,#059669)",
    danger:  "linear-gradient(135deg,#ef4444,#dc2626)",
    ghost:   "transparent",
    amber:   "linear-gradient(135deg,#f59e0b,#d97706)",
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#e5e7eb" : colors[color],
      color: color==="ghost" ? "#6b7280" : "#fff",
      border: color==="ghost" ? "1px solid #e5e7eb" : "none",
      borderRadius: 10, padding: small ? "6px 14px" : "10px 20px",
      fontSize: small ? 12 : 14, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto", transition:"opacity .2s",
      fontFamily:"'DM Sans',sans-serif",
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, type="text", placeholder="", required=false }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", marginBottom:5, fontSize:13, fontWeight:600, color:"#374151" }}>{label}{required && <span style={{color:"#ef4444"}}> *</span>}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
          fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box",
          transition:"border .2s" }}
        onFocus={e=>e.target.style.borderColor="#0ea5e9"}
        onBlur={e=>e.target.style.borderColor="#e5e7eb"}
      />
    </div>
  );
}

function Select({ label, value, onChange, options=[], required=false }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", marginBottom:5, fontSize:13, fontWeight:600, color:"#374151" }}>{label}{required && <span style={{color:"#ef4444"}}> *</span>}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
          fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#fff", boxSizing:"border-box" }}>
        {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
      </select>
    </div>
  );
}

function ProgressBar({ value, max=100, color="#0ea5e9" }) {
  const p = clamp(pct(value,max),0,100);
  return (
    <div style={{ height:8, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
      <div style={{ width:`${p}%`, height:"100%", background:color, borderRadius:99, transition:"width .5s" }}/>
    </div>
  );
}

function Tab({ label, active, onClick, count }) {
  return (
    <button onClick={onClick} style={{
      padding:"10px 18px", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700,
      fontSize:13, fontFamily:"'DM Sans',sans-serif", transition:"all .2s",
      background: active ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
      color: active ? "#fff" : "#6b7280",
    }}>
      {label}{count!=null && <span style={{ marginLeft:6, background: active?"rgba(255,255,255,.3)":"#e5e7eb",
        color: active?"#fff":"#6b7280", borderRadius:20, padding:"1px 7px", fontSize:11 }}>{count}</span>}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("admin@school.ke");
  const [pass,  setPass]  = useState("admin123");
  const [err,   setErr]   = useState("");
  const [role,  setRole]  = useState("admin");

  const presets = {
    admin:   { email:"admin@school.ke",   pass:"admin123"  },
    teacher: { email:"abena@school.ke",   pass:"teach123"  },
    parent:  { email:"parent1@school.ke", pass:"parent123" },
  };

  const handleRole = (r) => { setRole(r); setEmail(presets[r].email); setPass(presets[r].pass); setErr(""); };

  const login = () => {
    const user = USERS.find(u=>u.email===email && u.password===pass);
    if (user) onLogin(user);
    else setErr("Invalid email or password.");
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f172a 0%,#0c4a6e 50%,#075985 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ width:"100%", maxWidth:440 }}>
        {/* School crest */}
        <div style={{ textAlign:"center", marginBottom:32, animation:"fadeUp .6s ease" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#d97706)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 12px",
            boxShadow:"0 8px 32px rgba(245,158,11,.4)" }}>🏫</div>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',serif", margin:"0 0 4px" }}>Elimu Academy</h1>
          <p style={{ color:"#94a3b8", fontSize:14, margin:0 }}>School Management System · Kenya</p>
        </div>

        <div style={{ background:"rgba(255,255,255,.05)", backdropFilter:"blur(20px)", borderRadius:20,
          padding:32, border:"1px solid rgba(255,255,255,.12)", animation:"fadeUp .6s ease .1s both" }}>
          {/* Role tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:24, background:"rgba(0,0,0,.2)", borderRadius:12, padding:4 }}>
            {["admin","teacher","parent"].map(r=>(
              <button key={r} onClick={()=>handleRole(r)} style={{
                flex:1, padding:"8px 0", borderRadius:9, border:"none", cursor:"pointer", fontSize:12,
                fontWeight:700, textTransform:"capitalize", fontFamily:"'DM Sans',sans-serif", transition:"all .2s",
                background: role===r ? "#fff" : "transparent",
                color: role===r ? "#0284c7" : "#94a3b8",
              }}>{r==="admin"?"🛡 Admin":r==="teacher"?"📚 Teacher":"👨‍👩‍👧 Parent"}</button>
            ))}
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:600, color:"#cbd5e1" }}>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
              style={{ width:"100%", padding:"12px 16px", background:"rgba(255,255,255,.08)", border:"1.5px solid rgba(255,255,255,.15)",
                borderRadius:12, color:"#fff", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:600, color:"#cbd5e1" }}>Password</label>
            <input value={pass} onChange={e=>setPass(e.target.value)} type="password"
              style={{ width:"100%", padding:"12px 16px", background:"rgba(255,255,255,.08)", border:"1.5px solid rgba(255,255,255,.15)",
                borderRadius:12, color:"#fff", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" }}
              onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          {err && <p style={{ color:"#fca5a5", fontSize:13, margin:"-10px 0 16px", textAlign:"center" }}>{err}</p>}
          <button onClick={login} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#f59e0b,#d97706)",
            border:"none", borderRadius:12, color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", letterSpacing:.3 }}>Sign In →</button>

          <p style={{ textAlign:"center", color:"#64748b", fontSize:12, marginTop:16, marginBottom:0 }}>
            Demo — Admin: admin123 · Teacher: teach123 · Parent: parent123
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR NAV
═══════════════════════════════════════════════════════════ */
const NAV_ADMIN = [
  { id:"dashboard",  icon:"📊", label:"Dashboard"     },
  { id:"students",   icon:"👨‍🎓", label:"Students"      },
  { id:"teachers",   icon:"👩‍🏫", label:"Teachers"      },
  { id:"staff",      icon:"👷", label:"Non-Teaching"  },
  { id:"attendance", icon:"✅", label:"Attendance"    },
  { id:"timetable",  icon:"📅", label:"Timetable"     },
  { id:"exams",      icon:"📝", label:"Exam Reports"  },
  { id:"fees",       icon:"💰", label:"Fees"          },
  { id:"events",     icon:"📢", label:"Notifications" },
  { id:"reports",    icon:"📨", label:"Weekly Reports"},
];

const NAV_TEACHER = [
  { id:"dashboard",  icon:"📊", label:"Dashboard"    },
  { id:"attendance", icon:"✅", label:"Attendance"   },
  { id:"timetable",  icon:"📅", label:"My Timetable" },
  { id:"exams",      icon:"📝", label:"Exam Reports" },
];

const NAV_PARENT = [
  { id:"dashboard",  icon:"📊", label:"My Child"      },
  { id:"exams",      icon:"📝", label:"Report Card"   },
  { id:"fees",       icon:"💰", label:"Fees Balance"  },
  { id:"events",     icon:"📢", label:"School Updates"},
];

function Sidebar({ user, active, onNav, onLogout }) {
  const nav = user.role==="admin" ? NAV_ADMIN : user.role==="teacher" ? NAV_TEACHER : NAV_PARENT;
  return (
    <div style={{ width:220, minHeight:"100vh", background:"#0f172a", display:"flex", flexDirection:"column",
      flexShrink:0, position:"sticky", top:0 }}>
      <div style={{ padding:"24px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#d97706)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏫</div>
          <div>
            <div style={{ color:"#fff", fontSize:13, fontWeight:800, fontFamily:"'Playfair Display',serif" }}>Elimu</div>
            <div style={{ color:"#64748b", fontSize:10, fontWeight:600, letterSpacing:1 }}>ACADEMY</div>
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,.05)", borderRadius:12, padding:12, marginBottom:20 }}>
          <div style={{ color:"#fff", fontSize:13, fontWeight:700, marginBottom:2, whiteSpace:"nowrap",
            overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
          <div style={{ color:"#64748b", fontSize:11, textTransform:"capitalize" }}>{user.role}</div>
        </div>

        {nav.map(n=>(
          <button key={n.id} onClick={()=>onNav(n.id)} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px",
            borderRadius:10, border:"none", cursor:"pointer", marginBottom:2, textAlign:"left",
            background: active===n.id ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
            color: active===n.id ? "#fff" : "#94a3b8", transition:"all .2s",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: active===n.id ? 700 : 500,
          }}>
            <span>{n.icon}</span><span>{n.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop:"auto", padding:"16px" }}>
        <button onClick={onLogout} style={{ width:"100%", padding:"10px", background:"rgba(239,68,68,.1)",
          border:"1px solid rgba(239,68,68,.2)", borderRadius:10, color:"#fca5a5", cursor:"pointer",
          fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>
          ⬅ Sign Out
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
function Dashboard({ user, students, teachers, staff, attendance, exams }) {
  const todayAtt  = attendance.student?.[TODAY] || {};
  const presentToday = Object.values(todayAtt).filter(v=>v==="present").length;
  const totalFees = students.reduce((a,s)=>a+s.fees,0);
  const paidFees  = students.reduce((a,s)=>a+s.paid,0);
  const balanceFees = totalFees - paidFees;
  const unpaidStudents = students.filter(s=>s.paid<s.fees);

  if (user.role === "parent") {
    const child = students.find(s=>s.id===USERS.find(u=>u.id===user.id)?.studentId);
    if (!child) return <div style={{padding:40}}>No student linked to your account.</div>;
    const scores = exams[child.id] || {};
    const average = avg(scores);
    const balance = child.fees - child.paid;
    return (
      <div style={{ padding:32 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:8, color:"#111827" }}>
          Welcome, {user.name}
        </h2>
        <p style={{ color:"#6b7280", marginBottom:28 }}>Here's how {child.name} is doing at Elimu Academy.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
          <StatCard icon="🎓" label="Class" value={child.grade} accent="#dbeafe" />
          <StatCard icon="📝" label="Average Score" value={`${average}%`} sub={`Grade ${grade(average)}`} accent="#d1fae5" />
          <StatCard icon="💰" label="Fees Balance" value={fmt(balance)} sub={balance>0?"Outstanding":"Fully Paid"} accent={balance>0?"#fee2e2":"#d1fae5"} />
          <StatCard icon="📋" label="Adm. No" value={child.admNo} accent="#ede9fe" />
        </div>
        <Card>
          <h4 style={{ margin:"0 0 16px", color:"#374151" }}>Subject Performance</h4>
          {Object.entries(scores).map(([sub,sc])=>(
            <div key={sub} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13 }}>
                <span style={{ color:"#374151" }}>{sub}</span>
                <span style={{ fontWeight:700, color: sc>=70?"#059669":sc>=50?"#d97706":"#dc2626" }}>{sc}% ({grade(sc)})</span>
              </div>
              <ProgressBar value={sc} color={sc>=70?"#10b981":sc>=50?"#f59e0b":"#ef4444"} />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (user.role === "teacher") {
    const tc = teachers.find(t=>t.id===user.id);
    return (
      <div style={{ padding:32 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:8, color:"#111827" }}>
          Good morning, {user.name.split(" ")[1]} 👋
        </h2>
        <p style={{ color:"#6b7280", marginBottom:28 }}>Subjects: {tc?.subjects.join(", ")}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
          <StatCard icon="👨‍🎓" label="Total Students" value={students.length} accent="#dbeafe" />
          <StatCard icon="✅" label="Present Today" value={`${presentToday}/${students.length}`} accent="#d1fae5" />
          <StatCard icon="💵" label="My Salary" value={fmt(tc?.salary||0)} sub={tc?.paid?"Paid this month":"⚠ Pending"} accent={tc?.paid?"#d1fae5":"#fee2e2"} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:32 }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:4, color:"#111827" }}>
        Admin Dashboard
      </h2>
      <p style={{ color:"#6b7280", marginBottom:28 }}>{new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
        <StatCard icon="👨‍🎓" label="Total Students"  value={students.length}         sub="Enrolled"            accent="#dbeafe" />
        <StatCard icon="👩‍🏫" label="Teachers"        value={teachers.length}         sub="Teaching staff"      accent="#d1fae5" />
        <StatCard icon="✅"  label="Present Today"   value={`${presentToday}`}       sub={`of ${students.length} students`} accent="#ccfbf1" />
        <StatCard icon="💰"  label="Fees Collected"  value={fmt(paidFees)}           sub={`${pct(paidFees,totalFees)}% of total`} accent="#fef3c7" />
        <StatCard icon="⚠"  label="Fees Outstanding" value={fmt(balanceFees)}        sub={`${unpaidStudents.length} students`} accent="#fee2e2" />
        <StatCard icon="👷"  label="Support Staff"   value={staff.length}            sub="Non-teaching"         accent="#ede9fe" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <h4 style={{ margin:"0 0 16px", color:"#374151", fontFamily:"'Playfair Display',serif" }}>Fees Collection by Grade</h4>
          {GRADES.slice(0,6).map(g=>{
            const gStudents = students.filter(s=>s.grade===g);
            if(!gStudents.length) return null;
            const total = gStudents.reduce((a,s)=>a+s.fees,0);
            const paid  = gStudents.reduce((a,s)=>a+s.paid,0);
            return (
              <div key={g} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4, color:"#374151" }}>
                  <span>{g}</span><span style={{fontWeight:700}}>{pct(paid,total)}%</span>
                </div>
                <ProgressBar value={paid} max={total} color={pct(paid,total)>=80?"#10b981":pct(paid,total)>=50?"#f59e0b":"#ef4444"} />
              </div>
            );
          })}
        </Card>

        <Card>
          <h4 style={{ margin:"0 0 16px", color:"#374151", fontFamily:"'Playfair Display',serif" }}>Outstanding Balances</h4>
          {unpaidStudents.map(s=>(
            <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 0", borderBottom:"1px solid #f9fafb", fontSize:13 }}>
              <div>
                <div style={{ fontWeight:700, color:"#111827" }}>{s.name}</div>
                <div style={{ color:"#9ca3af", fontSize:11 }}>{s.grade}</div>
              </div>
              <Badge color="red">{fmt(s.fees-s.paid)}</Badge>
            </div>
          ))}
          {unpaidStudents.length===0 && <p style={{color:"#10b981",fontSize:13,textAlign:"center"}}>🎉 All fees cleared!</p>}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STUDENTS MODULE
═══════════════════════════════════════════════════════════ */
function StudentsModule({ students, setStudents, showToast }) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [form, setForm] = useState({ name:"", grade:"Grade 1", fees:10000, paid:0, phone:"", admNo:"" });

  const filtered = students.filter(s=>
    (gradeFilter==="All" || s.grade===gradeFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const addStudent = () => {
    if(!form.name.trim()) return showToast("Name required","error");
    const newS = { ...form, id:uid(), parent:uid(), fees:+form.fees, paid:+form.paid };
    setStudents(prev=>[...prev, newS]);
    setModal(null); setForm({ name:"", grade:"Grade 1", fees:10000, paid:0, phone:"", admNo:"" });
    showToast("Student added successfully");
  };

  const deleteStudent = (id) => { setStudents(prev=>prev.filter(s=>s.id!==id)); showToast("Student removed","amber"); };

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Students</h2>
          <p style={{ color:"#6b7280", margin:0 }}>{students.length} enrolled across {GRADES.length} grades</p>
        </div>
        <Btn onClick={()=>setModal("add")}>+ Add Student</Btn>
      </div>

      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search students…"
            style={{ flex:1, minWidth:200, padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14,
              fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
          <select value={gradeFilter} onChange={e=>setGradeFilter(e.target.value)}
            style={{ padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14,
              fontFamily:"'DM Sans',sans-serif", background:"#fff" }}>
            <option>All</option>
            {GRADES.map(g=><option key={g}>{g}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #f0f0f0" }}>
                {["Adm No","Name","Grade","Total Fees","Paid","Balance","Phone","Status",""].map(h=>(
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#6b7280", fontWeight:700, fontSize:11,
                    textTransform:"uppercase", letterSpacing:.5, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id} style={{ borderBottom:"1px solid #f9fafb" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"12px 12px", color:"#6b7280", fontWeight:600 }}>{s.admNo||"—"}</td>
                  <td style={{ padding:"12px 12px", fontWeight:700, color:"#111827" }}>{s.name}</td>
                  <td style={{ padding:"12px 12px" }}><Badge color="blue">{s.grade}</Badge></td>
                  <td style={{ padding:"12px 12px", color:"#374151" }}>{fmt(s.fees)}</td>
                  <td style={{ padding:"12px 12px", color:"#059669", fontWeight:600 }}>{fmt(s.paid)}</td>
                  <td style={{ padding:"12px 12px" }}><Badge color={s.fees-s.paid>0?"red":"green"}>{fmt(s.fees-s.paid)}</Badge></td>
                  <td style={{ padding:"12px 12px", color:"#6b7280" }}>{s.phone}</td>
                  <td style={{ padding:"12px 12px" }}><Badge color={s.paid>=s.fees?"green":"amber"}>{s.paid>=s.fees?"Paid":"Partial"}</Badge></td>
                  <td style={{ padding:"12px 12px" }}>
                    <button onClick={()=>deleteStudent(s.id)} style={{ background:"none", border:"none",
                      cursor:"pointer", color:"#ef4444", fontSize:16 }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <p style={{textAlign:"center",color:"#9ca3af",padding:"30px 0"}}>No students found.</p>}
        </div>
      </Card>

      {modal==="add" && (
        <Modal title="Add New Student" onClose={()=>setModal(null)}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} required placeholder="e.g. Amara Wanjiku"/>
          <Input label="Adm. Number" value={form.admNo} onChange={v=>setForm(p=>({...p,admNo:v}))} placeholder="e.g. 2025/001"/>
          <Select label="Grade" value={form.grade} onChange={v=>setForm(p=>({...p,grade:v}))} options={GRADES} required/>
          <Input label="Annual Fees (KES)" value={form.fees} onChange={v=>setForm(p=>({...p,fees:v}))} type="number"/>
          <Input label="Amount Paid (KES)" value={form.paid} onChange={v=>setForm(p=>({...p,paid:v}))} type="number"/>
          <Input label="Parent Phone" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="07XXXXXXXX"/>
          <Btn onClick={addStudent} full>Add Student</Btn>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEACHERS MODULE
═══════════════════════════════════════════════════════════ */
function TeachersModule({ teachers, setTeachers, showToast }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:"", subjects:[], salary:40000, email:"" });

  const addTeacher = () => {
    if(!form.name.trim()) return showToast("Name required","error");
    setTeachers(prev=>[...prev,{ ...form, id:uid(), paid:false, salary:+form.salary, subjects:form.subjects }]);
    setModal(null); setForm({ name:"", subjects:[], salary:40000, email:"" });
    showToast("Teacher added");
  };

  const togglePaid = (id) => setTeachers(prev=>prev.map(t=>t.id===id?{...t,paid:!t.paid}:t));
  const remove = (id) => { setTeachers(prev=>prev.filter(t=>t.id!==id)); showToast("Teacher removed","amber"); };

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Teachers</h2>
          <p style={{ color:"#6b7280", margin:0 }}>{teachers.length} teaching staff members</p>
        </div>
        <Btn onClick={()=>setModal("add")}>+ Add Teacher</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {teachers.map(t=>(
          <Card key={t.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#0ea5e9,#0284c7)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👩‍🏫</div>
              <Badge color={t.paid?"green":"red"}>{t.paid?"Salary Paid":"Pending"}</Badge>
            </div>
            <h4 style={{ margin:"0 0 4px", fontSize:15, color:"#111827", fontWeight:700 }}>{t.name}</h4>
            <p style={{ margin:"0 0 12px", fontSize:12, color:"#6b7280" }}>{t.email}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
              {t.subjects.map(s=><Badge key={s} color="blue">{s}</Badge>)}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 0 0", borderTop:"1px solid #f0f0f0" }}>
              <span style={{ fontWeight:800, color:"#374151" }}>{fmt(t.salary)}/mo</span>
              <div style={{ display:"flex", gap:8 }}>
                <Btn small color={t.paid?"ghost":"success"} onClick={()=>togglePaid(t.id)}>
                  {t.paid?"Mark Unpaid":"Mark Paid"}
                </Btn>
                <button onClick={()=>remove(t.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"#ef4444" }}>🗑</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal==="add" && (
        <Modal title="Add Teacher" onClose={()=>setModal(null)}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} required/>
          <Input label="Email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} type="email"/>
          <Input label="Monthly Salary (KES)" value={form.salary} onChange={v=>setForm(p=>({...p,salary:v}))} type="number"/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:600, color:"#374151" }}>Subjects (select multiple)</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {SUBJECTS.map(s=>(
                <button key={s} onClick={()=>setForm(p=>({...p,subjects:p.subjects.includes(s)?p.subjects.filter(x=>x!==s):[...p.subjects,s]}))}
                  style={{ padding:"6px 12px", borderRadius:20, border:"1.5px solid",
                    borderColor: form.subjects.includes(s)?"#0284c7":"#e5e7eb",
                    background: form.subjects.includes(s)?"#dbeafe":"#fff",
                    color: form.subjects.includes(s)?"#1e40af":"#6b7280",
                    cursor:"pointer", fontSize:12, fontWeight:600 }}>{s}</button>
              ))}
            </div>
          </div>
          <Btn onClick={addTeacher} full>Add Teacher</Btn>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAFF MODULE
═══════════════════════════════════════════════════════════ */
function StaffModule({ staff, setStaff, staffAttendance, setStaffAttendance, showToast }) {
  const [modal, setModal] = useState(null);
  const [date, setDate] = useState(TODAY);
  const [form, setForm] = useState({ name:"", role:"", salary:15000 });

  const att = staffAttendance[date] || {};
  const markAtt = (id, status) => setStaffAttendance(prev=>({...prev,[date]:{...(prev[date]||{}),[id]:status}}));
  const togglePaid = (id) => setStaff(prev=>prev.map(s=>s.id===id?{...s,paid:!s.paid}:s));
  const remove = (id) => { setStaff(prev=>prev.filter(s=>s.id!==id)); showToast("Staff member removed","amber"); };
  const addStaff = () => {
    if(!form.name.trim()||!form.role.trim()) return showToast("Name and role required","error");
    setStaff(prev=>[...prev,{...form,id:uid(),paid:false,salary:+form.salary}]);
    setModal(null); setForm({name:"",role:"",salary:15000}); showToast("Staff added");
  };

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Non-Teaching Staff</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Salary & Attendance Management</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{ padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13,
              fontFamily:"'DM Sans',sans-serif" }}/>
          <Btn onClick={()=>setModal("add")}>+ Add Staff</Btn>
        </div>
      </div>

      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #f0f0f0" }}>
              {["Name","Role","Salary","Salary Status","Attendance","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#6b7280", fontWeight:700,
                  fontSize:11, textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map(s=>(
              <tr key={s.id} style={{ borderBottom:"1px solid #f9fafb" }}>
                <td style={{ padding:"12px", fontWeight:700, color:"#111827" }}>{s.name}</td>
                <td style={{ padding:"12px" }}><Badge color="violet">{s.role}</Badge></td>
                <td style={{ padding:"12px", fontWeight:600 }}>{fmt(s.salary)}</td>
                <td style={{ padding:"12px" }}>
                  <button onClick={()=>togglePaid(s.id)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                    <Badge color={s.paid?"green":"red"}>{s.paid?"✓ Paid":"⚠ Pending"}</Badge>
                  </button>
                </td>
                <td style={{ padding:"12px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    {["present","absent","late"].map(status=>(
                      <button key={status} onClick={()=>markAtt(s.id,status)} style={{
                        padding:"4px 10px", borderRadius:20, border:"1.5px solid", cursor:"pointer", fontSize:11, fontWeight:700,
                        background: att[s.id]===status ? (status==="present"?"#d1fae5":status==="absent"?"#fee2e2":"#fef3c7") : "#fff",
                        borderColor: att[s.id]===status ? (status==="present"?"#10b981":status==="absent"?"#ef4444":"#f59e0b") : "#e5e7eb",
                        color: att[s.id]===status ? (status==="present"?"#065f46":status==="absent"?"#991b1b":"#92400e") : "#9ca3af",
                      }}>{status.charAt(0).toUpperCase()+status.slice(1)}</button>
                    ))}
                  </div>
                </td>
                <td style={{ padding:"12px" }}>
                  <button onClick={()=>remove(s.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"#ef4444" }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal==="add" && (
        <Modal title="Add Staff Member" onClose={()=>setModal(null)}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} required/>
          <Input label="Role / Position" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} required placeholder="e.g. Security Guard"/>
          <Input label="Monthly Salary (KES)" value={form.salary} onChange={v=>setForm(p=>({...p,salary:v}))} type="number"/>
          <Btn onClick={addStaff} full>Add Staff Member</Btn>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ATTENDANCE MODULE
═══════════════════════════════════════════════════════════ */
function AttendanceModule({ user, students, teachers, attendance, setAttendance, teacherAtt, setTeacherAtt }) {
  const [date, setDate] = useState(TODAY);
  const [view, setView] = useState("students");
  const [grade, setGrade] = useState("Grade 7");

  const gradeStudents = students.filter(s=>s.grade===grade);
  const sAtt = attendance[date] || {};
  const tAtt = teacherAtt[date] || {};

  const markS = (id, status) => setAttendance(prev=>({...prev,[date]:{...(prev[date]||{}),[id]:status}}));
  const markT = (id, status) => setTeacherAtt(prev=>({...prev,[date]:{...(prev[date]||{}),[id]:status}}));

  const markAllPresent = () => {
    const updates = {};
    gradeStudents.forEach(s=>{ updates[s.id]="present"; });
    setAttendance(prev=>({...prev,[date]:{...(prev[date]||{}),...updates}}));
  };

  const presentCount  = gradeStudents.filter(s=>sAtt[s.id]==="present").length;
  const absentCount   = gradeStudents.filter(s=>sAtt[s.id]==="absent").length;
  const unmarkedCount = gradeStudents.filter(s=>!sAtt[s.id]).length;

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Attendance Register</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Mark and track daily attendance</p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{ padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20, background:"#f3f4f6", borderRadius:12, padding:4, width:"fit-content" }}>
        <Tab label="👨‍🎓 Students" active={view==="students"} onClick={()=>setView("students")}/>
        {user.role==="admin" && <Tab label="👩‍🏫 Teachers" active={view==="teachers"} onClick={()=>setView("teachers")}/>}
      </div>

      {view==="students" && (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <select value={grade} onChange={e=>setGrade(e.target.value)}
              style={{ padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13, fontFamily:"'DM Sans',sans-serif", background:"#fff" }}>
              {GRADES.map(g=><option key={g}>{g}</option>)}
            </select>
            <Btn small color="success" onClick={markAllPresent}>✓ Mark All Present</Btn>
            <div style={{ marginLeft:"auto", display:"flex", gap:12 }}>
              {[{label:"Present",v:presentCount,c:"#059669"},{label:"Absent",v:absentCount,c:"#dc2626"},{label:"Unmarked",v:unmarkedCount,c:"#9ca3af"}].map(x=>(
                <div key={x.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:x.c }}>{x.v}</div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{x.label}</div>
                </div>
              ))}
            </div>
          </div>
          <Card>
            {gradeStudents.length===0 && <p style={{textAlign:"center",color:"#9ca3af",padding:"20px 0"}}>No students in {grade}</p>}
            {gradeStudents.map(s=>(
              <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"12px 0", borderBottom:"1px solid #f9fafb" }}>
                <div>
                  <div style={{ fontWeight:700, color:"#111827", fontSize:14 }}>{s.name}</div>
                  <div style={{ color:"#9ca3af", fontSize:12 }}>{s.admNo||s.id}</div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  {["present","absent","late"].map(status=>(
                    <button key={status} onClick={()=>markS(s.id,status)} style={{
                      padding:"6px 14px", borderRadius:20, border:"1.5px solid", cursor:"pointer",
                      fontSize:12, fontWeight:700, transition:"all .15s",
                      background: sAtt[s.id]===status ? (status==="present"?"#d1fae5":status==="absent"?"#fee2e2":"#fef3c7") : "#fff",
                      borderColor: sAtt[s.id]===status ? (status==="present"?"#10b981":status==="absent"?"#ef4444":"#f59e0b") : "#e5e7eb",
                      color: sAtt[s.id]===status ? (status==="present"?"#065f46":status==="absent"?"#991b1b":"#92400e") : "#9ca3af",
                    }}>{status.charAt(0).toUpperCase()+status.slice(1)}</button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </>
      )}

      {view==="teachers" && user.role==="admin" && (
        <Card>
          {teachers.map(t=>(
            <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"12px 0", borderBottom:"1px solid #f9fafb" }}>
              <div>
                <div style={{ fontWeight:700, color:"#111827", fontSize:14 }}>{t.name}</div>
                <div style={{ color:"#9ca3af", fontSize:12 }}>{t.subjects.join(", ")}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {["present","absent","on leave"].map(status=>(
                  <button key={status} onClick={()=>markT(t.id,status)} style={{
                    padding:"6px 14px", borderRadius:20, border:"1.5px solid", cursor:"pointer",
                    fontSize:12, fontWeight:700, transition:"all .15s",
                    background: tAtt[t.id]===status ? (status==="present"?"#d1fae5":status==="absent"?"#fee2e2":"#fef3c7") : "#fff",
                    borderColor: tAtt[t.id]===status ? (status==="present"?"#10b981":status==="absent"?"#ef4444":"#f59e0b") : "#e5e7eb",
                    color: tAtt[t.id]===status ? (status==="present"?"#065f46":status==="absent"?"#991b1b":"#92400e") : "#9ca3af",
                  }}>{status.charAt(0).toUpperCase()+status.slice(1)}</button>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIMETABLE MODULE
═══════════════════════════════════════════════════════════ */
function TimetableModule({ teachers, timetable, setTimetable }) {
  const [grade, setGrade] = useState("Grade 7");
  const [editing, setEditing] = useState(null); // {day, period}
  const [selTeacher, setSelTeacher] = useState("");

  const tt = timetable[grade] || {};
  const getTeacher = (id) => teachers.find(t=>t.id===id);

  const assign = () => {
    if(!selTeacher) return;
    setTimetable(prev=>({
      ...prev,
      [grade]: { ...(prev[grade]||{}), [editing.day]: { ...((prev[grade]||{})[editing.day]||{}), [editing.period]: selTeacher } }
    }));
    setEditing(null); setSelTeacher("");
  };

  const clear = (day, period) => {
    setTimetable(prev=>{
      const newGrade = { ...(prev[grade]||{}) };
      const newDay = { ...(newGrade[day]||{}) };
      delete newDay[period];
      newGrade[day] = newDay;
      return { ...prev, [grade]: newGrade };
    });
  };

  const subjectColor = (subj) => {
    const colors = { Mathematics:"#dbeafe|#1e40af", English:"#d1fae5|#065f46", Kiswahili:"#fef3c7|#92400e",
      Science:"#ede9fe|#5b21b6", "Social Studies":"#fee2e2|#991b1b", CRE:"#f0fdf4|#166534",
      "Art & Craft":"#fdf4ff|#86198f", "Physical Education":"#fff7ed|#9a3412", "Computer Studies":"#f0f9ff|#0c4a6e" };
    const teacher = teachers.find(t=>t.id===subj);
    if (!teacher) return ["#f3f4f6","#374151"];
    const sub = teacher.subjects[0];
    return (colors[sub]||"#f3f4f6|#374151").split("|");
  };

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Teaching Timetable</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Click a cell to assign a teacher</p>
        </div>
        <select value={grade} onChange={e=>setGrade(e.target.value)}
          style={{ padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13, fontFamily:"'DM Sans',sans-serif", background:"#fff" }}>
          {GRADES.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              <th style={{ padding:"12px 10px", border:"1px solid #e5e7eb", color:"#6b7280", fontWeight:700, width:90, textAlign:"left" }}>Period</th>
              {DAYS.map(d=>(
                <th key={d} style={{ padding:"12px 10px", border:"1px solid #e5e7eb", color:"#374151", fontWeight:700, textAlign:"center" }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period,pi)=>(
              <tr key={period} style={{ background: pi===3||pi===6?"#fff9f0":"#fff" }}>
                <td style={{ padding:"8px 10px", border:"1px solid #e5e7eb", fontWeight:700, color:"#6b7280", fontSize:11, whiteSpace:"nowrap" }}>
                  {pi===3?"☕ BREAK":pi===6?"🍽 LUNCH":period}
                </td>
                {DAYS.map(day=>{
                  if(pi===3||pi===6) return <td key={day} style={{ border:"1px solid #e5e7eb", background:"#fef9ec", textAlign:"center", fontSize:11, color:"#b45309", fontWeight:600 }}>{pi===3?"Break":"Lunch"}</td>;
                  const teacherId = tt[day]?.[period];
                  const teacher = getTeacher(teacherId);
                  const [bg,fg] = subjectColor(teacherId);
                  return (
                    <td key={day} style={{ border:"1px solid #e5e7eb", padding:4, cursor:"pointer", minWidth:120 }}
                      onClick={()=>{ setEditing({day,period}); setSelTeacher(teacherId||""); }}>
                      {teacher ? (
                        <div style={{ background:bg, borderRadius:8, padding:"6px 8px", position:"relative" }}>
                          <div style={{ color:fg, fontWeight:700, fontSize:11 }}>{teacher.subjects[0]}</div>
                          <div style={{ color:fg, opacity:.8, fontSize:10 }}>{teacher.name.split(" ").slice(-1)[0]}</div>
                          <button onClick={e=>{e.stopPropagation();clear(day,period);}} style={{ position:"absolute",top:2,right:4,background:"none",border:"none",cursor:"pointer",color:fg,opacity:.5,fontSize:10 }}>✕</button>
                        </div>
                      ) : (
                        <div style={{ height:44, borderRadius:8, border:"1.5px dashed #e5e7eb", display:"flex",
                          alignItems:"center", justifyContent:"center", color:"#d1d5db", fontSize:18 }}>+</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={`Assign Teacher — ${editing.day} ${editing.period}`} onClose={()=>setEditing(null)}>
          <Select label="Select Teacher" value={selTeacher} onChange={setSelTeacher}
            options={[{value:"",label:"— Clear slot —"},...teachers.map(t=>({value:t.id,label:`${t.name} (${t.subjects.join(", ")})`}))]}/>
          <div style={{ display:"flex", gap:10 }}>
            <Btn onClick={assign} full>Assign</Btn>
            <Btn color="ghost" onClick={()=>setEditing(null)} full>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXAM REPORTS MODULE
═══════════════════════════════════════════════════════════ */
function ExamsModule({ user, students, exams, setExams, showToast }) {
  const [selStudent, setSelStudent] = useState(
    user.role==="parent" ? USERS.find(u=>u.id===user.id)?.studentId || students[0]?.id : students[0]?.id
  );
  const [editing, setEditing] = useState(false);
  const [scores, setScores] = useState({});

  const student = students.find(s=>s.id===selStudent);
  const studentScores = exams[selStudent] || {};
  const average = avg(studentScores);
  const totalScore = Object.values(studentScores).reduce((a,b)=>a+b,0);
  const totalMax   = Object.keys(studentScores).length * 100;

  useEffect(()=>{ setScores(exams[selStudent]||{}); },[selStudent,exams]);

  const save = () => {
    setExams(prev=>({...prev,[selStudent]:scores}));
    setEditing(false); showToast("Exam scores saved");
  };

  const gradeLabel = (s) => {
    if(s>=80) return { label:"Excellent",color:"#059669" };
    if(s>=70) return { label:"Good",color:"#0284c7" };
    if(s>=60) return { label:"Average",color:"#d97706" };
    if(s>=50) return { label:"Below Average",color:"#dc2626" };
    return { label:"Fail",color:"#991b1b" };
  };

  const overallGrade = gradeLabel(average);
  const rank = [...students].sort((a,b)=>{
    const aAvg = avg(exams[a.id]||{}); const bAvg = avg(exams[b.id]||{});
    return bAvg - aAvg;
  }).findIndex(s=>s.id===selStudent)+1;

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Exam Report Cards</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Generate and manage student academic reports</p>
        </div>
        {user.role!=="parent" && (
          <select value={selStudent} onChange={e=>setSelStudent(e.target.value)}
            style={{ padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13, fontFamily:"'DM Sans',sans-serif", background:"#fff" }}>
            {students.map(s=><option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
          </select>
        )}
      </div>

      {student && (
        <>
          {/* Report Header */}
          <Card style={{ marginBottom:16, background:"linear-gradient(135deg,#0f172a,#0c4a6e)", color:"#fff" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Elimu Academy · Official Report Card</div>
                <h3 style={{ margin:"0 0 4px", fontFamily:"'Playfair Display',serif", fontSize:22 }}>{student.name}</h3>
                <div style={{ color:"#94a3b8", fontSize:13 }}>{student.grade} · Adm No: {student.admNo} · Term 2, 2025</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:48, fontWeight:900, fontFamily:"'Playfair Display',serif", color:average>=70?"#34d399":average>=50?"#fbbf24":"#f87171" }}>{grade(average)}</div>
                <div style={{ color:"#94a3b8", fontSize:12 }}>{overallGrade.label}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:28, fontWeight:800 }}>{average}%</div>
                <div style={{ color:"#94a3b8", fontSize:12 }}>Average · Rank #{rank}</div>
                <div style={{ color:"#94a3b8", fontSize:12 }}>{totalScore}/{totalMax} marks</div>
              </div>
            </div>
          </Card>

          {/* Subjects Table */}
          <Card style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h4 style={{ margin:0, color:"#374151", fontFamily:"'Playfair Display',serif" }}>Subject Performance</h4>
              {user.role==="admin" && (
                <Btn small onClick={()=>setEditing(!editing)}>{editing?"Cancel":"✏ Edit Scores"}</Btn>
              )}
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"2px solid #f0f0f0" }}>
                  {["Subject","Score","Grade","Remarks","Bar"].map(h=>(
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"#6b7280", fontWeight:700, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SUBJECTS.map(sub=>{
                  const sc = editing ? (scores[sub]||0) : (studentScores[sub]||0);
                  const {label,color} = gradeLabel(sc);
                  return (
                    <tr key={sub} style={{ borderBottom:"1px solid #f9fafb" }}>
                      <td style={{ padding:"10px 12px", fontWeight:600, color:"#374151" }}>{sub}</td>
                      <td style={{ padding:"10px 12px" }}>
                        {editing ? (
                          <input type="number" min={0} max={100} value={scores[sub]||0}
                            onChange={e=>setScores(p=>({...p,[sub]:+e.target.value}))}
                            style={{ width:60, padding:"4px 8px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}/>
                        ) : (
                          <span style={{ fontWeight:800, color }}>{sc}</span>
                        )}
                      </td>
                      <td style={{ padding:"10px 12px" }}><Badge color={sc>=80?"green":sc>=70?"blue":sc>=60?"amber":sc>=50?"amber":"red"}>{grade(sc)}</Badge></td>
                      <td style={{ padding:"10px 12px", color:"#6b7280", fontSize:12 }}>{label}</td>
                      <td style={{ padding:"10px 12px", width:120 }}><ProgressBar value={sc} color={sc>=70?"#10b981":sc>=50?"#f59e0b":"#ef4444"}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {editing && <div style={{ marginTop:16 }}><Btn onClick={save} color="success">Save Report</Btn></div>}
          </Card>

          {/* Class ranking */}
          {user.role==="admin" && (
            <Card>
              <h4 style={{ margin:"0 0 16px", fontFamily:"'Playfair Display',serif", color:"#374151" }}>Class Rankings — {student.grade}</h4>
              {[...students].filter(s=>s.grade===student.grade).sort((a,b)=>avg(exams[b.id]||{})-avg(exams[a.id]||{})).map((s,i)=>(
                <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                  borderBottom:"1px solid #f9fafb", background: s.id===selStudent?"#f0f9ff":"transparent",
                  borderRadius:8, paddingLeft:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:13, fontWeight:800,
                    background: i===0?"#fef3c7":i===1?"#f1f5f9":i===2?"#fff7ed":"#f9fafb",
                    color: i===0?"#d97706":i===1?"#6b7280":i===2?"#c2410c":"#9ca3af" }}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                  </div>
                  <div style={{ flex:1, fontWeight:700, color:"#374151", fontSize:13 }}>{s.name}</div>
                  <div style={{ fontWeight:800, color:"#0284c7" }}>{avg(exams[s.id]||{})}%</div>
                  <Badge color={avg(exams[s.id]||{})>=70?"green":avg(exams[s.id]||{})>=50?"amber":"red"}>{grade(avg(exams[s.id]||{}))}</Badge>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEES MODULE
═══════════════════════════════════════════════════════════ */
function FeesModule({ students, setStudents, showToast }) {
  const [modal, setModal] = useState(null);
  const [selId, setSelId] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  const filtered = students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));
  const totalFees = students.reduce((a,s)=>a+s.fees,0);
  const collected = students.reduce((a,s)=>a+s.paid,0);
  const balance   = totalFees - collected;

  const recordPayment = () => {
    if(!amount||+amount<=0) return showToast("Enter valid amount","error");
    setStudents(prev=>prev.map(s=>s.id===selId?{...s,paid:Math.min(s.fees,s.paid+(+amount))}:s));
    setModal(null); setAmount(""); showToast(`Payment of ${fmt(+amount)} recorded`);
  };

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Fees Management</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Track and record school fee payments</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:24 }}>
        <StatCard icon="💰" label="Total Expected" value={fmt(totalFees)} accent="#dbeafe"/>
        <StatCard icon="✅" label="Collected" value={fmt(collected)} sub={`${pct(collected,totalFees)}%`} accent="#d1fae5"/>
        <StatCard icon="⚠" label="Outstanding" value={fmt(balance)} sub={`${students.filter(s=>s.paid<s.fees).length} students`} accent="#fee2e2"/>
      </div>

      <Card style={{ marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search student…"
          style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14,
            fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" }}/>
      </Card>

      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #f0f0f0" }}>
              {["Student","Grade","Total Fees","Paid","Balance","Progress","Action"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#6b7280", fontWeight:700, fontSize:11, textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s=>{
              const bal = s.fees - s.paid;
              return (
                <tr key={s.id} style={{ borderBottom:"1px solid #f9fafb" }}>
                  <td style={{ padding:"12px", fontWeight:700, color:"#111827" }}>{s.name}</td>
                  <td style={{ padding:"12px" }}><Badge color="blue">{s.grade}</Badge></td>
                  <td style={{ padding:"12px" }}>{fmt(s.fees)}</td>
                  <td style={{ padding:"12px", color:"#059669", fontWeight:700 }}>{fmt(s.paid)}</td>
                  <td style={{ padding:"12px" }}><Badge color={bal>0?"red":"green"}>{bal>0?fmt(bal):"✓ Cleared"}</Badge></td>
                  <td style={{ padding:"12px", width:120 }}>
                    <ProgressBar value={s.paid} max={s.fees} color={pct(s.paid,s.fees)>=80?"#10b981":pct(s.paid,s.fees)>=50?"#f59e0b":"#ef4444"}/>
                    <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{pct(s.paid,s.fees)}%</div>
                  </td>
                  <td style={{ padding:"12px" }}>
                    {bal>0 && <Btn small color="success" onClick={()=>{ setSelId(s.id); setModal("pay"); }}>Record Payment</Btn>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {modal==="pay" && (
        <Modal title={`Record Payment — ${students.find(s=>s.id===selId)?.name}`} onClose={()=>setModal(null)}>
          <div style={{ background:"#f9fafb", borderRadius:10, padding:14, marginBottom:16 }}>
            <div style={{ fontSize:13, color:"#6b7280" }}>Outstanding Balance</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#dc2626" }}>
              {fmt(students.find(s=>s.id===selId)?.fees - students.find(s=>s.id===selId)?.paid || 0)}
            </div>
          </div>
          <Input label="Amount Paid (KES)" value={amount} onChange={setAmount} type="number" placeholder="e.g. 5000"/>
          <Btn onClick={recordPayment} full color="success">Record Payment</Btn>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EVENTS / NOTIFICATIONS MODULE
═══════════════════════════════════════════════════════════ */
function EventsModule({ user, events, setEvents, showToast }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:"", date:"", audience:"all", message:"" });

  const addEvent = () => {
    if(!form.title.trim()||!form.date) return showToast("Title and date required","error");
    setEvents(prev=>[...prev,{...form,id:uid(),sent:false}]);
    setModal(null); setForm({title:"",date:"",audience:"all",message:""}); showToast("Event added");
  };

  const sendNotice = (id) => {
    setEvents(prev=>prev.map(e=>e.id===id?{...e,sent:true}:e));
    showToast("Notification sent to recipients! 📤");
  };

  const remove = (id) => setEvents(prev=>prev.filter(e=>e.id!==id));

  const upcoming = events.filter(e=>e.date>=TODAY).sort((a,b)=>a.date.localeCompare(b.date));
  const past     = events.filter(e=>e.date<TODAY).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>School Notifications</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Notify parents & staff of important dates</p>
        </div>
        {user.role==="admin" && <Btn onClick={()=>setModal("add")}>+ Add Event</Btn>}
      </div>

      <h4 style={{ color:"#374151", marginBottom:12 }}>📅 Upcoming Events</h4>
      {upcoming.length===0 && <Card style={{ marginBottom:20 }}><p style={{ textAlign:"center", color:"#9ca3af" }}>No upcoming events.</p></Card>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12, marginBottom:24 }}>
        {upcoming.map(e=>{
          const daysLeft = Math.ceil((new Date(e.date)-new Date())/86400000);
          return (
            <Card key={e.id} style={{ borderLeft:"4px solid #0ea5e9" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <Badge color={e.audience==="all"?"violet":"teal"}>{e.audience==="all"?"All Staff":"Parents"}</Badge>
                <Badge color={e.sent?"green":"amber"}>{e.sent?"Sent":"Pending"}</Badge>
              </div>
              <h4 style={{ margin:"0 0 6px", color:"#111827", fontSize:15 }}>{e.title}</h4>
              <p style={{ margin:"0 0 12px", fontSize:12, color:"#6b7280" }}>
                📅 {new Date(e.date).toLocaleDateString("en-KE",{day:"numeric",month:"long",year:"numeric"})}
                {daysLeft>0 && <span style={{ marginLeft:8, color:"#0284c7", fontWeight:700 }}>({daysLeft}d away)</span>}
              </p>
              {e.message && <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 12px" }}>{e.message}</p>}
              {user.role==="admin" && (
                <div style={{ display:"flex", gap:8 }}>
                  {!e.sent && <Btn small color="success" onClick={()=>sendNotice(e.id)}>📤 Send</Btn>}
                  <button onClick={()=>remove(e.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"#ef4444",fontSize:13 }}>🗑 Remove</button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {past.length>0 && (
        <>
          <h4 style={{ color:"#9ca3af", marginBottom:12 }}>Past Events</h4>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
            {past.map(e=>(
              <Card key={e.id} style={{ borderLeft:"4px solid #e5e7eb", opacity:.7 }}>
                <h4 style={{ margin:"0 0 4px", color:"#6b7280", fontSize:14 }}>{e.title}</h4>
                <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>
                  {new Date(e.date).toLocaleDateString("en-KE",{day:"numeric",month:"long",year:"numeric"})}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      {modal==="add" && (
        <Modal title="Add School Event / Notification" onClose={()=>setModal(null)}>
          <Input label="Event Title" value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} required placeholder="e.g. Term 3 Opening Day"/>
          <Input label="Date" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))} type="date" required/>
          <Select label="Target Audience" value={form.audience} onChange={v=>setForm(p=>({...p,audience:v}))}
            options={[{value:"all",label:"All (Students, Parents & Staff)"},{value:"parents",label:"Parents Only"},{value:"staff",label:"Staff Only"}]}/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", marginBottom:5, fontSize:13, fontWeight:600, color:"#374151" }}>Message (optional)</label>
            <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
              placeholder="Additional details for parents/staff…" rows={3}
              style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
                fontSize:14, fontFamily:"'DM Sans',sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <Btn onClick={addEvent} full>Add Event</Btn>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEEKLY REPORTS MODULE
═══════════════════════════════════════════════════════════ */
function WeeklyReportsModule({ students, attendance, exams, showToast }) {
  const [generated, setGenerated] = useState(false);
  const [selGrade, setSelGrade] = useState("All");

  const attDays = Object.keys(attendance);
  const getAttRate = (id) => {
    if(!attDays.length) return 0;
    const p = attDays.filter(d=>attendance[d]?.[id]==="present").length;
    return pct(p, attDays.length);
  };

  const filtered = selGrade==="All" ? students : students.filter(s=>s.grade===selGrade);

  const generate = () => { setGenerated(true); showToast("Weekly report generated! 📊"); };
  const send = () => showToast("Reports sent to parents & admin via SMS/email 📤");

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px", color:"#111827" }}>Weekly Progress Reports</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Generate and send weekly summaries to parents and admin</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <select value={selGrade} onChange={e=>setSelGrade(e.target.value)}
            style={{ padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13, fontFamily:"'DM Sans',sans-serif", background:"#fff" }}>
            <option value="All">All Grades</option>
            {GRADES.map(g=><option key={g}>{g}</option>)}
          </select>
          <Btn onClick={generate}>⚙ Generate Report</Btn>
          {generated && <Btn color="success" onClick={send}>📤 Send to All</Btn>}
        </div>
      </div>

      {!generated && (
        <Card style={{ textAlign:"center", padding:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📊</div>
          <h3 style={{ margin:"0 0 8px", fontFamily:"'Playfair Display',serif", color:"#374151" }}>Generate Weekly Report</h3>
          <p style={{ color:"#9ca3af", marginBottom:24 }}>Click "Generate Report" to create a summary of attendance, exam scores, and fees balance for all students this week.</p>
          <Btn onClick={generate}>⚙ Generate Now</Btn>
        </Card>
      )}

      {generated && (
        <div>
          <div style={{ background:"linear-gradient(135deg,#0f172a,#0c4a6e)", borderRadius:16, padding:24, marginBottom:20, color:"#fff" }}>
            <div style={{ fontSize:12, color:"#94a3b8", fontWeight:700, letterSpacing:1, marginBottom:8 }}>
              ELIMU ACADEMY · WEEKLY REPORT · {new Date().toLocaleDateString("en-KE",{day:"numeric",month:"long",year:"numeric"})}
            </div>
            <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
              <div><div style={{fontSize:32,fontWeight:900}}>{filtered.length}</div><div style={{color:"#94a3b8",fontSize:12}}>Students</div></div>
              <div><div style={{fontSize:32,fontWeight:900}}>{Math.round(filtered.reduce((a,s)=>a+getAttRate(s.id),0)/Math.max(filtered.length,1))}%</div><div style={{color:"#94a3b8",fontSize:12}}>Avg Attendance</div></div>
              <div><div style={{fontSize:32,fontWeight:900}}>{Math.round(filtered.reduce((a,s)=>a+avg(exams[s.id]||{}),0)/Math.max(filtered.length,1))}%</div><div style={{color:"#94a3b8",fontSize:12}}>Avg Score</div></div>
              <div><div style={{fontSize:32,fontWeight:900}}>{fmt(filtered.reduce((a,s)=>a+(s.fees-s.paid),0))}</div><div style={{color:"#94a3b8",fontSize:12}}>Total Outstanding</div></div>
            </div>
          </div>

          <Card>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"2px solid #f0f0f0" }}>
                  {["Student","Grade","Attendance","Avg Score","Grade","Fees Balance","Status"].map(h=>(
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#6b7280", fontWeight:700, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s=>{
                  const attR  = getAttRate(s.id);
                  const score = avg(exams[s.id]||{});
                  const bal   = s.fees - s.paid;
                  const alert = attR<60||score<50||bal>s.fees*.5;
                  return (
                    <tr key={s.id} style={{ borderBottom:"1px solid #f9fafb", background: alert?"#fff9f0":"transparent" }}>
                      <td style={{ padding:"12px", fontWeight:700, color:"#111827" }}>
                        {alert && <span style={{marginRight:4}}>⚠</span>}{s.name}
                      </td>
                      <td style={{ padding:"12px" }}><Badge color="blue">{s.grade}</Badge></td>
                      <td style={{ padding:"12px" }}>
                        <span style={{ color: attR>=80?"#059669":attR>=60?"#d97706":"#dc2626", fontWeight:700 }}>{attR}%</span>
                      </td>
                      <td style={{ padding:"12px", fontWeight:700, color: score>=70?"#059669":score>=50?"#d97706":"#dc2626" }}>{score}%</td>
                      <td style={{ padding:"12px" }}><Badge color={score>=70?"green":score>=50?"amber":"red"}>{grade(score)}</Badge></td>
                      <td style={{ padding:"12px" }}><Badge color={bal===0?"green":bal>s.fees*.5?"red":"amber"}>{bal===0?"Cleared":fmt(bal)}</Badge></td>
                      <td style={{ padding:"12px" }}><Badge color={alert?"red":"green"}>{alert?"Needs Attention":"On Track"}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <div style={{ marginTop:16, padding:16, background:"#f0fdf4", borderRadius:12, border:"1px solid #bbf7d0" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#065f46", marginBottom:6 }}>📤 Report Delivery</div>
            <div style={{ fontSize:12, color:"#059669" }}>
              When you click "Send to All", this report will be sent to:<br/>
              • All parents via SMS to their registered phone numbers<br/>
              • Admin email: admin@school.ke<br/>
              • Individual student summaries to each parent's email
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [tab,  setTab]  = useState("dashboard");
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [teachers, setTeachers] = useState(SEED_TEACHERS);
  const [staff,    setStaff]    = useState(SEED_STAFF);
  const [attendance,    setAttendance]    = useState({ student:{}, teacher:{} });
  const [teacherAtt,    setTeacherAtt]    = useState({});
  const [staffAtt,      setStaffAtt]      = useState({});
  const [exams,    setExams]    = useState(SEED_EXAMS);
  const [timetable,setTimetable] = useState(SEED_TIMETABLE);
  const [events,   setEvents]   = useState(SEED_EVENTS);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(()=>setToast(null), 3000);
  };

  const login  = (u) => { setUser(u); setTab("dashboard"); };
  const logout = () => { setUser(null); setTab("dashboard"); };

  if (!user) return <><style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif}`}</style><LoginScreen onLogin={login}/></>;

  const renderTab = () => {
    switch(tab) {
      case "dashboard":  return <Dashboard user={user} students={students} teachers={teachers} staff={staff} attendance={attendance} exams={exams}/>;
      case "students":   return <StudentsModule students={students} setStudents={setStudents} showToast={showToast}/>;
      case "teachers":   return <TeachersModule teachers={teachers} setTeachers={setTeachers} showToast={showToast}/>;
      case "staff":      return <StaffModule staff={staff} setStaff={setStaff} staffAttendance={staffAtt} setStaffAttendance={setStaffAtt} showToast={showToast}/>;
      case "attendance": return <AttendanceModule user={user} students={students} teachers={teachers} attendance={attendance} setAttendance={(fn)=>setAttendance(prev=>({...prev,student:typeof fn==="function"?fn(prev.student):fn}))} teacherAtt={teacherAtt} setTeacherAtt={setTeacherAtt}/>;
      case "timetable":  return <TimetableModule teachers={teachers} timetable={timetable} setTimetable={setTimetable}/>;
      case "exams":      return <ExamsModule user={user} students={students} exams={exams} setExams={setExams} showToast={showToast}/>;
      case "fees":       return <FeesModule students={students} setStudents={setStudents} showToast={showToast}/>;
      case "events":     return <EventsModule user={user} events={events} setEvents={setEvents} showToast={showToast}/>;
      case "reports":    return <WeeklyReportsModule students={students} attendance={attendance.student} exams={exams} showToast={showToast}/>;
      default:           return <Dashboard user={user} students={students} teachers={teachers} staff={staff} attendance={attendance} exams={exams}/>;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <Sidebar user={user} active={tab} onNav={setTab} onLogout={logout}/>

      <main style={{ flex:1, overflowY:"auto", minHeight:"100vh" }}>
        {renderTab()}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}
// Render the App component into the root div
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
