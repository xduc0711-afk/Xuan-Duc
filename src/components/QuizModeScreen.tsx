import { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  Bookmark,
  ChevronRight,
  Check,
  Eye,
  FileQuestion,
  GraduationCap
} from 'lucide-react';
import { PracticeQuizSet, PracticeQuestion } from '../types';

const STORAGE_SAVED_QUIZZES_KEY = 'edufit_saved_quizzes_v1';

// Default curated quiz in case localStorage is empty on first visit
const DEFAULT_FALLBACK_QUIZ: PracticeQuizSet = {
  id: 'saved_quiz_default_1500m',
  topic: 'Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở',
  grade: 'Lớp 8',
  subject: 'Giáo dục Thể chất',
  description: 'Bộ câu hỏi chuẩn kiến thức GDPT: nhịp thở 2-2, kỹ thuật tiếp đất bàn chân, chống xóc hông và hồi tĩnh an toàn.',
  createdAt: new Date().toISOString(),
  totalQuestions: 5,
  questions: [
    {
      id: 'q1_mc',
      type: 'multiple_choice',
      typeLabelVi: 'Trắc nghiệm lựa chọn',
      question: 'Trong cự ly chạy 1500m, nhịp thở chuẩn mực được khuyên dùng để phòng ngừa xóc hông là gì?',
      options: [
        'A. 1 bước hít vào - 1 bước thở ra',
        'B. 2 bước hít vào bằng mũi - 2 bước thở ra bằng miệng (nhịp 2-2)',
        'C. Nín thở khi chạy nhanh rồi thở dốc',
        'D. Chỉ hít thở bằng miệng'
      ],
      correctOptionIndex: 1,
      explanation: 'Nhịp thở 2-2 (2 bước hít sâu bằng mũi, 2 bước thở mạnh qua miệng) giúp cung cấp đủ oxy cho cơ thể và ngăn ngừa co thắt cơ hoành (xóc hông).',
      studyTip: 'Ghi nhớ: "2 hít mũi - 2 thở miệng" theo nhịp bước chân.',
      curriculumReference: 'SGK Giáo dục Thể chất Lớp 8 - Điền kinh cự ly trung bình.'
    },
    {
      id: 'q2_tf',
      type: 'true_false',
      typeLabelVi: 'Đúng / Sai',
      question: 'Sau khi chạy qua vạch đích 1500m, học sinh nên ngồi bệt hoặc nằm ngay xuống đất để cơ thể nghỉ ngơi nhanh nhất.',
      correctBoolean: false,
      explanation: 'SAI. Khi vừa dừng chạy, máu đang dồn nhiều ở chi dưới. Nếu ngồi bệt ngay, máu chưa kịp hồi lưu về tim và não, rất dễ gây tụt huyết áp đột ngột, hoa mắt và ngất xỉu. Phải đi bộ nhẹ nhàng 3-5 phút và vung tay thả lỏng.',
      studyTip: 'Quy tắc hồi tĩnh: Luôn đi bộ thả lỏng sau khi về đích.',
      curriculumReference: 'Nguyên tắc an toàn và hồi phục sau bài chạy cự ly bền.'
    },
    {
      id: 'q3_mc',
      type: 'multiple_choice',
      typeLabelVi: 'Trắc nghiệm lựa chọn',
      question: 'Khi chạy cự ly 1500m, kỹ thuật tiếp đất bàn chân đúng nhất để bảo vệ khớp gối là:',
      options: [
        'A. Nện mạnh gót chân xuống đường chạy',
        'B. Tiếp đất bằng cạnh ngoài bàn chân',
        'C. Tiếp đất bằng nửa trước bàn chân (ức bàn chân) hoặc phần giữa bàn chân rồi miết êm',
        'D. Nhón hoàn toàn ngón chân cái'
      ],
      correctOptionIndex: 2,
      explanation: 'Tiếp đất bằng nửa trước/giữa bàn chân giúp bàn chân và cơ bắp chân đóng vai trò lò xo giảm xóc, tránh lực phản chấn dội thẳng vào khớp gối và cột sống.',
      studyTip: 'Không nện gót chân để tránh chấn thương khớp gối.',
      curriculumReference: 'Kỹ thuật chạy cự ly trung bình - Phần Đặt bàn chân.'
    },
    {
      id: 'q4_fb',
      type: 'fill_blank',
      typeLabelVi: 'Điền từ ngắn',
      question: 'Để duy trì năng lượng và tránh kiệt sức sớm, chiến thuật quan trọng nhất trong chạy 1500m là phân phối ___ đều trong suốt các vòng chạy.',
      correctTextAnswer: 'sức',
      acceptableAnswers: ['sức lực', 'thể lực', 'tốc độ', 'sức'],
      explanation: 'Phân phối sức hợp lý giúp cơ thể duy trì trạng thái hiếu khí, tránh tích tụ acid lactic quá sớm ở các vòng đầu.',
      studyTip: 'Từ cần điền: "sức" hoặc "thể lực".',
      curriculumReference: 'Chiến thuật chạy cự ly trung bình.'
    },
    {
      id: 'q5_sa',
      type: 'short_answer',
      typeLabelVi: 'Hỏi – đáp ngắn',
      question: 'Nêu 2 dấu hiệu thường gặp của hiện tượng "xóc hông" khi chạy bền và cách xử lý nhanh nhất?',
      modelAnswer: 'Dấu hiệu: Đau nhói buốt ở một bên sườn (thường là sườn phải) và thở dốc, khó chịu. Cách xử lý: Giảm tốc độ chạy, hít sâu bằng mũi và thở mạnh hết cỡ qua miệng, hoặc dùng tay ấn nhẹ vào vùng đau kết hợp cúi nhẹ người khi thở ra.',
      keyConcepts: ['đau nhói sườn', 'giảm tốc độ', 'thở mạnh bằng miệng', 'hít sâu'],
      explanation: 'Xóc hông là do cơ hoành bị co thắt cục bộ do thiếu oxy hoặc dạ dày co bóp khi ăn no trước giờ chạy.',
      studyTip: 'Nhớ 2 ý: Giảm tốc độ + Thở mạnh tống khí cặn.',
      curriculumReference: 'Sơ cứu và xử lý tai biến thể thao học đường.'
    }
  ]
};

