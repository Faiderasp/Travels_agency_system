import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Table from "../components/Table";
import { api } from "../services/api";

function Panel() {

    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [stats, setStats] = useState({
        travels: 0,
        travellers: 0,
    });


    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigate();
    const bestTraveller = 'Cevino Sobretti';

    useEffect(() => {
        if (!userData) {
            navigation('/');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [travelsRes, travellersRes] = await Promise.all([
                    api.getTravels(),
                    api.getTravellers()
                ]);

                if (travelsRes.success && travellersRes.success) {
                    setStats({
                        travels: travelsRes.data.length,
                        travellers: travellersRes.data.length,
                    });


                    // Take last 5 travels as recent activity
                    const recent = travelsRes.data.slice(-5).reverse().map(t => ({
                        id: t.travel_code,
                        traveller: t.name,
                        date: new Date(t.date).toLocaleDateString(),
                        destination: t.destiny,
                        status: "Confirmed"
                    }));
                    setRecentActivity(recent);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userData, navigation]);

    if (!userData) return null;

    const recentTravelsHeaders = ["ID", "Traveller", "Destination", "Status", "Date"];

    function logout_handler() {
        navigation('/');
    }

    return (
        <div className="flex h-screen flex-row bg-gray-50 overflow-hidden">
            <Navbar userData={userData} logout_handler={logout_handler}></Navbar>

            <div className="flex grow flex-col overflow-y-auto">
                {/* Header */}
                <header className="px-10 py-8 bg-white border-b shadow-sm flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-violet-950 font-mono">Dashboard Overview</h1>
                        <p className="text-gray-500 mt-1">Welcome back, {userData.name}! Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-violet-800 flex items-center justify-center text-white font-bold uppercase">
                            {(userData.username || userData.name || '??').slice(0, 2)}
                        </div>
                    </div>

                </header>

                <main className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-violet-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-violet-100 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                    <i className="fa-solid fa-plane-departure text-3xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-semibold mb-1">Total Travels</h3>
                                    <p className="text-4xl font-bold text-slate-800">{stats.travels}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-violet-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-blue-100 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <i className="fa-solid fa-users text-3xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-semibold mb-1">Active Travellers</h3>
                                    <p className="text-4xl font-bold text-slate-800">{stats.travellers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h2 className="text-2xl font-bold text-slate-800 font-mono">Recent Activity</h2>
                            <button
                                onClick={() => navigation('/travels')}
                                className="text-violet-600 font-semibold hover:underline"
                            >
                                View All Travels
                            </button>
                        </div>
                        <Table headers={recentTravelsHeaders} data={recentActivity} />
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Panel;

