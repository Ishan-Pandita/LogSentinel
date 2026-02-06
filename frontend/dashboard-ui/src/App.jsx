import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ShieldAlert,
    Activity,
    Server,
    LayoutDashboard,
    Search,
    Bell,
    Menu,
    ShieldCheck,
    Globe,
    Lock,
    Cpu,
    Moon,
    Sun,
    User,
    LogOut,
    Settings
} from 'lucide-react';
import './index.css';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg mb-1 group ${active ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}`}
    >
        <Icon size={20} className={active ? 'text-blue-500' : 'group-hover:scale-110 transition-transform'} />
        <span className="font-medium text-sm">{label}</span>
    </div>
);

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
    <div className={`glass-panel p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
                <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20`}>
                <Icon size={24} className={borderClass} />
            </div>
        </div>
    </div>
);

const PlaceholderView = ({ title, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
        <div className="p-6 bg-[var(--bg-secondary)] rounded-full mb-6 border border-[var(--border-color)]">
            <Icon size={64} className="text-[var(--text-secondary)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{title} Module</h2>
        <p className="text-[var(--text-secondary)] max-w-md">
            This advanced module is part of the Enterprise Edition. <br />
            For this demonstration, focus is on the <span className="text-blue-500">Overview & Threat Detection</span> system.
        </p>
        <button className="mt-8 px-6 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg border border-[var(--border-color)] transition-colors font-medium">
            View Documentation
        </button>
    </div>
);

function App() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchAlerts = async () => {
        try {
            const response = await axios.get('http://localhost:3002/alerts');
            setAlerts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching alerts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 2000);
        return () => clearInterval(interval);
    }, []);

    // Theme Toggle Effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Metrics
    const totalAlerts = alerts.length;
    const highSeverity = alerts.filter(a => a.severity === 'HIGH').length;
    const uniqueIPs = [...new Set(alerts.map(a => a.ip))].length;
    const recentHighAlerts = alerts.filter(a => a.severity === 'HIGH').slice(0, 3);

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">

            {/* Sidebar */}
            <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-primary)] hidden md:flex flex-col fixed h-full z-20 transition-colors duration-300">
                <div className="p-6 flex items-center gap-3 border-b border-[var(--border-color)]">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight leading-none">LogSentinel</h1>
                        <p className="text-[10px] text-blue-500 font-bold tracking-widest mt-1 uppercase">Enterprise Security</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 mt-2">Platform</p>
                    <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
                    <SidebarItem icon={Activity} label="Live Traffic" active={activeTab === 'Live Traffic'} onClick={() => setActiveTab('Live Traffic')} />
                    <SidebarItem icon={Server} label="Server Nodes" active={activeTab === 'Server Nodes'} onClick={() => setActiveTab('Server Nodes')} />
                    <SidebarItem icon={Globe} label="Network Map" active={activeTab === 'Network Map'} onClick={() => setActiveTab('Network Map')} />

                    <p className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 mt-8">Intelligence</p>
                    <SidebarItem icon={ShieldAlert} label="Threats & Alerts" active={activeTab === 'Threats & Alerts'} onClick={() => setActiveTab('Overview')} />
                    <SidebarItem icon={Search} label="Log Investigation" active={activeTab === 'Log Investigation'} onClick={() => setActiveTab('Log Investigation')} />
                </nav>

                <div className="p-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500 relative"></div>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] font-medium">System Operational</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 animate-in fade-in duration-500">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{activeTab === 'Overview' ? 'Security Overview' : activeTab}</h2>
                        <p className="text-[var(--text-secondary)] text-sm mt-1">Real-time threat monitoring and intrusion detection system.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Live Indicator */}
                        <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full border border-[var(--border-color)] flex items-center gap-2 hidden sm:flex">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Live updates: 2s
                        </span>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors relative"
                            >
                                <Bell size={20} />
                                {highSeverity > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[var(--bg-primary)] animate-pulse"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-3 border-b border-[var(--border-color)] flex justify-between items-center">
                                        <span className="text-sm font-semibold">Notifications</span>
                                        <span className="text-xs text-blue-500 cursor-pointer">Mark all read</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {recentHighAlerts.length === 0 ? (
                                            <p className="p-4 text-xs text-center text-[var(--text-secondary)]">No critical alerts.</p>
                                        ) : (
                                            recentHighAlerts.map(alert => (
                                                <div key={alert._id} className="p-3 hover:bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] last:border-0 cursor-pointer">
                                                    <div className="flex gap-2">
                                                        <ShieldAlert size={16} className="text-red-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-red-500">{alert.rule}</p>
                                                            <p className="text-xs text-[var(--text-secondary)] truncate w-48">{alert.description}</p>
                                                            <p className="text-[10px] text-[var(--text-secondary)] mt-1">{new Date(alert.createdAt).toLocaleTimeString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 text-center border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                                        <span className="text-xs font-medium cursor-pointer hover:text-blue-500">View all alerts</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {activeTab === 'Overview' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard title="Total Threats Detected" value={totalAlerts} icon={ShieldAlert} colorClass="bg-red-500" borderClass="text-red-500" />
                            <StatCard title="Critical Incidents" value={highSeverity} icon={Activity} colorClass="bg-orange-500" borderClass="text-orange-500" />
                            <StatCard title="Compromised Sources" value={uniqueIPs} icon={Globe} colorClass="bg-blue-500" borderClass="text-blue-500" />
                        </div>

                        {/* Alerts Table */}
                        <div className="glass-panel rounded-xl overflow-hidden min-h-[400px]">
                            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)] bg-opacity-40">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <ShieldAlert size={20} className="text-blue-500" />
                                    Recent Security Events
                                </h3>
                                <div className="relative group">
                                    <Search size={16} className="absolute left-3 top-3 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search IP or Event..."
                                        className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-blue-500/50 transition-all w-64 placeholder:text-[var(--text-secondary)]"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--bg-tertiary)] bg-opacity-30 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">
                                            <th className="p-4 pl-6">Severity</th>
                                            <th className="p-4">Rule / Detection</th>
                                            <th className="p-4">Source IP</th>
                                            <th className="p-4">Description</th>
                                            <th className="p-4 text-right pr-6">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center text-[var(--text-secondary)] animate-pulse">
                                                    Establishing secure connection to Collector Node...
                                                </td>
                                            </tr>
                                        ) : alerts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-16 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center ring-1 ring-green-500/20 shadow-lg">
                                                            <ShieldCheck size={32} className="text-green-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-lg mb-1">System Secure</h4>
                                                            <p className="text-[var(--text-secondary)] text-sm">No active threats detected in the last 24 hours.</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            alerts.map((alert) => (
                                                <tr key={alert._id} className="table-row-hover transition-colors group cursor-default border-b border-[var(--border-color)] last:border-0">
                                                    <td className="p-4 pl-6">
                                                        <span className={`status-badge border shadow-sm ${alert.severity === 'HIGH'
                                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                            }`}>
                                                            {alert.severity}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-medium group-hover:text-[var(--text-primary)] transition-colors">{alert.rule}</td>
                                                    <td className="p-4 font-mono text-[var(--text-secondary)] text-sm group-hover:text-blue-500 transition-colors">{alert.ip}</td>
                                                    <td className="p-4 text-[var(--text-secondary)] text-sm max-w-xs truncate" title={alert.description}>{alert.description}</td>
                                                    <td className="p-4 text-right pr-6 text-[var(--text-secondary)] text-sm font-mono whitespace-nowrap">
                                                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        <span className="text-[var(--text-secondary)] ml-2 text-xs opacity-70">{new Date(alert.createdAt).toLocaleDateString()}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] bg-opacity-30 text-center text-[10px] text-[var(--text-secondary)] font-medium tracking-wide">
                                <span className="flex items-center justify-center gap-2">
                                    <Lock size={10} />
                                    Showing latest 50 events • Connection Encrypted (TLS 1.3) • v1.0.4
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <PlaceholderView
                        title={activeTab}
                        icon={
                            activeTab === 'Live Traffic' ? Activity :
                                activeTab === 'Server Nodes' ? Server :
                                    activeTab === 'Network Map' ? Globe :
                                        activeTab === 'Log Investigation' ? Search :
                                            LayoutDashboard
                        }
                    />
                )}
            </main>
        </div>
    );
}

export default App;
