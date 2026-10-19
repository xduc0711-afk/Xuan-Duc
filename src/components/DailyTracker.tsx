import { useState } from 'react';
import { Droplets, Trophy, Award, CheckCircle2, Clock, Plus, Flame, Sparkles, BookOpen } from 'lucide-react';
import { DailyHealthLog } from '../types';
import { playBeep } from '../utils/audio';

interface DailyTrackerProps {
  log: DailyHealthLog;
  onUpdateLog: (updated: Partial<DailyHealthLog>) => void;
  onNavigateToExercises: () => void;
}

export default function DailyTracker({
  log,
  onUpdateLog,
  onNavigateToExercises,
}: DailyTrackerProps) {
  const [journalNote, setJournalNote] = useState(log.notes || '');

  const handleDrinkWater = (glassIndex: number) => {
    const newGlasses = glassIndex === log.waterGlasses - 1 ? glassIndex : glassIndex + 1;
    onUpdateLog({ waterGlasses: newGlasses });
    playBeep(800, 0.1, 'sine');
  };

  const handleAddWorkoutMinutes = (extraMinutes: number) => {
    const newMinutes = log.completedWorkoutMinutes + extraMinutes;
    onUpdateLog({ completedWorkoutMinutes: newMinutes });
    playBeep(950, 0.15, 'triangle');
  };

  const handleSaveJournalNote = () => {
    onUpdateLog({ notes: journalNote });
  };

  const waterPercent = Math.min(100, Math.round((log.waterGlasses / log.targetWaterGlasses) * 100));
  const workoutPercent = Math.min(100, Math.round((log.completedWorkoutMinutes / log.targetWorkoutMinutes) * 100));

  const badges = [
    {
      id: 'badge-water',
      title: 'Chiến Binh Uống Nước',
      desc: 'Uống đủ 8 ly nước lọc mỗi ngày',
      icon: '💧',
      isUnlocked: log.waterGlasses >= 8,
    },
    {
      id: 'badge-workout',
      title: 'Kiện Tướng Thể Dục',
      desc: 'Hoàn thành 30 phút rèn luyện thể chất',
      icon: '🥇',
      isUnlocked: log.completedWorkoutMinutes >= 30,
    },
    {
      id: 'badge-nutrition',
      title: 'Học Sinh Sống Khỏe',
      desc: 'Ghi nhận bữa ăn cân đối đủ 4 nhóm chất',
      icon: '🥗',
      isUnlocked: log.mealsLogged.length > 0,
    },
    {
      id: 'badge-height',
      title: 'Tăng Trưởng Chiều Cao',
      desc: 'Thực hiện các động tác kéo giãn cột sống',
      icon: '🦒',
      isUnlocked: log.completedExerciseIds.some((id) => id.includes('height') || id.includes('reach')),
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
          Sổ Tay Rèn Luyện Học Đường
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Nhật Ký Thể Chất & Uống Nước Hôm Nay
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Theo dõi từng ly nước, số phút vận động và tích lũy huy hiệu học sinh năng động
        </p>
      </div>

      {/* Grid Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Water Tracker */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Droplets className="w-5 h-5 fill-sky-500 text-sky-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Theo Dõi Uống Nước
                </h2>
                <p className="text-xs text-slate-500">
                  Mục tiêu: {log.targetWaterGlasses} ly nước (khoảng 2 lít/ngày)
                </p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-sky-600">
              {log.waterGlasses}/{log.targetWaterGlasses} ly ({waterPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          {/* 8 Interactive Water Glasses */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
            {Array.from({ length: log.targetWaterGlasses }).map((_, idx) => {
              const isFilled = idx < log.waterGlasses;
              return (
                <button
                  key={idx}
                  onClick={() => handleDrinkWater(idx)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all active:scale-95 ${
                    isFilled
                      ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-400'
                  }`}
                  title={`Ly nước thứ ${idx + 1} (250ml)`}
                >
                  <Droplets className={`w-5 h-5 ${isFilled ? 'fill-white text-white' : ''}`} />
                  <span className="text-2xs font-bold mt-1">Ly {idx + 1}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-sky-50 rounded-xl text-xs text-sky-800 leading-relaxed border border-sky-100">
            💧 <strong>Mẹo học đường:</strong> Uống 1 ngụm nước sau mỗi 30 phút học bài giúp tăng khả năng tập trung của não bộ lên 25%!
          </div>
        </div>

        {/* 2. Workout Minutes Tracker */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Thời Gian Vận Động Thể Chất
                </h2>
                <p className="text-xs text-slate-500">
                  Mục tiêu chuẩn: {log.targetWorkoutMinutes} phút mỗi ngày
                </p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-emerald-600">
              {log.completedWorkoutMinutes}/{log.targetWorkoutMinutes} phút ({workoutPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${workoutPercent}%` }}
            />
          </div>

          {/* Quick Add Minutes Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-600">Cộng nhanh:</span>
            <button
              onClick={() => handleAddWorkoutMinutes(5)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 5 phút
            </button>
            <button
              onClick={() => handleAddWorkoutMinutes(15)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 15 phút
            </button>
            <button
              onClick={onNavigateToExercises}
              className="ml-auto px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
            >
              Tập bài tập ngay
            </button>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 leading-relaxed border border-emerald-100">
            🏃 <strong>Khuyến nghị Bộ GD&ĐT:</strong> Học sinh nên dành ít nhất 30 phút mỗi ngày để vận động, bao gồm khởi động và các trò chơi vận động.
          </div>
        </div>
      </div>

      {/* 3. Badges & School Achievements */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Huy Hiệu Rèn Luyện Học Đường
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Đã mở khóa: {badges.filter((b) => b.isUnlocked).length}/{badges.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                badge.isUnlocked
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <span className="text-3xl shrink-0 select-none">{badge.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold leading-tight font-heading truncate">
                    {badge.title}
                  </h3>
                  {badge.isUnlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-2xs text-slate-500 mt-1 leading-normal">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Logged Meals & Personal PE Journal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meals Logged */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <span>🥗</span> Bữa Ăn Đã Ghi Nhận Hôm Nay
          </h2>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {log.mealsLogged.length > 0 ? (
              log.mealsLogged.map((meal) => (
                <div
                  key={meal.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-2xs mr-2">
                      {meal.mealType}
                    </span>
                    <span className="text-slate-800 font-medium">{meal.description}</span>
                  </div>
                  <span className="font-extrabold text-emerald-600 shrink-0">
                    {meal.score}/10đ
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Chưa có bữa ăn nào được ghi. Hãy sang tab "Dinh Dưỡng" để tạo hộp cơm hoặc đánh giá món ăn nhé!
              </p>
            )}
          </div>
        </div>

        {/* Personal PE Journal */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Nhật Ký Cảm Nhận Thể Thao
          </h2>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="Ghi lại cảm nhận hôm nay (ví dụ: Sau khi tập bài khởi động em thấy người khoan khoái, bớt mỏi lưng rõ rệt...)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              onClick={handleSaveJournalNote}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Lưu nhật ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
