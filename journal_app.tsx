import { useState } from "react";

const TC = {
  beige: "#F5EFE6",
  beige2: "#EDE4D6",
  beige3: "#D9CEBC",
  terra: "#C1694F",
  terraDark: "#9B4F38",
  terraLight: "#D4856E",
  brown: "#6B4C3B",
  text: "#3D2B1F",
  textMid: "#7A5C4E",
  textLight: "#A68472",
  white: "#FFFAF5",
};

const MOODS = ["😊","😔","😤","😴","🥳","😌","😰","❤️"];
const PRIORITIES = ["haute","moyenne","basse"];
const PCOLORS = { haute: TC.terra, moyenne: "#B8860B", basse: "#5A7A5A" };
const WISH_ICONS = ["🎯","🎮","✈️","📚","🎵","👟","🍕","💻","🎨","🏋️","🌴","💡"];

const now = () => new Date().toISOString();
const fmtDate = d => new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});

const SAMPLE_ENTRIES = [
  {id:"e1",title:"Première page",body:"Bienvenue dans mon journal Journeyma. C'est ici que je noterai mes pensées, mes rêves et mes journées.",mood:"😊",date:new Date(Date.now()-86400000*2).toISOString()},
  {id:"e2",title:"Une belle journée",body:"Aujourd'hui était vraiment agréable. J'ai pris le temps de me poser et de réfléchir à mes projets.",mood:"😌",date:new Date(Date.now()-86400000).toISOString()},
];
const SAMPLE_WISHES = [
  {id:"w1",title:"Voyage à Paris",desc:"Voir la Tour Eiffel et les musées",priority:"haute",icon:"✈️",done:false,date:now()},
  {id:"w2",title:"Lire un bon livre",desc:"Roman de science-fiction",priority:"moyenne",icon:"📚",done:false,date:now()},
  {id:"w3",title:"Nouvelle paire de chaussures",desc:"Sneakers confortables",priority:"basse",icon:"👟",done:true,date:now()},
];

const s = {
  wrap: {fontFamily:"'Georgia', serif",minHeight:"100vh",background:TC.beige,color:TC.text,width:"100%",margin:0,padding:"1.5rem"},
  // Lock screen
  lockWrap: {minHeight:"100vh",width:"100%",background:TC.beige,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24},
  lockCard: {background:TC.white,border:`1px solid ${TC.beige3}`,borderRadius:20,padding:"2.5rem 2rem",textAlign:"center",width:300,boxSizing:"border-box"},
  lockTitle: {fontSize:22,fontWeight:700,color:TC.terra,letterSpacing:1,marginBottom:4,fontFamily:"Georgia, serif"},
  lockSub: {fontSize:13,color:TC.textLight,marginBottom:24},
  pinRow: {display:"flex",gap:10,justifyContent:"center",marginBottom:20},
  pinDot: (filled) => ({width:14,height:14,borderRadius:"50%",background:filled?TC.terra:TC.beige3,transition:"background 0.2s"}),
  numpad: {display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10},
  numBtn: {background:TC.beige,border:`1px solid ${TC.beige3}`,borderRadius:12,padding:"14px 0",fontSize:18,color:TC.text,cursor:"pointer",fontFamily:"Georgia, serif"},
  errorMsg: {fontSize:12,color:TC.terra,marginTop:8},
  // App
  header: {display:"flex",alignItems:"center",gap:12,marginBottom:"0.25rem"},
  h1: {fontSize:22,fontWeight:700,color:TC.terra,margin:0,fontFamily:"Georgia, serif",letterSpacing:1},
  dateStr: {fontSize:12,color:TC.textLight,marginBottom:"1.5rem",marginLeft:52},
  tabs: {display:"flex",gap:6,marginBottom:"1.5rem",borderBottom:`1px solid ${TC.beige3}`,paddingBottom:"0.75rem"},
  tab: (a) => ({padding:"6px 16px",borderRadius:20,border:`1px solid ${a?TC.terra:TC.beige3}`,background:a?TC.terra:"transparent",color:a?TC.white:TC.textMid,cursor:"pointer",fontSize:13,fontFamily:"Georgia, serif"}),
  card: {background:TC.white,border:`1px solid ${TC.beige3}`,borderRadius:16,padding:"1rem 1.25rem",marginBottom:10},
  btn: {padding:"7px 14px",borderRadius:20,border:`1px solid ${TC.beige3}`,background:"transparent",color:TC.textMid,cursor:"pointer",fontSize:13,fontFamily:"Georgia, serif"},
  btnP: {padding:"7px 16px",borderRadius:20,border:`1px solid ${TC.terra}`,background:TC.terra,color:TC.white,cursor:"pointer",fontSize:13,fontFamily:"Georgia, serif"},
  input: {width:"100%",marginBottom:10,boxSizing:"border-box",background:TC.beige,border:`1px solid ${TC.beige3}`,borderRadius:10,padding:"8px 12px",color:TC.text,fontFamily:"Georgia, serif",fontSize:14,outline:"none"},
  label: {fontSize:11,color:TC.textLight,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:1},
  metric: {background:TC.white,border:`1px solid ${TC.beige3}`,borderRadius:14,padding:"1rem",textAlign:"center"},
  metricNum: {fontSize:26,fontWeight:700,color:TC.terra,display:"block",fontFamily:"Georgia, serif"},
  metricLbl: {fontSize:12,color:TC.textLight},
  badge: (p) => ({display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,background:PCOLORS[p]+"22",color:PCOLORS[p],fontFamily:"sans-serif"}),
  wishIco: (sel,ic) => ({fontSize:18,cursor:"pointer",padding:"4px 6px",borderRadius:8,border:`1.5px solid ${sel===ic?TC.terra:"transparent"}`,background:sel===ic?TC.beige2:"transparent"}),
  lockBtn: {background:"transparent",border:"none",color:TC.textLight,fontSize:12,cursor:"pointer",marginTop:8,textDecoration:"underline"},
};