interface QuizModeScreenProps {
  initialQuizSet?: PracticeQuizSet | null;
  onNavigateToPracticeHub?: () => void;
  onNavigateToExercises?: () => void;
}

export default function QuizModeScreen({
  initialQuizSet,
  onNavigateToPracticeHub
}: QuizModeScreenProps) {
  // 1. Quizzes loaded from LocalStorage
  const [savedQuizList, setSavedQuizList] = useState<PracticeQuizSet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_SAVED_QUIZZES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading saved quizzes', e);
      }
    }
    return [DEFAULT_FALLBACK_QUIZ];
  });

  // 2. Active quiz selection
  const [activeQuizId, setActiveQuizId] = useState<string>(() => {
    if (initialQuizSet && initialQuizSet.id) return initialQuizSet.id;
    return savedQuizList[0]?.id || DEFAULT_FALLBACK_QUIZ.id;
  });

  // Current active quiz object
  const activeQuiz = useMemo(() => {
    if (initialQuizSet && initialQuizSet.id === activeQuizId) {
      return initialQuizSet;
    }
    const found = savedQuizList.find(q => q.id === activeQuizId);
    return found || savedQuizList[0] || DEFAULT_FALLBACK_QUIZ;
  }, [activeQuizId, initialQuizSet, savedQuizList]);

  // 3. Current Question Index (Single question view)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // 4. CRITICAL: Store answers PER INDIVIDUAL QUESTION ID (not single state of last question!)
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, any>>({});

  // 5. Track which questions have had their individual answer checked
  const [checkedQuestionIds, setCheckedQuestionIds] = useState<Record<string, boolean>>({});

  // 6. Overall submission state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [scoreReport, setScoreReport] = useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    questionResults: Record<string, { isCorrect: boolean; feedback: string }>;
  } | null>(null);

  // Synchronize when activeQuiz changes or initialQuizSet changes
  useEffect(() => {
    if (initialQuizSet && initialQuizSet.id) {
      setActiveQuizId(initialQuizSet.id);
    }
  }, [initialQuizSet]);

  // Reset progress when switching to a different quiz
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswersByQuestionId({});
    setCheckedQuestionIds({});
    setIsCompleted(false);
    setScoreReport(null);
  }, [activeQuiz.id]);

  // Current question helper
  const currentQuestion = activeQuiz.questions[currentQuestionIndex] || activeQuiz.questions[0];
  const totalQuestions = activeQuiz.questions.length;

  // Answer handler for the current question: ALWAYS maps to currentQuestion.id
  const handleSelectAnswer = (questionId: string, answerValue: any) => {
    setAnswersByQuestionId(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  // Helper function to evaluate answer of any single question
  const evaluateSingleQuestion = (q: PracticeQuestion, answer: any): { isCorrect: boolean; feedback: string } => {
    if (answer === undefined || answer === null || answer === '') {
      return { isCorrect: false, feedback: 'Chưa trả lời câu hỏi này.' };
    }

    if (q.type === 'multiple_choice') {
      const isCorrect = answer === q.correctOptionIndex;
      const correctText = q.options && q.correctOptionIndex !== undefined ? q.options[q.correctOptionIndex] : '';
      return {
        isCorrect,
        feedback: isCorrect
          ? 'Chính xác! Bạn đã chọn đúng phương án.'
          : `Chưa chính xác. Đáp án đúng là: ${correctText}`
      };
    }

    if (q.type === 'true_false') {
      const isCorrect = answer === q.correctBoolean;
      const correctStr = q.correctBoolean ? 'ĐÚNG' : 'SAI';
      return {
        isCorrect,
        feedback: isCorrect
          ? `Chính xác! Nhận định này là ${correctStr}.`
          : `Chưa chính xác. Nhận định này là ${correctStr}.`
      };
    }

    if (q.type === 'fill_blank') {
      const cleanedInput = String(answer).trim().toLowerCase();
      const acceptable = [
        q.correctTextAnswer || '',
        ...(q.acceptableAnswers || [])
      ].map(a => a.trim().toLowerCase());

      const isCorrect = acceptable.some(acc => acc.length > 0 && cleanedInput === acc);
      return {
        isCorrect,
        feedback: isCorrect
          ? `Chính xác! Từ cần điền là: "${q.correctTextAnswer}"`
          : `Chưa chính xác. Đáp án đúng là: "${q.correctTextAnswer}"`
      };
    }

    if (q.type === 'short_answer') {
      // For short answer, mark as self-checked/answered if they provided substantive text
      const text = String(answer).trim();
      const hasContent = text.length >= 8;
      return {
        isCorrect: hasContent,
        feedback: hasContent
          ? 'Đã ghi nhận câu trả lời. Hãy đối chiếu với câu trả lời mẫu của SGK bên dưới.'
          : 'Câu trả lời còn quá ngắn, hãy bổ sung thêm ý chính theo SGK.'
      };
    }

    return { isCorrect: false, feedback: '' };
  };

  // Button: "Kiểm Tra Câu Này"
  const handleCheckCurrentQuestion = () => {
    if (!currentQuestion) return;
    setCheckedQuestionIds(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  // Button: "Kiểm Tra Kết Quả Toàn Bài" / "Nộp Bài"
  // CRITICAL REQUIREMENT: "lưu câu trả lời theo từng câu, không dùng state của câu cuối để chấm cho cả bài"
  const handleSubmitAllQuiz = () => {
    let correctCount = 0;
    const questionResults: Record<string, { isCorrect: boolean; feedback: string }> = {};

    activeQuiz.questions.forEach((q) => {
      // Look up answer SPECIFICALLY for q.id from answersByQuestionId!
      const answerForThisQ = answersByQuestionId[q.id];
      const result = evaluateSingleQuestion(q, answerForThisQ);
      questionResults[q.id] = result;
      if (result.isCorrect) {
        correctCount += 1;
      }
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    setScoreReport({
      correctCount,
      totalCount: total,
      percentage,
      questionResults
    });

    // Mark all as checked so student can review feedback
    const allChecked: Record<string, boolean> = {};
    activeQuiz.questions.forEach(q => {
      allChecked[q.id] = true;
    });
    setCheckedQuestionIds(allChecked);
    setIsCompleted(true);

    // Update user best score in LocalStorage if higher
    try {
      const updatedList = savedQuizList.map(item => {
        if (item.id === activeQuiz.id) {
          const prevScore = item.userBestScore?.score || 0;
          if (correctCount >= prevScore) {
            return {
              ...item,
              userBestScore: {
                score: correctCount,
                total,
                completedAt: new Date().toISOString()
              }
            };
          }
        }
        return item;
      });
      setSavedQuizList(updatedList);
      localStorage.setItem(STORAGE_SAVED_QUIZZES_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
  };

  // Reset quiz to practice again
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswersByQuestionId({});
    setCheckedQuestionIds({});
    setIsCompleted(false);
    setScoreReport(null);
  };

  // Current question answer & feedback state
  const currentAnswer = currentQuestion ? answersByQuestionId[currentQuestion.id] : undefined;
  const isCurrentChecked = currentQuestion ? Boolean(checkedQuestionIds[currentQuestion.id]) : false;
  const currentEval = currentQuestion ? evaluateSingleQuestion(currentQuestion, currentAnswer) : null;
  const hasCurrentAnswer = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';

  // Progress metrics
  const answeredCount = Object.keys(answersByQuestionId).filter(
    k => answersByQuestionId[k] !== undefined && answersByQuestionId[k] !== ''
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Banner - Quiz Mode Screen */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-7 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500 text-slate-950 uppercase tracking-wider">
                QUIZ MODE
              </span>
              <span className="text-xs text-teal-200 font-semibold px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-700/50">
                {activeQuiz.grade}
              </span>
              <span className="text-xs text-slate-400">
                • {activeQuiz.subject || 'Giáo dục Thể chất'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeQuiz.topic}
            </h1>
            <p className="text-xs text-slate-300 line-clamp-1">
              {activeQuiz.description || 'Luyện tập từng câu hỏi, kiểm tra kết quả ngay và theo dõi điểm số.'}
            </p>
          </div>

          {/* Quick Quiz Switcher Dropdown (Dữ liệu lấy từ quiz đã lưu) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={activeQuiz.id}
                onChange={e => setActiveQuizId(e.target.value)}
                className="appearance-none bg-slate-800/90 text-white text-xs font-semibold px-3 py-2 pr-8 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
              >
                {savedQuizList.map((quiz, idx) => (
                  <option key={quiz.id || idx} value={quiz.id}>
                    {quiz.grade} - {quiz.topic.length > 25 ? quiz.topic.slice(0, 25) + '...' : quiz.topic}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {onNavigateToPracticeHub && (
              <button
                type="button"
                onClick={onNavigateToPracticeHub}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10"
              >
                Kho Đề
              </button>
            )}
          </div>
        </div>

        {/* Stepper Navigation Pill Bar (Hiển thị từng câu hỏi rõ ràng) */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {activeQuiz.questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isAnswered = answersByQuestionId[q.id] !== undefined && answersByQuestionId[q.id] !== '';
              const isChecked = Boolean(checkedQuestionIds[q.id]);
              const evalRes = evaluateSingleQuestion(q, answersByQuestionId[q.id]);

              let btnClass = 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white';

              if (isChecked) {
                if (evalRes.isCorrect) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-500 font-bold';
                } else {
                  btnClass = 'bg-rose-600 text-white border-rose-500 font-bold';
                }
              } else if (isAnswered) {
                btnClass = 'bg-teal-700 text-white border-teal-500 font-semibold';
              }

              if (isCurrent) {
                btnClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105';
              }

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-xl text-xs flex items-center justify-center border transition-all shrink-0 ${btnClass}`}
                  title={`Câu ${idx + 1}: ${q.typeLabelVi}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-semibold text-slate-300 shrink-0">
            Đã làm: <span className="text-teal-400 font-bold">{answeredCount}</span>/{totalQuestions}
          </div>
        </div>
      </div>

      {/* COMPLETED REPORT CARD (When user submitted all) */}
      {isCompleted && scoreReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              Kết Quả Bài Làm Quiz Mode
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chủ đề: <strong>{activeQuiz.topic}</strong> ({activeQuiz.grade})
            </p>
          </div>

          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Số câu đúng</span>
              <span className="text-2xl font-black text-emerald-600">
                {scoreReport.correctCount} / {scoreReport.totalCount}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Điểm số</span>
              <span className="text-2xl font-black text-teal-600">
                {scoreReport.percentage}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Đánh giá</span>
              <span className="text-xs font-bold text-slate-700">
                {scoreReport.percentage >= 80 ? '🌟 Xuất Sắc' : scoreReport.percentage >= 50 ? '👍 Đạt Yêu Cầu' : '💪 Cần Cố Gắng'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm Lại Bài Này</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCompleted(false)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Xem Lại Từng Câu</span>
            </button>
          </div>
        </div>
      )}

      {/* SINGLE QUESTION FOCUS CARD (Yêu cầu: Hiển thị từng câu hỏi rõ ràng, ưu tiên dễ học dễ dùng) */}
      {currentQuestion && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
          {/* Question Meta Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-teal-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {currentQuestion.typeLabelVi}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              Câu {currentQuestionIndex + 1} / {totalQuestions}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>
            {currentQuestion.curriculumReference && (
              <p className="text-[11px] text-slate-400 italic">
                Nguồn: {currentQuestion.curriculumReference}
              </p>
            )}
          </div>

          {/* ANSWER INPUT SECTION: Based on Question Type */}
          <div className="space-y-3 pt-1">
            {/* TYPE 1: TRUE / FALSE */}
            {currentQuestion.type === 'true_false' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectAnswer(currentQuestion.id, true)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-3 ${
                    currentAnswer === true
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentAnswer === true
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    ✔
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">ĐÚNG</span>
                    <span className="text-[11px] text-slate-500">Nhận định này chuẩn xác</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAnswer(currentQuestion.id, false)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-3 ${
                    currentAnswer === false
                      ? 'border-rose-500 bg-rose-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentAnswer === false
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    ✖
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">SAI</span>
                    <span className="text-[11px] text-slate-500">Nhận định này chưa đúng</span>
                  </div>
                </button>
              </div>
            )}

            {/* TYPE 2: MULTIPLE CHOICE (4 Options) */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = currentAnswer === optIdx;
                  const prefixLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, optIdx)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3 text-xs sm:text-sm ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 text-slate-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-medium'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-teal-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {prefixLetter}
                      </div>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPE 3: FILL IN THE BLANK */}
            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Nhập từ hoặc số cần điền vào chỗ trống:
                </label>
                <input
                  type="text"
                  placeholder="Gõ câu trả lời vào đây..."
                  value={currentAnswer || ''}
                  onChange={e => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCheckCurrentQuestion();
                  }}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* TYPE 4: SHORT ANSWER */}
            {currentQuestion.type === 'short_answer' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Nhập câu trả lời ngắn (1–2 câu):
                </label>
                <textarea
                  rows={3}
                  placeholder="Gõ tóm tắt ý chính của bạn..."
                  value={currentAnswer || ''}
                  onChange={e => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-sans"
                />
              </div>
            )}
          </div>

          {/* BASIC FEEDBACK PANEL (Phản hồi đúng/sai cơ bản & giải thích) */}
          {isCurrentChecked && currentEval && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-2 animate-in fade-in duration-200 ${
                currentEval.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {currentEval.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-800">Chính xác! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="text-rose-800">Chưa chính xác</span>
                  </>
                )}
              </div>

              <p className="font-semibold text-slate-800 leading-relaxed pl-7">
                {currentEval.feedback}
              </p>

              {/* SGK Explanation */}
              {currentQuestion.explanation && (
                <div className="pt-2 mt-2 border-t border-slate-200/60 pl-7 space-y-1 text-xs text-slate-700">
                  <span className="font-bold block text-slate-800">💡 Giải thích chuẩn SGK:</span>
                  <p className="leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Study Tip */}
              {currentQuestion.studyTip && (
                <div className="pl-7 text-xs text-amber-800 font-medium pt-1">
                  ⭐ <strong>Mẹo nhớ:</strong> {currentQuestion.studyTip}
                </div>
              )}

              {/* Model Answer for Short Answer */}
              {currentQuestion.type === 'short_answer' && currentQuestion.modelAnswer && (
                <div className="pt-2 pl-7 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-800">📖 Câu trả lời mẫu SGK:</span>
                  <p className="p-2.5 rounded-xl bg-white/80 border border-slate-200 leading-relaxed font-sans">
                    {currentQuestion.modelAnswer}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CONTROLS FOOTER: Check Current Answer, Prev, Next, Submit Whole Quiz */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left Action: Check Current Question */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCheckCurrentQuestion}
                disabled={!hasCurrentAnswer}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Kiểm Tra Câu Này</span>
              </button>

              {isCurrentChecked && (
                <span className="text-xs text-slate-400 font-medium">
                  {currentEval?.isCorrect ? '✔ Đã chấm đúng' : '✖ Đã chấm sai'}
                </span>
              )}
            </div>

            {/* Right Action: Prev / Next Navigation & Submit */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-xs font-semibold transition-all"
                title="Câu trước"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  <span>Câu Tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitAllQuiz}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Award className="w-4 h-4 text-amber-300 fill-amber-200" />
                  <span>Nộp Bài & Xem Điểm</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK FOOTER HELPER */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Quiz Mode lưu câu trả lời độc lập cho từng câu hỏi, giúp bạn tự tin ôn bài và kiểm tra kiến thức trước kỳ thi.
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmitAllQuiz}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 underline whitespace-nowrap"
        >
          Nộp bài ngay ({answeredCount}/{totalQuestions} câu)
        </button>
      </div>
    </div>
  );
}
