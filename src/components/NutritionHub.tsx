import { useState } from 'react';
import { Apple, Plus, Trash2, CheckCircle2, Sparkles, Send, Loader2, Utensils, Droplets, Info, ChefHat, BookOpen } from 'lucide-react';
import { FoodItem, AIMealAssessment, SpoonacularRecipe } from '../types';
import { NUTRITION_GROUPS, SCHOOL_FOODS, STUDENT_NUTRITION_RULES } from '../data/nutrition';
import SpoonacularRecipesView from './SpoonacularRecipesView';
import AiMealPlannerView from './AiMealPlannerView';
import RecipeDetailModal from './RecipeDetailModal';

interface NutritionHubProps {
  onLogMealToTracker: (mealName: string, score: number) => void;
}

export default function NutritionHub({ onLogMealToTracker }: NutritionHubProps) {
  // Navigation subtab: 'suggestions' (AI & Spoonacular), 'builder' (Hộp cơm), 'pyramid' (Tháp & Thẩm định)
  const [nutritionSubTab, setNutritionSubTab] = useState<'suggestions' | 'builder' | 'pyramid'>('suggestions');
  const [suggestionMode, setSuggestionMode] = useState<'ai_plan' | 'spoonacular'>('ai_plan');

  // Selected recipe for detail modal
  const [activeModalRecipe, setActiveModalRecipe] = useState<SpoonacularRecipe | null>(null);

  // Quick toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Meal Builder State
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([
    SCHOOL_FOODS[0], // Cơm trắng
    SCHOOL_FOODS[4], // Trứng gà luộc
    SCHOOL_FOODS[8], // Rau muống luộc
    SCHOOL_FOODS[12], // Sữa tươi
  ]);

  // AI Meal Evaluation State
  const [aiInputMeal, setAiInputMeal] = useState('');
  const [aiMealType, setAiMealType] = useState('Bữa trưa');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<AIMealAssessment | null>(null);

  // Active pyramid level
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(0);

  // Meal builder metrics
  const totalCalories = selectedFoods.reduce((acc, f) => acc + f.calories, 0);
  const totalProtein = selectedFoods.reduce((acc, f) => acc + f.proteinGrams, 0);
  const totalCarb = selectedFoods.reduce((acc, f) => acc + f.carbGrams, 0);
  const totalFat = selectedFoods.reduce((acc, f) => acc + f.fatGrams, 0);
  const totalFiber = selectedFoods.reduce((acc, f) => acc + f.fiberGrams, 0);

  const hasCarb = selectedFoods.some((f) => f.category === 'carb');
  const hasProtein = selectedFoods.some((f) => f.category === 'protein');
  const hasVeg = selectedFoods.some((f) => f.category === 'vitamin_mineral');
  const hasTreat = selectedFoods.some((f) => f.category === 'treat');

  // Calculate student balance score
  let balanceScore = 5;
  if (hasCarb) balanceScore += 1.5;
  if (hasProtein) balanceScore += 1.5;
  if (hasVeg) balanceScore += 2;
  if (hasTreat) balanceScore = Math.max(3, balanceScore - 2);
  balanceScore = Math.min(10, Math.round(balanceScore));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddFood = (food: FoodItem) => {
    setSelectedFoods((prev) => [...prev, food]);
    showToast(`Đã thêm "${food.vietnameseName}" vào hộp cơm!`);
  };

  const handleAddSpoonacularToMealBuilder = (recipe: SpoonacularRecipe) => {
    const rawProt = typeof recipe.protein === 'number' ? recipe.protein : parseFloat(String(recipe.protein || '18'));
    const rawCarb = typeof recipe.carbs === 'number' ? recipe.carbs : parseFloat(String(recipe.carbs || '40'));
    const rawFat = typeof recipe.fat === 'number' ? recipe.fat : parseFloat(String(recipe.fat || '10'));
    const rawFib = typeof recipe.fiber === 'number' ? recipe.fiber : parseFloat(String(recipe.fiber || '5'));

    let cat: FoodItem['category'] = 'carb';
    let catVi = 'Chất bột đường';
    if (rawProt >= 20) {
      cat = 'protein';
      catVi = 'Chất đạm';
    } else if (recipe.dishTypes?.includes('salad') || recipe.dishTypes?.includes('soup')) {
      cat = 'vitamin_mineral';
      catVi = 'Rau củ & vi chất';
    }

    const convertedFood: FoodItem = {
      id: `spoonacular-${recipe.id}-${Date.now()}`,
      name: recipe.title,
      vietnameseName: recipe.vietnameseTitle || recipe.title,
      category: cat,
      categoryNameVi: catVi,
      portion: '1 khẩu phần',
      calories: recipe.calories || 380,
      proteinGrams: isNaN(rawProt) ? 18 : rawProt,
      carbGrams: isNaN(rawCarb) ? 40 : rawCarb,
      fatGrams: isNaN(rawFat) ? 10 : rawFat,
      fiberGrams: isNaN(rawFib) ? 5 : rawFib,
      rating: 'Tốt',
      tipsForStudents: recipe.benefitsVi || 'Món ăn dinh dưỡng cao từ Spoonacular API.',
      iconName: 'Utensils',
    };

    setSelectedFoods((prev) => [...prev, convertedFood]);
    showToast(`Đã thêm món "${convertedFood.vietnameseName}" vào hộp cơm!`);
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleEvaluateWithAi = async () => {
    if (!aiInputMeal.trim()) return;
    setAiLoading(true);
    setAiAssessment(null);

    try {
      const res = await fetch('/api/ai/meal-evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealDescription: aiInputMeal,
          mealType: aiMealType,
          studentAge: 'Học sinh 12-18 tuổi',
        }),
      });
      const data = await res.json();
      setAiAssessment(data);
    } catch (err) {
      console.error(err);
      setAiAssessment({
        score: 7,
        assessment: 'Bữa ăn cung cấp đủ năng lượng cho học tập.',
        pros: ['Cung cấp tinh bột và năng lượng học tập'],
        cons: ['Cần chú ý ăn đủ 4 nhóm chất'],
        advice: 'Bổ sung thêm rau xanh luộc hoặc quả chín sau bữa ăn em nhé!',
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-teal-700 via-emerald-700 to-green-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-white/20 text-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
            Khoa Học Dinh Dưỡng Thể Dục Học Đường
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading">
            Dinh Dưỡng Thông Minh Để Cao Lớn & Bền Bỉ
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Kết hợp thực đơn cá nhân hóa từ AI, cơ sở dữ liệu món ăn dinh dưỡng Spoonacular và tháp dinh dưỡng học đường chuẩn mực để xây dựng thể lực vượt trội.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 opacity-15 sm:opacity-25 pointer-events-none">
          <Apple className="w-56 h-56 text-white" />
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setNutritionSubTab('suggestions')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            nutritionSubTab === 'suggestions'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Đề Xuất Món Ăn (AI & Spoonacular)</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-2xs font-extrabold">
            Mới
          </span>
        </button>

        <button
          onClick={() => setNutritionSubTab('builder')}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            nutritionSubTab === 'builder'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-600" />
          <span>Hộp Cơm Học Đường</span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-2xs font-extrabold">
            {selectedFoods.length} món
          </span>
        </button>

        <button
          onClick={() => setNutritionSubTab('pyramid')}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            nutritionSubTab === 'pyramid'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>Tháp Dinh Dưỡng & Đánh Giá</span>
        </button>
      </div>

      {/* VIEW 1: AI & SPOONACULAR RECOMMENDATIONS */}
      {nutritionSubTab === 'suggestions' && (
        <div className="space-y-6">
          {/* Submode switcher: AI Planner vs Spoonacular Dishes */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1 bg-slate-200/80 rounded-2xl">
            <button
              onClick={() => setSuggestionMode('ai_plan')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                suggestionMode === 'ai_plan'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thực Đơn 1 Ngày Bằng AI</span>
            </button>
            <button
              onClick={() => setSuggestionMode('spoonacular')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                suggestionMode === 'spoonacular'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Tra Cứu Món Ăn Spoonacular</span>
            </button>
          </div>

          {suggestionMode === 'ai_plan' ? (
            <AiMealPlannerView onLogMealToTracker={onLogMealToTracker} />
          ) : (
            <SpoonacularRecipesView
              onAddToMealBuilder={handleAddSpoonacularToMealBuilder}
              onLogMealToTracker={onLogMealToTracker}
              onSelectRecipeForDetail={(recipe) => setActiveModalRecipe(recipe)}
            />
          )}
        </div>
      )}

      {/* VIEW 3: PYRAMID & AI EVALUATION */}
      {nutritionSubTab === 'pyramid' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">🏛️</span>
              Tháp Dinh Dưỡng Chuẩn Học Sinh Việt Nam
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Nhấp vào từng tầng tháp để xem vai trò và khuyến nghị dinh dưỡng
            </p>
          </div>
        </div>

        {/* Pyramid Graphic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col items-center space-y-2 select-none">
            {/* Pyramid Level 5: Top (Smallest) */}
            <div
              onClick={() => setActiveGroupIndex(2)}
              className="w-44 sm:w-56 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-center cursor-pointer shadow-sm transition-all hover:scale-102 flex flex-col items-center justify-center"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Hạn Chế: Đường, Muối & Dầu Mỡ</span>
              <span className="text-2xs opacity-90">Ăn có chừng mực</span>
            </div>

            {/* Pyramid Level 4: Protein */}
            <div
              onClick={() => setActiveGroupIndex(1)}
              className="w-60 sm:w-80 py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-center cursor-pointer shadow-sm transition-all hover:scale-102 flex flex-col items-center justify-center"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Nhóm Chất Đạm (Thịt, Cá, Trứng, Đậu)</span>
              <span className="text-2xs opacity-90">Xây dựng cơ bắp & tế bào</span>
            </div>

            {/* Pyramid Level 3: Veggies & Fruits */}
            <div
              onClick={() => setActiveGroupIndex(3)}
              className="w-76 sm:w-104 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center cursor-pointer shadow-sm transition-all hover:scale-102 flex flex-col items-center justify-center"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Nhóm Rau Củ Quả & Trái Cây Tươi</span>
              <span className="text-2xs opacity-90">Vitamin, khoáng chất & chất xơ</span>
            </div>

            {/* Pyramid Level 2: Carbs */}
            <div
              onClick={() => setActiveGroupIndex(0)}
              className="w-88 sm:w-124 py-4 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-center cursor-pointer shadow-sm transition-all hover:scale-102 flex flex-col items-center justify-center"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Nhóm Chất Bột Đường (Gạo, Khoai, Ngô, Bánh Mì)</span>
              <span className="text-2xs opacity-90">Nguồn năng lượng chính cho học tập</span>
            </div>

            {/* Pyramid Level 1: Base (Water & Exercise) */}
            <div
              onClick={() => setActiveGroupIndex(4)}
              className="w-full sm:w-140 py-4 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-center cursor-pointer shadow-sm transition-all hover:scale-102 flex flex-col items-center justify-center"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Nền Tảng: Nước Uống (1.5-2L) & Vận Động Thể Thao 30 Phút</span>
              <span className="text-2xs opacity-90">Quyết định sức bền và sự trao đổi chất</span>
            </div>
          </div>

          {/* Right: Active Level Info */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            {activeGroupIndex !== null && NUTRITION_GROUPS[activeGroupIndex] ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {NUTRITION_GROUPS[activeGroupIndex].name}
                  </h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p>
                    <strong className="text-slate-900">🎯 Vai trò:</strong>{' '}
                    {NUTRITION_GROUPS[activeGroupIndex].role}
                  </p>
                  <p>
                    <strong className="text-slate-900">🥗 Nguồn thực phẩm tốt:</strong>{' '}
                    {NUTRITION_GROUPS[activeGroupIndex].sources}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-emerald-800 text-xs font-medium leading-relaxed">
                    💡 <strong>Lời khuyên học sinh:</strong> {NUTRITION_GROUPS[activeGroupIndex].dailyAdvice}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">
                Nhấp vào các tầng của tháp bên trái để khám phá thông tin dinh dưỡng chi tiết.
              </p>
            )}
          </div>
        </div>
      </section>
      )}

      {/* VIEW 2: SMART MEAL BUILDER */}
      {nutritionSubTab === 'builder' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">🍱</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Hộp Cơm Học Đường Cân Đối
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chọn các món ăn vào hộp cơm của bạn để kiểm tra điểm cân đối dinh dưỡng và lượng calo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Food Selector by Category */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chọn món thêm vào hộp cơm:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {SCHOOL_FOODS.map((food) => {
                const isSelected = selectedFoods.some((f) => f.id === food.id);
                return (
                  <div
                    key={food.id}
                    onClick={() => handleAddFood(food)}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all text-left group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 line-clamp-1">
                        {food.vietnameseName}
                      </p>
                      <div className="flex items-center gap-2 text-2xs text-slate-500 mt-0.5">
                        <span>{food.portion}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{food.calories} calo</span>
                      </div>
                    </div>
                    <button
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-600 text-xs transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Meal Plate Summary & Balance Rating */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-5 border border-slate-200 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  Món Trong Bữa Ăn ({selectedFoods.length})
                </h3>
                {selectedFoods.length > 0 && (
                  <button
                    onClick={() => setSelectedFoods([])}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Items Selected list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs"
                  >
                    <span className="font-medium text-slate-800 truncate pr-2">
                      {food.vietnameseName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500 font-semibold">{food.calories} calo</span>
                      <button
                        onClick={() => handleRemoveFood(idx)}
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedFoods.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-6">
                    Chưa có món nào. Nhấp vào các món ăn bên trái để thêm vào hộp cơm!
                  </p>
                )}
              </div>

              {/* Nutrition Nutrients Bar */}
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Tổng năng lượng:</span>
                  <span className="text-emerald-700 text-base">{totalCalories} kcal</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center text-2xs font-semibold">
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-800">
                    <div>Tinh bột</div>
                    <div className="font-bold text-xs">{totalCarb.toFixed(1)}g</div>
                  </div>
                  <div className="p-1.5 bg-rose-50 rounded-lg text-rose-800">
                    <div>Chất đạm</div>
                    <div className="font-bold text-xs">{totalProtein.toFixed(1)}g</div>
                  </div>
                  <div className="p-1.5 bg-yellow-50 rounded-lg text-yellow-800">
                    <div>Chất béo</div>
                    <div className="font-bold text-xs">{totalFat.toFixed(1)}g</div>
                  </div>
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                    <div>Chất xơ</div>
                    <div className="font-bold text-xs">{totalFiber.toFixed(1)}g</div>
                  </div>
                </div>
              </div>

              {/* Balance Score */}
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">Điểm Cân Đối Dinh Dưỡng:</span>
                  <span
                    className={`text-sm font-extrabold ${
                      balanceScore >= 8
                        ? 'text-emerald-600'
                        : balanceScore >= 6
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {balanceScore}/10 Điểm
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      balanceScore >= 8
                        ? 'bg-emerald-500'
                        : balanceScore >= 6
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${balanceScore * 10}%` }}
                  />
                </div>

                <p className="text-2xs text-slate-600 mt-1">
                  {!hasVeg && '⚠️ Bữa ăn đang thiếu rau xanh hoặc canh.'}
                  {!hasProtein && '⚠️ Cần thêm thức ăn giàu đạm (thịt, cá, trứng hoặc đậu).'}
                  {hasTreat && '⚠️ Có đồ ngọt/đồ chiên nhiều dầu mỡ, chỉ nên ăn thỉnh thoảng.'}
                  {hasCarb && hasProtein && hasVeg && !hasTreat && '🌟 Tuyệt vời! Hộp cơm cân đối hoàn hảo cho học sinh.'}
                </p>
              </div>
            </div>

            {selectedFoods.length > 0 && (
              <button
                onClick={() => {
                  onLogMealToTracker(
                    selectedFoods.map((f) => f.vietnameseName).join(', '),
                    balanceScore
                  );
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Lưu bữa ăn này vào nhật ký
              </button>
            )}
          </div>
        </div>
      </section>
      )}

      {/* 3. AI Meal Evaluator (Trợ Lý AI Thẩm Định Bữa Ăn) */}
      {nutritionSubTab === 'pyramid' && (
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              Thầy/Cô Dinh Dưỡng AI Đánh Giá Bữa Ăn Của Bạn
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Nhập món ăn bạn vừa ăn ở trường hoặc ở nhà để nhận lời khuyên dinh dưỡng chính xác
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={aiMealType}
              onChange={(e) => setAiMealType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="Bữa sáng">Bữa sáng</option>
              <option value="Bữa trưa">Bữa trưa</option>
              <option value="Bữa xế chiều">Bữa xế chiều</option>
              <option value="Bữa tối">Bữa tối</option>
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                value={aiInputMeal}
                onChange={(e) => setAiInputMeal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEvaluateWithAi()}
                placeholder="Ví dụ: Em ăn 1 đĩa cơm sườn trứng, uống canh rau ngót và 1 ly trà sữa..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                onClick={handleEvaluateWithAi}
                disabled={aiLoading || !aiInputMeal.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center disabled:opacity-40 transition-colors"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {aiAssessment && (
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Kết quả phân tích từ AI:
                </span>
                <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  {aiAssessment.score}/10 Điểm
                </span>
              </div>

              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {aiAssessment.assessment}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {aiAssessment.pros && aiAssessment.pros.length > 0 && (
                  <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/50 space-y-1">
                    <span className="text-emerald-400 font-bold">✅ Ưu điểm dinh dưỡng:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      {aiAssessment.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiAssessment.cons && aiAssessment.cons.length > 0 && (
                  <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/50 space-y-1">
                    <span className="text-amber-400 font-bold">⚠️ Điểm nên điều chỉnh:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      {aiAssessment.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {aiAssessment.advice && (
                <div className="p-3 bg-sky-950/40 rounded-xl border border-sky-800/40 text-xs text-sky-200">
                  💡 <strong>Lời khuyên dành cho bạn:</strong> {aiAssessment.advice}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      )}

      {/* 4. Golden Rules for Student Health */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Cẩm Nang Dinh Dưỡng Vàng Lứa Tuổi Học Sinh
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Những lưu ý quan trọng giúp học sinh khỏe mạnh, không bị uể oải trong giờ học
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENT_NUTRITION_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-2 hover:border-emerald-300 transition-colors"
            >
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                {rule.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                {rule.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={activeModalRecipe}
        onClose={() => setActiveModalRecipe(null)}
        onAddToMealBuilder={handleAddSpoonacularToMealBuilder}
        onLogToTracker={onLogMealToTracker}
      />
    </div>
  );
}