const Logo = () => (
  <svg viewBox="0 0 400 400" width="52" height="52" style={{borderRadius:12,marginBottom:12}}>
    <rect x="40" y="40" width="320" height="320" rx="72" fill={TC.beige2}/>
    <rect x="118" y="108" width="164" height="200" rx="14" fill={TC.terra}/>
    <rect x="118" y="108" width="28" height="200" rx="6" fill={TC.terraDark}/>
    <rect x="162" y="148" width="96" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
    <rect x="162" y="170" width="80" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
    <rect x="162" y="192" width="88" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
    <rect x="162" y="214" width="72" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
    <circle cx="270" cy="130" r="14" fill={TC.beige}/>
    <polygon points="270,119 272.5,127 281,127 274.5,132 277,140 270,135 263,140 265.5,132 259,127 267.5,127" fill={TC.terra}/>
  </svg>
);

function LockScreen({savedPin, onUnlock, onSetPin}) {
  const [pin, setPin] = useState("");
  const [draftPin, setDraftPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState(savedPin ? "enter" : "create");
  const [error, setError] = useState("");

  const press = (d) => {
    setError("");
    if (step === "enter") {
      if (pin.length >= 4) return;
      const next = pin + d;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === savedPin) onUnlock();
          else { setPin(""); setError("Code incorrect, réessayez."); }
        }, 200);
      }
    } else if (step === "create") {
      if (pin.length >= 4) return;
      const next = pin + d;
      setPin(next);
      if (next.length === 4) setTimeout(() => { setDraftPin(next); setStep("confirm"); setPin(""); setConfirm(""); }, 200);
    } else if (step === "confirm") {
      if (confirm.length >= 4) return;
      const next = confirm + d;
      setConfirm(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === draftPin) {
            onSetPin(draftPin); onUnlock();
          } else { setConfirm(""); setError("Les codes ne correspondent pas."); }
        }, 200);
      }
    }
  };

  const del = () => {
    setError("");
    if (step==="confirm") setConfirm(c=>c.slice(0,-1));
    else setPin(p=>p.slice(0,-1));
  };

  const current = step==="confirm" ? confirm : pin;
  const subtitle = step==="create" ? "Choisissez votre code à 4 chiffres" : step==="confirm" ? "Confirmez votre code" : "Entrez votre code";

  return (
    <div style={s.lockWrap}>
      <div style={s.lockCard}>
        <Logo/>
        <div style={s.lockTitle}>journeyma</div>
        <div style={s.lockSub}>{subtitle}</div>
        <div style={s.pinRow}>
          {[0,1,2,3].map(i => <div key={i} style={s.pinDot(i < current.length)}/>)}
        </div>
        <div style={s.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} style={s.numBtn} onClick={()=>press(String(n))}>{n}</button>
          ))}
          <div/>
          <button style={s.numBtn} onClick={()=>press("0")}>0</button>
          <button style={{...s.numBtn,fontSize:14,color:TC.terra}} onClick={del}>⌫</button>
        </div>
        {error && <div style={s.errorMsg}>{error}</div>}
        {step==="confirm" && <button style={s.lockBtn} onClick={()=>{setStep("create");setPin("");setDraftPin("");setConfirm("");setError("");}}>Recommencer</button>}
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [savedPin, setSavedPin] = useState("");
  const [tab, setTab] = useState("journal");
  const [entries, setEntries] = useState(SAMPLE_ENTRIES);
  const [wishes, setWishes] = useState(SAMPLE_WISHES);
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("😊");
  const [search, setSearch] = useState("");
  const [wishFilter, setWishFilter] = useState("tous");
  const [newWish, setNewWish] = useState({title:"",desc:"",priority:"moyenne",icon:"🎯"});
  const [addingWish, setAddingWish] = useState(false);

  if (!unlocked) return <LockScreen savedPin={savedPin} onUnlock={()=>setUnlocked(true)} onSetPin={p=>setSavedPin(p)}/>;

  const saveEntry = () => {
    if (!title.trim() && !body.trim()) return;
    if (editing) setEntries(es=>es.map(e=>e.id===editing?{...e,title,body,mood}:e));
    else setEntries(es=>[{id:Date.now()+"",title,body,mood,date:now()},...es]);
    setView("list"); setTitle(""); setBody(""); setMood("😊"); setEditing(null);
  };

  const deleteEntry = id => setEntries(es=>es.filter(e=>e.id!==id));
  const startEdit = e => { setEditing(e.id); setTitle(e.title); setBody(e.body); setMood(e.mood); setView("edit"); };
  const toggleWish = id => setWishes(ws=>ws.map(w=>w.id===id?{...w,done:!w.done}:w));
  const deleteWish = id => setWishes(ws=>ws.filter(w=>w.id!==id));
  const addWish = () => {
    if (!newWish.title.trim()) return;
    setWishes(ws=>[{id:Date.now()+"", ...newWish,done:false,date:now()},...ws]);
    setNewWish({title:"",desc:"",priority:"moyenne",icon:"🎯"});
    setAddingWish(false);
  };

  const filtered = entries.filter(e=>e.title.toLowerCase().includes(search.toLowerCase())||e.body.toLowerCase().includes(search.toLowerCase()));
  const filteredWishes = wishes.filter(w=>wishFilter==="tous"?true:wishFilter==="actifs"?!w.done:w.done);
  const days = [...new Set(entries.map(e=>new Date(e.date).toDateString()))].length;
  const moodCount = MOODS.map(m=>({m,n:entries.filter(e=>e.mood===m).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
  const months = {};
  entries.forEach(e=>{const k=new Date(e.date).toLocaleDateString("fr-FR",{month:"long",year:"numeric"});months[k]=(months[k]||0)+1;});

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <svg viewBox="0 0 400 400" width="40" height="40" style={{borderRadius:10,flexShrink:0}}>
          <rect x="40" y="40" width="320" height="320" rx="72" fill={TC.beige2}/>
          <rect x="118" y="108" width="164" height="200" rx="14" fill={TC.terra}/>
          <rect x="118" y="108" width="28" height="200" rx="6" fill={TC.terraDark}/>
          <rect x="162" y="148" width="96" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
          <rect x="162" y="170" width="80" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
          <rect x="162" y="192" width="88" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
          <rect x="162" y="214" width="72" height="8" rx="4" fill={TC.beige} opacity="0.85"/>
          <circle cx="270" cy="130" r="14" fill={TC.beige}/>
          <polygon points="270,119 272.5,127 281,127 274.5,132 277,140 270,135 263,140 265.5,132 259,127 267.5,127" fill={TC.terra}/>
        </svg>
        <h1 style={s.h1}>journeyma</h1>
        <button style={{...s.btn,marginLeft:"auto",fontSize:11,padding:"4px 12px"}} onClick={()=>setUnlocked(false)}>🔒 Verrouiller</button>
      </div>
      <div style={s.dateStr}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>

      <div style={s.tabs}>
        {[["journal","Journal"],["stats","Statistiques"],["wishes","Souhaits"]].map(([k,l])=>(
          <button key={k} style={s.tab(tab===k)} onClick={()=>{setTab(k);setView("list")}}>{l}</button>
        ))}
      </div>

      {tab==="journal" && (
        <>
          {view==="list" && (
            <>
              <div style={{display:"flex",gap:8,marginBottom:"1rem",alignItems:"center"}}>
                <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...s.input,marginBottom:0,flex:1}}/>
                <button style={s.btnP} onClick={()=>{setView("edit");setEditing(null);setTitle("");setBody("");setMood("😊")}}>+ Note</button>
              </div>
              {filtered.length===0&&<p style={{color:TC.textLight,fontSize:14}}>Aucune entrée trouvée.</p>}
              {filtered.map(e=>(
                <div key={e.id} style={s.card}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <span style={{fontSize:18,marginTop:2}}>{e.mood}</span>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:700,fontSize:15,color:TC.text,margin:"0 0 4px"}}>{e.title||"Sans titre"}</p>
                      <p style={{fontSize:13,color:TC.textMid,margin:"0 0 6px",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{e.body}</p>
                      <span style={{fontSize:11,color:TC.textLight}}>{fmtDate(e.date)}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{...s.btn,padding:"3px 10px",fontSize:12}} onClick={()=>startEdit(e)}>Éditer</button>
                      <button style={{...s.btn,padding:"3px 10px",fontSize:12,color:TC.terra}} onClick={()=>deleteEntry(e.id)}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {view==="edit" && (
            <div style={s.card}>
              <label style={s.label}>Titre</label>
              <input placeholder="Titre..." value={title} onChange={e=>setTitle(e.target.value)} style={s.input}/>
              <label style={s.label}>Humeur</label>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                {MOODS.map(m=>(
                  <span key={m} onClick={()=>setMood(m)} style={{fontSize:20,cursor:"pointer",padding:4,borderRadius:8,border:`1.5px solid ${mood===m?TC.terra:"transparent"}`,background:mood===m?TC.beige2:"transparent"}}>{m}</span>
                ))}
              </div>
              <label style={s.label}>Contenu</label>
              <textarea placeholder="Écrivez vos pensées..." value={body} onChange={e=>setBody(e.target.value)} rows={8} style={{...s.input,resize:"vertical",lineHeight:1.7}}/>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button style={s.btn} onClick={()=>{setView("list");setEditing(null)}}>Annuler</button>
                <button style={s.btnP} onClick={saveEntry}>{editing?"Enregistrer":"Créer"}</button>
              </div>
            </div>
          )}
        </>
      )}

      {tab==="stats" && (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:"1.5rem"}}>
            {[["Notes",entries.length],["Jours actifs",days],["Souhaits restants",wishes.filter(w=>!w.done).length]].map(([l,v])=>(
              <div key={l} style={s.metric}><span style={s.metricNum}>{v}</span><span style={s.metricLbl}>{l}</span></div>
            ))}
          </div>
          <div style={s.card}>
            <p style={{fontWeight:700,fontSize:14,margin:"0 0 12px",color:TC.text}}>Humeurs fréquentes</p>
            {moodCount.length===0&&<p style={{fontSize:13,color:TC.textLight}}>Pas encore de données.</p>}
            {moodCount.map(({m,n})=>(
              <div key={m} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:18,width:24}}>{m}</span>
                <div style={{flex:1,height:6,background:TC.beige2,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:4,background:TC.terraLight,width:`${Math.round(n/entries.length*100)}%`}}/>
                </div>
                <span style={{fontSize:12,color:TC.textLight,minWidth:16}}>{n}</span>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <p style={{fontWeight:700,fontSize:14,margin:"0 0 12px",color:TC.text}}>Activité par mois</p>
            {Object.entries(months).map(([m,n])=>(
              <div key={m} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:13,color:TC.textMid,minWidth:120}}>{m}</span>
                <div style={{flex:1,height:6,background:TC.beige2,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:4,background:TC.terraLight,width:`${Math.min(100,n*30)}%`}}/>
                </div>
                <span style={{fontSize:12,color:TC.textLight}}>{n}</span>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <p style={{fontWeight:700,fontSize:14,margin:"0 0 12px",color:TC.text}}>Souhaits</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["Accomplis",wishes.filter(w=>w.done).length],["En attente",wishes.filter(w=>!w.done).length],["Taux",wishes.length===0?"—":Math.round(wishes.filter(w=>w.done).length/wishes.length*100)+"%"]].map(([l,v])=>(
                <div key={l} style={s.metric}><span style={s.metricNum}>{v}</span><span style={s.metricLbl}>{l}</span></div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab==="wishes" && (
        <>
          <div style={{display:"flex",gap:6,marginBottom:"1rem",alignItems:"center",flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6}}>
              {["tous","actifs","accomplis"].map(f=>(
                <button key={f} style={s.tab(wishFilter===f)} onClick={()=>setWishFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
              ))}
            </div>
            <button style={{...s.btnP,marginLeft:"auto"}} onClick={()=>setAddingWish(true)}>+ Ajouter</button>
          </div>
          {addingWish && (
            <div style={{...s.card,border:`1px solid ${TC.terra}`}}>
              <p style={{fontWeight:700,fontSize:14,margin:"0 0 12px",color:TC.text}}>Nouveau souhait</p>
              <label style={s.label}>Titre</label>
              <input placeholder="Ce dont j'ai envie..." value={newWish.title} onChange={e=>setNewWish(w=>({...w,title:e.target.value}))} style={s.input}/>
              <label style={s.label}>Description</label>
              <input placeholder="Un peu plus de détails..." value={newWish.desc} onChange={e=>setNewWish(w=>({...w,desc:e.target.value}))} style={s.input}/>
              <label style={s.label}>Priorité</label>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {PRIORITIES.map(p=>(
                  <button key={p} style={{...s.btn,padding:"4px 14px",fontSize:12,...(newWish.priority===p?{background:TC.terra,color:TC.white,border:`1px solid ${TC.terra}`}:{})}} onClick={()=>setNewWish(w=>({...w,priority:p}))}>{p}</button>
                ))}
              </div>
              <label style={s.label}>Icône</label>
              <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
                {WISH_ICONS.map(ic=>(
                  <span key={ic} style={s.wishIco(newWish.icon,ic)} onClick={()=>setNewWish(w=>({...w,icon:ic}))}>{ic}</span>
                ))}
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button style={s.btn} onClick={()=>setAddingWish(false)}>Annuler</button>
                <button style={s.btnP} onClick={addWish}>Ajouter</button>
              </div>
            </div>
          )}
          {filteredWishes.length===0&&<p style={{fontSize:14,color:TC.textLight}}>Aucun souhait ici.</p>}
          {filteredWishes.map(w=>(
            <div key={w.id} style={{...s.card,opacity:w.done?0.6:1}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:20,marginTop:2}}>{w.icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:15,color:TC.text,textDecoration:w.done?"line-through":"none"}}>{w.title}</span>
                    <span style={s.badge(w.priority)}>{w.priority}</span>
                  </div>
                  {w.desc&&<p style={{fontSize:13,color:TC.textMid,margin:"0 0 4px",lineHeight:1.5}}>{w.desc}</p>}
                  <span style={{fontSize:11,color:TC.textLight}}>{fmtDate(w.date)}</span>
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button style={{...s.btn,padding:"3px 10px",fontSize:12,color:w.done?TC.textMid:"#5A7A5A"}} onClick={()=>toggleWish(w.id)}>{w.done?"Rouvrir":"Fait !"}</button>
                  <button style={{...s.btn,padding:"3px 10px",fontSize:12,color:TC.terra}} onClick={()=>deleteWish(w.id)}>×</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
