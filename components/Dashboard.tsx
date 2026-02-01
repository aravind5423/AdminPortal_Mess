
import React, { useState, useEffect } from 'react';
import { Users, Utensils, AlertCircle, Clock, Lock } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        attendance: 0,
        totalStudents: 450, // Default fallback
        guestMeals: 0,
        pendingLeaves: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get Total Students
                const usersSnap = await getDocs(collection(db, "Users"));
                const totalStudents = usersSnap.size || 450;

                // 2. Get Leaves for Today
                const todayStr = new Date().toISOString().split('T')[0];
                const leavesSnap = await getDocs(collection(db, "MessLeaves"));
                const leaves = leavesSnap.docs.map(d => d.data());

                const leavesToday = leaves.filter((l: any) =>
                    l.date === todayStr && l.status === "Approved"
                ).length;

                const pendingLeaves = leaves.filter((l: any) => l.status === "Pending").length;

                // 3. Guest Meals (Simulated for now if Payments empty)
                const paymentsSnap = await getDocs(collection(db, "Payments"));
                // Simple logic: if payments exist, try to filter. Else 0.
                const guestCount = paymentsSnap.docs.filter(d => {
                    const data = d.data();
                    return (data.purpose === "Guest Meal") &&
                        (data.timeStamp && new Date(data.timeStamp).toISOString().startsWith(todayStr));
                }).length;

                setStats({
                    attendance: totalStudents - leavesToday,
                    totalStudents,
                    guestMeals: guestCount,
                    pendingLeaves
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { label: 'Today Attendance', value: loading ? '...' : stats.attendance.toString(), sub: `Total ${stats.totalStudents} students`, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Guest Meals', value: loading ? '...' : stats.guestMeals.toString(), sub: 'Verified & Paid Today', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Leaves', value: loading ? '...' : stats.pendingLeaves.toString(), sub: 'Action Required', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Status', value: 'Unlocked', sub: 'Closing in 2h 15m', icon: Lock, color: 'text-violet-600', bg: 'bg-violet-50' },
    ];

    const mealData = [
        { name: 'Breakfast', count: Math.floor(stats.attendance * 0.9), capacity: stats.totalStudents },
        { name: 'Lunch', count: stats.attendance, capacity: stats.totalStudents },
        { name: 'Snacks', count: Math.floor(stats.attendance * 0.7), capacity: stats.totalStudents },
        { name: 'Dinner', count: Math.floor(stats.attendance * 0.95), capacity: stats.totalStudents },
    ];

    const trendData = [
        { day: 'Mon', attendance: 410 },
        { day: 'Tue', attendance: 430 },
        { day: 'Wed', attendance: 390 },
        { day: 'Thu', attendance: 420 },
        { day: 'Fri', attendance: 440 },
        { day: 'Sat', attendance: 320 },
        { day: 'Today', attendance: stats.attendance },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Operations Overview</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Real-time status of the hostel mess</p>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-600 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl border border-white shadow-sm ring-1 ring-slate-200/50">
                    <div className="bg-orange-100 p-1.5 rounded-full text-orange-600">
                        <Clock size={14} strokeWidth={2.5} />
                    </div>
                    <span>Next Meal: <strong className="text-slate-900 font-heading">Dinner at 7:30 PM</strong></span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm card-hover relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                            <stat.icon size={80} className={stat.color} />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl shadow-inner`}>
                                <stat.icon size={22} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Live</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">{stat.value}</h3>
                            <p className="text-slate-500 text-sm font-bold mt-1">{stat.label}</p>
                            <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-lg border border-slate-100">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 font-heading">Meal-wise Attendance (Projected)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mealData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 font-heading">Weekly Attendance Trend</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                                    />
                                    <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Action Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 font-heading">Quick Alerts</h3>
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${stats.pendingLeaves > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                {stats.pendingLeaves} Active
                            </span>
                        </div>
                        <div className="space-y-4">
                            {stats.pendingLeaves > 0 ? (
                                <div className="flex gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50 hover:bg-orange-50 transition-colors cursor-pointer group">
                                    <div className="bg-white p-2 rounded-xl h-fit shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{stats.pendingLeaves} Pending Leave Requests</p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Review them in the "Leaves" tab.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 text-sm font-medium">No critical alerts</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">View All System Alerts</button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden group cursor-pointer">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                            <Utensils size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/10 w-fit p-2 rounded-lg backdrop-blur mb-4">
                                <Clock size={20} className="text-indigo-100" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading leading-tight">Announcement</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">Special dinner tonight for Cultural Festival. Please ensure extra guest tokens are ready.</p>
                            <button className="bg-white text-indigo-600 px-5 py-3 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20 w-full">Broadcast to App</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
