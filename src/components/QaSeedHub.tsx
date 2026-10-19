import { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Sparkles,
  BookOpen,
  Bookmark,
  Download,
  Trash2,
  Plus,
  Edit3,
  Check,
  Tag,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Search,
  FileCode,
  GraduationCap,
  Copy,
  CheckCheck,
  Bot
} from 'lucide-react';
import { QaSeedDataset, QaSeedPair, QaIntentCategory } from '../types';

const STORAGE_QA_SEEDS_KEY = 'edufit_qa_seeds_v1';

const PRESET_TOPICS = [
  {
    topic: 'Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở',
    grade: 'Lớp 8',
    subject: 'Giáo dục Thể chất',
    description: 'Xử lý xóc hông, nhịp thở 2-2, tiếp đất bàn chân và hồi tĩnh sau khi về đích.',
  },
  {
    topic: 'Kỹ thuật Xuất phát thấp & Chạy cự ly ngắn (60m / 100m)',
    grade: 'Lớp 7',
    subject: 'Giáo dục Thể chất',
    description: 'Lệnh sẵn sàng không ngã chúi, giữ độ ngả khi chạy lao và đánh đích bằng ngực.',
  },
  {
    topic: 'Bóng rổ: Kỹ thuật Dẫn bóng & Ném rổ 1 tay trên vai',
    grade: 'Lớp 10',
    subject: 'Giáo dục Thể chất',
    description: 'Cảm giác bóng đầu ngón tay không nhìn bóng, miết cổ tay theo bóng hình cầu vồng.',
  },
  {
    topic: 'Sơ cứu chấn thương thể thao (Bong gân cổ chân, Chuột rút)',
    grade: 'Lớp 8',
    subject: 'Y tế & An toàn Thể chất',
    description: 'Kéo ngược ngón chân khi chuột rút, không xoa dầu nóng khi bong gân, quy tắc R.I.C.E.',
  },
  {
    topic: 'Dinh dưỡng 4 nhóm chất & Năng lượng học đường',
    grade: 'Lớp 9',
    subject: 'Dinh dưỡng & Thể lực',
    description: 'Uống nước đúng cách trước giờ tập, nạp Kali chống chuột rút, ăn nhẹ trước giờ thi đấu.',
  },
];

