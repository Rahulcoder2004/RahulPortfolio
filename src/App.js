
import { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";

// ── Google Fonts ─────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');`;

// ── Design tokens ────────────────────────────────────────────────────
const C = {
  bg:      "#050a14",
  glass:   "rgba(255,255,255,0.04)",
  border:  "rgba(0,212,255,0.18)",
  cyan:    "#00d4ff",
  cyanDim: "rgba(0,212,255,0.12)",
  lime:    "#39ff14",
  text:    "#e2eff5",
  muted:   "#607d8b",
  white:   "#ffffff",
  H:       "'Poppins', sans-serif",
  B:       "'Inter', sans-serif",
};

// ── Data ─────────────────────────────────────────────────────────────
const NAV_ITEMS = ["about","skills","projects","experience","contact"];

const SKILLS = [
  { category: "Frontend", items: [
    { name: "HTML / CSS", pct: 90 }, { name: "JavaScript (ES6+)", pct: 82 },
    { name: "React.js", pct: 80 },   { name: "Responsive Design", pct: 85 },
  ]},
  { category: "Backend", items: [
    { name: "Node.js", pct: 60 },    { name: "Express.js", pct: 58 },
    { name: "REST APIs", pct: 65 },  { name: "SQL", pct: 75 },
  ]},
  { category: "Tools", items: [
    { name: "Git / GitHub", pct: 78 }, { name: "VS Code", pct: 95 },
    { name: "Figma (basic)", pct: 50 }, { name: "Vercel", pct: 72 },
  ]},
];

const PROJECTS = [
  { emoji:"🫀", title:"ECG Arrhythmia Classification",
    desc:"Developed an ECG arrhythmia classification system using deep learning techniques to detect multiple types of heart rhythm abnormalities. The model combines CNN and LSTM architectures for effective feature extraction and temporal pattern recognition. ECG signals were preprocessed and transformed into structured inputs to improve classification performance. The system was evaluated using metrics such as accuracy, precision, recall, and F1-score. A simple web interface was integrated to display predictions and assist in early cardiac diagnosis.",
    tags:["Python","TensorFlow","Scikit-learn","Pandas","React"], github:"https://github.com/Rahulcoder2004/ECG_Classification/tree/main/ECGProject-master", live:"#" },
  { 
  emoji: "📸", 
  title: "Insta Share App",
  desc: "An Instagram-like social media application built using React that features authentication, protected routes, user stories, posts, likes/unlikes, search functionality, and user profiles. Data is fetched from APIs using class components and lifecycle methods, with full responsive design.\n\nDemo Credentials:\n• Username: agastya | Password: myth#789\n• Username: aakash | Password: sky@007\n• Username: rahul | Password: rahul@2021",
  tags: ["React", "React Router", "REST API", "Authentication", "Cookies", "Responsive Design"],
  github: "https://github.com/Rahulcoder2004/instaShare", 
  live: "https://instashare04.ccbp.tech/login" 
},
  { 
  emoji: "🛒",
  title: "Products App",
  desc: "An e-commerce-style React application built with authentication and protected routes to ensure secure access to product details. Authenticated users can view detailed product information and similar products fetched via JWT-secured APIs. The app includes quantity increment and decrement functionality along with proper loader and failure state handling. Seamless navigation is provided between Products and Product Details routes with a fully responsive UI. Demo Login: Prime User (Username: rahul, Password: rahul@2021) and Non-Prime User (Username: raja, Password: raja@2021).",
  tags: ["React", "React Router", "REST API", "Authentication", "Cookies", "Responsive Design"],
  github: "https://github.com/Rahulcoder2004/NxtTrend-E-Commerce",
  live: "https://rahulnxttrend.ccbp.tech/login"
},
{ 
  emoji: "😄",
  title: "Emoji Game",
  desc: "An interactive memory-based Emoji Game built using React where users must click each emoji only once without repetition. The game tracks the current score and top score, updating them based on user interactions. A win state is displayed when all emojis are clicked exactly once, while a lose state appears on repeated selections. The Play Again option allows users to restart the game while preserving the top score. Emojis are rendered dynamically using props with efficient state and conditional rendering logic.",
  tags: ["React", "State Management", "Props", "Event Handling", "Conditional Rendering"],
  github: "https://github.com/Rahulcoder2004/EmojiGame",
  live: "https://emojigame04.ccbp.tech/"
},
];

const GOALS = [
  "Land a Junior Software Developer role where I can grow rapidly",
  "Master advanced React patterns & system design principles",
  "Contribute to impactful open-source projects",
  "Build products that solve real-world problems at scale",
];

const EXP = [
  "Developed and maintained responsive web interfaces using HTML, CSS, and JavaScript.",
  "Worked on React.js components and learned state management in a real-world codebase.",
  "Collaborated with developers on REST API integration and debugging.",
  "Contributed to page performance — optimizing load times and reducing render-blocking resources.",
  "Gained hands-on Git workflow experience: branching, PRs, and code reviews.",
  "Applied UI/UX best practices to improve user experience on live product features.",
];

// ── Utility: FadeIn on scroll ─────────────────────────────────────────
function FadeIn({ children, delay=0 }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setV(true); },{ threshold:0.08 });
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?"translateY(0)":"translateY(26px)",
      transition:`opacity 0.65s ${delay}ms ease,transform 0.65s ${delay}ms ease` }}>
      {children}
    </div>
  );
}

