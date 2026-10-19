import { useState } from 'react';
import {
  STUDENT_VISUAL_CARDS,
  STUDENT_HACKS,
  STUDENT_BADGES,
  STUDENT_QUIZ_QUESTIONS,
  ANIMAL_PROFILES,
  QuizAnimalProfile,
} from '../data/studentCardsData';
import { StudentVisualCard, StudentHack } from '../types';
import StudentCardModal from './StudentCardModal';
import {
  Sparkles,
  Flame,
  HelpCircle,
  Trophy,
  Heart,
  Maximize2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Smile,
  Zap,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

interface StudentZoneProps {
  onNavigateToExercises: () => void;
  onNavigateToNutrition: () => void;
  onNavigateToTracker: () => void;
}

export default function StudentZone({
  onNavigateToExercises,
  onNavigateToNutrition,
  onNavigateToTracker,
}: StudentZoneProps) {
  const [activeSubTab, setActiveSubTab] = useState<'cards' | 'quiz' | 'hacks' | 'badges'>('cards');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [activeCard, setActiveCard] = useState<StudentVisualCard | null>(null);
  const [likedCardIds, setLikedCardIds] = useState<string[]>([]);

  // Hacks state (expanded question)
  const [expandedHackId, setExpandedHackId] = useState<string | null>(STUDENT_HACKS[0].id);

  // Quiz state
  const [quizCurrentStep, setQuizCurrentStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<QuizAnimalProfile | null>(null);

  // Daily Student Habits checklist state
  const [habitsDone, setHabitsDone] = useState<{ [key: string]: boolean }>({
    water: true,
    backpack: false,
    stretch: true,
    snack: false,
    sleepEarly: false,
  });

  const handleLikeCard = (id: string) => {
    setLikedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCards = selectedTopic === 'all'
    ? STUDENT_VISUAL_CARDS
    : STUDENT_VISUAL_CARDS.filter((c) => c.topic === selectedTopic);

  // Quiz answering logic
  const handleSelectQuizOption = (animal: string) => {
    const updatedAnswers = [...quizAnswers, animal];
    setQuizAnswers(updatedAnswers);

    if (quizCurrentStep < STUDENT_QUIZ_QUESTIONS.length - 1) {
      setQuizCurrentStep((prev) => prev + 1);
    } else {
      // Calculate dominant archetype
      const tally: { [key: string]: number } = { cheetah: 0, giraffe: 0, bear: 0, eagle: 0 };
      updatedAnswers.forEach((a) => {
        if (tally[a] !== undefined) tally[a]++;
      });
      let highestAnimal = 'giraffe';
      let maxScore = -1;
      Object.entries(tally).forEach(([k, v]) => {
        if (v > maxScore) {
          maxScore = v;
          highestAnimal = k;
        }
      });
      setQuizResult(ANIMAL_PROFILES[highestAnimal] || ANIMAL_PROFILES.giraffe);
    }
  };

  const handleResetQuiz = () => {
    setQuizCurrentStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const toggleHabit = (key: string) => {
    setHabitsDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Banner - Cheerful, Visual, Student-Centric */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 sm:p-10 shadow-lg">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-extrabold border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Góc Học Trò & Thẻ Ảnh Chữ Sắc Màu</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight font-heading">
            Rèn Luyện Vui Vẻ – Không Khô Khan, Dễ Hiểu 100%!
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 leading-relaxed">
            Nơi tổng hợp những mẹo hay giờ ra chơi, bí kíp vượt ải kiểm tra môn Thể dục, thẻ ảnh chữ truyền động lực sống động và trắc nghiệm khám phá linh vật thể thao của riêng bạn.
          </p>

          {/* Quick Stat Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/15 backdrop-blur-xs text-xs font-semibold">
              🎨 6+ Thẻ Ảnh Chữ Poster
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/15 backdrop-blur-xs text-xs font-semibold">
              🦁 Trắc Nghiệm Linh Vật Học Trò
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/15 backdrop-blur-xs text-xs font-semibold">
              💡 5+ Bí Kíp Cứu Nguy Tiết Thể Dục
            </span>
          </div>
        </div>
      </section>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('cards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'cards'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Thẻ Ảnh Chữ & Poster Động Lực</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'quiz'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Trắc Nghiệm Linh Vật Thể Thao</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hacks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'hacks'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-sky-600" />
          <span>Hỏi Nhanh Đáp Gọn Giờ Thể Dục</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'badges'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Bảng Vàng Huy Hiệu & Thói Quen</span>
        </button>
      </div>

      {/* ===================== SUBTAB 1: THẺ ẢNH CHỮ & POSTER ===================== */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          {/* Topic Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1">Chủ đề:</span>
            {[
              { id: 'all', label: 'Tất Cả Thẻ' },
              { id: 'running', label: '🏃 Chạy Bền 1500m' },
              { id: 'height', label: '🦒 Chiều Cao' },
              { id: 'posture', label: '🎒 Lưng Thẳng' },
              { id: 'water', label: '💧 Nước Lọc' },
              { id: 'energy', label: '🍌 Ăn Vặt Lành Mạnh' },
              { id: 'pe_test', label: '🎯 Kiểm Tra Thể Dục' },
            ].map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTopic === topic.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Grid of Typographic Cards ("Ảnh Chữ") */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const isLiked = likedCardIds.includes(card.id);
              return (
                <div
                  key={card.id}
                  className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Visual Header / Poster Banner with Gradient & Bold Typography */}
                  <div className={`relative p-6 bg-gradient-to-br ${card.gradient} text-white space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 backdrop-blur-md border border-white/30 tracking-wide uppercase">
                        {card.topicLabel}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeCard(card.id);
                        }}
                        className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-xs flex items-center justify-center transition-transform active:scale-125"
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-white/80'}`}
                        />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase tracking-tight leading-tight drop-shadow-xs font-heading">
                        {card.catchphrase}
                      </h3>
                      <p className="text-xs font-medium text-white/90">
                        ✨ {card.tagline}
                      </p>
                    </div>

                    {/* Short Quote */}
                    <p className="text-xs italic text-white/85 bg-black/15 p-2 rounded-xl border border-white/10 line-clamp-2">
                      {card.studentQuote}
                    </p>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.summary}
                    </p>

                    {/* Step previews */}
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        ⚡ 3 Bước Dễ Làm:
                      </div>
                      {card.steps.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{s}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="text-slate-400 font-medium">
                        ❤️ {card.likesCount + (isLiked ? 1 : 0)} học sinh thích
                      </span>
                      <button
                        onClick={() => setActiveCard(card)}
                        className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span>Xem Ảnh Chữ</span>
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 2: TRẮC NGHIỆM LINH VẬT ===================== */}
      {activeSubTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!quizResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Quiz Header & Progress */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                    <span>🦁 Trắc Nghiệm Vui Thể Chất Học Đường</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    Khám Phá Linh Vật Thể Thao Của Bạn!
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">Câu hỏi</span>
                  <div className="text-lg font-black text-emerald-600">
                    {quizCurrentStep + 1} / {STUDENT_QUIZ_QUESTIONS.length}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
                  style={{
                    width: `${((quizCurrentStep + 1) / STUDENT_QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Question */}
              {STUDENT_QUIZ_QUESTIONS[quizCurrentStep] && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100/70">
                    <span className="text-2xl sm:text-3xl">
                      {STUDENT_QUIZ_QUESTIONS[quizCurrentStep].emoji}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                      {STUDENT_QUIZ_QUESTIONS[quizCurrentStep].question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {STUDENT_QUIZ_QUESTIONS[quizCurrentStep].options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectQuizOption(opt.animal)}
                        className="w-full text-left p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition-all flex items-center justify-between group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white font-bold text-sm text-slate-700 flex items-center justify-center transition-colors">
                            {opt.label}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                            {opt.text}
                          </span>
                        </div>
                        <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 bg-slate-50 group-hover:bg-emerald-100 group-hover:text-emerald-800 px-2.5 py-1 rounded-lg transition-colors">
                          {opt.pointsHint}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Result Screen */
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Chúc mừng! Linh vật đại diện của bạn là:</span>
              </div>

              <div className="space-y-2">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-5xl shadow-lg shadow-orange-500/20 animate-bounce">
                  {quizResult.avatarEmoji}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {quizResult.name}
                </h2>
                <p className="text-sm font-bold text-emerald-600">
                  {quizResult.title}
                </p>
                <div className="text-xs italic text-slate-500 font-medium">
                  {quizResult.motto}
                </div>
              </div>

              {/* Superpower & Description */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-slate-800">⚡ Siêu năng lực thể chất: </span>
                  <span className="text-slate-600">{quizResult.superpower}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">📖 Đặc điểm: </span>
                  <span className="text-slate-600">{quizResult.description}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                  <span className="font-bold">💡 Lời khuyên cho môn Thể dục: </span>
                  <span>{quizResult.schoolAdvice}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onNavigateToExercises}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <span>Tập theo gợi ý linh vật</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Trắc nghiệm lại</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== SUBTAB 3: BÍ KÍP VƯỢT ẢI THỂ DỤC ===================== */}
      {activeSubTab === 'hacks' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-3xl p-6 border border-sky-100 flex items-start gap-4">
            <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs">💡</span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Góc Cứu Nguy: Bí Kíp Xử Lý Các Sự Cố Trong Giờ Thể Dục
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Các câu hỏi thực tế mà hầu như học sinh nào cũng từng gặp: xóc hông, vấp dây, chuột rút, gù lưng, buồn ngủ... Giải thích dễ hiểu 100%!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {STUDENT_HACKS.map((hack) => {
              const isExpanded = expandedHackId === hack.id;
              return (
                <div
                  key={hack.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-white border-sky-300 shadow-md ring-1 ring-sky-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{hack.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800">
                            {hack.badgeTag}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                          {hack.question}
                        </h3>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 text-xs sm:text-sm">
                      {/* Problem */}
                      <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 text-rose-900">
                        <span className="font-bold">❌ Tình huống hay gặp: </span>
                        <span>{hack.relatableProblem}</span>
                      </div>

                      {/* Solution */}
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Cách xử lý nhanh trong 30 giây:</span>
                        </div>
                        <p className="leading-relaxed">{hack.quickSolution}</p>
                      </div>

                      {/* Why it works */}
                      <div className="text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl">
                        <span className="font-semibold not-italic text-slate-800">🔍 Vì sao mẹo này lại hiệu nghiệm? </span>
                        {hack.whyItWorks}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 4: BẢNG VÀNG HUY HIỆU & THÓI QUEN ===================== */}
      {activeSubTab === 'badges' && (
        <div className="space-y-8">
          {/* Daily Student Habits Checklist */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Thử Thách Mỗi Ngày
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  5 Thói Quen Học Trò Khỏe Đẹp
                </h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Tích xanh để nhận sao ⭐
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { key: 'water', label: 'Mang bình nước 500ml đi học', icon: '💧' },
                { key: 'backpack', label: 'Chỉnh quai cặp sách cân 2 vai', icon: '🎒' },
                { key: 'stretch', label: 'Xoay cổ vai gáy giờ ra chơi', icon: '🧘' },
                { key: 'snack', label: 'Ăn chuối/trái cây thay bim bim', icon: '🍌' },
                { key: 'sleepEarly', label: 'Tối nay ngủ trước 22h00', icon: '😴' },
              ].map((habit) => (
                <button
                  key={habit.key}
                  onClick={() => toggleHabit(habit.key)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    habitsDone[habit.key]
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{habit.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{habit.label}</span>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      habitsDone[habit.key] ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Badges Grid */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Bộ Sưu Tập Huy Hiệu Học Đường</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STUDENT_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border flex items-start gap-4 transition-all ${
                    badge.unlocked
                      ? 'bg-white border-slate-200/80 shadow-xs'
                      : 'bg-slate-50/70 border-dashed border-slate-200 opacity-75'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-md`}
                  >
                    {badge.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{badge.title}</h3>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Đạt được
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          Chưa mở
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{badge.description}</p>
                    <div className="text-[11px] font-semibold text-emerald-700 pt-1">
                      {badge.progressText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Modal View for "Ảnh Chữ" Poster */}
      <StudentCardModal
        card={activeCard}
        onClose={() => setActiveCard(null)}
        onLike={handleLikeCard}
        liked={activeCard ? likedCardIds.includes(activeCard.id) : false}
        onNavigateToExercise={onNavigateToExercises}
      />
    </div>
  );
}
