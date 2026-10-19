import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, CheckCircle, Flame, Clock, Award, RotateCcw } from 'lucide-react';
import { Exercise, WorkoutRoutine } from '../types';
import ExerciseFigure from './ExerciseFigure';
import { playCountdownTick, playNextExerciseBeep, playVictoryFanfare } from '../utils/audio';

interface WorkoutStudioProps {
  routine?: WorkoutRoutine | null;
  singleExercise?: Exercise | null;
  onClose: () => void;
  onFinishWorkout: (minutes: number, calories: number, exerciseIds: string[]) => void;
}

export default function WorkoutStudio({
  routine,
  singleExercise,
  onClose,
  onFinishWorkout,
}: WorkoutStudioProps) {
  const exercises: Exercise[] = routine
    ? routine.exercises
    : singleExercise
    ? [singleExercise]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(
    exercises[0]?.durationSeconds || 30
  );
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);

  const currentExercise = exercises[currentIndex];
  const initialDuration = currentExercise?.durationSeconds || 30;

  // Track progress circle
  const progressRatio = secondsRemaining / initialDuration;
  const strokeDashoffset = 283 * (1 - progressRatio);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-start on load
  useEffect(() => {
    setIsActive(true);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update timer duration when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setSecondsRemaining(currentExercise.durationSeconds);
    }
  }, [currentIndex, currentExercise]);

  useEffect(() => {
    if (isActive && !isCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Exercise completed
            if (currentIndex < exercises.length - 1) {
              if (soundEnabled) playNextExerciseBeep();
              setCurrentIndex((idx) => idx + 1);
              return exercises[currentIndex + 1].durationSeconds;
            } else {
              // Entire routine finished
              if (soundEnabled) playVictoryFanfare();
              setIsCompleted(true);
              setIsActive(false);
              return 0;
            }
          }

          // Sound tick on last 3 seconds
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playCountdownTick();
          }

          return prev - 1;
        });

        setTotalSecondsSpent((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, currentIndex, exercises, isCompleted, soundEnabled]);

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      if (soundEnabled) playNextExerciseBeep();
      setCurrentIndex((i) => i + 1);
    } else {
      if (soundEnabled) playVictoryFanfare();
      setIsCompleted(true);
      setIsActive(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSecondsRemaining(exercises[0]?.durationSeconds || 30);
    setIsCompleted(false);
    setIsActive(true);
    setTotalSecondsSpent(0);
  };

  // Calories estimation
  const totalCalories = exercises.reduce((sum, ex) => sum + ex.caloriesBurnedApprox, 0);

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-emerald-100 relative overflow-hidden">
          {/* Decorative celebration background */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />
          
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 shadow-inner">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wider border border-emerald-200">
            Hoàn Thành Xuất Sắc
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-3 mb-2">
            Chúc mừng bạn đã hoàn thành bài tập! 🎉
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Thói quen rèn luyện thể chất hằng ngày là chiếc chìa khóa vàng giúp bạn phát triển vóc dáng, tăng chiều cao và học tập tập trung hơn.
          </p>

          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-2xs">
              <Clock className="w-8 h-8 text-sky-500" />
              <div className="text-left">
                <span className="text-xs text-slate-500 font-medium">Thời gian tập</span>
                <p className="text-lg font-bold text-slate-900">
                  {Math.ceil(totalSecondsSpent / 60)} phút
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-2xs">
              <Flame className="w-8 h-8 text-amber-500" />
              <div className="text-left">
                <span className="text-xs text-slate-500 font-medium">Năng lượng tiêu hao</span>
                <p className="text-lg font-bold text-slate-900">
                  ~{totalCalories} calo
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Tập lại
            </button>
            <button
              onClick={() => {
                onFinishWorkout(
                  Math.max(1, Math.ceil(totalSecondsSpent / 60)),
                  totalCalories,
                  exercises.map((e) => e.id)
                );
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Lưu vào nhật ký & Kết thúc
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
            {currentIndex + 1}/{exercises.length}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight font-heading">
              {routine ? routine.title : currentExercise?.name}
            </h2>
            <p className="text-xs text-slate-400">
              Động tác tiếp theo:{' '}
              {currentIndex < exercises.length - 1
                ? exercises[currentIndex + 1].name
                : 'Hoàn thành bài tập'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          {/* Close Workout */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-colors"
            title="Thoát bài tập"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Studio Center Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 gap-6 max-w-6xl mx-auto w-full overflow-y-auto">
        {/* Left: Visual Animation Card */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-xl">
          <div className="bg-slate-900/90 rounded-2xl p-4 w-full flex items-center justify-center border border-slate-800 shadow-inner">
            <ExerciseFigure
              type={currentExercise?.animationType || 'stretch'}
              isPlaying={isActive}
              className="w-56 h-60 sm:w-64 sm:h-64"
            />
          </div>

          <div className="mt-4 text-center">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentExercise?.repsText}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-2">
              {currentExercise?.name}
            </h3>
          </div>
        </div>

        {/* Right: Timer & Posture Coach */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-6">
          {/* Circular Countdown Timer */}
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-emerald-500 transition-all duration-300 ease-linear"
                strokeWidth="8"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-heading">
                {secondsRemaining}
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 mt-1">
                Giây Còn Lại
              </span>
            </div>
          </div>

          {/* Teacher's Posture Cue */}
          <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span>💡 Mẹo Thầy/Cô Nhắc Nhở:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentExercise?.steps[0]?.instruction}
            </p>
            {currentExercise?.mistakes[0] && (
              <p className="text-xs text-rose-300 font-medium">
                ⚠️ Chú ý: {currentExercise.mistakes[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            <SkipBack className="w-4 h-4" />
            Trước
          </button>

          {/* Big Play / Pause Button */}
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
          >
            {isActive ? <Pause className="w-7 h-7 fill-slate-950" /> : <Play className="w-7 h-7 fill-slate-950 ml-1" />}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors text-sm font-semibold"
          >
            {currentIndex === exercises.length - 1 ? 'Hoàn thành' : 'Kế tiếp'}
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