// ── Utility: Animated progress bar ────────────────────────────────────
function Bar({ pct, delay=0 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setTimeout(()=>setW(pct),delay); },{ threshold:0.5 });
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[pct,delay]);
  return (
    <div ref={ref} style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${w}%`, background:`linear-gradient(90deg,${C.cyan},${C.lime})`,
        transition:"width 1s cubic-bezier(0.4,0,0.2,1)", borderRadius:2 }} />
    </div>
  );
}

// ── Utility: Typewriter ───────────────────────────────────────────────
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(()=>{
    const w = words[idx%words.length];
    const t = setTimeout(()=>{
      if(!del){ setTxt(w.slice(0,txt.length+1)); if(txt.length+1===w.length) setTimeout(()=>setDel(true),1400); }
      else { setTxt(w.slice(0,txt.length-1)); if(txt.length-1===0){ setDel(false); setIdx(i=>i+1); } }
    }, del?45:75);
    return ()=>clearTimeout(t);
  },[txt,del,idx,words]);
  return <span style={{color:C.cyan}}>{txt}<span style={{animation:"blink 1s step-end infinite",color:C.cyan}}>|</span></span>;
}

// ── Utility: Cursor glow ──────────────────────────────────────────────
function CursorGlow() {
  const [p, setP] = useState({x:-999,y:-999});
  useEffect(()=>{
    const h=e=>setP({x:e.clientX,y:e.clientY});
    window.addEventListener("mousemove",h);
    return ()=>window.removeEventListener("mousemove",h);
  },[]);
  return <div style={{ position:"fixed", pointerEvents:"none", zIndex:0, width:520, height:520, borderRadius:"50%",
    background:"radial-gradient(circle,rgba(0,212,255,0.055) 0%,transparent 70%)",
    left:p.x, top:p.y, transform:"translate(-50%,-50%)", transition:"left 0.08s,top 0.08s" }} />;
}

// ── Utility: Hamburger icon ───────────────────────────────────────────
function BurgerIcon({ open }) {
  return (
    <div style={{ width:26, height:18, position:"relative", cursor:"pointer" }}>
      {[0,1,2].map(i=>(
        <span key={i} style={{
          position:"absolute", left:0, height:2, background:C.cyan, borderRadius:2,
          transition:"all 0.3s ease",
          width: open && i===1 ? 0 : 26,
          top: i===0 ? (open?8:0) : i===1 ? 8 : (open?8:16),
          transform: open ? (i===0?"rotate(45deg)": i===2?"rotate(-45deg)":"none") : "none",
          opacity: open && i===1 ? 0 : 1,
        }} />
      ))}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────
function SH({ num, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.6rem" }}>
      <span style={{ width:28, height:1, background:C.cyan, display:"block" }} />
      <span style={{ fontFamily:C.B, fontSize:"0.72rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.cyan }}>
        {num} / {label}
      </span>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────
export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

    const sendFormData = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_v2dq65l",
      "template_0ce5cfu",
      formData,
      "1ZC-34hhifp9LAyVl"
    )
    .then(() => {
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    })
    .catch(() => {
      alert("Failed to send message. Please try again.");
    });
  };

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  useEffect(()=>{
    const h=()=>{ if(window.innerWidth>768) setMenuOpen(false); };
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  useEffect(()=>{
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return ()=>{ document.body.style.overflow=""; };
  },[menuOpen]);

  const go = id => {
    setMenuOpen(false);
    setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}), menuOpen?260:0);
  };

  return (
    <div style={{ fontFamily:C.B, background:C.bg, color:C.text, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        ${FONTS}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        @keyframes blink {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes pulse {0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}
        @keyframes fadeSlide {from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.cyan};border-radius:2px}

        /* grid bg */
        .gbg{position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:linear-gradient(rgba(0,212,255,.022)1px,transparent 1px),
          linear-gradient(90deg,rgba(0,212,255,.022)1px,transparent 1px);
          background-size:64px 64px;}

        /* nav links */
        .nl{font-family:${C.B};color:${C.muted};text-decoration:none;font-size:.8rem;
          letter-spacing:.12em;text-transform:uppercase;font-weight:500;cursor:pointer;
          transition:color .22s;position:relative;padding:.2rem 0;}
        .nl::after{content:'';position:absolute;left:0;bottom:-2px;width:0;height:1px;
          background:${C.cyan};transition:width .28s;}
        .nl:hover,.nl:hover::after{color:${C.cyan};width:100%;}

        /* mobile overlay */
        .mob{position:fixed;inset:0;z-index:98;background:rgba(5,10,20,.97);
          backdrop-filter:blur(22px);display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:2.25rem;
          transition:opacity .28s,visibility .28s;}
        .mob.off{opacity:0;visibility:hidden;pointer-events:none;}
        .mob.on {opacity:1;visibility:visible;}
        .mlink{font-family:${C.H};font-size:clamp(1.7rem,7vw,2.5rem);font-weight:700;
          color:${C.text};cursor:pointer;text-transform:capitalize;letter-spacing:.02em;
          transition:color .2s,transform .2s;animation:fadeSlide .35s ease both;}
        .mlink:hover{color:${C.cyan};transform:translateX(8px);}

        /* buttons */
        .bp{padding:.82rem 2rem;background:${C.cyan};color:${C.bg};border:1px solid ${C.cyan};
          font-family:${C.B};font-weight:600;font-size:.8rem;letter-spacing:.12em;
          text-transform:uppercase;cursor:pointer;transition:all .25s;}
        .bp:hover{background:transparent;color:${C.cyan};}
        .bo{padding:.82rem 2rem;background:transparent;color:${C.cyan};border:1px solid ${C.cyan};
          font-family:${C.B};font-weight:600;font-size:.8rem;letter-spacing:.12em;
          text-transform:uppercase;cursor:pointer;transition:all .25s;}
        .bo:hover{background:${C.cyan};color:${C.bg};}

        /* cards */
        .pc:hover{border-color:${C.cyan}!important;transform:translateY(-5px);}
        .sc:hover{border-color:rgba(0,212,255,.5)!important;}
        .sl:hover{border-color:${C.cyan}!important;background:${C.cyanDim}!important;color:${C.cyan}!important;}
        .lb:hover{background:${C.cyanDim}!important;color:${C.cyan}!important;border-color:${C.cyan}!important;}
        input:focus,textarea:focus{outline:none;border-color:${C.cyan}!important;
          box-shadow:0 0 0 2px rgba(0,212,255,.1);}

        /* layout helpers */
        .sw{padding:6rem 2.5rem;max-width:1120px;margin:0 auto;}
        .ag{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;}
        .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
        .pg{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;}
        .ec{display:grid;grid-template-columns:1fr 2.2fr;gap:3rem;}
        .cg{display:grid;grid-template-columns:1fr 1fr;gap:3rem;}
        .hs{padding:8rem 2.5rem 4rem;min-height:100vh;display:flex;flex-direction:column;justify-content:center;position:relative;}

        /* responsive */
        @media(max-width:1024px){.sg{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:768px){
          .dn{display:none!important;}
          .db{display:flex!important;}
          .sw{padding:4rem 1.25rem;}
          .hs{padding:6.5rem 1.25rem 3rem;}
          .ag,.ec,.cg{grid-template-columns:1fr;gap:1.75rem;}
          .sg,.pg{grid-template-columns:1fr;}
        }
        @media(max-width:480px){
          .bg-btns{flex-direction:column;}
          .bg-btns button{width:100%;text-align:center;}
        }
      `}</style>

      <div className="gbg" />
      <CursorGlow />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <header style={{
        position:"fixed",top:0,left:0,right:0,zIndex:99,
        display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"0.9rem 2.5rem",
        background: scrolled?"rgba(5,10,20,0.93)":"rgba(5,10,20,0.55)",
        backdropFilter:"blur(18px)",
        borderBottom:`1px solid ${scrolled?C.border:"transparent"}`,
        transition:"background .4s,border-color .4s",
      }}>
        {/* Logo */}
        <span onClick={()=>go("hero")} style={{ fontFamily:C.H, fontSize:"1.35rem", fontWeight:800, color:C.cyan, cursor:"pointer", letterSpacing:"0.04em" }}>
          Rahul<span style={{color:C.lime}}>.</span>dev
        </span>

        {/* Desktop links */}
        <nav className="dn" style={{display:"flex",gap:"2.2rem"}}>
          {NAV_ITEMS.map(n=>(
            <span key={n} className="nl" onClick={()=>go(n)}>{n}</span>
          ))}
        </nav>

        {/* Hire me — desktop */}
        <button className="bp dn" style={{padding:".55rem 1.4rem",fontSize:".75rem",display:"block"}} onClick={()=>go("contact")}>
          Hire Me
        </button>

        {/* Hamburger — mobile */}
        <button className="db" onClick={()=>setMenuOpen(o=>!o)}
          style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:4,zIndex:100,alignItems:"center"}}>
          <BurgerIcon open={menuOpen}/>
        </button>
      </header>

      {/* ═══════════════ MOBILE MENU ═══════════════ */}
      <div className={`mob ${menuOpen?"on":"off"}`}>
        {/* logo inside menu */}
        <span style={{ position:"absolute",top:"1.4rem",left:"2rem",fontFamily:C.H,fontSize:"1.35rem",fontWeight:800,color:C.cyan }}>
          Rahul<span style={{color:C.lime}}>.</span>dev
        </span>

        {NAV_ITEMS.map((n,i)=>(
          <span key={n} className="mlink" style={{animationDelay:`${i*55}ms`}} onClick={()=>go(n)}>{n}</span>
        ))}
        <button className="bp" style={{marginTop:"0.5rem"}} onClick={()=>{setMenuOpen(false);go("contact");}}>
          Hire Me →
        </button>

        <p style={{position:"absolute",bottom:"2rem",fontFamily:C.B,fontSize:".68rem",color:C.muted,letterSpacing:".15em",textTransform:"uppercase"}}>
          tap to close
        </p>
        <div style={{position:"absolute",inset:0,zIndex:-1}} onClick={()=>setMenuOpen(false)}/>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="hero" className="hs">
        {/* orbs */}
        <div style={{position:"absolute",right:"8%",top:"20%",width:360,height:360,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,212,255,.07)0%,transparent 70%)",
          animation:"float 7s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:"28%",bottom:"18%",width:200,height:200,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(57,255,20,.05)0%,transparent 70%)",
          animation:"float 9s ease-in-out infinite 2s",pointerEvents:"none"}}/>

        <FadeIn delay={0}>
          <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.5rem"}}>
            <span style={{width:32,height:1,background:C.cyan,display:"block"}}/>
            <span style={{fontFamily:C.B,fontSize:".75rem",letterSpacing:".3em",textTransform:"uppercase",color:C.cyan,animation:"pulse 2.5s ease-in-out infinite"}}>
              ● Available for work
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 style={{fontFamily:C.H,fontSize:"clamp(3rem,10vw,7rem)",fontWeight:900,lineHeight:1,color:C.white,letterSpacing:"-0.02em",marginBottom:".25rem"}}>
            RAHUL A D
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p style={{fontFamily:C.H,fontSize:"clamp(1rem,3vw,1.65rem)",fontWeight:600,marginBottom:"1.5rem",letterSpacing:".02em"}}>
            <Typewriter words={["Full Stack Developer","Software Developer","AI enthusiast","Frontend Developer"]}/>
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <p style={{fontFamily:C.B,fontSize:"1rem",color:C.muted,maxWidth:490,lineHeight:1.85,marginBottom:"2.8rem"}}>
            Fresher dev with a builder's mindset — turning ideas into clean, performant, and beautiful web experiences.
          </p>
        </FadeIn>

        <FadeIn delay={420}>
          <div className="bg-btns" style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button className="bp" onClick={()=>go("contact")}>Contact Me →</button>
            <a
            href="https://drive.google.com/file/d/1PwZvsk8FFeEHh0zrPD6oGO0BXCGBVl6g/view?usp=drivesdk"
            target="_blank"
            rel="noopener noreferrer"
            >
           <button className="bo">↓ Download Resume</button>
