import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  LayoutDashboard, Globe, Activity, Zap, LogOut, Lock, 
  TrendingUp, Cpu, ShieldCheck, Sun, Moon, RefreshCcw, Terminal
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet Icon Setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

export default function ParkAR() {
  const [role, setRole] = useState(null); 
  const [activeTab, setActiveTab] = useState('Map');
  const [darkMode, setDarkMode] = useState(true);
  const [activeCoords, setActiveCoords] = useState([12.9716, 77.5946]);
  
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [locations, setLocations] = useState([
    { id: 1, name: "MG Road Central", coords: [12.9733, 77.6117], price: "₹40/hr", status: "Available" },
    { id: 2, name: "Indiranagar Hub", coords: [12.9784, 77.6408], price: "₹25/hr", status: "Available" },
    { id: 3, name: "Whitefield Tech", coords: [12.9698, 77.7500], price: "₹60/hr", status: "Available" },
    { id: 4, name: "Koramangala Node", coords: [12.9352, 77.6245], price: "₹35/hr", status: "Occupied" }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), event: "SYS_INIT", desc: "Network online. All nodes active." }
  ]);

  const triggerLog = (type, message) => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      event: type,
      desc: message
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const validateAdmin = () => {
    // HIDDEN LOGIC: admin | 1234
    if (adminUser === "admin" && adminPass === "1234") {
      setRole('admin');
      setActiveTab('Overview');
      triggerLog("AUTH_SUCCESS", "Admin session established.");
    } else {
      triggerLog("AUTH_FAIL", `Failed login attempt.`);
      alert("Invalid Credentials");
    }
  };

  const handleBooking = (id, name) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, status: "Occupied" } : loc
    ));
    triggerLog("RESERVATION", `User booked spot at ${name}.`);
    alert(`Success: Slot Reserved at ${name}.`);
  };

  const toggleNodeStatus = (id, name) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id === id) {
        const newStatus = loc.status === "Available" ? "Occupied" : "Available";
        triggerLog("NODE_UPDATE", `${name} switched to ${newStatus.toUpperCase()}.`);
        return { ...loc, status: newStatus };
      }
      return loc;
    }));
  };

  const theme = {
    bg: darkMode ? "bg-[#020617]" : "bg-[#F1F5F9]",
    sidebar: darkMode ? "bg-[#0F172A] border-white/5" : "bg-white border-slate-200 shadow-xl",
    card: darkMode ? "bg-[#0F172A] border-cyan-500/20" : "bg-white border-slate-200",
    text: darkMode ? "text-slate-100" : "text-slate-700",
    input: darkMode ? "bg-[#1E293B] text-cyan-400 border-cyan-500/30" : "bg-slate-100 text-slate-900 border-slate-300"
  };

  if (!role) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${theme.bg}`}>
        <div className={`p-10 rounded-[48px] ${theme.card} w-[440px] border-2 shadow-2xl text-center`}>
          <div className="inline-block p-5 bg-cyan-500 rounded-[2rem] mb-6 text-slate-900 shadow-xl shadow-cyan-500/20"><Zap size={32} /></div>
          <h2 className={`text-4xl font-black italic uppercase mb-10 ${theme.text}`}>Park<span className="text-cyan-500">AR</span></h2>
          
          {!showAdminLogin ? (
            <div className="space-y-4">
              <button onClick={() => setRole('user')} className="w-full py-5 rounded-3xl bg-cyan-500 text-slate-900 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cyan-500/20">User Terminal</button>
              <button onClick={() => setShowAdminLogin(true)} className={`w-full py-5 rounded-3xl border-2 font-black uppercase text-[10px] tracking-widest ${darkMode ? 'border-cyan-500/20 text-cyan-500' : 'border-slate-300 text-slate-500'}`}>Admin Gate</button>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {/* ADMIN DETAILS REMOVED FROM UI FOR SECURITY */}
              <input type="text" placeholder="Admin ID" className={`w-full p-4 rounded-2xl border-2 outline-none font-bold ${theme.input}`} onChange={(e) => setAdminUser(e.target.value)} />
              <input type="password" placeholder="Passkey" className={`w-full p-4 rounded-2xl border-2 outline-none font-bold ${theme.input}`} onChange={(e) => setAdminPass(e.target.value)} />
              <button onClick={validateAdmin} className="w-full py-5 rounded-3xl bg-cyan-500 text-slate-900 font-black uppercase tracking-widest">Verify Access</button>
              <button onClick={() => setShowAdminLogin(false)} className="w-full text-center text-[10px] font-black uppercase text-slate-500 mt-2">Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full transition-all duration-700 ${theme.bg} ${theme.text}`}>
      <aside className={`w-80 border-r p-8 flex flex-col ${theme.sidebar}`}>
        <div className="flex items-center gap-4 mb-16">
          <Zap size={32} className="text-cyan-500" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Park<span className="text-cyan-500">AR</span></h1>
        </div>
        <nav className="flex-1 space-y-3">
          {role === 'user' ? (
            <NavBtn active={activeTab === 'Map'} onClick={() => setActiveTab('Map')} icon={<Globe size={18}/>} label="Live Network" />
          ) : (
            <>
              <NavBtn active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} icon={<LayoutDashboard size={18}/>} label="Admin Hub" />
              <NavBtn active={activeTab === 'Map'} onClick={() => setActiveTab('Map')} icon={<Globe size={18}/>} label="Monitor" />
              <NavBtn active={activeTab === 'Logs'} onClick={() => setActiveTab('Logs')} icon={<Terminal size={18}/>} label="Neural Logs" />
            </>
          )}
        </nav>
        <div className="mt-auto space-y-4">
          <button onClick={() => setDarkMode(!darkMode)} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-slate-600'}`}>
            {darkMode ? <Sun size={14} /> : <Moon size={14} />} {darkMode ? 'Daylight' : 'Midnight'}
          </button>
          <button onClick={() => { setRole(null); triggerLog("TERMINATE", "User signed out."); }} className="w-full py-4 rounded-2xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all"><LogOut size={16}/> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10">
          <div className="px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 text-[10px] font-black uppercase tracking-widest">
            {role === 'admin' ? 'STRATEGIC ADMIN' : 'USER TERMINAL'}
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'Map' && (
            <div className="flex h-full gap-8">
              <div className="flex-[2.5] rounded-[48px] overflow-hidden border-4 border-slate-700/50 shadow-2xl relative">
                <MapContainer center={activeCoords} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <MapHandler center={activeCoords} />
                  <TileLayer url={darkMode ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"} />
                  {locations.map(loc => (
                    <Marker key={loc.id} position={loc.coords}>
                      <Popup><span className="font-bold">{loc.name}</span></Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="flex-1 space-y-4">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6">Node Monitor</h2>
                 {locations.map(loc => (
                   <div key={loc.id} className={`p-6 rounded-[32px] border-2 transition-all ${activeCoords === loc.coords ? 'border-cyan-500 bg-cyan-500/5' : 'border-transparent bg-slate-800/20'}`}>
                      <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase text-slate-500">
                        {loc.name} 
                        <span className={loc.status === 'Available' ? 'text-emerald-500' : 'text-rose-500'}>{loc.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-black italic text-cyan-500">{loc.price}</span>
                        {role === 'user' && loc.status === 'Available' && (
                          <button onClick={() => handleBooking(loc.id, loc.name)} className="bg-cyan-500 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Reserve</button>
                        )}
                        {role === 'admin' && (
                          <button onClick={() => toggleNodeStatus(loc.id, loc.name)} className="p-2 rounded-lg bg-slate-700 text-white hover:bg-cyan-500 hover:text-slate-900 transition-colors">
                            <RefreshCcw size={14}/>
                          </button>
                        )}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {role === 'admin' && activeTab === 'Overview' && (
            <div className="space-y-8">
               <h2 className="text-3xl font-black italic uppercase">System <span className="text-cyan-500">Analytics</span></h2>
               <div className="grid grid-cols-3 gap-6">
                  <StatCard icon={<TrendingUp />} label="Project Revenue" val="₹12,450" color="text-emerald-400" />
                  <StatCard icon={<Cpu />} label="Total Nodes" val={locations.length} color="text-cyan-400" />
                  <StatCard icon={<ShieldCheck />} label="Occupied" val={locations.filter(l => l.status === 'Occupied').length} color="text-rose-400" />
               </div>
            </div>
          )}

          {role === 'admin' && activeTab === 'Logs' && (
             <div className="space-y-6">
                <h2 className="text-3xl font-black italic uppercase">Neural <span className="text-cyan-500">Logs</span></h2>
                <div className={`rounded-[40px] border overflow-hidden ${theme.card}`}>
                   <table className="w-full text-left">
                     <thead>
                       <tr className="border-b border-white/5 text-[10px] font-black uppercase text-slate-500">
                         <th className="p-6">Timestamp</th>
                         <th className="p-6">Event Type</th>
                         <th className="p-6">Description</th>
                       </tr>
                     </thead>
                     <tbody className="text-xs font-medium">
                       {logs.map(log => (
                         <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                           <td className="p-6 text-cyan-500 font-mono">{log.time}</td>
                           <td className="p-6"><span className="uppercase font-black text-[9px] bg-slate-800 px-2 py-1 rounded border border-white/10">{log.event}</span></td>
                           <td className="p-6 text-slate-400 italic">{log.desc}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, val, color }) {
  return (
    <div className="p-8 rounded-[40px] bg-slate-800/40 border border-white/5">
      <div className={`mb-4 ${color}`}>{icon}</div>
      <div className="text-[10px] font-black uppercase text-slate-500 mb-1">{label}</div>
      <div className={`text-3xl font-black italic ${color}`}>{val}</div>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'bg-cyan-500 text-slate-900 italic scale-105 shadow-xl shadow-cyan-500/20' : 'text-slate-500 hover:text-cyan-400'}`}>
      {icon} {label}
    </button>
  );
}