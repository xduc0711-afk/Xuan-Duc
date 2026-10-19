import { X, CheckCircle2, AlertTriangle, Play, Sparkles, Wind } from 'lucide-react';
import { Exercise } from '../types';
import ExerciseFigure from './ExerciseFigure';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartSingleExercise: (exercise: Exercise) => void;
}

export default function ExerciseDetailModal({
  exercise,
  onClose,
  onStartSingleExercise,
}: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
              {exercise.level}
            </span>
            {exercise.badgeLabel && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {exercise.badgeLabel}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Title and Visual Demonstration */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-emerald-50/70 via-sky-50/50 to-slate-50 p-5 rounded-2xl border border-emerald-100/80">
            <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100">
              <ExerciseFigure type={exercise.animationType} isPlaying={true} className="w-40 h-44" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                {exercise.name}
              </h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs font-medium text-slate-600">
                <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  ⏱️ Thời gian: <strong className="text-slate-900">{exercise.durationSeconds}s</strong>
                </span>
                <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  🔁 Định mức: <strong className="text-slate-900">{exercise.repsText}</strong>
                </span>
                <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  🔥 Tiêu hao: <strong className="text-slate-900">~{exercise.caloriesBurnedApprox} calo</strong>
                </span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-500 font-medium">Nhóm cơ tác động:</span>
                <div className="flex flex-wrap gap-1.5 mt-1 justify-center sm:justify-start">
                  {exercise.targetMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-emerald-100/70 text-emerald-800 rounded-md text-xs font-semibold"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Các bước thực hiện chuẩn mực:
            </h4>
            <div className="space-y-2.5">
              {exercise.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-800 leading-relaxed">{step.instruction}</p>
                    {step.breathingTip && (
                      <p className="text-xs text-sky-700 flex items-center gap-1 font-medium">
                        <Wind className="w-3.5 h-3.5" />
                        Nhịp thở: {step.breathingTip}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Lợi ích sức khỏe học đường:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
              {exercise.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-emerald-600 font-bold text-base leading-none">•</span>
                  <span className="text-xs sm:text-sm leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Lỗi sai học sinh hay mắc (cần tránh):
            </h4>
            <div className="space-y-2">
              {exercise.mistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-rose-50/70 p-2.5 rounded-lg border border-rose-200/60 text-xs sm:text-sm text-rose-900"
                >
                  <span className="text-rose-500 font-bold">⚠️</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onStartSingleExercise(exercise);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Tập động tác này ngay
          </button>
        </div>
      </div>
    </div>
  );
}
