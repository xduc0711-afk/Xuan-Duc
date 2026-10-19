import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExerciseLibrary from './components/ExerciseLibrary';
import ExerciseDetailModal from './components/ExerciseDetailModal';
import WorkoutStudio from './components/WorkoutStudio';
import NutritionHub from './components/NutritionHub';
import BmiCalculator from './components/BmiCalculator';
import DailyTracker from './components/DailyTracker';
import StudentZone from './components/StudentZone';
import MaterialHub from './components/MaterialHub';
import SmartSummarizer from './components/SmartSummarizer';
import PracticeQuizHub from './components/PracticeQuizHub';
import QaSeedHub from './components/QaSeedHub';
import QuizModeScreen from './components/QuizModeScreen';
import GroundedChatScreen from './components/GroundedChatScreen';
import StudyPackVersionHub from './components/StudyPackVersionHub';
import AiCoachModal from './components/AiCoachModal';
import { Exercise, WorkoutRoutine, DailyHealthLog, StudentProfile, MaterialItem, PracticeQuizSet } from './types';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const STORAGE_LOG_KEY = 'edufit_daily_log_v1';
const STORAGE_PROFILE_KEY = 'edufit_profile_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'exercises' | 'nutrition' | 'bmi' | 'tracker' | 'student_zone' | 'materials' | 'summarizer' | 'quiz_practice' | 'qa_seeds' | 'quiz_mode' | 'grounded_chat' | 'study_pack'>('exercises');
  const [inspectingExercise, setInspectingExercise] = useState<Exercise | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [activeSingleExercise, setActiveSingleExercise] = useState<Exercise | null>(null);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedMaterialForSummary, setSelectedMaterialForSummary] = useState<MaterialItem | null>(null);
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState<string | null>(null);
  const [selectedGradeForQuiz, setSelectedGradeForQuiz] = useState<string | null>(null);
  const [selectedTopicForQaSeed, setSelectedTopicForQaSeed] = useState<string | null>(null);
  const [selectedGradeForQaSeed, setSelectedGradeForQaSeed] = useState<string | null>(null);
  const [selectedQuizSetForMode, setSelectedQuizSetForMode] = useState<PracticeQuizSet | null>(null);
  const [selectedTopicKeyForChat, setSelectedTopicKeyForChat] = useState<string>('1500m');

  // Initialize today's log from localStorage
  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyLog, setDailyLog] = useState<DailyHealthLog>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_LOG_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.date === todayStr) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading log from localStorage', e);
      }
    }
    return {
      date: todayStr,
      waterGlasses: 3,
      targetWaterGlasses: 8,
      completedWorkoutMinutes: 10,
      targetWorkoutMinutes: 30,
      completedExerciseIds: ['ex-warmup-joints'],
      mealsLogged: [
        {
          id: 'meal-init',
          mealType: 'Sáng',
          description: 'Phở bò chín + 1 ly nước ấm',
          score: 9,
        },
      ],
      notes: 'Hôm nay khởi động xoay khớp thấy người nhẹ nhõm hơn hẳn!',
    };
  });

  // Save log changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOG_KEY, JSON.stringify(dailyLog));
    } catch (e) {
      console.error(e);
    }
  }, [dailyLog]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateLog = (updated: Partial<DailyHealthLog>) => {
    setDailyLog((prev) => ({ ...prev, ...updated }));
  };

  const handleFinishWorkout = (minutes: number, _calories: number, exerciseIds: string[]) => {
    setDailyLog((prev) => ({
      ...prev,
      completedWorkoutMinutes: prev.completedWorkoutMinutes + minutes,
      completedExerciseIds: Array.from(new Set([...prev.completedExerciseIds, ...exerciseIds])),
    }));
    showToast(`Đã cộng ${minutes} phút vào nhật ký rèn luyện hôm nay! 🌟`);
  };

  const handleLogMeal = (mealDescription: string, score: number) => {
    const newMealItem = {
      id: Date.now().toString(),
      mealType: 'Trưa' as const,
      description: mealDescription,
      score,
    };
    setDailyLog((prev) => ({
      ...prev,
      mealsLogged: [newMealItem, ...prev.mealsLogged],
    }));
    showToast('Đã lưu bữa ăn vào nhật ký dinh dưỡng! 🥗');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAiCoach={() => setIsAiCoachOpen(true)}
        waterGlasses={dailyLog.waterGlasses}
        streakDays={3}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {currentTab === 'exercises' && (
          <ExerciseLibrary
            onSelectRoutine={(routine) => setActiveRoutine(routine)}
            onSelectExerciseDetail={(exercise) => setInspectingExercise(exercise)}
            onStartSingleExercise={(exercise) => setActiveSingleExercise(exercise)}
            onNavigateToStudentZone={() => setCurrentTab('student_zone')}
          />
        )}

        {currentTab === 'nutrition' && (
          <NutritionHub onLogMealToTracker={handleLogMeal} />
        )}

        {currentTab === 'bmi' && (
          <BmiCalculator
            onNavigateToExercises={() => setCurrentTab('exercises')}
            onNavigateToStudentZone={() => setCurrentTab('student_zone')}
          />
        )}

        {currentTab === 'tracker' && (
          <DailyTracker
            log={dailyLog}
            onUpdateLog={handleUpdateLog}
            onNavigateToExercises={() => setCurrentTab('exercises')}
          />
        )}

        {currentTab === 'student_zone' && (
          <StudentZone
            onNavigateToExercises={() => setCurrentTab('exercises')}
            onNavigateToNutrition={() => setCurrentTab('nutrition')}
            onNavigateToTracker={() => setCurrentTab('tracker')}
          />
        )}

        {currentTab === 'materials' && (
          <MaterialHub
            onSummarizeMaterial={(mat) => {
              setSelectedMaterialForSummary(mat);
              setCurrentTab('summarizer');
            }}
            onOpenQuizPractice={(topic, grade) => {
              setSelectedTopicForQuiz(topic);
              if (grade) setSelectedGradeForQuiz(grade);
              setCurrentTab('quiz_practice');
            }}
          />
        )}

        {currentTab === 'summarizer' && (
          <SmartSummarizer
            initialMaterial={selectedMaterialForSummary}
            onNavigateToMaterials={() => {
              setSelectedMaterialForSummary(null);
              setCurrentTab('materials');
            }}
            onNavigateToExercises={() => setCurrentTab('exercises')}
            onOpenQuizPractice={(topic, grade) => {
              setSelectedTopicForQuiz(topic);
              if (grade) setSelectedGradeForQuiz(grade);
              setCurrentTab('quiz_practice');
            }}
          />
        )}

        {currentTab === 'quiz_practice' && (
          <PracticeQuizHub
            initialTopic={selectedTopicForQuiz || undefined}
            initialGrade={selectedGradeForQuiz || undefined}
            onNavigateToExercises={() => setCurrentTab('exercises')}
            onNavigateToMaterials={() => setCurrentTab('materials')}
            onOpenQaSeeds={(topic, grade) => {
              setSelectedTopicForQaSeed(topic);
              if (grade) setSelectedGradeForQaSeed(grade);
              setCurrentTab('qa_seeds');
            }}
            onOpenQuizMode={(quiz) => {
              if (quiz) setSelectedQuizSetForMode(quiz);
              setCurrentTab('quiz_mode');
            }}
          />
        )}

        {currentTab === 'qa_seeds' && (
          <QaSeedHub
            initialTopic={selectedTopicForQaSeed || undefined}
            initialGrade={selectedGradeForQaSeed || undefined}
            onNavigateToExercises={() => setCurrentTab('exercises')}
            onNavigateToMaterials={() => setCurrentTab('materials')}
            onNavigateToQuizPractice={(topic, grade) => {
              setSelectedTopicForQuiz(topic);
              if (grade) setSelectedGradeForQuiz(grade);
              setCurrentTab('quiz_practice');
            }}
            onNavigateToGroundedChat={() => setCurrentTab('grounded_chat')}
          />
        )}

        {currentTab === 'quiz_mode' && (
          <QuizModeScreen
            initialQuizSet={selectedQuizSetForMode}
            onNavigateToPracticeHub={() => setCurrentTab('quiz_practice')}
            onNavigateToExercises={() => setCurrentTab('exercises')}
          />
        )}

        {currentTab === 'grounded_chat' && (
          <GroundedChatScreen
            initialTopicKey={selectedTopicKeyForChat}
            onNavigateToExercises={() => setCurrentTab('exercises')}
            onNavigateToMaterials={() => setCurrentTab('materials')}
            onNavigateToQuizPractice={() => setCurrentTab('quiz_practice')}
          />
        )}

        {currentTab === 'study_pack' && (
          <StudyPackVersionHub
            onNavigateToQuizMode={(quiz) => {
              if (quiz) setSelectedQuizSetForMode(quiz);
              setCurrentTab('quiz_mode');
            }}
            onNavigateToChatbot={() => setCurrentTab('grounded_chat')}
            onNavigateToExercises={() => setCurrentTab('exercises')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>EduFit - Giáo Dục Thể Chất & Dinh Dưỡng Học Đường Toàn Diện</span>
          </div>
          <p className="text-slate-400">
            Nội dung bài tập và tháp dinh dưỡng xây dựng theo định hướng chương trình GDPT môn Giáo dục thể chất và Viện Dinh Dưỡng Quốc Gia.
          </p>
        </div>
      </footer>

      {/* Workout Studio Modal (When Workout is Running) */}
      {(activeRoutine || activeSingleExercise) && (
        <WorkoutStudio
          routine={activeRoutine}
          singleExercise={activeSingleExercise}
          onClose={() => {
            setActiveRoutine(null);
            setActiveSingleExercise(null);
          }}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {/* Exercise Detail Modal */}
      {inspectingExercise && (
        <ExerciseDetailModal
          exercise={inspectingExercise}
          onClose={() => setInspectingExercise(null)}
          onStartSingleExercise={(ex) => {
            setActiveSingleExercise(ex);
          }}
        />
      )}

      {/* AI Teacher & Nutritionist Coach Modal */}
      <AiCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
      />
    </div>
  );
}
