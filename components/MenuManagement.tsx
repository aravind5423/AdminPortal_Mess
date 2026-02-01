
import React, { useState, useEffect } from 'react';
import { Edit2, Save, Trash2, Plus, ArrowRight, Utensils, Check } from 'lucide-react';
import { MenuService } from '../services/menuService';
import { MainMenu, DayMenu, Particular } from '../types';

interface MealItem {
  type: string;
  food: string;
  time: string;
}

const MenuManagement: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [menuId, setMenuId] = useState<string | null>(null);
  const [fullMenu, setFullMenu] = useState<DayMenu[]>([]);
  const [currentDayMeals, setCurrentDayMeals] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Default meal structure for a new day
  const defaultDayMeals: MealItem[] = [
    { type: 'Breakfast', food: '', time: '8:30 AM to 10:00 AM' },
    { type: 'Lunch', food: '', time: '12:30 PM to 2:30 PM' },
    { type: 'Snacks', food: '', time: '5:00 PM to 6:00 PM' },
    { type: 'Dinner', food: '', time: '7:30 PM to 9:30 PM' }
  ];

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    // When fullMenu or selectedDayIndex changes, update the displayed meals
    if (fullMenu.length > selectedDayIndex) {
      const dayData = fullMenu[selectedDayIndex];
      // Map 'particulars' (from Firebase) to MealItem state
      // If particulars are empty or missing, fall back to defaults
      if (dayData && dayData.particulars && dayData.particulars.length > 0) {
        setCurrentDayMeals(dayData.particulars as MealItem[]);
      } else {
        setCurrentDayMeals(defaultDayMeals);
      }
    } else {
      // If index is out of bounds (e.g. data not fully initialized), use defaults
      setCurrentDayMeals(defaultDayMeals);
    }
  }, [fullMenu, selectedDayIndex]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await MenuService.getMainMenu();
      if (data) {
        setMenuId(data.id);
        setFullMenu(data.menu || []);
      } else {
        // Handle case where no menu exists at all -> Initialize empty structure
        // In a real app we might create a document here, but for now we just show defaults
        console.warn("No MainMenu document found in Firestore.");
        const emptyWeek = Array(7).fill({ particulars: defaultDayMeals });
        setFullMenu(emptyWeek);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealChange = (index: number, field: keyof MealItem, value: string) => {
    const updatedMeals = [...currentDayMeals];
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    setCurrentDayMeals(updatedMeals);
  };

  const saveChanges = async () => {
    if (!menuId) {
      alert("No Menu ID found. Cannot update.");
      return;
    }

    try {
      setSaving(true);

      // Update the fullMenu state with the current day's changes
      const updatedFullMenu = [...fullMenu];
      // Ensure the array is at least large enough (fill gaps if needed)
      while (updatedFullMenu.length <= selectedDayIndex) {
        updatedFullMenu.push({ particulars: [] });
      }

      updatedFullMenu[selectedDayIndex] = {
        particulars: currentDayMeals
      };

      // Send to Firebase
      await MenuService.updateMainMenu(menuId, { menu: updatedFullMenu });

      // Update local state to reflect the save
      setFullMenu(updatedFullMenu);

      // Optional: User feedback
      // alert("Menu updated successfully!");
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };


  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [specialMealData, setSpecialMealData] = useState({
    food: '',
    date: new Date().toISOString().split('T')[0],
    mealIndex: 0
  });

  const handleAddSpecialMeal = async () => {
    try {
      setSaving(true);
      // Basic mapping for demo purposes. Ideally, convert date string to timestamp components
      const dateObj = new Date(specialMealData.date);
      await import('../services/specialMealService').then(m => m.SpecialMealService.addSpecialMeal({
        food: specialMealData.food,
        day: dateObj.getDate(),
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        mealIndex: specialMealData.mealIndex,
        timestamp: dateObj.getTime()
      }));
      setShowSpecialModal(false);
      setSpecialMealData({ food: '', date: new Date().toISOString().split('T')[0], mealIndex: 0 });
      alert("Special Meal Added!");
    } catch (e) {
      console.error(e);
      alert("Failed to add special meal");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Menu...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Special Meal Modal */}
      {showSpecialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Add Special Meal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={specialMealData.date}
                  onChange={(e) => setSpecialMealData({ ...specialMealData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meal Type</label>
                <select
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={specialMealData.mealIndex}
                  onChange={(e) => setSpecialMealData({ ...specialMealData, mealIndex: parseInt(e.target.value) })}
                >
                  <option value={0}>Breakfast</option>
                  <option value={1}>Lunch</option>
                  <option value={2}>Snacks</option>
                  <option value={3}>Dinner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Food Items</label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg p-2 h-24"
                  placeholder="Checking Biryani, Sweet, Ice Cream..."
                  value={specialMealData.food}
                  onChange={(e) => setSpecialMealData({ ...specialMealData, food: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={() => setShowSpecialModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleAddSpecialMeal} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Meal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Weekly Mess Menu</h2>
          <p className="text-slate-500 text-sm">Update meal particulars and timings for students</p>
        </div>
        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Save size={18} />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDayIndex(idx)}
            className={`
              px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all
              ${selectedDayIndex === idx
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentDayMeals.map((meal, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Edit2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{meal.type}</h4>
                  <input
                    type="text"
                    value={meal.time}
                    onChange={(e) => handleMealChange(idx, 'time', e.target.value)}
                    className="text-xs text-slate-400 font-medium bg-transparent border-none focus:ring-0 p-0 w-full"
                    placeholder="Set time..."
                  />
                </div>
              </div>
              <button className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Food Items</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none h-24"
                value={meal.food}
                onChange={(e) => handleMealChange(idx, 'food', e.target.value)}
                placeholder="Enter food items..."
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-xs text-slate-400 italic">
                {saving ? 'Syncing...' : 'Edits are local until saved'}
              </span>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowSpecialModal(true)}
          className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 group-hover:border-indigo-200 flex items-center justify-center">
            <Plus size={24} />
          </div>
          <span className="font-bold">Add Special Meal Segment</span>
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex gap-4">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl h-fit">
          <Utensils size={24} />
        </div>
        <div>
          <h4 className="font-bold text-orange-900">Food Preparation Tip (AI)</h4>
          <p className="text-sm text-orange-800 leading-relaxed mt-1">
            Based on historical data for {days[selectedDayIndex]}, attendance is usually 15% lower during breakfast due to late arrivals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
