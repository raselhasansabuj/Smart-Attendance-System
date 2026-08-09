import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, Camera, QrCode, MapPin, 
  BarChart3, Calendar, Bell, Search, Download, Plus, RefreshCw, 
  Sparkles, ShieldCheck, AlertTriangle, UserCheck, ChevronRight, 
  Filter, Settings, ExternalLink, Activity, Info, Award, Smartphone
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const INITIAL_STUDENTS = [
  { id: 'STU-1001', name: 'Alex Rivera', class: 'CS-101', email: 'alex.r@univ.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', attendanceRate: 96, status: 'Present', lastCheckIn: '08:45 AM', faceVector: 'vec_98421' },
  { id: 'STU-1002', name: 'Sarah Chen', class: 'CS-101', email: 'sarah.c@univ.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', attendanceRate: 92, status: 'Present', lastCheckIn: '08:50 AM', faceVector: 'vec_11029' },
  { id: 'STU-1003', name: 'Marcus Vance', class: 'CS-101', email: 'marcus.v@univ.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', attendanceRate: 78, status: 'Absent', lastCheckIn: '--', faceVector: 'vec_33912' },
  { id: 'STU-1004', name: 'Emily Zhang', class: 'CS-202', email: 'emily.z@univ.edu', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', attendanceRate: 98, status: 'Present', lastCheckIn: '08:42 AM', faceVector: 'vec_88123' },
  { id: 'STU-1005', name: 'David Miller', class: 'CS-202', email: 'david.m@univ.edu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', attendanceRate: 84, status: 'Late', lastCheckIn: '09:15 AM', faceVector: 'vec_77412' },
  { id: 'STU-1006', name: 'Aaliyah Patel', class: 'CS-101', email: 'aaliyah.p@univ.edu', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250', attendanceRate: 90, status: 'Present', lastCheckIn: '08:55 AM', faceVector: 'vec_44129' },
  { id: 'STU-1007', name: 'Lucas Scott', class: 'CS-202', email: 'lucas.s@univ.edu', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250', attendanceRate: 65, status: 'Absent', lastCheckIn: '--', faceVector: 'vec_99120' },
  { id: 'STU-1008', name: 'Sophia Taylor', class: 'CS-101', email: 'sophia.t@univ.edu', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', attendanceRate: 95, status: 'Present', lastCheckIn: '08:40 AM', faceVector: 'vec_55210' }
];

const INITIAL_LOGS = [
  { id: 'LOG-1', studentId: 'STU-1001', name: 'Alex Rivera', class: 'CS-101', status: 'Present', time: '08:45 AM', method: 'Face AI', confidence: '99.4%' },
  { id: 'LOG-2', studentId: 'STU-1002', name: 'Sarah Chen', class: 'CS-101', status: 'Present', time: '08:50 AM', method: 'QR Code', confidence: '100%' },
  { id: 'LOG-3', studentId: 'STU-1004', name: 'Emily Zhang', class: 'CS-202', status: 'Present', time: '08:42 AM', method: 'Geofence GPS', confidence: 'Radius 12m' },
  { id: 'LOG-4', studentId: 'STU-1005', name: 'David Miller', class: 'CS-202', status: 'Late', time: '09:15 AM', method: 'Manual', confidence: 'Verified by Instructor' },
  { id: 'LOG-5', studentId: 'STU-1008', name: 'Sophia Taylor', class: 'CS-101', status: 'Present', time: '08:40 AM', method: 'Face AI', confidence: '98.8%' }
];

const WEEKLY_TREND = [
  { day: 'Mon', CS101: 94, CS202: 88, overall: 91 },
  { day: 'Tue', CS101: 96, CS202: 92, overall: 94 },
  { day: 'Wed', CS101: 90, CS202: 85, overall: 87.5 },
  { day: 'Thu', CS101: 98, CS202: 90, overall: 94 },
  { day: 'Fri', CS101: 92, CS202: 82, overall: 87 }
];

const METHOD_DISTRIBUTION = [
  { name: 'Face AI Recognition', value: 52, color: '#6366f1' },
  { name: 'QR Code Check-in', value: 28, color: '#10b981' },
  { name: 'Geofence GPS', value: 12, color: '#f59e0b' },
  { name: 'Manual Override', value: 8, color: '#ec4899' }
];

const playAudioTone = (type = 'success') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'scan') {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.log('Audio playback requires interactive gesture');
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('teacher');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const recordAttendance = (studentId, status, method, confidence = '100%') => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, status, lastCheckIn: timeNow };
      }
      return s;
    }));

    const student = students.find(s => s.id === studentId);
    if (student) {
      const newLog = {
        id: `LOG-${Date.now()}`,
        studentId: student.id,
        name: student.name,
        class: student.class,
        status,
        time: timeNow,
        method,
        confidence
      };
      setLogs(prev => [newLog, ...prev]);
      playAudioTone('success');
      triggerToast(`Attendance marked for ${student.name} as ${status} (${method})`);
    }
  };

  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const lateCount = students.filter(s => s.status === 'Late').length;
  const attendancePercentage = Math.round(((presentCount + (lateCount * 0.5)) / totalStudents) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 border border-indigo-500/30 text-white shadow-2xl shadow-indigo-500/20 animate-bounce">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} setRole={setRole} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Attendance System
            </h1>
            <p className="text-xs text-slate-400">AI-Powered Biometric & Spatial Check-in Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Class:</span>
              <select 
                value={selectedClassFilter} 
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-800">All Classes</option>
                <option value="CS-101" className="bg-slate-800">CS-101 (Intro to CS)</option>
                <option value="CS-202" className="bg-slate-800">CS-202 (Data Structures)</option>
              </select>
            </div>

            <button
              onClick={() => {
                const nextRole = role === 'teacher' ? 'student' : 'teacher';
                setRole(nextRole);
                triggerToast(`Switched view to ${nextRole.toUpperCase()} mode`, 'info');
              }}
              className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Role: <strong className="capitalize text-white">{role}</strong></span>
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              students={students} 
              logs={logs}
              presentCount={presentCount}
              absentCount={absentCount}
              lateCount={lateCount}
              totalStudents={totalStudents}
              attendancePercentage={attendancePercentage}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'scanner' && (
            <SmartAiScanner 
              students={students} 
              onMarkAttendance={(id, status, method, conf) => recordAttendance(id, status, method, conf)}
            />
          )}

          {activeTab === 'roster' && (
            <ClassRoster 
              students={students.filter(s => selectedClassFilter === 'All' || s.class === selectedClassFilter)} 
              onMarkAttendance={recordAttendance}
              selectedClassFilter={selectedClassFilter}
            />
          )}

          {activeTab === 'students' && (
            <StudentDirectory 
              students={students} 
              setStudents={setStudents}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'geofence' && (
            <GeofenceCheckin 
              students={students}
              recordAttendance={recordAttendance}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsReports 
              students={students}
              logs={logs}
              triggerToast={triggerToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'scanner', label: 'AI Face & QR Scan', icon: Camera, badge: 'Smart' },
    { id: 'roster', label: 'Live Attendance Register', icon: UserCheck },
    { id: 'geofence', label: 'GPS Geofence Check-in', icon: MapPin },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'analytics', label: 'Reports & Analytics', icon: Activity },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-sm tracking-wide">ATTENDANCE.AI</h2>
            <p className="text-[10px] text-slate-400 font-medium">v3.4 Smart Campus</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>Terminal ID:</span>
            <span className="font-mono text-indigo-400">TERM-89A</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Server Status:</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardOverview({ students, logs, presentCount, absentCount, lateCount, totalStudents, attendancePercentage, setActiveTab }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Overall Attendance" 
          value={`${attendancePercentage}%`} 
          subtitle="Target threshold: > 85%" 
          icon={Award}
          gradient="from-indigo-500 to-purple-600"
          trend="+2.4% vs last week"
        />
        <MetricCard 
          title="Present Today" 
          value={presentCount} 
          subtitle={`Out of ${totalStudents} enrolled`} 
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-600"
        />
        <MetricCard 
          title="Absent Today" 
          value={absentCount} 
          subtitle="Needs follow-up notification" 
          icon={XCircle}
          gradient="from-rose-500 to-red-600"
        />
        <MetricCard 
          title="Late Arrivals" 
          value={lateCount} 
          subtitle="Checked in after 09:00 AM" 
          icon={Clock}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next Generation AI Recognition
          </div>
          <h2 className="text-xl font-bold text-white">Start High-Speed Biometric Scan Session</h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Activate the AI Camera Scanner or GPS Geofence Check-in mode to instantly log classroom attendance without manual roll call.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <button 
            onClick={() => setActiveTab('scanner')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Launch AI Scanner
          </button>
          <button 
            onClick={() => setActiveTab('geofence')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-sm transition-all flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            GPS Geofence
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-100 text-base">Weekly Attendance Rate</h3>
              <p className="text-xs text-slate-400">Class comparison across the current week</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              Live Sync
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="CS101" stroke="#818cf8" strokeWidth={3} name="CS-101" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="CS202" stroke="#34d399" strokeWidth={3} name="CS-202" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-base">Verification Methods</h3>
            <p className="text-xs text-slate-400">How students checked in today</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={METHOD_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {METHOD_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {METHOD_DISTRIBUTION.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-slate-300">{m.name}</span>
                </div>
                <span className="font-semibold text-slate-200">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-slate-100 text-base">Recent Activity Log</h3>
          </div>
          <button 
            onClick={() => setActiveTab('roster')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            View Full Register <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Student Name</th>
                <th className="pb-3 px-3">Class</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Time</th>
                <th className="pb-3 px-3">Verification Method</th>
                <th className="pb-3 px-3">Accuracy / Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {logs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-100">{log.name}</td>
                  <td className="py-3 px-3">{log.class}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      log.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {log.status === 'Present' && <CheckCircle2 className="w-3 h-3" />}
                      {log.status === 'Late' && <Clock className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{log.time}</td>
                  <td className="py-3 px-3 text-slate-300">{log.method}</td>
                  <td className="py-3 px-3 font-mono text-indigo-300">{log.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, gradient, trend }) {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">{value}</span>
        {trend && <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">{trend}</span>}
      </div>
      <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>
    </div>
  );
}

function SmartAiScanner({ students, onMarkAttendance }) {
  const [isScanning, setIsScanning] = useState(false);
  const [activeMode, setActiveMode] = useState('face');
  const [scanResult, setScanResult] = useState(null);
  const [cameraPermissionError, setCameraPermissionError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    if (isScanning) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Webcam unavailable:", err);
          setCameraPermissionError("Live webcam not available. Use the simulator below.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  const triggerSimulationMatch = (student) => {
    playAudioTone('scan');
    const targetStudent = student || students[Math.floor(Math.random() * students.length)];
    
    setScanResult({
      student: targetStudent,
      confidence: (96 + Math.random() * 3.8).toFixed(1) + '%',
      timestamp: new Date().toLocaleTimeString()
    });

    onMarkAttendance(targetStudent.id, 'Present', activeMode === 'face' ? 'Face AI Scanner' : 'QR Scanner', '99.2%');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            Biometric Scanner Terminal
          </h2>
          <p className="text-xs text-slate-400">Real-time facial vector feature matching & instant QR decoding</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMode('face')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'face' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Face Recognition
          </button>
          <button
            onClick={() => setActiveMode('qr')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'qr' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> QR Code Scanner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[420px] overflow-hidden">
          <div className="relative w-full max-w-md aspect-video bg-slate-900 rounded-2xl border-2 border-indigo-500/40 overflow-hidden flex items-center justify-center shadow-2xl shadow-indigo-500/10">
            {isScanning ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 border-2 border-indigo-500/30 m-4 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between text-[10px] font-mono text-indigo-400 bg-slate-950/70 p-1.5 rounded">
                    <span>AI Engine: FaceNet-v4</span>
                    <span>FPS: 60.0</span>
                  </div>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse my-auto" />
                  <div className="absolute inset-12 border-2 border-dashed border-indigo-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      {activeMode === 'face' ? 'Scanning Facial Landmarks...' : 'Align Student QR Code'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                  {activeMode === 'face' ? <Camera className="w-8 h-8 text-indigo-400" /> : <QrCode className="w-8 h-8 text-indigo-400" />}
                </div>
                <h3 className="text-sm font-semibold text-slate-200">Camera Feed Idle</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click 'Activate Camera' to start automated biometric detection.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center gap-2 shadow-lg ${
                isScanning 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Stop Camera' : 'Activate Camera Feed'}
            </button>

            <button
              onClick={() => triggerSimulationMatch()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulate Instant Match
            </button>
          </div>

          {cameraPermissionError && (
            <p className="mt-3 text-xs text-amber-400 font-medium">{cameraPermissionError}</p>
          )}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Detection Details</h3>

          {scanResult ? (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={scanResult.student.avatar} 
                  alt={scanResult.student.name} 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-indigo-500"
                />
                <div>
                  <h4 className="font-bold text-white text-base">{scanResult.student.name}</h4>
                  <p className="text-xs text-slate-400">{scanResult.student.id} • {scanResult.student.class}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Match Confidence</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{scanResult.confidence}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Logged Time</span>
                  <span className="font-mono text-indigo-300 font-bold text-sm">{scanResult.timestamp}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Attendance successfully registered!</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
              <Info className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">Waiting for target identification scan...</p>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Quick Test Detection on Student:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => triggerSimulationMatch(s)}
                  className="w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={s.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">{s.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassRoster({ students, onMarkAttendance, selectedClassFilter }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Class Attendance Register
          </h2>
          <p className="text-xs text-slate-400">
            Showing records for: <strong className="text-indigo-300">{selectedClassFilter}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              students.forEach(s => onMarkAttendance(s.id, 'Present', 'Batch Manual'));
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Present
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
              <th className="py-3 px-4">Student Profile</th>
              <th className="py-3 px-4">Student ID</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Overall Rate</th>
              <th className="py-3 px-4">Today's Status</th>
              <th className="py-3 px-4">Last Check-in</th>
              <th className="py-3 px-4 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={student.avatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <p className="font-semibold text-slate-100 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-indigo-300">{student.id}</td>
                <td className="py-3 px-4 text-xs">{student.class}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          student.attendanceRate > 85 ? 'bg-emerald-400' : 'bg-rose-400'
                        }`} 
                        style={{ width: `${student.attendanceRate}%` }} 
                      />
                    </div>
                    <span className="text-xs font-mono">{student.attendanceRate}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    student.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    student.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-slate-400">{student.lastCheckIn}</td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => onMarkAttendance(student.id, 'Present', 'Teacher Manual')}
                      className={`p-1.5 rounded-lg text-xs hover:bg-emerald-500/20 hover:text-emerald-300 ${student.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
                      title="Mark Present"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMarkAttendance(student.id, 'Late', 'Teacher Manual')}
                      className={`p-1.5 rounded-lg text-xs hover:bg-amber-500/20 hover:text-amber-300 ${student.status === 'Late' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`}
                      title="Mark Late"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMarkAttendance(student.id, 'Absent', 'Teacher Manual')}
                      className={`p-1.5 rounded-lg text-xs hover:bg-rose-500/20 hover:text-rose-300 ${student.status === 'Absent' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400'}`}
                      title="Mark Absent"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GeofenceCheckin({ students, recordAttendance }) {
  const [geoState, setGeoState] = useState({
    userLat: 23.8103,
    userLng: 90.4125,
    distanceMeter: 12,
    isInside: true,
    statusText: 'Inside Campus Perimeter (Radius: 100m)'
  });
  const [selectedStudentForGeo, setSelectedStudentForGeo] = useState(students[0]?.id || '');

  const verifyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const simDistance = Math.floor(Math.random() * 40) + 5;
          setGeoState(prev => ({
            ...prev,
            userLat: pos.coords.latitude,
            userLng: pos.coords.longitude,
            distanceMeter: simDistance,
            isInside: simDistance <= 100,
            statusText: simDistance <= 100 ? `Verified Location (${simDistance}m from Center)` : `Outside Campus (${simDistance}m)`
          }));
        },
        () => {
          const simDistance = Math.floor(Math.random() * 30) + 8;
          setGeoState(prev => ({
            ...prev,
            distanceMeter: simDistance,
            isInside: true,
            statusText: `Simulated Verified Location (${simDistance}m from Center)`
          }));
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            GPS Geofence Location Verification
          </h2>
          <p className="text-xs text-slate-400">Automatic student check-in via spatial GPS radius</p>
        </div>
        <button 
          onClick={verifyLocation}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-sync Coordinates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[350px]">
          <div className="relative w-64 h-64 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-950/10 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="absolute w-44 h-44 rounded-full border border-dashed border-emerald-500/40 animate-spin" />
            <div className="absolute w-28 h-28 rounded-full border border-emerald-500/50 bg-emerald-500/5" />
            
            <div className="z-10 bg-emerald-500 text-slate-950 p-3 rounded-full shadow-lg shadow-emerald-500/50 animate-bounce">
              <Smartphone className="w-6 h-6" />
            </div>

            <span className="absolute bottom-4 text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/30">
              Radius: {geoState.distanceMeter} meters
            </span>
          </div>

          <div className="mt-6 text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> {geoState.statusText}
            </span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Geofence Check-in Terminal</h3>

          <div className="space-y-3">
            <label className="text-xs text-slate-400 font-semibold block">Select Student Account:</label>
            <select
              value={selectedStudentForGeo}
              onChange={(e) => setSelectedStudentForGeo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Geofence:</span>
              <span className="font-mono text-slate-200">Main Campus Quad</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Allowed Radius:</span>
              <span className="font-mono text-slate-200">100 Meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Distance:</span>
              <span className="font-mono text-emerald-400">{geoState.distanceMeter} Meters</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (selectedStudentForGeo) {
                recordAttendance(selectedStudentForGeo, 'Present', 'GPS Geofence', `Radius ${geoState.distanceMeter}m`);
              }
            }}
            disabled={!geoState.isInside}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm Geofence Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDirectory({ students, setStudents, searchQuery, setSearchQuery, triggerToast }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', class: 'CS-101', email: '' });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    const created = {
      id: `STU-${1000 + students.length + 1}`,
      name: newStudent.name,
      class: newStudent.class,
      email: newStudent.email,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
      attendanceRate: 100,
      status: 'Present',
      lastCheckIn: 'Just now',
      faceVector: `vec_${Math.floor(Math.random()*90000 + 10000)}`
    };

    setStudents(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewStudent({ name: '', class: 'CS-101', email: '' });
    triggerToast(`Added new student ${created.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Enrolled Student Directory
          </h2>
          <p className="text-xs text-slate-400">Manage student biometric vectors and enrollment records</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <img src={student.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
              <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {student.id}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm">{student.name}</h4>
              <p className="text-xs text-slate-400">{student.email}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Class: <strong>{student.class}</strong></span>
              <span className="font-bold text-emerald-400">{student.attendanceRate}% Rate</span>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Enroll New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Jordan Lee"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="jordan.l@univ.edu"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Class Designation</label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="CS-101">CS-101 (Intro to CS)</option>
                  <option value="CS-202">CS-202 (Data Structures)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsReports({ students, triggerToast }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Attendance Intelligence Reports
          </h2>
          <p className="text-xs text-slate-400">Exportable data insights and absenteeism risk alerts</p>
        </div>

        <button 
          onClick={() => triggerToast && triggerToast("CSV Attendance Data exported successfully!")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Export Report (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-200">Average Attendance by Course</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'CS-101', rate: 92 },
                { name: 'CS-202', rate: 84 },
                { name: 'ENG-11', rate: 95 },
                { name: 'MATH-3', rate: 89 }
              ]}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} />
                <Bar dataKey="rate" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-bold">Absenteeism Risk Flag (&lt;80%)</h3>
          </div>

          <div className="space-y-3">
            {students.filter(s => s.attendanceRate < 80).map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.class} • {s.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-400">{s.attendanceRate}%</span>
                  <span className="block text-[9px] text-slate-400">Low Threshold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}