</a>
          </div>
        </FadeIn>

        <div style={{position:"absolute",bottom:"2.5rem",left:"2.5rem",display:"flex",alignItems:"center",gap:".6rem",
          fontFamily:C.B,fontSize:".65rem",letterSpacing:".2em",textTransform:"uppercase",color:C.muted,animation:"float 2.8s ease-in-out infinite"}}>
          scroll <span style={{width:36,height:1,background:C.muted,display:"block"}}/>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" style={{background:"rgba(0,8,22,.55)",padding:"6rem 0"}}>
        <div className="sw">
          <FadeIn>
            <SH num="01" label="About Me"/>
            <h2 style={{fontFamily:C.H,fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,color:C.white,lineHeight:1.1,marginBottom:"3rem"}}>
              The human<br/>behind the code.
            </h2>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="ag">
              <div>
                <p style={{fontFamily:C.B,fontSize:"1rem",lineHeight:1.9,color:C.muted,marginBottom:"1.4rem"}}>
                  Hey! I'm <span style={{color:C.cyan,fontWeight:600}}>Rahul A D</span>, a passionate fresher developer
                  who loves crafting seamless digital experiences. I specialize in{" "}
                  <span style={{color:C.cyan,fontWeight:600}}>React.js</span> and the{" "}
                  <span style={{color:C.cyan,fontWeight:600}}>MERN stack</span>, blending design sensibility with solid engineering.
                </p>
                <p style={{fontFamily:C.B,fontSize:"1rem",lineHeight:1.9,color:C.muted}}>
                  I believe great software lives at the intersection of empathy and logic. Every project I take on is a chance to grow, solve real problems, and push what I thought I could build.
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:".7rem",marginTop:"2rem"}}>
                  {["React.js","Node.js","JavaScript","CSS3","Git","REST APIs"].map(t=>(
                    <span key={t} style={{fontFamily:C.B,fontSize:".72rem",letterSpacing:".1em",textTransform:"uppercase",padding:".3rem .8rem",border:`1px solid ${C.border}`,color:C.cyan}}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{background:C.glass,border:`1px solid ${C.border}`,padding:"2rem",backdropFilter:"blur(12px)"}}>
                <p style={{fontFamily:C.B,fontSize:".7rem",letterSpacing:".25em",textTransform:"uppercase",color:C.cyan,marginBottom:"1.6rem"}}>Career Goals</p>
                {GOALS.map((g,i)=>(
                  <div key={i} style={{display:"flex",gap:".75rem",alignItems:"flex-start",marginBottom:"1.2rem"}}>
                    <span style={{color:C.cyan,marginTop:".1rem",flexShrink:0,fontWeight:700}}>→</span>
                    <span style={{fontFamily:C.B,fontSize:".9rem",lineHeight:1.7,color:C.muted}}>{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ SKILLS ═══════════════ */}
      <section id="skills" style={{padding:"6rem 0"}}>
        <div className="sw">
          <FadeIn>
            <SH num="02" label="Skills"/>
            <h2 style={{fontFamily:C.H,fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,color:C.white,lineHeight:1.1,marginBottom:"3rem"}}>
              My tech<br/>arsenal.
            </h2>
          </FadeIn>
          <div className="sg">
            {SKILLS.map((cat,ci)=>(
              <FadeIn key={ci} delay={ci*130}>
                <div className="sc" style={{background:C.glass,border:`1px solid ${C.border}`,padding:"1.75rem",backdropFilter:"blur(12px)",transition:"border-color .3s",height:"100%"}}>
                  <p style={{fontFamily:C.H,fontWeight:700,fontSize:".85rem",letterSpacing:".15em",textTransform:"uppercase",color:C.cyan,marginBottom:"1.6rem"}}>{cat.category}</p>
                  {cat.items.map((s,si)=>(
                    <div key={si} style={{marginBottom:"1.25rem"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:".45rem"}}>
                        <span style={{fontFamily:C.B,fontSize:".88rem",color:C.text}}>{s.name}</span>
                        <span style={{fontFamily:C.B,fontSize:".75rem",color:C.muted}}>{s.pct}%</span>
                      </div>
                      <Bar pct={s.pct} delay={ci*100+si*80}/>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROJECTS ═══════════════ */}
      <section id="projects" style={{background:"rgba(0,8,22,.55)",padding:"6rem 0"}}>
        <div className="sw">
          <FadeIn>
            <SH num="03" label="Projects"/>
            <h2 style={{fontFamily:C.H,fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,color:C.white,lineHeight:1.1,marginBottom:"3rem"}}>
              Things I've<br/>built.
            </h2>
          </FadeIn>
          <div className="pg">
            {PROJECTS.map((p,i)=>(
              <FadeIn key={i} delay={i*100}>
                <div className="pc" style={{background:C.glass,border:`1px solid ${C.border}`,backdropFilter:"blur(12px)",overflow:"hidden",transition:"border-color .3s,transform .3s",display:"flex",flexDirection:"column",height: "550px"}}>
                  <div style={{height:140,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem",borderBottom:`1px solid ${C.border}`,background:"rgba(0,212,255,.04)"}}>{p.emoji}</div>
                  <div style={{padding:"1.5rem",flex:1,display:"flex",flexDirection:"column"}}>
                    <h3 style={{fontFamily:C.H,fontWeight:700,fontSize:"1.05rem",color:C.white,marginBottom:".6rem"}}>{p.title}</h3>
                    <p style={{
                        fontFamily: C.B,
                        fontSize: ".87rem",
                        color: C.muted,
                        lineHeight: 1.7,
                        flex: 1,
                        marginBottom: "1.1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 7,   // ✅ MAX LINES
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>{p.desc}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:".4rem",marginBottom:"1.2rem"}}>
                      {p.tags.map(t=>(
                        <span key={t} style={{fontFamily:C.B,fontSize:".65rem",letterSpacing:".1em",textTransform:"uppercase",padding:".25rem .65rem",border:`1px solid ${C.border}`,color:C.cyan}}>{t}</span>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:".75rem"}}>
                      {[["⬡ GitHub",p.github],["↗ Live Demo",p.live]].map(([lbl,href])=>(
                        <a key={lbl} href={href} className="lb" style={{fontFamily:C.B,fontSize:".7rem",letterSpacing:".12em",textTransform:"uppercase",padding:".45rem .9rem",border:`1px solid ${C.border}`,color:C.muted,background:"transparent",textDecoration:"none",transition:"all .25s",display:"inline-block"}}>{lbl}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPERIENCE ═══════════════ */}
      <section id="experience" style={{padding:"6rem 0"}}>
        <div className="sw">
          <FadeIn>
            <SH num="04" label="Experience"/>
            <h2 style={{fontFamily:C.H,fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,color:C.white,lineHeight:1.1,marginBottom:"3rem"}}>
              Where I've<br/>worked.
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="ec" style={{background:C.glass,border:`1px solid ${C.border}`,padding:"2.5rem",backdropFilter:"blur(12px)"}}>
              <div>
                <div style={{width:52,height:52,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:"1.25rem",background:C.cyanDim}}>💼</div>
                <p style={{fontFamily:C.H,fontWeight:700,fontSize:"1.15rem",color:C.cyan,marginBottom:".3rem"}}>Corizo</p>
                <p style={{fontFamily:C.B,fontSize:".9rem",color:C.text,marginBottom:".25rem"}}>Web Developer Intern</p>
                <p style={{fontFamily:C.B,fontSize:".78rem",color:C.muted,marginBottom:".15rem"}}>2023 · Remote</p>
                <span style={{fontFamily:C.B,fontSize:".65rem",letterSpacing:".15em",textTransform:"uppercase",padding:".2rem .6rem",border:`1px solid ${C.border}`,color:C.lime,display:"inline-block",marginTop:".5rem"}}>Completed</span>
              </div>
              <div>
                <p style={{fontFamily:C.B,fontSize:".7rem",letterSpacing:".2em",textTransform:"uppercase",color:C.cyan,marginBottom:"1.4rem"}}>Key Responsibilities &amp; Learnings</p>
                <ul style={{listStyle:"none",padding:0,margin:0}}>
                  {EXP.map((item,i)=>(
                    <li key={i} style={{fontFamily:C.B,fontSize:".9rem",color:C.muted,lineHeight:1.75,marginBottom:".8rem",paddingLeft:"1.4rem",position:"relative"}}>
                      <span style={{position:"absolute",left:0,color:C.cyan,fontWeight:700}}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
     <section id="contact" style={{ background: "rgba(0,8,22,.55)", padding: "6rem 0" }}>
      <div className="sw">
        <FadeIn>
          <SH num="05" label="Contact" />
          <h2
            style={{
              fontFamily: C.H,
              fontSize: "clamp(2rem,5vw,3rem)",
              fontWeight: 800,
              color: C.white,
              lineHeight: 1.1,
              marginBottom: "3rem"
            }}
          >
            Let's build<br />something great.
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="cg">

            {/* FORM */}
            <form onSubmit={sendFormData}
              // onSubmit={(e) => {
              //   e.preventDefault()

              //   emailjs.send(
              //     "YOUR_SERVICE_ID",
              //     "YOUR_TEMPLATE_ID",
              //     formData,
              //     "YOUR_PUBLIC_KEY"
              //   ).then(() => {
              //     alert("Message sent successfully!")
              //     setFormData({ name: "", email: "", message: "" })
              //   }).catch(() => {
              //     alert("Failed to send message. Try again.")
              //   })
              // }}
            >
              {[{ l: "Your Name", n: "name", t: "text", ph: "John Doe" },
                { l: "Email Address", n: "email", t: "email", ph: "john@example.com" }]
                .map(({ l, n, t, ph }) => (
                  <div key={l} style={{ marginBottom: "1.2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: C.B,
                        fontSize: ".7rem",
                        letterSpacing: ".2em",
                        textTransform: "uppercase",
                        color: C.muted,
                        marginBottom: ".5rem"
                      }}
                    >
                      {l}
                    </label>
                    <input
                      type={t}
                      name={n}
                      placeholder={ph}
                      value={formData[n]}
                      onChange={(e) =>
                        setFormData({ ...formData, [n]: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        background: C.glass,
                        border: `1px solid ${C.border}`,
                        padding: ".9rem 1rem",
                        color: C.text,
                        fontFamily: C.B,
                        fontSize: ".9rem",
                        outline: "none"
                      }}
                    />
                  </div>
                ))}

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: C.B,
                    fontSize: ".7rem",
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: C.muted,
                    marginBottom: ".5rem"
                  }}
                >
                  Message
                </label>
                <textarea
                  rows={5}
                  name="message"
                  placeholder="Tell me about your project or opportunity..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    background: C.glass,
                    border: `1px solid ${C.border}`,
                    padding: ".9rem 1rem",
                    color: C.text,
                    fontFamily: C.B,
                    fontSize: ".9rem",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              <button className="bp" style={{ width: "100%" }}>
                Send Message →
              </button>
            </form>

            {/* INFO SECTION (UNCHANGED) */}
            <div>
              <p
                style={{
                  fontFamily: C.B,
                  fontSize: ".95rem",
                  color: C.muted,
                  lineHeight: 1.85,
                  marginBottom: "2rem"
                }}
              >
                I'm actively looking for <span style={{ color: C.cyan, fontWeight: 600 }}>
                  junior developer roles
                </span>. Have a project idea, job opportunity, or just want to say hi? My inbox is always open!
              </p>

              {[{
                icon: "⬡",
                label: "GitHub",
                sub: "github.com/rahul",
                href: "https://github.com/Rahulcoder2004"
              }, {
                icon: "⬟",
                label: "LinkedIn",
                sub: "linkedin.com/in/rahul",
                href: "https://www.linkedin.com/in/rahulad04/"
              }].map(({ icon, label, sub, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="sl"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.1rem",
                    padding: "1.2rem",
                    background: C.glass,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    textDecoration: "none",
                    marginBottom: "1rem"
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: C.H, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontFamily: C.B, fontSize: ".8rem", color: C.muted }}>{sub}</div>
                  </div>
                </a>
              ))}

              <div style={{ marginTop: "1.75rem", padding: "1.25rem", border: `1px solid ${C.border}`, background: C.glass }}>
                <p style={{ fontFamily: C.B, fontSize: ".7rem", letterSpacing: ".2em", textTransform: "uppercase", color: C.cyan }}>
                  Direct Email
                </p>
                <p style={{ fontFamily: C.B, fontSize: ".95rem" }}>
                  adrahul04@gmail.com
                </p>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{textAlign:"center",padding:"2.25rem 1.25rem",borderTop:`1px solid ${C.border}`}}>
        <p style={{fontFamily:C.B,fontSize:".78rem",color:C.muted,lineHeight:1.8}}>
          <span style={{fontFamily:C.H,fontWeight:700,color:C.cyan}}>Rahul</span>
          {" "}· Designed &amp; built with React.js · {new Date().getFullYear()} ·{" "}
          <span style={{color:C.lime}}>Open to opportunities</span>
        </p>
      </footer>
    </div>
  );
}

