import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics = () => {
    const navigate = useNavigate();
    const [travels, setTravels] = useState([]);
    const [travellers, setTravellers] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [userData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (!userData) {
            navigate('/');
            return;
        }
        fetchData();
    }, [userData, navigate]);

    const fetchData = async () => {
        if (!userData) return;
        try {
            const [travelsRes, regsRes, travellersRes] = await Promise.all([
                api.getTravels(),
                api.getRegistrations(),
                api.getTravellers()
            ]);

            console.log("Stats Data:", { travels: travelsRes, regs: regsRes, travellers: travellersRes });

            if (!travelsRes.success) console.error("Travels failed:", travelsRes);
            if (!regsRes.success) console.error("Registrations failed:", regsRes);
            if (!travellersRes.success) console.error("Travellers failed:", travellersRes);

            if (travelsRes.success) setTravels(travelsRes.data || []);
            if (regsRes.success) setRegistrations(regsRes.data || []);
            if (travellersRes.success) setTravellers(travellersRes.data || []);
        } catch (error) {
            console.error("Fetch stats error:", error);
            Swal.fire('Error', `Could not load statistics data: ${error.message || 'Unknown network error'}`, 'error');
        } finally {


            setLoading(false);
        }
    };

    // Data Processing: Travels by Destination
    const destinationData = (travels || []).reduce((acc, travel) => {
        const name = travel.destiny || 'Unknown';
        const found = acc.find(item => item.name === name);
        if (found) {
            found.value += 1;
        } else {
            acc.push({ name, value: 1 });
        }
        return acc;
    }, []).sort((a, b) => b.value - a.value).slice(0, 5);

    // Data Processing: Registrations over time
    const monthlyData = (registrations || []).reduce((acc, reg) => {
        const dateStr = reg.created_at || new Date();
        const date = new Date(dateStr);
        const month = date.toLocaleString('default', { month: 'short' });
        const found = acc.find(item => item.name === month);
        if (found) {
            found.registrations += 1;
        } else {
            acc.push({ name: month, registrations: 1 });
        }
        return acc;
    }, []);

    // Data Processing: Capacity Utilization
    const capacityData = (travels || []).map(t => {
        const regCount = (registrations || []).filter(r => r.travel_id === t.travel_id).length;
        return {
            name: t.destiny || 'Unknown',
            capacity: t.seat_quantity || 1,
            occupied: regCount,
            percentage: Math.min(100, Math.round((regCount / (t.seat_quantity || 1)) * 100))
        };
    }).sort((a, b) => b.percentage - a.percentage).slice(0, 10);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600"></div>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Navbar userData={userData} logout_handler={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
            }}/>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">System Dashboard Statistics</h1>
                        <p className="text-gray-500">Overview of travels, travellers and registrations.</p>
                    </header>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Travels</span>
                            <span className="text-4xl font-black text-violet-600 mt-2">{travels.length}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Travellers</span>
                            <span className="text-4xl font-black text-emerald-500 mt-2">{travellers.length}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Registrations</span>
                            <span className="text-4xl font-black text-blue-500 mt-2">{registrations.length}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Destinations */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                                Top Destinations
                            </h3>
                            <div className="h-64">
                                {destinationData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={destinationData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={35} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : <div className="h-full flex items-center justify-center text-gray-400 italic">No destination data available</div>}
                            </div>
                        </div>

                        {/* Registration Trends */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                Registration Activity
                            </h3>
                            <div className="h-64">
                                {monthlyData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <defs>
                                                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="registrations" stroke="#82ca9d" fillOpacity={1} fill="url(#colorReg)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : <div className="h-full flex items-center justify-center text-gray-400 italic">No activity data available</div>}
                            </div>
                        </div>

                        {/* Market Share */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                Destiny Distribution
                            </h3>
                            <div className="h-64">
                                {destinationData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={destinationData}
                                                cx="50%" cy="50%"
                                                innerRadius={60} outerRadius={80}
                                                paddingAngle={5} dataKey="value"
                                            >
                                                {destinationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <div className="h-full flex items-center justify-center text-gray-400 italic">No distribution data</div>}
                            </div>
                        </div>

                        {/* Capacity Utilization */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Seat Utilization
                            </h3>
                            <div className="space-y-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                                {capacityData.length > 0 ? capacityData.map((travel, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-bold text-gray-700">{travel.name}</span>
                                            <span className="text-gray-400">{travel.occupied}/{travel.capacity} pax</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 rounded-full ${travel.percentage > 90 ? 'bg-rose-500' : travel.percentage > 50 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${travel.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )) : <div className="h-64 flex items-center justify-center text-gray-400 italic">No occupancy data</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
