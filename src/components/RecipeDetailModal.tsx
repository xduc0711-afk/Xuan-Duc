import { X, Clock, Users, Flame, Dumbbell, Sparkles, CheckCircle2, HeartPulse, ExternalLink } from 'lucide-react';
import { SpoonacularRecipe } from '../types';

interface RecipeDetailModalProps {
  recipe: SpoonacularRecipe | null;
  onClose: () => void;
  onAddToMealBuilder: (recipe: SpoonacularRecipe) => void;
  onLogToTracker: (mealName: string, score: number) => void;
}

export default function RecipeDetailModal({
  recipe,
  onClose,
  onAddToMealBuilder,
  onLogToTracker,
}: RecipeDetailModalProps) {
  if (!recipe) return null;

  const displayTitle = recipe.vietnameseTitle || recipe.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Top Header with Image */}
        <div className="relative h-48 sm:h-64 shrink-0 bg-slate-100 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tag and Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-600 text-white inline-block mb-1.5 shadow-xs">
              {recipe.studentTag || 'Dinh Dưỡng Học Đường'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading line-clamp-2">
              {displayTitle}
            </h2>
            {recipe.vietnameseTitle && (
              <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                {recipe.title}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-100">
              <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-2xs text-amber-700 font-medium">Năng lượng</div>
              <div className="text-sm font-bold text-amber-900">{recipe.calories || 380} kcal</div>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-100">
              <Dumbbell className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <div className="text-2xs text-rose-700 font-medium">Chất đạm</div>
              <div className="text-sm font-bold text-rose-900">{recipe.protein || '18g'}</div>
            </div>
            <div className="bg-sky-50 p-2.5 rounded-2xl border border-sky-100">
              <Clock className="w-4 h-4 text-sky-500 mx-auto mb-1" />
              <div className="text-2xs text-sky-700 font-medium">Thời gian</div>
              <div className="text-sm font-bold text-sky-900">{recipe.readyInMinutes || 20} phút</div>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
              <HeartPulse className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-2xs text-emerald-700 font-medium">Sức khỏe</div>
              <div className="text-sm font-bold text-emerald-900">{recipe.healthScore || 88}/100</div>
            </div>
          </div>

          {/* Student Benefits Highlight */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Lợi ích đối với học sinh:
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              {recipe.benefitsVi ||
                'Món ăn cân đối dinh dưỡng, hỗ trợ chuyển hóa năng lượng, giúp cơ thể phát triển khỏe mạnh và không bị mệt mỏi trong các tiết học thể dục.'}
            </p>
          </div>

          {/* Description / Summary */}
          {recipe.summary && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Giới thiệu món ăn
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                {recipe.summary}
              </p>
            </div>
          )}

          {/* Ingredients list if available */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nguyên liệu chuẩn bị
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-700">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions if available */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Các bước thực hiện
              </h3>
              <div className="space-y-2 text-xs">
                {recipe.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recipe.sourceUrl && (
            <div className="pt-2 text-2xs text-slate-400 flex items-center gap-1">
              <span>Nguồn dữ liệu công thức: Spoonacular API</span>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-0.5"
              >
                <span>Xem chi tiết gốc</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onAddToMealBuilder(recipe);
              onClose();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>🍱 Thêm vào Hộp cơm học đường</span>
          </button>

          <button
            onClick={() => {
              onLogToTracker(displayTitle, Math.min(10, Math.round((recipe.healthScore || 85) / 10)));
              onClose();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu vào Nhật ký hôm nay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
