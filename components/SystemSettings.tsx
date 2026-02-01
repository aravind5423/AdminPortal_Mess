
import React from 'react';
import { Clock, ShieldAlert, BellRing, UtensilsCrossed } from 'lucide-react';

const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
        <p className="text-slate-500 text-sm">Control deadlines, limits, and operational rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Clock size={18} className="text-indigo-600" />
            Operational Deadlines
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-slate-800">Leave Booking Cut-off</p>
                <p className="text-xs text-slate-400">Time before which leave must be filed</p>
              </div>
              <select className="p-2 bg-slate-50 border-slate-100 rounded-lg text-sm font-bold">
                <option>24 Hours</option>
                <option>48 Hours</option>
                <option>72 Hours</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-slate-800">Guest Booking Cut-off</p>
                <p className="text-xs text-slate-400">Applies to individual meal tokens</p>
              </div>
              <select className="p-2 bg-slate-50 border-slate-100 rounded-lg text-sm font-bold">
                <option>12 Hours</option>
                <option>24 Hours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <ShieldAlert size={18} className="text-red-600" />
            Emergency Policies
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-slate-800">Monthly Emergency Limit</p>
                <p className="text-xs text-slate-400">Max emergency leaves per student</p>
              </div>
              <input type="number" defaultValue={3} className="w-16 p-2 bg-slate-50 border-slate-100 rounded-lg text-center font-bold" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-slate-800">Auto-Approval Threshold</p>
                <p className="text-xs text-slate-400">Minutes before leave starts</p>
              </div>
              <input type="number" defaultValue={60} className="w-16 p-2 bg-slate-50 border-slate-100 rounded-lg text-center font-bold" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <BellRing size={18} className="text-orange-600" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Meal Prep Start Alerts', enabled: true },
              { label: 'Deadline Reminders', enabled: true },
              { label: 'Feedback Surveys', enabled: false },
            ].map((setting, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">{setting.label}</span>
                <button className={`w-10 h-5 rounded-full transition-colors relative ${setting.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${setting.enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <UtensilsCrossed size={18} className="text-green-600" />
            Guest Limits
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Max Guests per Student/Day</span>
              <input type="number" defaultValue={2} className="w-16 p-2 bg-slate-50 border-slate-100 rounded-lg text-center font-bold" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Guest Token Price (Fixed)</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-bold">₹</span>
                <input type="number" defaultValue={120} className="w-20 p-2 bg-slate-50 border-slate-100 rounded-lg text-center font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Discard</button>
        <button className="px-8 py-2 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-black transition-colors">Save All Configurations</button>
      </div>
    </div>
  );
};

export default SystemSettings;