const INTENT_CONFIG: Record<QaIntentCategory, { label: string; badgeClass: string }> = {
  technique_error: {
    label: 'Lỗi kỹ thuật',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  symptom_safety: {
    label: 'Triệu chứng & An toàn',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  exam_tip: {
    label: 'Mẹo thi thực hành',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  rule_concept: {
    label: 'Quy tắc & Khái niệm',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  nutrition_habit: {
    label: 'Dinh dưỡng & Thể lực',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
};

interface QaSeedHubProps {
  initialTopic?: string;
  initialGrade?: string;
  onNavigateToExercises?: () => void;
  onNavigateToMaterials?: () => void;
  onNavigateToQuizPractice?: (topic: string, grade?: string) => void;
  onNavigateToGroundedChat?: () => void;
}

export default function QaSeedHub({
  initialTopic,
  initialGrade,
  onNavigateToQuizPractice,
  onNavigateToGroundedChat
}: QaSeedHubProps) {
  // Setup inputs
  const [topicInput, setTopicInput] = useState(initialTopic || 'Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở');
  const [gradeInput, setGradeInput] = useState(initialGrade || 'Lớp 8');
  const [subjectInput, setSubjectInput] = useState('Giáo dục Thể chất');

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<QaSeedDataset | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSeedId, setCopiedSeedId] = useState<string | null>(null);

  // Manual seed addition / editing state
  const [isAddingSeed, setIsAddingSeed] = useState(false);
  const [editingSeedId, setEditingSeedId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newIntent, setNewIntent] = useState<QaIntentCategory>('technique_error');
  const [newKeywords, setNewKeywords] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('');

  // Tester simulation state (to test how chatbot will trigger this seed)
  const [testQuery, setTestQuery] = useState('');
  const [matchedSeed, setMatchedSeed] = useState<QaSeedPair | null>(null);

  // Saved seed datasets in LocalStorage
  const [savedDatasets, setSavedDatasets] = useState<QaSeedDataset[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_QA_SEEDS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved QA seeds', e);
      }
    }
    return [];
  });
  const [showSavedModal, setShowSavedModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QA_SEEDS_KEY, JSON.stringify(savedDatasets));
    } catch (e) {
      console.error(e);
    }
  }, [savedDatasets]);

  // Initial load: create a seed set if empty
  useEffect(() => {
    if (!currentDataset) {
      if (savedDatasets.length > 0) {
        setCurrentDataset(savedDatasets[0]);
      } else {
        handleGenerateSeeds('Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở', 'Lớp 8');
      }
    }
  }, []);

  // Generate Seeds via API
  const handleGenerateSeeds = async (targetTopic?: string, targetGrade?: string) => {
    const topicToUse = (targetTopic || topicInput).trim();
    const gradeToUse = (targetGrade || gradeInput).trim() || 'Lớp 8';

    if (!topicToUse) {
      showToast('Vui lòng nhập chủ đề học tập để tạo Q&A seed');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/qa-seeds/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          grade: gradeToUse,
          subject: subjectInput,
          seedCount: 5,
        }),
      });

      const data = await res.json();
      if (data.dataset) {
        setCurrentDataset(data.dataset);
        // Automatically save to local storage
        setSavedDatasets(prev => {
          const filtered = prev.filter(
            d => !(d.topic.toLowerCase() === data.dataset.topic.toLowerCase() && d.grade === data.dataset.grade)
          );
          return [data.dataset, ...filtered];
        });
        showToast(`✨ Đã khởi tạo ${data.dataset.seeds.length} cặp Q&A seed chuẩn bị cho chatbot!`);
      } else {
        showToast(data.error || 'Lỗi khi khởi tạo Q&A seed');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save current dataset explicitly
  const handleSaveCurrentDataset = () => {
    if (!currentDataset) return;
    setSavedDatasets(prev => {
      const filtered = prev.filter(d => d.id !== currentDataset.id);
      return [currentDataset, ...filtered];
    });
    showToast('💾 Đã lưu bộ Q&A seed vào LocalStorage!');
  };

  // Add a new seed manually
  const handleSaveManualSeed = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      showToast('Vui lòng nhập câu hỏi học sinh và câu trả lời ngắn');
      return;
    }

    const keywordList = newKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const newSeedItem: QaSeedPair = {
      id: `seed_${Date.now()}`,
      studentQuestion: newQuestion.trim(),
      intentCategory: newIntent,
      intentLabelVi: INTENT_CONFIG[newIntent].label,
      shortAnswer: newAnswer.trim(),
      keywords: keywordList.length > 0 ? keywordList : [newQuestion.slice(0, 15)],
      followUpPrompt: newFollowUp.trim() || undefined,
      curriculumContext: `Được bổ sung bởi giáo viên/học sinh cho ${topicInput}.`,
    };

    if (currentDataset) {
      const updated = {
        ...currentDataset,
        seeds: [newSeedItem, ...currentDataset.seeds],
        totalSeeds: currentDataset.seeds.length + 1,
      };
      setCurrentDataset(updated);
      setSavedDatasets(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    }

    setNewQuestion('');
    setNewAnswer('');
    setNewKeywords('');
    setNewFollowUp('');
    setIsAddingSeed(false);
    showToast('Đã thêm 1 cặp Q&A seed mới vào tập dữ liệu');
  };

  // Delete a single seed
  const handleDeleteSeed = (seedId: string) => {
    if (!currentDataset) return;
    const updated = {
      ...currentDataset,
      seeds: currentDataset.seeds.filter(s => s.id !== seedId),
      totalSeeds: Math.max(0, currentDataset.seeds.length - 1),
    };
    setCurrentDataset(updated);
    setSavedDatasets(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    showToast('Đã xóa câu hỏi seed');
  };

  // Copy seed text to clipboard
  const handleCopySeed = (seed: QaSeedPair) => {
    const text = `Q: ${seed.studentQuestion}\nA: ${seed.shortAnswer}\nTừ khóa: ${seed.keywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedSeedId(seed.id);
    setTimeout(() => setCopiedSeedId(null), 2000);
    showToast('Đã sao chép nội dung seed vào clipboard');
  };

  // Export as JSON for chatbot training/prompting
  const handleExportJson = (dataset: QaSeedDataset) => {
    const jsonStr = JSON.stringify(dataset, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa_seeds_${dataset.grade}_${dataset.topic.slice(0, 20).replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Đã xuất file JSON chuẩn bị cho chatbot ở buổi sau!');
  };

  // Export as TXT
  const handleExportTxt = (dataset: QaSeedDataset) => {
    let content = `DANH SÁCH Q&A SEED KHỞI TẠO (CHUẨN BỊ CHO CHATBOT ÔN BÀI)\n`;
    content += `Chủ đề: ${dataset.topic}\n`;
    content += `Khối lớp: ${dataset.grade} | Môn: ${dataset.subject || 'Giáo dục Thể chất'}\n`;
    content += `Mục đích: ${dataset.purpose}\n`;
    content += `Tổng số câu: ${dataset.seeds.length} cặp seed\n`;
    content += `Ngày khởi tạo: ${new Date(dataset.createdAt).toLocaleDateString('vi-VN')}\n`;
    content += `========================================================\n\n`;

    dataset.seeds.forEach((s, idx) => {
      content += `[SEED #${idx + 1}] - Phân loại: ${s.intentLabelVi}\n`;
      content += `Học sinh hỏi: "${s.studentQuestion}"\n`;
      content += `Trả lời ngắn ban đầu: ${s.shortAnswer}\n`;
      content += `Từ khóa gợi mở: ${s.keywords.join(' • ')}\n`;
      if (s.followUpPrompt) {
        content += `Gợi mở tiếp theo: "${s.followUpPrompt}"\n`;
      }
      content += `\n--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa_seeds_${dataset.grade}_${dataset.topic.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Đã tải file text Q&A Seed về máy!');
  };

  // Test match simulation (Keyword-based retrieval without full chatbot)
  const handleTestLookup = () => {
    if (!testQuery.trim() || !currentDataset) return;
    const qLower = testQuery.toLowerCase();
    
    // Find best match by keyword overlap
    let bestMatch: QaSeedPair | null = null;
    let maxScore = 0;

    for (const seed of currentDataset.seeds) {
      let score = 0;
      if (seed.studentQuestion.toLowerCase().includes(qLower) || qLower.includes(seed.studentQuestion.toLowerCase())) {
        score += 5;
      }
      for (const kw of seed.keywords) {
        if (qLower.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = seed;
      }
    }

    if (bestMatch && maxScore > 0) {
      setMatchedSeed(bestMatch);
    } else if (currentDataset.seeds.length > 0) {
      setMatchedSeed(currentDataset.seeds[0]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Matches Function #04 Card Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider shadow-sm">
                LOẠI: FUNCTION #04
              </span>
              <span className="text-xs text-teal-200 font-semibold px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-700/50">
                Q&A Seed Khởi Tạo
              </span>
              <span className="text-xs text-amber-300 font-medium px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/40">
                Chuẩn bị cho Chatbot ôn bài ở buổi sau
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Khởi Tạo Q&A Seed Cho Chủ Đề Học Tập
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Q&A seed là danh sách câu hỏi gợi mở và câu trả lời ngắn ban đầu để chuẩn bị dữ liệu cho chatbot hỗ trợ ôn bài ở buổi sau. Tập trung vào <strong>những câu hỏi mà học sinh thật sự có thể hỏi</strong> về chủ đề.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span>✔ Chỉ ở mức khởi tạo</span>
              <span>•</span>
              <span>✔ Chưa cần chatbot hoàn chỉnh</span>
              <span>•</span>
              <span>✔ Không đi sang buổi 5</span>
              <span>•</span>
              <span>✔ Ưu tiên câu hỏi băn khoăn thực tế</span>
            </div>
          </div>

          {/* Quick Storage & Export Buttons */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setShowSavedModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-300" />
              <span>Đã Lưu LocalStorage ({savedDatasets.length})</span>
            </button>

            {currentDataset && (
              <button
                onClick={() => handleExportJson(currentDataset)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <FileCode className="w-4 h-4" />
                <span>Xuất JSON Cho Chatbot</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Setup (Left 4 cols) & Seed Pairs List (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Topic Selection & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>Chủ Đề Cần Tạo Q&A Seed</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">Buổi Hiện Tại</span>
            </div>

            {/* Grade Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Khối lớp học sinh:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Tiểu học'].map(gr => (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => setGradeInput(gr)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                      gradeInput === gr
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {gr}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Tên chủ đề học tập hiện tại:
              </label>
              <textarea
                rows={3}
                placeholder="Nhập tên chủ đề (VD: Kỹ thuật Chạy 1500m & Nhịp thở, Nhảy xa kiểu ngồi, Dẫn bóng bóng rổ...)"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
              />
            </div>

            {/* Preset Curriculum Topics */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Chủ đề bài học gợi ý:</span>
                <span className="text-[10px] text-slate-400">Bấm để tạo seed</span>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {PRESET_TOPICS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopicInput(p.topic);
                      setGradeInput(p.grade);
                      setSubjectInput(p.subject);
                      handleGenerateSeeds(p.topic, p.grade);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs ${
                      topicInput === p.topic
                        ? 'bg-teal-50 border-teal-400 text-slate-900 font-bold ring-1 ring-teal-300'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold line-clamp-1">{p.topic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold shrink-0">
                        {p.grade}
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
                onClick={() => handleGenerateSeeds()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI Đang Khởi Tạo Q&A Seed...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                    <span>Tạo Q&A Seed Cho Chatbot</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Retrieval Simulator (Not full chatbot, strictly for previewing how seeds match questions) */}
          <div className="bg-slate-900 rounded-3xl p-5 text-white space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Thử Nghiệm Phản Hồi Khởi Tạo
              </h3>
              <span className="text-[10px] text-slate-400">Kiểm tra từ khóa</span>
            </div>

            <p className="text-xs text-slate-400">
              Nhập thử một câu hỏi của học sinh để kiểm tra xem seed nào sẽ kích hoạt câu trả lời ban đầu:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="VD: Chạy bị nhói hông thì làm sao?..."
                value={testQuery}
                onChange={e => setTestQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleTestLookup();
                }}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={handleTestLookup}
                className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shrink-0"
              >
                Thử
              </button>
            </div>

            {matchedSeed && (
              <div className="p-3 rounded-xl bg-slate-800/90 border border-teal-500/40 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-300">Khớp Seed:</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-900 text-teal-200">
                    {matchedSeed.intentLabelVi}
                  </span>
                </div>
                <p className="text-slate-300 font-semibold italic">
                  "{matchedSeed.studentQuestion}"
                </p>
                <div className="p-2 rounded-lg bg-slate-900 text-slate-200 text-[11px] leading-relaxed">
                  <strong>Câu trả lời ngắn ban đầu:</strong> {matchedSeed.shortAnswer}
                </div>
                {matchedSeed.followUpPrompt && (
                  <p className="text-[10px] text-amber-300 italic">
                    💬 Gợi mở tiếp: {matchedSeed.followUpPrompt}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Q&A Seed Dataset Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading && (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200/90 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
                <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquarePlus className="w-6 h-6 text-teal-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-800">
                  Đang Khởi Tạo Danh Sách Q&A Seed
                </h3>
                <p className="text-xs text-slate-500">
                  Thu thập các thắc mắc chân thực nhất của học sinh {gradeInput} về chủ đề "{topicInput}"...
                </p>
              </div>
            </div>
          )}

          {currentDataset && !isLoading && (
            <div className="space-y-6">
              {/* Dataset Top Summary Bar */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                        {currentDataset.grade}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {currentDataset.subject || 'Giáo dục Thể chất'}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {currentDataset.seeds.length} cặp seed
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {currentDataset.topic}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentDataset.purpose}
                    </p>
                  </div>

                  {/* Actions: Save, Add Manual, Export */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => setIsAddingSeed(!isAddingSeed)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Câu Hỏi Mới</span>
                    </button>

                    <button
                      onClick={handleSaveCurrentDataset}
                      title="Lưu vào LocalStorage"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                      <span className="hidden sm:inline">Lưu</span>
                    </button>

                    <button
                      onClick={() => handleExportTxt(currentDataset)}
                      title="Xuất file TXT"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Xuất TXT</span>
                    </button>

                    <button
                      onClick={() => handleExportJson(currentDataset)}
                      title="Xuất JSON chuẩn bị cho chatbot"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
                    >
                      <FileCode className="w-3.5 h-3.5 text-teal-400" />
                      <span>Xuất JSON</span>
                    </button>
                  </div>
                </div>

                {/* Notice banner for Function #04 */}
                <div className="bg-teal-50/70 border border-teal-200 p-3.5 rounded-2xl text-xs text-teal-950 flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Mục tiêu buổi hiện tại:</strong> Tạo danh sách câu hỏi gợi mở và câu trả lời ngắn ban đầu. Dữ liệu này sẽ được lưu vào <strong>LocalStorage</strong> và sẵn sàng nạp làm context/prompt cho <em>chatbot hỗ trợ ôn bài ở buổi sau</em> (chưa cần chatbot hoàn chỉnh, không đi sang buổi 5).
                  </div>
                </div>
              </div>

              {/* Form to Add Manual Student Seed */}
              {isAddingSeed && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-300 ring-1 ring-teal-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-teal-600" />
                      Thêm Câu Hỏi Thực Tế Học Sinh Thường Hỏi
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingSeed(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Hủy
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Câu hỏi tự nhiên của học sinh:
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Tại sao khi chạy chân em hay bị quẹt vào nhau?..."
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Phân loại ý định:
                        </label>
                        <select
                          value={newIntent}
                          onChange={e => setNewIntent(e.target.value as QaIntentCategory)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                        >
                          <option value="technique_error">Lỗi kỹ thuật</option>
                          <option value="symptom_safety">Triệu chứng & An toàn</option>
                          <option value="exam_tip">Mẹo thi thực hành</option>
                          <option value="rule_concept">Quy tắc & Khái niệm</option>
                          <option value="nutrition_habit">Dinh dưỡng & Thể lực</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Từ khóa gợi mở (phân cách bằng dấu phẩy):
                        </label>
                        <input
                          type="text"
                          placeholder="chạy quẹt chân, bàn chân, sai tư thế"
                          value={newKeywords}
                          onChange={e => setNewKeywords(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                        >
                        </input>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Câu trả lời ngắn ban đầu (1-3 câu):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Giải thích ngắn gọn nguyên nhân và hướng dẫn cụ thể..."
                        value={newAnswer}
                        onChange={e => setNewAnswer(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Câu hỏi gợi mở tiếp theo để chatbot hỏi lại học sinh:
                      </label>
                      <input
                        type="text"
                        placeholder="Em có muốn biết cách đặt bàn chân song song theo đường chạy không?..."
                        value={newFollowUp}
                        onChange={e => setNewFollowUp(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingSeed(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveManualSeed}
                        className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                      >
                        Lưu Cặp Seed
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Seed Pairs List */}
              <div className="space-y-4">
                {currentDataset.seeds.map((seed, idx) => {
                  const intentConf = INTENT_CONFIG[seed.intentCategory] || {
                    label: seed.intentLabelVi,
                    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
                  };

                  return (
                    <div
                      key={seed.id || idx}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:border-teal-300 transition-all space-y-4 group"
                    >
                      {/* Seed Header: Number & Intent Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${intentConf.badgeClass}`}>
                            {intentConf.label}
                          </span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            Seed ID: {seed.id}
                          </span>
                        </div>

                        {/* Top Seed Actions: Copy, Delete */}
                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopySeed(seed)}
                            title="Sao chép nội dung seed"
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-teal-700 transition-colors"
                          >
                            {copiedSeedId === seed.id ? (
                              <CheckCheck className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSeed(seed.id)}
                            title="Xóa seed này"
                            className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Student Natural Question */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                          🙋 Học Sinh Thật Sự Có Thể Hỏi:
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          "{seed.studentQuestion}"
                        </h3>
                      </div>

                      {/* Short Initial Answer */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Câu Trả Lời Ngắn Ban Đầu (Cho Chatbot):
                        </span>
                        <p className="text-slate-700 leading-relaxed font-medium pl-5">
                          {seed.shortAnswer}
                        </p>
                      </div>

                      {/* Seed Keywords & Follow-up Prompt */}
                      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                        {/* Keywords */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-400" /> Từ khóa:
                          </span>
                          {seed.keywords.map((kw, kIdx) => (
                            <span
                              key={kIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>

                        {/* Follow up question */}
                        {seed.followUpPrompt && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80 font-medium">
                            💬 <strong>Gợi mở tiếp:</strong> "{seed.followUpPrompt}"
                          </div>
                        )}
                      </div>

                      {/* Curriculum Reference */}
                      {seed.curriculumContext && (
                        <p className="text-[10px] text-slate-400 italic">
                          Căn cứ kiến thức: {seed.curriculumContext}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Card: Link to Question Practice */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-950">
                    Muốn kiểm tra kiến thức cho chủ đề này ngay?
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Chuyển sang bộ câu hỏi ôn luyện cơ bản (Đúng/Sai, Trắc nghiệm, Điền từ) để làm bài thử.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onNavigateToGroundedChat && (
                    <button
                      type="button"
                      onClick={onNavigateToGroundedChat}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-sm"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Mở Chatbot Ôn Bài (#05)</span>
                    </button>
                  )}

                  {onNavigateToQuizPractice && (
                    <button
                      type="button"
                      onClick={() => onNavigateToQuizPractice(currentDataset.topic, currentDataset.grade)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                    >
                      <span>Luyện Tập Bộ Câu Hỏi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sổ Tay Q&A Seed Đã Lưu Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-300" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Tập Dữ Liệu Q&A Seed Đã Lưu LocalStorage ({savedDatasets.length})
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
              {savedDatasets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Chưa có tập dữ liệu Q&A seed nào được lưu.</p>
                </div>
              ) : (
                savedDatasets.map((ds, idx) => (
                  <div
                    key={ds.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {ds.topic}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold shrink-0">
                          {ds.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {ds.seeds.length} cặp seed • Tạo ngày: {new Date(ds.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentDataset(ds);
                          setShowSavedModal(false);
                          showToast(`Đã mở bộ seed: "${ds.topic}" (${ds.grade})`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                      >
                        Mở Xem
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportJson(ds)}
                        className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs"
                        title="Xuất file JSON"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSavedDatasets(prev => prev.filter(d => d.id !== ds.id));
                          showToast('Đã xóa bộ Q&A seed');
                        }}
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
              <span className="text-slate-400">Chuẩn bị sẵn sàng cho chatbot ở buổi sau</span>
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
