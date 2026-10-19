import { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Copy,
  Volume2,
  VolumeX,
  FileText,
  Bookmark,
  Share2,
  HelpCircle,
  ListChecks,
  Compass,
  ArrowRight,
  RefreshCw,
  Search,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  Lightbulb,
  ShieldAlert,
  Flame,
  Clock,
  Cpu,
  Trash2,
  GraduationCap
} from 'lucide-react';
import { SummaryResult, MaterialItem, KeyPointItem, QuizQuestionItem, ActionStepItem } from '../types';

const STORAGE_SAVED_SUMMARIES_KEY = 'edufit_saved_summaries_v1';

interface SmartSummarizerProps {
  initialMaterial?: MaterialItem | null;
  onNavigateToMaterials?: () => void;
  onNavigateToExercises?: () => void;
  onOpenQuizPractice?: (topic: string, grade?: string) => void;
}

interface PresetDoc {
  id: string;
  title: string;
  category: string;
  badge: string;
  text: string;
}

export default function SmartSummarizer({
  initialMaterial,
  onNavigateToMaterials,
  onNavigateToExercises,
  onOpenQuizPractice,
}: SmartSummarizerProps) {
  // Input Selection Mode
  const [inputMode, setInputMode] = useState<'material' | 'preset' | 'custom'>('preset');

  // Materials from API
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [materialSearch, setMaterialSearch] = useState('');

  // Preset Docs
  const [presets, setPresets] = useState<PresetDoc[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('doc_run_1500');

  // Custom text input
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');

  // Options
  const [depth, setDepth] = useState<'quick' | 'standard' | 'detailed'>('standard');
  const [audience, setAudience] = useState<'student' | 'teacher' | 'athlete'>('student');

  // Loading & Results
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Checklist states
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  // Flashcards flipped / revealed states
  const [revealedQuiz, setRevealedQuiz] = useState<Record<string, boolean>>({});

  // Saved Summaries History
  const [savedSummaries, setSavedSummaries] = useState<SummaryResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_SAVED_SUMMARIES_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved summaries', e);
      }
    }
    return [];
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load materials from backend
  useEffect(() => {
    fetch('/api/materials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.materials)) {
          setMaterials(data.materials);
        }
      })
      .catch(err => console.error('Failed to load materials', err));

    fetch('/api/ai/summarize/presets')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.presets)) {
          setPresets(data.presets);
        }
      })
      .catch(err => console.error('Failed to load presets', err));
  }, []);

  // Handle initialMaterial if passed
  useEffect(() => {
    if (initialMaterial) {
      setInputMode('material');
      setSelectedMaterialId(initialMaterial.id);
      // Auto-trigger summarization for passed material
      handleSummarizeMaterial(initialMaterial);
    }
  }, [initialMaterial]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_SUMMARIES_KEY, JSON.stringify(savedSummaries));
    } catch (e) {
      console.error(e);
    }
  }, [savedSummaries]);

  // Trigger Summarize for a given material
  const handleSummarizeMaterial = async (mat: MaterialItem) => {
    setIsLoading(true);
    stopSpeech();
    try {
      const fullText = `Tên học liệu / vật liệu: ${mat.title}\nPhân loại: ${mat.categoryNameVi} (${mat.category})\nHiện trạng: ${mat.statusLabelVi} - Số lượng: ${mat.quantity}\nVị trí / Nguồn gốc: ${mat.locationOrOrigin}\nNgười đóng góp: ${mat.authorName} (${mat.authorRole})\nTừ khóa: ${mat.tags.join(', ')}\n\nMô tả chi tiết & Hướng dẫn sử dụng:\n${mat.description}`;

      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText,
          title: mat.title,
          depth,
          audience,
          sourceType: 'material',
          sourceId: mat.id,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setSummaryResult(data.summary);
        setCheckedActions({});
        setRevealedQuiz({});
        showToast('✨ Đã hoàn thành tóm tắt và trích xuất ý chính học liệu!');
      } else {
        showToast(data.error || 'Có lỗi xảy ra khi tóm tắt');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Summarize from form
  const handleRunSummarize = async () => {
    let textToAnalyze = '';
    let docTitle = '';
    let sType: 'material' | 'custom' | 'preset' = 'custom';
    let sId: string | undefined = undefined;

    if (inputMode === 'material') {
      const found = materials.find(m => m.id === selectedMaterialId);
      if (!found) {
        showToast('Vui lòng chọn một vật liệu hoặc học liệu từ kho');
        return;
      }
      return handleSummarizeMaterial(found);
    } else if (inputMode === 'preset') {
      const found = presets.find(p => p.id === selectedPresetId);
      if (!found) {
        showToast('Vui lòng chọn một bài học thể chất mẫu');
        return;
      }
      textToAnalyze = found.text;
      docTitle = found.title;
      sType = 'preset';
      sId = found.id;
    } else {
      if (!customText.trim()) {
        showToast('Vui lòng nhập hoặc dán nội dung văn bản cần tóm tắt');
        return;
      }
      textToAnalyze = customText.trim();
      docTitle = customTitle.trim() || 'Tài liệu tùy chọn';
      sType = 'custom';
    }

    setIsLoading(true);
    stopSpeech();
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          title: docTitle,
          depth,
          audience,
          sourceType: sType,
          sourceId: sId,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setSummaryResult(data.summary);
        setCheckedActions({});
        setRevealedQuiz({});
        showToast('✨ Đã hoàn thành tóm tắt và trích xuất ý chính!');
      } else {
        showToast(data.error || 'Không thể tạo bản tóm tắt');
      }
    } catch (err: any) {
      showToast('Lỗi khi phân tích: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech (Web Speech API)
  const toggleSpeech = () => {
    if (!summaryResult || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Trình duyệt không hỗ trợ đọc giọng nói');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const speechText = `${summaryResult.title}. ${summaryResult.quickDigest}. Các ý chính quan trọng: ${summaryResult.keyPoints
      .map((kp, idx) => `Ý thứ ${idx + 1}: ${kp.title}. ${kp.detail}`)
      .join('. ')}. Lời khuyên cho học sinh: ${summaryResult.studentTakeaway}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;

    // Try finding Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Save to Notebook
  const handleSaveToNotebook = () => {
    if (!summaryResult) return;
    const exists = savedSummaries.some(s => s.title === summaryResult.title && s.quickDigest === summaryResult.quickDigest);
    if (exists) {
      showToast('Bản tóm tắt này đã được lưu trong Sổ tay của bạn rồi!');
      return;
    }
    setSavedSummaries(prev => [summaryResult, ...prev]);
    showToast('💾 Đã lưu vào Sổ tay Ghi nhớ Học sinh thành công!');
  };

  // Copy full summary to clipboard
  const handleCopyFull = () => {
    if (!summaryResult) return;
    const content = `📌 ${summaryResult.title}
⚡ Tóm tắt nhanh:
${summaryResult.quickDigest}

🔑 Các ý chính cốt lõi:
${summaryResult.keyPoints.map((kp, i) => `${i + 1}. [${kp.tag}] ${kp.title}: ${kp.detail}`).join('\n')}

🎯 Bước hành động thực tế:
${summaryResult.actionItems.map((act, i) => `${i + 1}. ${act.step} (${act.tip || ''})`).join('\n')}

💡 Thông điệp: ${summaryResult.studentTakeaway}
---
Nguồn: EduFit - Chức Năng Tóm Tắt & Trích Xuất Ý Chính (MindX #03)`;

    navigator.clipboard.writeText(content).then(() => {
      showToast('📋 Đã sao chép toàn bộ bản tóm tắt vào bộ nhớ tạm!');
    });
  };

  // Export as new Material into Kho Vật Liệu
  const handleExportToMaterialHub = async () => {
    if (!summaryResult) return;
    try {
      const newMatData = {
        title: `[Tóm tắt AI] ${summaryResult.title}`,
        category: 'guide',
        description: `TỔNG QUAN TÓM TẮT:\n${summaryResult.quickDigest}\n\nÝ CHÍNH CỐT LÕI:\n${summaryResult.keyPoints.map(k => `• [${k.tag}] ${k.title}: ${k.detail}`).join('\n')}\n\nHƯỚNG DẪN THỰC HÀNH:\n${summaryResult.actionItems.map(a => `✔ ${a.step}`).join('\n')}\n\nTHÔNG ĐIỆP HỌC SINH:\n${summaryResult.studentTakeaway}`,
        quantity: '1 tài liệu tổng hợp',
        status: 'available',
        locationOrOrigin: 'Trợ lý Tóm tắt MindX #03 AI',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
        tags: ['tóm tắt ai', 'ý chính', 'giáo án', 'học đường'],
        authorId: 'acc_minh',
        authorName: 'Nguyễn Nhật Minh',
        authorRole: 'Học sinh Lớp 9B',
        authorAvatarEmoji: '⚡',
      };

      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMatData),
      });

      if (res.ok) {
        showToast('📦 Đã xuất bản tóm tắt thành Học liệu mới trong Kho Vật Liệu!');
        if (onNavigateToMaterials) {
          setTimeout(onNavigateToMaterials, 1200);
        }
      } else {
        const err = await res.json();
        showToast(err.error || 'Lỗi lưu học liệu');
      }
    } catch (err: any) {
      showToast('Không thể xuất sang Kho Vật Liệu: ' + err.message);
    }
  };

  // Download .txt file
  const handleDownloadTxt = () => {
    if (!summaryResult) return;
    const content = `EDUFIT - BẢN TÓM TẮT VÀ TRÍCH XUẤT Ý CHÍNH HỌC ĐƯỜNG (MINDX #03)
============================================================
Tiêu đề: ${summaryResult.title}
Thời gian đọc ước tính: ~${summaryResult.readingTimeMinutes} phút
Độ cô đọng: Tiết kiệm ${summaryResult.compressionPercentage}% dung lượng (từ ${summaryResult.originalWordCount} từ còn ${summaryResult.condensedWordCount} từ)

1. TỔNG QUAN TÓM TẮT NHANH (QUICK DIGEST):
${summaryResult.quickDigest}

2. CÁC Ý CHÍNH CỐT LÕI (CORE KEY POINTS):
${summaryResult.keyPoints.map((kp, i) => `[${i + 1}] [${kp.tag}] ${kp.title}\n    -> ${kp.detail}`).join('\n\n')}

3. BƯỚC HÀNH ĐỘNG CỤ THỂ (ACTION CHECKLIST):
${summaryResult.actionItems.map((act, i) => `[ ] Bước ${i + 1}: ${act.step}\n    Mẹo: ${act.tip || 'Thực hiện đúng kỹ thuật'}`).join('\n\n')}

4. CÂU HỎI TỰ KIỂM TRA ĐỘ HIỂU BÀI (SELF-CHECK QUIZ):
${summaryResult.quizQuestions.map((q, i) => `Câu hỏi ${i + 1}: ${q.question}\nĐáp án: ${q.answer}\nGợi ý: ${q.hint || 'Không có'}`).join('\n\n')}

5. THÔNG ĐIỆP HỌC SINH:
${summaryResult.studentTakeaway}
============================================================
Tạo tự động bởi MindX Function #03 - AI Summarizer & Key Points Extractor`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tom-tat-${summaryResult.title.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📥 Đã tải file tóm tắt về thiết bị!');
  };

  // Filtered materials
  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
    m.categoryNameVi.toLowerCase().includes(materialSearch.toLowerCase()) ||
    m.description.toLowerCase().includes(materialSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - MindX #03 Special Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                FUNCTION #03
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                <Cpu className="w-3 h-3 text-indigo-300" />
                mindX Technology School Challenge
              </span>
              <span className="text-xs text-indigo-200 font-medium">
                Tóm tắt & Trích xuất ý chính từ dữ liệu
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Trợ Lý Tóm Tắt & Trích Xuất Ý Chính Học Đường
            </h1>

            <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
              Giải pháp AI thông minh giúp học sinh và thầy cô cô đọng kiến thức, trích xuất tức thì các luận điểm cốt lõi, bước hành động kỹ thuật chuẩn và câu hỏi ôn tập từ bất kỳ tài liệu, giáo án thể chất hay kho học liệu nào.
            </p>
          </div>

          {/* Quick Actions / History Button */}
          <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm shadow-sm hover:scale-[1.02]"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Sổ Tay Tóm Tắt ({savedSummaries.length})</span>
            </button>

            {onNavigateToMaterials && (
              <button
                onClick={onNavigateToMaterials}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/40 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm"
              >
                <Package className="w-4 h-4 text-indigo-200" />
                <span>Kho Vật Liệu Trường</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Input Setup & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Selection & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Nguồn Tài Liệu Đầu Vào</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Bước 1 / 2
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setInputMode('preset')}
                className={`py-2 px-2 text-center rounded-xl transition-all duration-200 ${
                  inputMode === 'preset'
                    ? 'bg-white text-indigo-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📚 Bài học mẫu
              </button>
              <button
                onClick={() => setInputMode('material')}
                className={`py-2 px-2 text-center rounded-xl transition-all duration-200 ${
                  inputMode === 'material'
                    ? 'bg-white text-indigo-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📦 Kho Vật Liệu
              </button>
              <button
                onClick={() => setInputMode('custom')}
                className={`py-2 px-2 text-center rounded-xl transition-all duration-200 ${
                  inputMode === 'custom'
                    ? 'bg-white text-indigo-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✍️ Dán tự do
              </button>
            </div>

            {/* Mode 1: Preset Curated Docs */}
            {inputMode === 'preset' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Chọn 1 trong các bài giảng & kỹ thuật thể thao học đường chuẩn hóa:
                </p>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {presets.map(doc => {
                    const isSelected = selectedPresetId === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedPresetId(doc.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-400 text-indigo-950 font-semibold ring-2 ring-indigo-200'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-xs line-clamp-1">{doc.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold shrink-0">
                            {doc.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {doc.text.slice(0, 120)}...
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Pick from Kho Vật Liệu */}
            {inputMode === 'material' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={e => setMaterialSearch(e.target.value)}
                    placeholder="Tìm trong Kho vật liệu..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {filteredMaterials.length === 0 ? (
                  <div className="p-4 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                    Chưa tìm thấy vật liệu phù hợp. Bạn có thể sang tab "Kho Vật Liệu" để thêm mới!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredMaterials.map(mat => {
                      const isSelected = selectedMaterialId === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setSelectedMaterialId(mat.id)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all text-xs ${
                            isSelected
                              ? 'bg-amber-50/80 border-amber-400 text-slate-900 font-semibold ring-2 ring-amber-200'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold line-clamp-1">{mat.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium shrink-0">
                              {mat.categoryNameVi}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {mat.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                            <span>Người tạo: {mat.authorName}</span>
                            <span>• {mat.quantity}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Mode 3: Custom Paste */}
            {inputMode === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu đề tài liệu / chủ đề:
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    placeholder="VD: Kỹ thuật đập bóng chuyền đúng tư thế..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Nội dung văn bản cần tóm tắt:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {customText.length} ký tự ({customText.trim() ? customText.trim().split(/\s+/).length : 0} từ)
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="Dán nội dung giáo án, bài đọc môn thể chất, kiến thức dinh dưỡng, tài liệu PDF hoặc ghi chú của bạn vào đây..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Quick samples for custom */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Thử mẫu nhanh:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTitle('Kỹ thuật Nhảy Dây Đôi & Lợi Ích Tim Mạch');
                      setCustomText('Nhảy dây là một trong những bài tập tim mạch (cardio) hiệu quả nhất dành cho học sinh. Khi nhảy dây 10 phút liên tục với tốc độ 120 nhịp/phút, cơ thể tiêu hao lượng calo tương đương với 30 phút chạy bộ chậm (khoảng 140 calo). Động tác này huy động toàn bộ cơ bắp chuối, cơ đùi trước, cơ vai và cơ lõi bụng để giữ thăng bằng. Để thực hiện đúng kỹ thuật: Cầm cán dây bằng 2 tay ngang hông, cổ tay xoay tròn nhịp nhàng thay vì vung cả cánh tay. Tiếp đất êm ái bằng ức bàn chân, đầu gối hơi chùng nhẹ để triệt tiêu phản lực. Khởi động kỹ cổ chân trước khi tập và không nhảy trên nền bê tông cứng mà nên tập trên thảm cỏ hoặc thảm tập đàn hồi.');
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                  >
                    + Nhảy dây cardio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTitle('Quy Tắc Bữa Ăn Trước Giờ Kiểm Tra Thể Dục');
                      setCustomText('Bữa ăn trước giờ kiểm tra thể dục quyết định trực tiếp tới 40% thể lực của học sinh. Tuyệt đối không được nhịn ăn sáng vì đường huyết tụt sẽ gây hoa mắt chóng mặt khi chạy bền. Tuy nhiên, cũng không được ăn quá no hoặc ăn đồ nhiều dầu mỡ (thịt mỡ, đồ chiên rán) sát giờ tập vì dạ dày cần tới 3-4 tiếng để tiêu hóa mỡ, gây cảm giác nặng bụng và trào ngược. Thời điểm vàng: Ăn bữa chính trước giờ tập 2 đến 3 tiếng. Nếu chỉ còn 30-45 phút trước khi thi, hãy ăn nhẹ 1 quả chuối chín hoặc 1 lát bánh mì sandwich quết mứt và uống 150ml nước ấm. Bổ sung chuối giúp cơ bắp có nguồn glucose hấp thu nhanh và cung cấp Kali chống co rút cơ.');
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    + Bữa ăn trước thi
                  </button>
                </div>
              </div>
            )}

            {/* Customization Options */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tùy Chọn Trích Xuất AI</span>
                <span className="text-[10px] text-slate-400">Điều chỉnh phong cách</span>
              </div>

              {/* Depth */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-semibold">Độ sâu tóm tắt:</label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDepth('quick')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      depth === 'quick'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ⚡ Siêu cô đọng
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepth('standard')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      depth === 'standard'
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🎯 Tiêu chuẩn
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepth('detailed')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      depth === 'detailed'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📚 Toàn diện
                  </button>
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-semibold">Góc nhìn tiếp nhận:</label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAudience('student')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      audience === 'student'
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🎒 Học sinh
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudience('teacher')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      audience === 'teacher'
                        ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📋 Giáo viên
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudience('athlete')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      audience === 'athlete'
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🏃 Vận động viên
                  </button>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunSummarize}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI Đang Phân Tích & Rút Ý Chính...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                    <span>Tóm Tắt & Trích Xuất Ý Chính Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Summarized Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!summaryResult && !isLoading && (
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/90 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-800">
                  Sẵn Sàng Tóm Tắt & Trích Xuất Dữ Liệu
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Chọn một tài liệu mẫu bên trái hoặc dán nội dung bất kỳ, sau đó nhấn nút <strong>"Tóm Tắt & Trích Xuất Ý Chính Ngay"</strong> để xem kết quả phân tích trực quan.
                </p>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('preset');
                    setSelectedPresetId('doc_run_1500');
                    handleRunSummarize();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-indigo-900 mb-1">
                    <span>🏃 Kỹ thuật chạy 1500m</span>
                    <ArrowRight className="w-3 h-3 text-indigo-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500">Trích xuất kỹ thuật nhịp thở 2-2 và chống xóc hông.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputMode('preset');
                    setSelectedPresetId('doc_height_growth');
                    handleRunSummarize();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-indigo-900 mb-1">
                    <span>📏 Tăng chiều cao dậy thì</span>
                    <ArrowRight className="w-3 h-3 text-indigo-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500">Khoa học dinh dưỡng Canxi + D3 + K2 & khung giờ GH.</p>
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200/90 text-center space-y-5">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-500 fill-current animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-800">
                  AI Đang Bóc Tách & Cô Đọng Dữ Liệu
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Trích xuất các luận điểm quan trọng, tổng hợp các bước hành động thực tiễn và thiết kế câu hỏi ôn tập nhanh cho học sinh...
                </p>
              </div>
            </div>
          )}

          {summaryResult && !isLoading && (
            <div className="space-y-6">
              {/* Result Container */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/90 space-y-6">
                {/* Result Title & Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                        Kết Quả Phân Tích AI
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        MindX Function #03
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {summaryResult.title}
                    </h2>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <button
                      onClick={toggleSpeech}
                      title={isSpeaking ? 'Dừng đọc' : 'Nghe đọc tóm tắt (TTS)'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSpeaking
                          ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Dừng đọc</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Nghe đọc</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCopyFull}
                      title="Sao chép toàn bộ"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all text-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleSaveToNotebook}
                      title="Lưu vào Sổ tay Ghi nhớ"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-amber-600 border border-slate-200 transition-all text-xs"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={handleDownloadTxt}
                      title="Tải file văn bản (.txt)"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Performance & Compression Analytics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Độ Cô Đọng
                    </span>
                    <span className="text-base font-black text-indigo-700">
                      Rút gọn {summaryResult.compressionPercentage}%
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Thời Gian Đọc
                    </span>
                    <span className="text-base font-black text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{summaryResult.readingTimeMinutes} phút
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Từ Gốc / Sau Tóm Tắt
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {summaryResult.originalWordCount} ➔ <strong className="text-indigo-600">{summaryResult.condensedWordCount} từ</strong>
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Ý Chính Rút Ra
                    </span>
                    <span className="text-base font-black text-emerald-600">
                      {summaryResult.keyPoints.length} Luận điểm
                    </span>
                  </div>
                </div>

                {/* Section 1: Executive Summary / Quick Digest */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-400 text-slate-950">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wide">
                      Tóm Tắt Nhanh (Quick Digest)
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                    {summaryResult.quickDigest}
                  </p>
                </div>

                {/* Section 2: Core Key Points */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Các Luận Điểm Cốt Lõi (Key Takeaways)</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      {summaryResult.keyPoints.length} điểm chính
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {summaryResult.keyPoints.map((kp, idx) => {
                      const tagColors: Record<string, string> = {
                        'Cốt lõi': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                        'Kỹ thuật': 'bg-blue-100 text-blue-800 border-blue-200',
                        'An toàn': 'bg-rose-100 text-rose-800 border-rose-200',
                        'Dinh dưỡng': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                        'Mẹo nhớ': 'bg-amber-100 text-amber-800 border-amber-200',
                        'Chiến thuật': 'bg-purple-100 text-purple-800 border-purple-200',
                      };

                      return (
                        <div
                          key={kp.id || idx}
                          className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 transition-all space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {kp.title}
                              </h4>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                                tagColors[kp.tag] || 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {kp.tag}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed pl-7">
                            {kp.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Actionable Checklist */}
                {summaryResult.actionItems && summaryResult.actionItems.length > 0 && (
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-emerald-600" />
                        <span>Các Bước Hành Động Cụ Thể (Action Checklist)</span>
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        {Object.values(checkedActions).filter(Boolean).length}/{summaryResult.actionItems.length} đã hoàn thành
                      </span>
                    </div>

                    <div className="space-y-2">
                      {summaryResult.actionItems.map((act, idx) => {
                        const isDone = !!checkedActions[act.id || idx];
                        return (
                          <div
                            key={act.id || idx}
                            onClick={() =>
                              setCheckedActions(prev => ({
                                ...prev,
                                [act.id || idx]: !prev[act.id || idx],
                              }))
                            }
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isDone
                                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/80 text-slate-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <div className="space-y-0.5">
                              <p className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                {act.step}
                              </p>
                              {act.tip && (
                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <span className="text-amber-500">💡</span>
                                  <span>{act.tip}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section 4: Self-Check Flashcard Quiz */}
                {summaryResult.quizQuestions && summaryResult.quizQuestions.length > 0 && (
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span>Câu Hỏi Tự Kiểm Tra Nhanh (Flashcards)</span>
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Bấm để xem lời giải
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {summaryResult.quizQuestions.map((q, idx) => {
                        const isRevealed = !!revealedQuiz[q.id || idx];
                        return (
                          <div
                            key={q.id || idx}
                            className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-900 text-[10px] font-bold shrink-0 mt-0.5">
                                  HỎI {idx + 1}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                  {q.question}
                                </h4>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedQuiz(prev => ({
                                    ...prev,
                                    [q.id || idx]: !prev[q.id || idx],
                                  }))
                                }
                                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 shrink-0 flex items-center gap-0.5 bg-white px-2 py-1 rounded-lg border border-indigo-200"
                              >
                                {isRevealed ? 'Ẩn đáp án' : 'Xem đáp án'}
                                {isRevealed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>

                            {q.hint && !isRevealed && (
                              <p className="text-[11px] text-slate-500 italic pl-8">
                                💬 Gợi ý: {q.hint}
                              </p>
                            )}

                            {isRevealed && (
                              <div className="mt-2 p-2.5 rounded-xl bg-white border border-indigo-200 text-xs text-slate-800 space-y-1 animate-in fade-in duration-200">
                                <span className="font-bold text-emerald-700 text-[11px] block">
                                  ✔ Đáp án chuẩn:
                                </span>
                                <p className="leading-relaxed">{q.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section 5: Student Takeaway Motivational Banner */}
                {summaryResult.studentTakeaway && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-center space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Thông Điệp Rèn Luyện Học Sinh
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 italic">
                      {summaryResult.studentTakeaway}
                    </p>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {onOpenQuizPractice && (
                      <button
                        type="button"
                        onClick={() => onOpenQuizPractice(summaryResult.title)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Tạo Câu Hỏi Luyện Tập</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleExportToMaterialHub}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Xuất Vào Kho Vật Liệu Trường</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveToNotebook}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>Lưu Sổ Tay</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Thuật toán trích xuất tối ưu cho GDPT Thể chất
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sổ Tay Ghi Nhớ Modal (History) */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Sổ Tay Tóm Tắt & Ý Chính Đã Lưu ({savedSummaries.length})
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedSummaries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Bạn chưa lưu bản tóm tắt nào vào sổ tay.</p>
                  <p className="text-[11px] text-slate-400">
                    Khi tóm tắt xong bất kỳ tài liệu nào, hãy bấm "Lưu Sổ Tay" để mở lại nhanh bất cứ lúc nào!
                  </p>
                </div>
              ) : (
                savedSummaries.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold shrink-0">
                          -{item.compressionPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.quickDigest}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSummaryResult(item);
                          setShowHistoryModal(false);
                          showToast(`Đã mở lại tóm tắt: "${item.title}"`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                      >
                        Xem Lại
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSavedSummaries(prev => prev.filter((_, i) => i !== idx));
                          showToast('Đã xóa khỏi sổ tay');
                        }}
                        className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-500"
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
              <span className="text-slate-400">Dữ liệu được lưu trong trình duyệt học sinh</span>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
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
