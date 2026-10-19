import { useState, useEffect } from 'react';
import { Search, Utensils, Clock, Dumbbell, Flame, Sparkles, Loader2, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { SpoonacularRecipe, FoodItem } from '../types';

interface SpoonacularRecipesViewProps {
  onAddToMealBuilder: (recipe: SpoonacularRecipe) => void;
  onLogMealToTracker: (mealName: string, score: number) => void;
  onSelectRecipeForDetail: (recipe: SpoonacularRecipe) => void;
}

const GOAL_FILTERS = [
  { id: 'all', label: 'Tất cả món lành mạnh', icon: '🍽️' },
  { id: 'height', label: 'Tăng Chiều Cao', icon: '🦒' },
  { id: 'strength', label: 'Tăng Cơ & Thể Lực', icon: '💪' },
  { id: 'weight_loss', label: 'Ít Calo Giữ Dáng', icon: '🏃' },
  { id: 'breakfast', label: 'Bữa Sáng Năng Lượng', icon: '🍳' },
  { id: 'snack', label: 'Bữa Xế Trước Tập', icon: '🍌' },
];

export default function SpoonacularRecipesView({
  onAddToMealBuilder,
  onLogMealToTracker,
  onSelectRecipeForDetail,
}: SpoonacularRecipesViewProps) {
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGoal, setActiveGoal] = useState('all');
  const [dataSource, setDataSource] = useState<string>('spoonacular');

  const fetchRecipes = async (queryStr = searchQuery, goalStr = activeGoal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (queryStr.trim()) params.append('query', queryStr.trim());
      if (goalStr !== 'all') params.append('goal', goalStr);
      params.append('number', '12');

      const res = await fetch(`/api/spoonacular/recipes?${params.toString()}`);
      if (!res.ok) throw new Error('Không thể tải món ăn');
      const data = await res.json();
      setRecipes(data.recipes || []);
      setDataSource(data.source || 'spoonacular');
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(searchQuery, activeGoal);
  }, [activeGoal]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(searchQuery, activeGoal);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" />
                Spoonacular Food API
              </span>
              <span className="text-2xs text-slate-500">
                {dataSource === 'spoonacular' ? '⚡ Dữ liệu trực tiếp từ Spoonacular' : '🛡️ Dữ liệu chuẩn học đường'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mt-1">
              Đề Xuất Món Ăn Bổ Dưỡng Cho Học Sinh
            </h3>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={() => fetchRecipes(searchQuery, activeGoal)}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới món ăn</span>
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món ăn (ví dụ: cá hồi, ức gà, yến mạch, salad, chuối, trứng, súp...)"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-24 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm kiếm'}
          </button>
        </form>

        {/* Goal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {GOAL_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveGoal(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeGoal === f.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 animate-pulse"
            >
              <div className="h-44 bg-slate-200 rounded-2xl w-full" />
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3 bg-slate-200 rounded-md w-1/2" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-8 bg-slate-100 rounded-lg" />
                <div className="h-8 bg-slate-100 rounded-lg" />
                <div className="h-8 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Cards Grid */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => {
            const displayTitle = recipe.vietnameseTitle || recipe.title;
            return (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div
                    className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => onSelectRecipeForDetail(recipe)}
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-emerald-600/90 backdrop-blur-xs text-white shadow-xs">
                        {recipe.studentTag || 'Học Đường Khỏe Mạnh'}
                      </span>
                    </div>

                    {/* Prep time badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white text-2xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" />
                      <span>{recipe.readyInMinutes || 20}p</span>
                    </div>

                    {/* Quick Calories Badge */}
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <div className="flex items-center gap-1 text-xs font-extrabold drop-shadow-md">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{recipe.calories || 380} kcal</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4
                        onClick={() => onSelectRecipeForDetail(recipe)}
                        className="text-sm sm:text-base font-bold text-slate-900 font-heading line-clamp-1 hover:text-emerald-700 cursor-pointer transition-colors"
                        title={displayTitle}
                      >
                        {displayTitle}
                      </h4>
                      {recipe.vietnameseTitle && (
                        <p className="text-2xs text-slate-400 line-clamp-1 mt-0.5">
                          {recipe.title}
                        </p>
                      )}
                    </div>

                    {/* Nutrients Row */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center text-2xs">
                      <div>
                        <div className="text-slate-400">Đạm</div>
                        <div className="font-bold text-rose-700">{recipe.protein || '18g'}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Tinh bột</div>
                        <div className="font-bold text-amber-700">{recipe.carbs || '40g'}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Sức khỏe</div>
                        <div className="font-bold text-emerald-700">{recipe.healthScore || 85}/100</div>
                      </div>
                    </div>

                    {/* Benefits preview */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {recipe.benefitsVi || recipe.summary || 'Món ăn giàu dinh dưỡng phù hợp cho rèn luyện thể chất học sinh.'}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onSelectRecipeForDetail(recipe)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-colors text-center"
                  >
                    Xem công thức
                  </button>
                  <button
                    onClick={() => onAddToMealBuilder(recipe)}
                    title="Thêm vào hộp cơm học đường"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
            🥣
          </div>
          <h4 className="text-base font-bold text-slate-800">
            Không tìm thấy món ăn phù hợp với từ khóa "{searchQuery}"
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hãy thử tìm các từ khóa phổ biến như: cá hồi, ức gà, chuối, trứng, yến mạch, súp, hoặc chọn danh mục phía trên.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveGoal('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            Xem lại tất cả món
          </button>
        </div>
      )}
    </div>
  );
}
