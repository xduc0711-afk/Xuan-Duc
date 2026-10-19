import { useState } from 'react';
import { Search, Flame, Clock, Play, Sparkles, ChevronRight, ShieldCheck, Dumbbell, Zap } from 'lucide-react';
import { Exercise, ExerciseCategory, WorkoutRoutine } from '../types';
import { EXERCISES, WORKOUT_ROUTINES } from '../data/exercises';
import ExerciseFigure from './ExerciseFigure';

interface ExerciseLibraryProps {
  onSelectRoutine: (routine: WorkoutRoutine) => void;
  onSelectExerciseDetail: (exercise: Exercise) => void;
  onStartSingleExercise: (exercise: Exercise) => void;
  onNavigateToStudentZone?: () => void;
}

export default function ExerciseLibrary({
  onSelectRoutine,
  onSelectExerciseDetail,
  onStartSingleExercise,
  onNavigateToStudentZone,
}: ExerciseLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ExerciseCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất Cả Động Tác', icon: '🌟' },
    { id: 'warmup', label: 'Khởi Động & Phát Triển Chung', icon: '🤸' },
    { id: 'posture', label: 'Chống Gù Lưng & Mỏi Vai', icon: '🧘' },
    { id: 'height', label: 'Phát Triển Chiều Cao', icon: '🦒' },
    { id: 'strength', label: 'Thể Lực & Sức Bền', icon: '⚡' },
    { id: 'recess', label: '5 Phút Giải Lao Giữa Giờ', icon: '☕' },
  ];

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero PE Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-6 sm:p-10 shadow-lg shadow-emerald-950/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Chuẩn Sư Phạm Môn Giáo Dục Thể Chất</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
            Rèn Luyện Thể Lực & Dáng Đẹp Học Đường
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Học sinh ngồi học nhiều dễ bị mỏi cổ vai gáy, gù lưng và uể oải. Chỉ với 10-15 phút tập các động tác chuẩn mỗi ngày, bạn sẽ bứt phá chiều cao, giữ cột sống thẳng đẹp và tràn đầy năng lượng học bài!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onSelectRoutine(WORKOUT_ROUTINES[0])}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-emerald-800" />
              Khởi động 5 phút ngay
            </button>
            <button
              onClick={() => onSelectRoutine(WORKOUT_ROUTINES[1])}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-400/40 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Bài tập chống gù lưng
            </button>
            {onNavigateToStudentZone && (
              <button
                onClick={onNavigateToStudentZone}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all"
              >
                <span>🎨 Góc Thẻ Ảnh Chữ & Mẹo Vui</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-4 -bottom-6 sm:right-8 sm:top-1/2 sm:-translate-y-1/2 opacity-20 sm:opacity-40 pointer-events-none">
          <Dumbbell className="w-64 h-64 text-white/40 rotate-12" />
        </div>
      </section>

      {/* Featured Routines Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Bộ Bài Tập Chuyên Đề Cho Học Sinh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Các chuỗi bài tập kết hợp sẵn phù hợp với từng mục tiêu học đường
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKOUT_ROUTINES.map((routine) => (
            <div
              key={routine.id}
              className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200/60">
                    ⏱️ {routine.durationMinutes} phút
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {routine.exercises.length} động tác
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-heading leading-snug">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {routine.description}
                </p>
                <div className="text-xs text-slate-500 font-medium pt-1">
                  🎯 Đối tượng: <span className="text-slate-800">{routine.targetAudience}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4">
                <button
                  onClick={() => onSelectRoutine(routine)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-all group-hover:bg-emerald-600 group-hover:text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Bắt đầu bài tập này
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Individual Exercises Library */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Thư Viện Động Tác Thể Dục Chuẩn Mực
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Xem chi tiết kỹ thuật động tác, nhịp thở và cách sửa lỗi sai
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm động tác, nhóm cơ..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Exercises Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Exercise Header & Visual Preview */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
                    {exercise.level}
                  </span>
                  {exercise.badgeLabel && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      {exercise.badgeLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div
                    onClick={() => onSelectExerciseDetail(exercise)}
                    className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-emerald-50/50 transition-colors p-1"
                  >
                    <ExerciseFigure type={exercise.animationType} isPlaying={false} className="w-16 h-16" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => onSelectExerciseDetail(exercise)}
                      className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 font-heading"
                    >
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {exercise.repsText}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        {exercise.durationSeconds}s
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        ~{exercise.caloriesBurnedApprox} calo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Muscles */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1">
                    {exercise.targetMuscles.slice(0, 3).map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-2xs font-medium"
                      >
                        {m}
                      </span>
                    ))}
                    {exercise.targetMuscles.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-400 text-2xs font-medium">
                        +{exercise.targetMuscles.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => onSelectExerciseDetail(exercise)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Xem kỹ thuật</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onStartSingleExercise(exercise)}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Tập ngay</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Zap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">
              Không tìm thấy động tác phù hợp với từ khóa "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Hãy thử chọn danh mục khác hoặc xóa ô tìm kiếm
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
