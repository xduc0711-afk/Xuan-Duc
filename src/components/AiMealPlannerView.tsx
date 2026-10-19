import { useState } from 'react';
import { Sparkles, Bot, Clock, Flame, Dumbbell, Droplets, CheckCircle2, Loader2, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';
import { AIMealPlan } from '../types';

interface AiMealPlannerViewProps {
  onLogMealToTracker: (mealName: string, score: number) => void;
}

const GOALS = [
  {
    id: 'height',
    title: 'Tăng Chiều Cao Đột Phá',
    desc: 'Tập trung Canxi, Vitamin D3 và khoáng chất kích thích sụn xương',
    icon: '🦒',
    color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
    activeColor: 'border-emerald-600 bg-emerald-600 text-white shadow-md',
  },
  {
    id: 'strength',
    title: 'Tăng Thể Lực & Sức Bền',
    desc: 'Phục vụ chạy bền 1500m, bóng đá, bóng rổ, phục hồi cơ bắp',
    icon: '💪',
    color: 'border-blue-300 bg-blue-50/50 text-blue-900',
    activeColor: 'border-blue-600 bg-blue-600 text-white shadow-md',
  },
  {
    id: 'weight_loss',
    title: 'Giữ Dáng Thon Gọn',
    desc: 'Kiểm soát cân nặng, giàu chất xơ, đường huyết thấp không mệt mỏi',
    icon: '🏃',
    color: 'border-amber-300 bg-amber-50/50 text-amber-900',
    activeColor: 'border-amber-600 bg-amber-600 text-white shadow-md',
  },
  {
    id: 'study_energy',
    title: 'Năng Lượng Học Tập & Ôn Thi',
    desc: 'Tăng tuần hoàn não, tỉnh táo, chống buồn ngủ gật gù trong lớp',
    icon: '🧠',
    color: 'border-purple-300 bg-purple-50/50 text-purple-900',
    activeColor: 'border-purple-600 bg-purple-600 text-white shadow-md',
  },
];

const CONTEXTS = [
  { id: 'any', label: 'Linh hoạt mọi nơi', icon: '✨' },
  { id: 'home_cooked', label: 'Cơm gia đình mang đi', icon: '🍱' },
  { id: 'canteen', label: 'Ăn tại căng tin trường', icon: '🏫' },
  { id: 'quick_prep', label: 'Tự làm nhanh < 15 phút', icon: '⚡' },
];

export default function AiMealPlannerView({ onLogMealToTracker }: AiMealPlannerViewProps) {
  const [selectedGoal, setSelectedGoal] = useState('height');
  const [selectedContext, setSelectedContext] = useState('any');
  const [studentGrade, setStudentGrade] = useState('Lớp 8 (13-14 tuổi)');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<AIMealPlan | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/ai/meal-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentAge: 14,
          grade: studentGrade,
          goal: selectedGoal,
          context: selectedContext,
          notes: customNotes,
        }),
      });

      if (!res.ok) throw new Error('Không thể kết nối với AI');
      const data = await res.json();
      setMealPlan(data.plan);
    } catch (err) {
      console.error('Error generating AI meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWholePlan = () => {
    if (!mealPlan) return;
    const summaryText = `Thực đơn ${mealPlan.title} (${mealPlan.breakfast.name}, ${mealPlan.lunch.name}, ${mealPlan.snack.name}, ${mealPlan.dinner.name})`;
    onLogMealToTracker(summaryText, 10);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Generator Form Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Trí Tuệ Nhân Tạo AI
              </span>
              <span className="text-2xs text-slate-500">Gemini 3.8 Flash</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 font-heading mt-0.5">
              Đề Xuất Thực Đơn Học Sinh Cá Nhân Hóa Bằng AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Chọn mục tiêu rèn luyện và hoàn cảnh ăn uống để AI thiết kế kế hoạch dinh dưỡng 1 ngày hoàn hảo
            </p>
          </div>
        </div>

        {/* 1. Goal Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Mục tiêu thể chất học đường ưu tiên của bạn:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GOALS.map((g) => {
              const isSelected = selectedGoal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                    isSelected ? g.activeColor : `${g.color} hover:border-slate-400`
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className="text-sm font-bold font-heading">{g.title}</div>
                    <p className={`text-2xs leading-relaxed ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                      {g.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Context & Grade Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              2. Hoàn cảnh ăn uống:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONTEXTS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedContext(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center gap-1.5 ${
                    selectedContext === c.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Khối lớp & lứa tuổi:
            </label>
            <select
              value={studentGrade}
              onChange={(e) => setStudentGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500"
            >
              <option value="Lớp 6 (11-12 tuổi)">Lớp 6 (11-12 tuổi - Bắt đầu dậy thì)</option>
              <option value="Lớp 7 (12-13 tuổi)">Lớp 7 (12-13 tuổi)</option>
              <option value="Lớp 8 (13-14 tuổi)">Lớp 8 (13-14 tuổi - Giai đoạn vàng bứt phá chiều cao)</option>
              <option value="Lớp 9 (14-15 tuổi)">Lớp 9 (14-15 tuổi - Ôn thi chuyển cấp)</option>
              <option value="Lớp 10 (15-16 tuổi)">Lớp 10 (15-16 tuổi)</option>
              <option value="Lớp 11 (16-17 tuổi)">Lớp 11 (16-17 tuổi)</option>
              <option value="Lớp 12 (17-18 tuổi)">Lớp 12 (17-18 tuổi - Ôn thi đại học & thể lực)</option>
            </select>

            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ghi chú thêm (VD: em dị ứng hải sản, thích ăn đồ luộc...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 mt-2"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Chuyên Gia Dinh Dưỡng AI Đang Thiết Kế Thực Đơn...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Đề Xuất Thực Đơn 1 Ngày Bằng AI</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </section>

      {/* Generated Meal Plan Display */}
      {mealPlan && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6 animate-in fade-in duration-300">
          {/* Plan Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {mealPlan.goal}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Học đường Việt Nam
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-1">
                {mealPlan.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                {mealPlan.summary}
              </p>
            </div>

            <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200/70 text-right shrink-0">
              <div className="text-2xs font-bold text-emerald-700 uppercase tracking-wider">
                Mục tiêu calo / ngày
              </div>
              <div className="text-2xl font-black text-emerald-800">
                {mealPlan.targetCalories} <span className="text-sm font-semibold">kcal</span>
              </div>
            </div>
          </div>

          {/* 4 Daily Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Breakfast */}
            <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍳</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Bữa Sáng (Năng Lượng)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  ~{mealPlan.breakfast.caloriesApprox} kcal
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {mealPlan.breakfast.name}
              </h4>
              <div className="text-2xs text-slate-600 space-y-1">
                <p>
                  <strong>Khẩu phần:</strong> {mealPlan.breakfast.portion}
                </p>
                <p>
                  <strong>Chất đạm:</strong> {mealPlan.breakfast.proteinApprox || '20g'} • <strong>Vi chất:</strong> {mealPlan.breakfast.keyNutrients}
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/50 text-2xs text-amber-900 leading-relaxed">
                💡 <strong>Lợi ích:</strong> {mealPlan.breakfast.whyGoodForStudents}
              </div>
              {mealPlan.breakfast.preparationTip && (
                <p className="text-2xs text-slate-500 italic">
                  ⚡ Mẹo nhanh: {mealPlan.breakfast.preparationTip}
                </p>
              )}
            </div>

            {/* Lunch */}
            <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍱</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Bữa Trưa (Cân Đối 4 Nhóm)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ~{mealPlan.lunch.caloriesApprox} kcal
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {mealPlan.lunch.name}
              </h4>
              <div className="text-2xs text-slate-600 space-y-1">
                <p>
                  <strong>Khẩu phần:</strong> {mealPlan.lunch.portion}
                </p>
                <p>
                  <strong>Chất đạm:</strong> {mealPlan.lunch.proteinApprox || '35g'} • <strong>Vi chất:</strong> {mealPlan.lunch.keyNutrients}
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/50 text-2xs text-emerald-900 leading-relaxed">
                💡 <strong>Lợi ích:</strong> {mealPlan.lunch.whyGoodForStudents}
              </div>
              {mealPlan.lunch.preparationTip && (
                <p className="text-2xs text-slate-500 italic">
                  ⚡ Mẹo: {mealPlan.lunch.preparationTip}
                </p>
              )}
            </div>

            {/* Snack */}
            <div className="bg-sky-50/40 p-5 rounded-2xl border border-sky-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍌</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                    Bữa Xế (Trước/Sau Giờ Thể Dục)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  ~{mealPlan.snack.caloriesApprox} kcal
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {mealPlan.snack.name}
              </h4>
              <div className="text-2xs text-slate-600 space-y-1">
                <p>
                  <strong>Khẩu phần:</strong> {mealPlan.snack.portion}
                </p>
                <p>
                  <strong>Dinh dưỡng:</strong> {mealPlan.snack.keyNutrients}
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-sky-200/50 text-2xs text-sky-900 leading-relaxed">
                💡 <strong>Hỗ trợ vận động:</strong> {mealPlan.snack.whyGoodForStudents}
              </div>
              {mealPlan.snack.preparationTip && (
                <p className="text-2xs text-slate-500 italic">
                  ⚡ Mẹo mang theo: {mealPlan.snack.preparationTip}
                </p>
              )}
            </div>

            {/* Dinner */}
            <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌙</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                    Bữa Tối (Nhẹ Nhàng & Phục Hồi)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  ~{mealPlan.dinner.caloriesApprox} kcal
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {mealPlan.dinner.name}
              </h4>
              <div className="text-2xs text-slate-600 space-y-1">
                <p>
                  <strong>Khẩu phần:</strong> {mealPlan.dinner.portion}
                </p>
                <p>
                  <strong>Chất đạm:</strong> {mealPlan.dinner.proteinApprox || '28g'} • <strong>Vi chất:</strong> {mealPlan.dinner.keyNutrients}
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-200/50 text-2xs text-indigo-900 leading-relaxed">
                💡 <strong>Lợi ích:</strong> {mealPlan.dinner.whyGoodForStudents}
              </div>
              {mealPlan.dinner.preparationTip && (
                <p className="text-2xs text-slate-500 italic">
                  ⚡ Lưu ý: {mealPlan.dinner.preparationTip}
                </p>
              )}
            </div>
          </div>

          {/* Hydration & Physical Exercise Integration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <strong className="text-sky-900 font-bold block">Lời Khuyên Bổ Sung Nước:</strong>
                <p className="text-sky-800 leading-relaxed">{mealPlan.hydrationAdvice}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <strong className="text-emerald-900 font-bold block">Bài Tập Thể Dục Kết Hợp Tốt Nhất:</strong>
                <p className="text-emerald-800 leading-relaxed">{mealPlan.physicalExerciseTip}</p>
              </div>
            </div>
          </div>

          {/* Action to Save to Tracker */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Bạn có thể lưu thực đơn này vào Nhật ký sức khỏe hàng ngày để tích lũy điểm chuyên cần.
            </span>
            <button
              onClick={handleSaveWholePlan}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedSuccess ? 'Đã lưu vào Nhật ký thành công!' : 'Lưu thực đơn này vào Nhật ký'}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
