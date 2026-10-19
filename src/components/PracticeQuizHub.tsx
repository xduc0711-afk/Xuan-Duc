import { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Bookmark,
  RotateCcw,
  Download,
  Trash2,
  ArrowRight,
  Lightbulb,
  Award,
  Clock,
  Layers,
  Check,
  Search,
  Filter,
  Eye,
  GraduationCap,
  MessageSquarePlus
} from 'lucide-react';
import { PracticeQuizSet, PracticeQuestion, QuizQuestionType } from '../types';

const STORAGE_SAVED_QUIZZES_KEY = 'edufit_saved_quizzes_v1';

const GRADE_OPTIONS = [
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
  'Lớp 9',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
  'Tiểu học'
];

interface PracticeQuizHubProps {
  initialTopic?: string;
  initialGrade?: string;
  onNavigateToExercises?: () => void;
  onNavigateToMaterials?: () => void;
  onOpenQaSeeds?: (topic: string, grade?: string) => void;
  onOpenQuizMode?: (quiz?: PracticeQuizSet) => void;
}

export default function PracticeQuizHub({
  initialTopic,
  initialGrade,
  onNavigateToExercises,
  onNavigateToMaterials,
  onOpenQaSeeds,
  onOpenQuizMode,
}: PracticeQuizHubProps) {
  // Input form state
  const [topicInput, setTopicInput] = useState(initialTopic || '');
  const [gradeInput, setGradeInput] = useState(initialGrade || 'Lớp 8');
  const [subjectInput, setSubjectInput] = useState('Giáo dục Thể chất');
  const [isCustomGrade, setIsCustomGrade] = useState(false);

  // Preset curriculum topics loaded from backend
  const [presets, setPresets] = useState<{ topic: string; defaultGrade: string; subject: string; description: string }[]>([]);

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuizSet, setCurrentQuizSet] = useState<PracticeQuizSet | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Practice session state (student answers)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [isAllSubmitted, setIsAllSubmitted] = useState(false);
  const [revealedModelAnswers, setRevealedModelAnswers] = useState<Record<string, boolean>>({});

  // Saved quizzes from LocalStorage
  const [savedQuizSets, setSavedQuizSets] = useState<PracticeQuizSet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_SAVED_QUIZZES_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved quizzes from localStorage', e);
      }
    }
    return [];
  });
  const [showSavedModal, setShowSavedModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch preset curriculum topics
  useEffect(() => {
    fetch('/api/ai/quiz/presets')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.presets)) {
          setPresets(data.presets);
          if (!topicInput && data.presets.length > 0) {
            setTopicInput(data.presets[0].topic);
            setGradeInput(data.presets[0].defaultGrade);
          }
        }
      })
      .catch(err => console.error('Failed to load quiz presets', err));
  }, []);

  // Save to LocalStorage whenever savedQuizSets changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_QUIZZES_KEY, JSON.stringify(savedQuizSets));
    } catch (e) {
      console.error(e);
    }
  }, [savedQuizSets]);

  // Handle Generate Quiz Set
  const handleGenerateQuiz = async (selectedTopic?: string, selectedGrade?: string) => {
    const topicToUse = (selectedTopic || topicInput).trim();
    const gradeToUse = (selectedGrade || gradeInput).trim() || 'Lớp 8';

    if (!topicToUse) {
      showToast('Vui lòng nhập hoặc chọn chủ đề bài học cần ôn tập');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          grade: gradeToUse,
          subject: subjectInput,
        }),
      });

      const data = await res.json();
      if (data.quizSet) {
        setCurrentQuizSet(data.quizSet);
        // Reset answer tracking
        setUserAnswers({});
        setSubmittedQuestions({});
        setIsAllSubmitted(false);
        setRevealedModelAnswers({});

        // Automatically auto-save this quiz set into LocalStorage if not already present
        setSavedQuizSets(prev => {
          const exists = prev.some(p => p.topic.toLowerCase() === data.quizSet.topic.toLowerCase() && p.grade === data.quizSet.grade);
          if (exists) {
            return prev.map(p => (p.topic.toLowerCase() === data.quizSet.topic.toLowerCase() && p.grade === data.quizSet.grade ? data.quizSet : p));
          }
          return [data.quizSet, ...prev];
        });

        showToast(`✨ Đã tạo thành công bộ ${data.quizSet.questions.length} câu hỏi ôn tập cho ${gradeToUse}!`);
      } else {
        showToast(data.error || 'Không thể tạo bộ câu hỏi');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Grade selection helper
  const handleSelectGrade = (gr: string) => {
    setGradeInput(gr);
    setIsCustomGrade(false);
  };

  // Preset topic selection helper
  const handleSelectPreset = (p: { topic: string; defaultGrade: string; subject: string }) => {
    setTopicInput(p.topic);
    setGradeInput(p.defaultGrade);
    setSubjectInput(p.subject);
    handleGenerateQuiz(p.topic, p.defaultGrade);
  };

  // Submit check single question
  const handleSubmitSingleQuestion = (questionId: string) => {
    setSubmittedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  // Submit all questions
  const handleSubmitAll = () => {
    if (!currentQuizSet) return;
    const allSubmittedMap: Record<string, boolean> = {};
    currentQuizSet.questions.forEach(q => {
      allSubmittedMap[q.id] = true;
    });
    setSubmittedQuestions(allSubmittedMap);
    setIsAllSubmitted(true);

    // Calculate score
    let correctCount = 0;
    currentQuizSet.questions.forEach(q => {
      if (isQuestionCorrect(q)) correctCount++;
    });

    // Update best score in LocalStorage
    setSavedQuizSets(prev =>
      prev.map(item => {
        if (item.id === currentQuizSet.id || (item.topic === currentQuizSet.topic && item.grade === currentQuizSet.grade)) {
          return {
            ...item,
            userBestScore: {
              score: Math.max(correctCount, item.userBestScore?.score || 0),
              total: currentQuizSet.questions.length,
              completedAt: new Date().toISOString(),
            },
          };
        }
        return item;
      })
    );

    showToast(`🎉 Đã nộp bài! Bạn trả lời đúng ${correctCount}/${currentQuizSet.questions.length} câu hỏi.`);
  };

  // Reset practice to do again
  const handleResetPractice = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setIsAllSubmitted(false);
    setRevealedModelAnswers({});
    showToast('🔄 Đã làm mới bài làm. Bạn có thể luyện tập lại từ đầu!');
  };

  // Check if answer is correct
  const isQuestionCorrect = (q: PracticeQuestion): boolean => {
    const ans = userAnswers[q.id];
    if (ans === undefined || ans === null) return false;

    if (q.type === 'multiple_choice') {
      return Number(ans) === q.correctOptionIndex;
    } else if (q.type === 'true_false') {
      return Boolean(ans) === q.correctBoolean;
    } else if (q.type === 'fill_blank') {
      const cleanUser = String(ans).trim().toLowerCase();
      if (!cleanUser) return false;
      const cleanCorrect = (q.correctTextAnswer || '').trim().toLowerCase();
      if (cleanUser === cleanCorrect) return true;
      if (Array.isArray(q.acceptableAnswers)) {
        return q.acceptableAnswers.some(a => a.trim().toLowerCase() === cleanUser);
      }
      return false;
    } else if (q.type === 'short_answer') {
      // In short answer, student self-evaluates or has answered something
      return String(ans).trim().length > 10;
    }
    return false;
  };

  // Save current quiz set explicitly to LocalStorage
  const handleSaveToLocalStorage = () => {
    if (!currentQuizSet) return;
    const exists = savedQuizSets.some(s => s.id === currentQuizSet.id);
    if (!exists) {
      setSavedQuizSets(prev => [currentQuizSet, ...prev]);
    }
    showToast('💾 Bộ câu hỏi đã được lưu an toàn vào LocalStorage!');
  };

  // Export to TXT for printing or studying
  const handleExportTxt = (quiz: PracticeQuizSet) => {
    let content = `BỘ CÂU HỎI ÔN TẬP BÁM SÁT KIẾN THỨC TRÊN TRƯỜNG\n`;
    content += `Chủ đề: ${quiz.topic}\n`;
    content += `Khối lớp: ${quiz.grade} | Môn: ${quiz.subject || 'Giáo dục Thể chất'}\n`;
    content += `Ngày tạo: ${new Date(quiz.createdAt).toLocaleDateString('vi-VN')}\n`;
    content += `Tổng số câu hỏi: ${quiz.questions.length}\n`;
    content += `====================================================\n\n`;

    quiz.questions.forEach((q, idx) => {
      content += `Câu ${idx + 1} [${q.typeLabelVi}]:\n${q.question}\n`;
      if (q.type === 'multiple_choice' && q.options) {
        q.options.forEach(opt => {
          content += `   ${opt}\n`;
        });
        content += `-> Đáp án đúng: Phương án ${String.fromCharCode(65 + (q.correctOptionIndex ?? 0))}\n`;
      } else if (q.type === 'true_false') {
        content += `-> Đáp án: ${q.correctBoolean ? 'ĐÚNG' : 'SAI'}\n`;
      } else if (q.type === 'fill_blank') {
        content += `-> Từ cần điền: ${q.correctTextAnswer}\n`;
      } else if (q.type === 'short_answer') {
        content += `-> Câu trả lời mẫu: ${q.modelAnswer}\n`;
      }
      content += `-> Giải thích SGK: ${q.explanation}\n`;
      if (q.studyTip) content += `-> Mẹo nhớ: ${q.studyTip}\n`;
      content += `\n----------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bo_Cau_Hoi_${quiz.grade}_${quiz.topic.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📥 Đã tải file bộ câu hỏi ôn bài về máy!');
  };

  // Delete saved quiz
  const handleDeleteSavedQuiz = (id: string) => {
    setSavedQuizSets(prev => prev.filter(q => q.id !== id));
    showToast('Đã xóa bộ câu hỏi khỏi danh sách lưu trữ');
  };

  // Calculate score summary
  const totalQuestions = currentQuizSet?.questions.length || 0;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== undefined && userAnswers[k] !== '').length;
  const correctCount = currentQuizSet
    ? currentQuizSet.questions.filter(q => submittedQuestions[q.id] && isQuestionCorrect(q)).length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-sm">
                <GraduationCap className="w-3.5 h-3.5" />
                ÔN BÀI TRÊN TRƯỜNG
              </span>
              <span className="text-xs text-emerald-200 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-800/60 border border-emerald-600/40">
                Đúng/Sai • Trắc nghiệm • Điền từ • Hỏi-đáp
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Tạo Bộ Câu Hỏi Luyện Tập Cơ Bản
            </h1>

            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Tạo bộ câu hỏi bám sát kiến thức thật trong chương trình sách giáo khoa theo từng khối lớp (Đúng/Sai, Trắc nghiệm A/B/C/D, Điền từ ngắn, Hỏi-đáp ngắn) giúp học sinh tự tin ôn bài và vượt qua bài kiểm tra thể chất.
            </p>
          </div>

          {/* Quick Storage & History Button */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            {onOpenQuizMode && (
              <button
                onClick={() => onOpenQuizMode(currentQuizSet || undefined)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md"
              >
                <GraduationCap className="w-4 h-4 text-slate-950" />
                <span>Vào Quiz Mode (Từng câu)</span>
              </button>
            )}

            <button
              onClick={() => setShowSavedModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm shadow-sm hover:scale-[1.02]"
            >
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-300" />
              <span>Đã Lưu LocalStorage ({savedQuizSets.length})</span>
            </button>

            {currentQuizSet && (
              <button
                onClick={() => handleExportTxt(currentQuizSet)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 text-white text-xs sm:text-sm font-semibold transition-all"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Tải File Ôn Tập (.txt)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Quiz Setup Form (Left) & Quiz Practice Interface (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Topic & Grade Input Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Thiết Lập Chủ Đề Ôn Bài</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">Chuẩn GDPT</span>
            </div>

            {/* 1. Grade Selector: phù hợp học sinh lớp [điền ở đây] */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Phù hợp học sinh lớp:
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomGrade(!isCustomGrade)}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline"
                >
                  {isCustomGrade ? 'Chọn lớp nhanh' : 'Tự điền lớp'}
                </button>
              </div>

              {!isCustomGrade ? (
                <div className="grid grid-cols-4 gap-1.5">
                  {GRADE_OPTIONS.map(gr => (
                    <button
                      key={gr}
                      type="button"
                      onClick={() => handleSelectGrade(gr)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                        gradeInput === gr
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {gr}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp 9, Lớp 10A, Tiểu học..."
                  value={gradeInput}
                  onChange={e => setGradeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              )}
            </div>

            {/* 2. Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Chủ đề bài học đang học trên trường:
              </label>
              <textarea
                rows={3}
                placeholder="Nhập tên bài học hoặc kỹ thuật cần ôn (VD: Kỹ thuật chạy 1500m & nhịp thở, Nhảy xa kiểu ngồi, Dẫn bóng bóng rổ, Sơ cứu bong gân...)"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
              />
            </div>

            {/* 3. Preset School Curriculum Topics */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Chủ đề bài giảng SGK mẫu:</span>
                <span className="text-[10px] text-slate-400">Bấm để ôn ngay</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs ${
                      topicInput === p.topic
                        ? 'bg-emerald-50/80 border-emerald-400 text-slate-900 font-bold ring-1 ring-emerald-300'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold line-clamp-1">{p.topic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0 font-bold">
                        {p.defaultGrade}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleGenerateQuiz()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI Đang Soạn Câu Hỏi Theo SGK...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                    <span>Tạo Bộ Câu Hỏi Luyện Tập Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Questions & Practice Interface (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!currentQuizSet && !isLoading && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/90 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <HelpCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-800">
                  Sẵn Sàng Ôn Bài & Luyện Tập
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Chọn chủ đề và khối lớp học của bạn ở cột bên trái, sau đó bấm <strong>"Tạo Bộ Câu Hỏi Luyện Tập Ngay"</strong> để bắt đầu làm bài ôn luyện có lời giải chi tiết.
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setTopicInput('Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở');
                    setGradeInput('Lớp 8');
                    handleGenerateQuiz('Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở', 'Lớp 8');
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-xs group"
                >
                  <div className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-emerald-900 mb-1">
                    <span>🏃 Chạy 1500m & Nhịp thở 2-2</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500">Ôn bài chạy cự ly bền, chống xóc hông, kiểm tra thể lực Lớp 8.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTopicInput('Kỹ thuật Xuất phát thấp & Chạy cự ly ngắn (60m / 100m)');
                    setGradeInput('Lớp 7');
                    handleGenerateQuiz('Kỹ thuật Xuất phát thấp & Chạy cự ly ngắn (60m / 100m)', 'Lớp 7');
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-xs group"
                >
                  <div className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-emerald-900 mb-1">
                    <span>⚡ Xuất phát thấp chạy 60m/100m</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500">Khẩu lệnh 3 bước, độ ngả thân người, chạy giữa quãng Lớp 7.</p>
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200/90 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-800">
                  Đang Soạn Bộ Câu Hỏi Bám Kiến Thức Thật
                </h3>
                <p className="text-xs text-slate-500">
                  Thiết kế đủ 4 dạng câu hỏi: Đúng/Sai, Trắc nghiệm, Điền từ ngắn và Hỏi-đáp cho học sinh {gradeInput}...
                </p>
              </div>
            </div>
          )}

          {currentQuizSet && !isLoading && (
            <div className="space-y-6">
              {/* Quiz Header & Progress Bar */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {currentQuizSet.grade}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {currentQuizSet.subject || 'Giáo dục Thể chất'}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {currentQuizSet.questions.length} câu hỏi
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {currentQuizSet.topic}
                    </h2>
                  </div>

                  {/* Actions: Save, Reset, Export */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenQuizMode && (
                      <button
                        onClick={() => onOpenQuizMode(currentQuizSet)}
                        title="Chuyển sang chế độ Quiz Mode làm từng câu"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Quiz Mode</span>
                      </button>
                    )}
                    {onOpenQaSeeds && (
                      <button
                        onClick={() => onOpenQaSeeds(currentQuizSet.topic, currentQuizSet.grade)}
                        title="Khởi tạo Q&A Seed cho chatbot ở buổi sau (Function #04)"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-semibold transition-all"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5 text-teal-400" />
                        <span className="hidden sm:inline">Q&A Seed (#04)</span>
                      </button>
                    )}
                    <button
                      onClick={handleSaveToLocalStorage}
                      title="Lưu vào LocalStorage"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                      <span className="hidden sm:inline">Lưu</span>
                    </button>
                    <button
                      onClick={() => handleExportTxt(currentQuizSet)}
                      title="Tải file .txt"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Xuất file</span>
                    </button>
                    <button
                      onClick={handleResetPractice}
                      title="Làm lại từ đầu"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Làm lại</span>
                    </button>
                  </div>
                </div>

                {/* Progress & Score Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <span>
                      Tiến độ: <strong className="text-slate-800">{answeredCount}/{totalQuestions} câu</strong>
                    </span>
                    {isAllSubmitted && (
                      <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Điểm số: {correctCount}/{totalQuestions} ({Math.round((correctCount / totalQuestions) * 100)}%)
                      </span>
                    )}
                  </div>

                  {!isAllSubmitted ? (
                    <button
                      onClick={handleSubmitAll}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Nộp Bài & Xem Điểm
                    </button>
                  ) : (
                    <button
                      onClick={handleResetPractice}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
                    >
                      Luyện Tập Lại
                    </button>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {currentQuizSet.questions.map((q, idx) => {
                  const isSubmitted = !!submittedQuestions[q.id];
                  const isCorrect = isQuestionCorrect(q);
                  const userAnswer = userAnswers[q.id];

                  const badgeColors: Record<QuizQuestionType, string> = {
                    multiple_choice: 'bg-blue-100 text-blue-800 border-blue-200',
                    true_false: 'bg-purple-100 text-purple-800 border-purple-200',
                    fill_blank: 'bg-amber-100 text-amber-800 border-amber-200',
                    short_answer: 'bg-teal-100 text-teal-800 border-teal-200',
                  };

                  return (
                    <div
                      key={q.id || idx}
                      className={`bg-white rounded-3xl p-6 shadow-sm border transition-all space-y-4 ${
                        isSubmitted
                          ? isCorrect
                            ? 'border-emerald-300 ring-1 ring-emerald-200'
                            : 'border-rose-300 ring-1 ring-rose-200'
                          : 'border-slate-200/90'
                      }`}
                    >
                      {/* Question Top Meta */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[q.type]}`}
                          >
                            {q.typeLabelVi}
                          </span>
                        </div>

                        {/* Status Icon when submitted */}
                        {isSubmitted && (
                          <div className="flex items-center gap-1 text-xs font-bold">
                            {isCorrect ? (
                              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Chính xác
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                                <XCircle className="w-3.5 h-3.5" /> Chưa chính xác
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Question Text */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>

                      {/* Interactive Answer Input based on Type */}

                      {/* 1. Multiple Choice Options */}
                      {q.type === 'multiple_choice' && q.options && (
                        <div className="space-y-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswer === optIdx;
                            const isCorrectOpt = q.correctOptionIndex === optIdx;

                            let optStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';
                            if (isSelected) {
                              optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-300';
                            }
                            if (isSubmitted) {
                              if (isCorrectOpt) {
                                optStyle = 'bg-emerald-100/80 border-emerald-500 text-emerald-950 font-bold';
                              } else if (isSelected && !isCorrectOpt) {
                                optStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  if (!isSubmitted) {
                                    setUserAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                                  }
                                }}
                                disabled={isSubmitted}
                                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between gap-3 ${optStyle}`}
                              >
                                <span>{opt}</span>
                                {isSubmitted && isCorrectOpt && (
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. True / False Options */}
                      {q.type === 'true_false' && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isSubmitted) {
                                setUserAnswers(prev => ({ ...prev, [q.id]: true }));
                              }
                            }}
                            disabled={isSubmitted}
                            className={`p-3.5 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all ${
                              userAnswer === true
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            ĐÚNG (True)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isSubmitted) {
                                setUserAnswers(prev => ({ ...prev, [q.id]: false }));
                              }
                            }}
                            disabled={isSubmitted}
                            className={`p-3.5 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all ${
                              userAnswer === false
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            SAI (False)
                          </button>
                        </div>
                      )}

                      {/* 3. Fill in the Blank Input */}
                      {q.type === 'fill_blank' && (
                        <div className="space-y-2 pt-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              disabled={isSubmitted}
                              placeholder="Nhập từ hoặc số cần điền..."
                              value={userAnswer || ''}
                              onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                            />
                            {!isSubmitted && (
                              <button
                                type="button"
                                onClick={() => handleSubmitSingleQuestion(q.id)}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0"
                              >
                                Kiểm tra
                              </button>
                            )}
                          </div>
                          {isSubmitted && !isCorrect && (
                            <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                              Đáp án chính xác: <strong>"{q.correctTextAnswer}"</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. Short Answer Input */}
                      {q.type === 'short_answer' && (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            disabled={isSubmitted}
                            placeholder="Ghi ngắn gọn câu trả lời của em (1-2 câu)..."
                            value={userAnswer || ''}
                            onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />

                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setRevealedModelAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                                handleSubmitSingleQuestion(q.id);
                              }}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span>{revealedModelAnswers[q.id] ? 'Ẩn câu trả lời mẫu' : 'Xem câu trả lời mẫu & Từ khóa chuẩn'}</span>
                            </button>
                          </div>

                          {revealedModelAnswers[q.id] && q.modelAnswer && (
                            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                              <span className="font-bold text-teal-900 block">
                                📌 Câu trả lời chuẩn:
                              </span>
                              <p className="text-teal-950 leading-relaxed font-medium">
                                {q.modelAnswer}
                              </p>
                              {q.keyConcepts && q.keyConcepts.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 pt-1">
                                  <span className="text-[11px] text-teal-800 font-semibold">Từ khóa cốt lõi:</span>
                                  {q.keyConcepts.map((kc, kIdx) => (
                                    <span key={kIdx} className="px-1.5 py-0.5 rounded bg-white text-teal-800 text-[10px] font-bold border border-teal-200">
                                      {kc}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Single Check Action Button when not yet submitted */}
                      {!isSubmitted && q.type !== 'short_answer' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSubmitSingleQuestion(q.id)}
                            disabled={userAnswer === undefined || userAnswer === ''}
                            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Kiểm Tra Câu Này
                          </button>
                        </div>
                      )}

                      {/* Explanation & Study Tip (Revealed when submitted) */}
                      {isSubmitted && (
                        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-200">
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              Giải Thích Chuẩn Kiến Thức:
                            </span>
                            <p className="text-slate-600 leading-relaxed pl-5">
                              {q.explanation}
                            </p>
                            {q.studyTip && (
                              <p className="text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200/80 font-medium pl-3 flex items-center gap-1 mt-1">
                                <span>💡 <strong>Mẹo nhớ:</strong> {q.studyTip}</span>
                              </p>
                            )}
                            {q.curriculumReference && (
                              <p className="text-[11px] text-slate-400 pl-5 italic">
                                Nguồn: {q.curriculumReference}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Submit / Action Bar */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Hoàn thành bài luyện tập?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bấm nộp bài để xem tổng điểm và lưu kết quả vào LocalStorage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isAllSubmitted ? (
                    <button
                      type="button"
                      onClick={handleSubmitAll}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      Nộp Bài & Chấm Điểm
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetPractice}
                      className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm"
                    >
                      Luyện Tập Lại Từ Đầu
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sổ Tay Bộ Câu Hỏi Đã Lưu LocalStorage Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-300" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Bộ Câu Hỏi Đã Lưu LocalStorage ({savedQuizSets.length})
                </h3>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedQuizSets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Chưa có bộ câu hỏi nào được lưu.</p>
                  <p className="text-[11px] text-slate-400">
                    Mỗi khi tạo bộ câu hỏi mới, hệ thống sẽ tự động lưu lại vào LocalStorage để bạn ôn luyện nhiều lần!
                  </p>
                </div>
              ) : (
                savedQuizSets.map((quiz, idx) => (
                  <div
                    key={quiz.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {quiz.topic}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                          {quiz.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {quiz.questions.length} câu hỏi • Tạo ngày: {new Date(quiz.createdAt).toLocaleDateString('vi-VN')}
                        {quiz.userBestScore && (
                          <span className="ml-2 font-bold text-emerald-700">
                            (Điểm cao nhất: {quiz.userBestScore.score}/{quiz.userBestScore.total})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onOpenQuizMode && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowSavedModal(false);
                            onOpenQuizMode(quiz);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                        >
                          Quiz Mode
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentQuizSet(quiz);
                          setUserAnswers({});
                          setSubmittedQuestions({});
                          setIsAllSubmitted(false);
                          setShowSavedModal(false);
                          showToast(`Đã mở bộ câu hỏi: "${quiz.topic}" (${quiz.grade})`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
                      >
                        Ôn Luyện
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportTxt(quiz)}
                        className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs"
                        title="Tải file .txt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedQuiz(quiz.id)}
                        className="p-2 rounded-xl hover:bg-rose-100 text-rose-500"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-400">Lưu trữ trực tiếp trong bộ nhớ trình duyệt học sinh</span>
              <button
                type="button"
                onClick={() => setShowSavedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
