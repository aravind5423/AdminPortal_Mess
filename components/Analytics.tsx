
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const Analytics: React.FC = () => {
  const attendanceTrends = [
    { month: 'Jul', attendance: 380, leaves: 40 },
    { month: 'Aug', attendance: 410, leaves: 30 },
    { month: 'Sep', attendance: 430, leaves: 20 },
    { month: 'Oct', attendance: 425, leaves: 25 },
  ];

  const wastageData = [
    { name: 'Rice', value: 45, color: '#ef4444' },
    { name: 'Vegetables', value: 25, color: '#f59e0b' },
    { name: 'Dal/Curry', value: 20, color: '#3b82f6' },
    { name: 'Others', value: 10, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reporting & Analytics</h2>
          <p className="text-slate-500 text-sm">Long-term insights and performance trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance vs Leaves Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrends}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={2} />
                <Area type="monotone" dataKey="leaves" stroke="#f43f5e" fillOpacity={1} fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Wastage Composition</h3>
          <div className="h-80 w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {wastageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Monthly Summary Table</h3>
          <button className="text-indigo-600 text-sm font-bold">Download Full Dataset (CSV)</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Peak Attendance</p>
            <p className="text-2xl font-bold text-slate-800">442</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Avg Wastage</p>
            <p className="text-2xl font-bold text-red-600">6.2 kg/day</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Guest Meals</p>
            <p className="text-2xl font-bold text-green-600">184</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-indigo-600">₹14,500</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
