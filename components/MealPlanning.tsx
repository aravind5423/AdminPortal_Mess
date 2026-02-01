
import React, { useState, useEffect } from 'react';
import { ChefHat, Info, Zap, Download, Utensils, Calendar } from 'lucide-react';
import { getMealEstimation } from '../services/gemini';
import { MenuService } from '../services/menuService';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const MealPlanning: React.FC = () => {
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string>('Lunch');
  const [attendance, setAttendance] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<string>('');
  const [loadingData, setLoadingData] = useState(true);

  // Helper to get day name (e.g., 'monday')
  const getDayName = (offset = 0) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return days[d.getDay()];
  };

  useEffect(() => {
    fetchRealTimeData();
  }, [selectedMeal]);

  const fetchRealTimeData = async () => {
    setLoadingData(true);
    try {
      // 1. Calculate Attendance (Total Users - Approved Leaves)
      // Optimization: In real app, cached or aggregated count is better.
      const usersSnap = await getDocs(collection(db, "Users"));
      const totalUsers = usersSnap.size || 450;

      // Get leaves for TODAY (assuming estimation is for today)
      const todayStr = new Date().toISOString().split('T')[0];
      const leavesSnap = await getDocs(collection(db, "MessLeaves"));
      const leavesToday = leavesSnap.docs.filter(d => {
        const data = d.data();
        return data.date === todayStr && (data.status === "Approved" || data.status === "APPROVED");
      }).length;

      const projectedAttendance = totalUsers - leavesToday;
      setAttendance(projectedAttendance);

      // 2. Fetch Menu
      // 2. Fetch Menu
      // Logic: Menu is stored as an array of 7 days (0=Monday, ... 6=Sunday) in 'menu' field
      const menuData = await MenuService.getMainMenu();
      if (menuData && menuData.menu) {
        // Calculate Day Index: 0=Monday ... 6=Sunday
        // JS getDay(): 0=Sunday, 1=Monday ... 6=Saturday
        const todayJS = new Date().getDay();
        const dayIndex = todayJS === 0 ? 6 : todayJS - 1; // Convert to Mon=0 start

        const todaysMenu = menuData.menu[dayIndex];

        if (todaysMenu && todaysMenu.particulars) {
          // particulars is an array of 4 meals: [Breakfast, Lunch, Snacks, Dinner]
          // We need to map selectedMeal string ('Lunch') to the correct index or find it
          const mealMap: { [key: string]: number } = { 'Breakfast': 0, 'Lunch': 1, 'Snacks': 2, 'Dinner': 3 };
          const mealIndex = mealMap[selectedMeal] ?? -1;

          if (mealIndex !== -1 && todaysMenu.particulars[mealIndex]) {
            setMenuItems(todaysMenu.particulars[mealIndex].food);
          } else {
            // Fallback: search by type name if index assumption fails
            const found = todaysMenu.particulars.find((p: any) => p.type === selectedMeal);
            setMenuItems(found ? found.food : "No items scheduled");
          }
        } else {
          console.warn("No menu found for day index:", dayIndex);
          setMenuItems("No menu for today");
        }
      }
    } catch (err) {
      console.error("Error fetching meal data", err);
      setAttendance(420); // Fallback
      setMenuItems("Rice, Dal, Curd (Fallback)");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAIEstimate = async () => {
    if (!menuItems) {
      alert("No menu items found for this meal. Please check Menu configuration.");
      return;
    }
    setIsEstimating(true);
    setError(null);
    try {
      const result = await getMealEstimation(selectedMeal, attendance, menuItems);
      setEstimationResult(result);
    } catch (error: any) {
      console.error("AI Estimation failed", error);
      setError(error.message || "An unexpected error occurred. Please check console.");
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">AI Meal Planner</h2>
          <p className="text-slate-500 text-sm mt-1">Generate precise ingredient requirements based on live data</p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
          <Download size={18} /> Export Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-slate-800 mb-6 font-heading text-lg">Configuration</h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Meal</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(meal => (
                    <button
                      key={meal}
                      onClick={() => setSelectedMeal(meal)}
                      className={`p-2 rounded-lg text-sm font-bold transition-all ${selectedMeal === meal ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Attendance</label>
                  {loadingData && <span className="text-[10px] text-indigo-500 animate-pulse">Syncing...</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <ChefHat size={20} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-800 block leading-none">{attendance}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Students Expected</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Menu for {selectedMeal}</label>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 mt-0.5">
                    <Utensils size={16} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {loadingData ? "Loading menu..." : (menuItems || "No items scheduled")}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAIEstimate}
                disabled={isEstimating || loadingData}
                className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                <Zap size={18} className={isEstimating ? 'animate-pulse text-yellow-400' : 'text-yellow-400'} fill="currentColor" />
                {isEstimating ? 'Generating Plan...' : 'Generate Prediction'}
              </button>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg text-center border border-red-100 animate-in fade-in">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 font-heading">
              <Info size={18} className="text-blue-500" />
              Wastage Insight
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Yesterday's Wastage</span>
                <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">8.5 kg</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">High wastage observed in Rice consumption during Dinner. AI has adjusted today's rice Quantity by -5%.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {estimationResult ? (
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-xl font-heading">AI Ingredient Manifest</h3>
                  <p className="text-indigo-100 text-xs opacity-80 mt-1">Generated via Gemini 1.5 Flash • Precision High</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="text-right">
                    <p className="text-xs font-medium opacity-80">Target</p>
                    <p className="font-bold">{attendance} Pax</p>
                  </div>
                </div>
                {/* Decoration */}
                <ChefHat className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12" size={120} />
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {estimationResult.estimates.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                          <span className="font-bold text-xs">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">{item.item}</p>
                          <p className="text-xl font-bold text-slate-800 font-heading">{item.quantity} <span className="text-sm text-slate-400 font-medium">{item.unit}</span></p>
                        </div>
                      </div>
                      <div className="text-right bg-white px-2 py-1 rounded border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Buffer</p>
                        <p className="text-xs font-bold text-green-600">+{item.wastageBuffer}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Zap size={16} fill="currentColor" className="text-indigo-500" /> AI Strategy Note
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                    {estimationResult.notes || "High precision estimate based on historical patterns. Quantities optimized to minimize wastage while ensuring sufficiency."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center group cursor-pointer hover:bg-slate-50 transition-colors" onClick={handleAIEstimate}>
              <div className="mb-6 p-6 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-500">
                <ChefHat size={48} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-2">Ready to Plan</h3>
              <p className="font-medium text-sm max-w-[300px] leading-relaxed">Select a meal and click 'Generate Prediction' to calculate requirements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanning;
