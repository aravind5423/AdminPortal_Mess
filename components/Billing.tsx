
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownLeft, FileText, Filter } from 'lucide-react';
import { PaymentService } from '../services/paymentService';
import { Payment } from '../types';

const Billing: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await PaymentService.getAllPayments();
      // Sort by timestamp desc locally since we grabbed all
      const sorted = data.sort((a, b) => b.timeStamp - a.timeStamp);
      setPayments(sorted);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalCollection = payments.reduce((acc, p) => acc + (p.amount > 0 ? p.amount : 0), 0);
  // Assuming refunds might be negative or have a specific status, but schema is simple. 
  // We'll calculate total based on displayed logic.

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Billing & Finance</h2>
          <p className="text-slate-500 text-sm">Monitor mess fee collection and refund status</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-white transition-colors">
            Monthly Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
            Process Refunds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Total Collection</span>
            <div className="bg-green-100 text-green-600 p-1.5 rounded-lg">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">₹{totalCollection.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-slate-400 mt-1">Total Verified Payments</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Pending Dues</span>
            <div className="bg-red-100 text-red-600 p-1.5 rounded-lg">
              <DollarSign size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">₹0</h3>
          <p className="text-xs text-slate-400 mt-1">All clear</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Total Refunds</span>
            <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
              <ArrowDownLeft size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">₹0</h3>
          <p className="text-xs text-slate-400 mt-1">Processed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-slate-500 hover:text-slate-800">
            <Filter size={18} />
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading transactions...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transactions found.</td></tr>
            ) : (
              payments.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.purpose}</td>
                  <td className="px-6 py-4 font-bold">₹{row.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-600' :
                        row.status?.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 text-xs">
                    {new Date(row.timeStamp).toLocaleDateString()}
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
