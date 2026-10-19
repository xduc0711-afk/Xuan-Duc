import { useState, useEffect } from 'react';
import {
  Sparkles,
  History,
  Layers,
  FileText,
  RotateCw,
  Trash2,
  CheckCircle2,
  Eye,
  Key,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Clock,
  HelpCircle,
  Award,
  AlertCircle,
  Copy,
  Plus,
  GitCompare,
  GraduationCap,
  MessageSquarePlus,
  Check,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  StudyPackVersion,
  StudyPackSourceDoc,
  PracticeQuestion,
  FlashcardItem,
  QaSeedPair
} from '../types';

const STORAGE_VERSIONS_KEY = 'edufit_study_pack_versions_v1';

// Initial curated source document (Preserved untouched across all versions)
const DEFAULT_SOURCE_DOC: StudyPackSourceDoc = {
  id: 'src_pe_1500m_original',
  title: 'Bài 3: Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở',
  topic: 'Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở',
  grade: 'Lớp 8',
  subject: 'Giáo dục Thể chất',
  referenceTag: 'SGK Giáo dục Thể chất 8 - Cánh Diều & Kết Nối Tri Thức',
  content: `Chạy cự ly trung bình (800m - 1500m) đòi hỏi sự phối hợp chặt chẽ giữa sức bền chung và kỹ thuật hô hấp điều hòa.
1. Kỹ thuật xuất phát: Sử dụng xuất phát cao với 2 khẩu lệnh "Vào chỗ" và "Chạy". Sau khi có lệnh chạy, nhanh chóng tăng tốc ở 20-30m đầu để chiếm vị trí thuận lợi ở đường chạy phía trong (đường chạy số 1).
2. Chạy giữa quãng: Duy trì tần số bước và độ dài bước hợp lý, thân người hơi ngả về trước khoảng 4-5 độ. Hai tay gập ở khớp khuỷu khoảng 90 độ, đánh nhịp nhàng so le với bước chạy, thả lỏng vai và cổ.
3. Kỹ thuật đặt bàn chân: Tiếp đất bằng nửa trước bàn chân (ức bàn chân) hoặc phần giữa bàn chân rồi miết êm, hơi chùng nhẹ khớp gối để giảm chấn động dội lên cột sống và khớp gối. Tránh nện thẳng gót chân xuống mặt đường.
4. Nhịp thở tối ưu: Kết hợp 2 bước hít vào sâu bằng mũi - 2 bước thở mạnh ra bằng miệng (nhịp 2-2). Thở sâu bằng cơ hoành giúp tống khí cặn CO2.
5. Phòng chống xóc hông: Xóc hông xảy ra do co thắt cơ hoành khi hít thở nông hoặc ăn uống quá no trước giờ chạy. Xử lý: giảm tốc độ, hít sâu bằng mũi, thở dốc mạnh bằng miệng, ấn nhẹ tay vào vùng sườn đau kết hợp cúi nhẹ thân người khi thở ra.
6. Hồi tĩnh sau khi về đích: Về đích tuyệt đối không được ngồi bệt hoặc nằm ngay xuống đất vì dễ gây tụt huyết áp đột ngột và ngất xỉu. Phải đi bộ nhẹ nhàng 3-5 phút và vung tay thả lỏng.`
};

// Initial version (v1 - Bản gốc ban đầu)
const INITIAL_VERSION_V1: StudyPackVersion = {
  id: 'spv_1_original_base',
  versionNumber: 1,
  versionTag: 'v1',
  versionNote: 'Bản gốc khởi tạo ban đầu từ SGK Giáo dục Thể chất 8',
  createdAt: '2026-10-12T04:00:00.000Z',
  sourceDoc: { ...DEFAULT_SOURCE_DOC },
  summary: {
    overview: 'Kỹ thuật chạy 1500m yêu cầu phân phối sức đều ở 75-80% khả năng, phối hợp nhịp thở 2-2 và hồi tĩnh tích cực.',
    keyPoints: [
      'Xuất phát cao chiếm đường chạy số 1 trong 30m đầu.',
      'Duy trì nhịp thở 2 bước hít bằng mũi - 2 bước thở mạnh bằng miệng.',
      'Tiếp đất bằng nửa trước hoặc giữa bàn chân để bảo vệ khớp gối.',
      'Sau khi về đích phải đi bộ thả lỏng 3-5 phút, cấm ngồi bệt ngay.'
    ],
    keyTerms: [
      { term: 'Nhịp thở 2-2', definition: '2 bước chân hít sâu bằng mũi, 2 bước chân thở mạnh qua miệng.' },
      { term: 'Xóc hông', definition: 'Cơn đau nhói ở vùng sườn do cơ hoành bị co thắt cục bộ vì thiếu oxy hoặc dạ dày co bóp.' },
      { term: 'Hồi tĩnh', definition: 'Quá trình đi bộ thả lỏng, hít thở sâu để đưa nhịp tim và tuần hoàn máu về trạng thái bình thường.' }
    ],
    commonErrors: [
      'Dốc toàn bộ sức chạy quá nhanh ngay từ vòng 1 dẫn đến kiệt sức sớm do tích tụ acid lactic.',
      'Nện mạnh gót chân xuống mặt đường gây đau nhức cẳng chân và khớp gối.',
      'Ngồi bệt hoặc nằm ngay xuống đất sau khi vừa chạm vạch đích.'
    ],
    actionableTips: [
      'Giữ nhịp thở đều đặn ngay từ những mét đầu tiên, không đợi mệt mới thở dốc.',
      'Khi bị xóc hông: giảm tốc độ, hít sâu bằng mũi rồi thở dốc mạnh bằng miệng.'
    ]
  },
  quiz: [
    {
      id: 'q1_v1',
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
      explanation: 'Nhịp thở 2-2 giúp cung cấp đủ oxy cho cơ thể và ngăn ngừa co thắt cơ hoành (xóc hông).',
      studyTip: 'Ghi nhớ: "2 hít mũi - 2 thở miệng" theo nhịp bước chân.',
      curriculumReference: 'SGK Giáo dục Thể chất 8 - Bài 3'
    },
    {
      id: 'q2_v1',
      type: 'true_false',
      typeLabelVi: 'Đúng / Sai',
      question: 'Sau khi chạy qua vạch đích 1500m, học sinh nên ngồi bệt hoặc nằm ngay xuống đất để cơ thể nghỉ ngơi nhanh nhất.',
      correctBoolean: false,
      explanation: 'SAI. Khi vừa dừng chạy, máu đang dồn nhiều ở chi dưới. Nếu ngồi bệt ngay, máu chưa kịp hồi lưu về não dễ gây tụt huyết áp và ngất xỉu.',
      studyTip: 'Quy tắc hồi tĩnh: Luôn đi bộ thả lỏng sau khi về đích.',
      curriculumReference: 'Nguyên tắc an toàn và hồi phục'
    }
  ],
  flashcards: [
    {
      id: 'fc_v1_1',
      frontTitle: 'Nhịp thở 2-2 trong chạy bền',
      frontSubtitle: 'Kỹ thuật thông khí phế nang',
      frontCategoryTag: 'Hô hấp thể lực',
      backDefinition: '2 bước chân hít sâu bằng mũi (phồng cơ hoành) kết hợp 2 bước chân thở mạnh qua miệng để tống sạch khí cặn CO2.',
      backClassification: 'LOẠI: Kỹ thuật điều hòa nhịp tim và tuần hoàn',
      backExample: 'Chạy nhịp bước chân: Trái - Phải (hít) / Trái - Phải (thở).',
      backMemoryTip: '2 mũi vào - 2 miệng ra, không hụt hơi!'
    },
    {
      id: 'fc_v1_2',
      frontTitle: 'Hiện tượng Xóc hông',
      frontSubtitle: 'Cơ chế và cách xử lý nhanh',
      frontCategoryTag: 'Triệu chứng sinh lý',
      backDefinition: 'Co thắt đột ngột của cơ hoành do thiếu oxy hoặc do dạ dày còn no nước/thức ăn khi vận động mạnh.',
      backClassification: 'LOẠI: Rối loạn co thắt cơ hô hấp tạm thời',
      backExample: 'Đang chạy thấy đau buốt nhói bên sườn phải: Giảm tốc độ, hít sâu bằng mũi và thở mạnh bằng miệng.',
      backMemoryTip: 'Giảm tốc độ + Thở sâu bằng miệng để giải phóng cơ hoành!'
    }
  ],
  qaSeeds: [
    {
      id: 'seed_v1_1',
      studentQuestion: 'Tại sao khi chạy được 1-2 vòng sân em hay bị đau nhói buốt ở một bên sườn phải?',
      intentCategory: 'symptom_safety',
      intentLabelVi: 'Triệu chứng & An toàn',
      shortAnswer: 'Đây là hiện tượng xóc hông do cơ hoành bị co thắt vì hít thở nông hoặc do ăn uống quá no trước giờ chạy. Em hãy giảm tốc độ, hít sâu bằng mũi rồi thở dốc mạnh bằng miệng.',
      keywords: ['xóc hông', 'đau nhói sườn', 'nhịp thở', 'cơ hoành']
    },
    {
      id: 'seed_v1_2',
      studentQuestion: 'Em có nên dốc toàn bộ sức chạy thật nhanh ngay từ vạch xuất phát để dẫn đầu đoàn chạy không?',
      intentCategory: 'exam_tip',
      intentLabelVi: 'Mẹo thi thực hành',
      shortAnswer: 'Không nên. Bứt tốc quá sớm sẽ khiến cơ bắp tích tụ nhiều acid lactic gây căng cứng cơ và kiệt sức nhanh. Em nên duy trì tốc độ đều ở 75-80% sức và chỉ dồn sức nước rút ở 150m cuối.',
      keywords: ['xuất phát', 'phân phối sức', 'nước rút']
    }
  ]
};

interface StudyPackVersionHubProps {
  onNavigateToQuizMode?: (quiz: any) => void;
  onNavigateToChatbot?: () => void;
  onNavigateToExercises?: () => void;
}

export default function StudyPackVersionHub({
  onNavigateToQuizMode,
  onNavigateToChatbot
}: StudyPackVersionHubProps) {
  // 1. Persistent versions list
  const [versionList, setVersionList] = useState<StudyPackVersion[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_VERSIONS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading study pack versions', e);
      }
    }
    return [INITIAL_VERSION_V1];
  });

  // 2. Active selected version (the one currently displayed / studied)
  const [activeVersionId, setActiveVersionId] = useState<string>(() => {
    return versionList[0]?.id || INITIAL_VERSION_V1.id;
  });

  // Current active version object
  const currentVersion = versionList.find(v => v.id === activeVersionId) || versionList[0] || INITIAL_VERSION_V1;

  // 3. Tab viewer inside the study pack: summary vs quiz vs flashcards vs qaSeeds vs sourceDoc
  const [activeViewerTab, setActiveViewerTab] = useState<'summary' | 'quiz' | 'flashcards' | 'qaSeeds' | 'sourceDoc'>('summary');

  // 4. Re-generation state (PROMPT 05)
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 5. Serverless Proxy Architecture & Live Testing (Bảo mật 100% - Không lưu key local)
  const [showProxyModal, setShowProxyModal] = useState<boolean>(false);
  const [proxyTestInput, setProxyTestInput] = useState<string>('Giải thích ngắn gọn lợi ích của việc chạy bền 1500m đối với hệ tuần hoàn của học sinh');
  const [proxyTestResult, setProxyTestResult] = useState<string | null>(null);
  const [isTestingProxy, setIsTestingProxy] = useState<boolean>(false);

  // 6. Version Compare Modal (PROMPT 06)
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);

  // Sync versions list to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VERSIONS_KEY, JSON.stringify(versionList));
    } catch (e) {
      console.error(e);
    }
  }, [versionList]);

  // Đảm bảo dọn dẹp sạch key local cũ nếu từng tồn tại trong browser
  useEffect(() => {
    try {
      localStorage.removeItem('edufit_local_gemini_key_v1');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // HANDLER: Re-generate Entire Study Pack (Gọi qua Serverless Proxy an toàn)
  const handleRegenerateStudyPack = async () => {
    setIsRegenerating(true);
    const nextVerNumber = versionList.length + 1;
    const baseSourceDoc = currentVersion.sourceDoc || DEFAULT_SOURCE_DOC;

    try {
      // Gọi qua Serverless Proxy: API key được bảo vệ hoàn toàn trên Server
      const res = await fetch('/api/ai/studypack/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // CRITICAL: Original source doc passed without alteration!
          sourceDoc: baseSourceDoc,
          versionNumber: nextVerNumber,
          versionNote: `Re-generated bởi Gemini AI (${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})`
        })
      });

      const data = await res.json();

      if (data.version) {
        const newVer: StudyPackVersion = data.version;
        // Append as newest version
        setVersionList(prev => [newVer, ...prev]);
        setActiveVersionId(newVer.id);
        showToast(`✨ Đã re-generate thành công Version ${newVer.versionTag} với toàn bộ Summary, Quiz, Flashcards, Q&A mới!`);
      } else {
        showToast(data.error || 'Lỗi khi re-generate study pack');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Lỗi máy chủ: ' + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  // HANDLER: Delete an unnecessary version (PROMPT 06)
  const handleDeleteVersion = (versionId: string) => {
    if (versionList.length <= 1) {
      showToast('Không thể xóa version duy nhất còn lại.');
      return;
    }
    const targetVer = versionList.find(v => v.id === versionId);
    if (!targetVer) return;

    if (confirm(`Bạn có chắc muốn xóa Version ${targetVer.versionTag} (${targetVer.versionNote}) không?`)) {
      const updated = versionList.filter(v => v.id !== versionId);
      setVersionList(updated);
      if (activeVersionId === versionId) {
        setActiveVersionId(updated[0].id);
      }
      showToast(`Đã xóa Version ${targetVer.versionTag}`);
    }
  };

  // Compare version helper
  const compareVersion = compareVersionId ? versionList.find(v => v.id === compareVersionId) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Matches Function #05 & #06 style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-400 text-slate-950 uppercase tracking-wider shadow-sm">
                LOẠI: FUNCTION #06
              </span>
              <span className="text-xs text-teal-200 font-semibold px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-700/50">
                Re-Generate & Quản Lý Versions
              </span>
              <span className="text-xs text-amber-300 font-medium px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/40">
                Bảo toàn 100% nguồn học liệu gốc
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Quản Lý Version & Re-Generate Toàn Bộ Study Pack
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tái tạo (re-generate) toàn bộ gói học tập bao gồm <strong>Summary, Quiz, Flashcard, Q&A</strong> từ tài liệu học liệu gốc ban đầu, tạo thành các version mới mà <strong>không làm mất nguồn gốc ban đầu</strong>.
            </p>
          </div>

          {/* Action Buttons: Re-generate and Key Configuration */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRegenerateStudyPack}
              disabled={isRegenerating}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Đang Re-generate Study Pack...' : '⚡ Re-generate Study Pack Mới'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProxyModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all border border-emerald-500/40"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bảo Mật: Serverless Proxy (Chi Tiết)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column: Version Management (4 cols) & Right Column: Study Pack Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Version Management List (PROMPT 06) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Danh Sách Version ({versionList.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Biết rõ cũ / mới</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mỗi lần re-generate sẽ tạo ra một version riêng biệt. Bạn có thể mở lại version cũ để so sánh hoặc học tiếp bất cứ lúc nào.
            </p>

            {/* Version List Cards */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {versionList.map((ver, idx) => {
                const isActive = ver.id === activeVersionId;
                const isNewest = idx === 0;
                const isOriginal = ver.versionNumber === 1;

                return (
                  <div
                    key={ver.id || idx}
                    className={`p-3.5 rounded-2xl border transition-all text-xs space-y-2 ${
                      isActive
                        ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-400 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    {/* Top Row: Tag, Badge, Actions */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md font-mono font-black text-xs bg-slate-900 text-teal-300">
                          {ver.versionTag}
                        </span>

                        {isNewest && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Mới nhất
                          </span>
                        )}

                        {isOriginal && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Gốc SGK
                          </span>
                        )}

                        {isActive && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Small Actions: Compare & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCompareVersionId(ver.id)}
                          title="So sánh với version khác"
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>

                        {versionList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteVersion(ver.id)}
                            title="Xóa version này"
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Note & Time */}
                    <p className="text-[11px] font-semibold text-slate-700 line-clamp-1">
                      {ver.versionNote}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>{new Date(ver.createdAt).toLocaleString('vi-VN')}</span>
                      <span>
                        {ver.summary.keyPoints.length} ý • {ver.quiz.length} quiz • {ver.flashcards.length} thẻ
                      </span>
                    </div>

                    {/* Button to Activate this version if not active */}
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVersionId(ver.id);
                          showToast(`Đã kích hoạt học tiếp Version ${ver.versionTag}!`);
                        }}
                        className="w-full mt-1 py-1.5 px-2 rounded-xl bg-white hover:bg-teal-600 hover:text-white border border-slate-300 text-slate-700 font-bold text-[11px] transition-all text-center"
                      >
                        Mở Học Version Này
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source Document Guardian Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo Toàn Học Liệu Gốc Ban Đầu</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Mọi version đều được re-generate trực tiếp từ <strong>"{currentVersion.sourceDoc.title}"</strong>. Học liệu gốc không bao giờ bị xóa hay ghi đè.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Study Pack of the Selected Active Version (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            {/* Version Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-teal-300">
                    {currentVersion.versionTag}
                  </span>
                  <span className="text-xs font-bold text-teal-700">
                    {currentVersion.sourceDoc.grade} • {currentVersion.sourceDoc.subject}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tạo: {new Date(currentVersion.createdAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {currentVersion.sourceDoc.topic}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentVersion.versionNote}
                </p>
              </div>

              {/* Quick Actions to Study this Version */}
              <div className="flex items-center gap-2 shrink-0">
                {onNavigateToQuizMode && (
                  <button
                    type="button"
                    onClick={() => {
                      const quizSet = {
                        id: `quiz_from_${currentVersion.id}`,
                        topic: currentVersion.sourceDoc.topic,
                        grade: currentVersion.sourceDoc.grade,
                        subject: currentVersion.sourceDoc.subject,
                        questions: currentVersion.quiz,
                        createdAt: currentVersion.createdAt,
                        totalQuestions: currentVersion.quiz.length
                      };
                      onNavigateToQuizMode(quizSet);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Làm Quiz Mode</span>
                  </button>
                )}

                {onNavigateToChatbot && (
                  <button
                    type="button"
                    onClick={onNavigateToChatbot}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Ôn Với Chatbot</span>
                  </button>
                )}
              </div>
            </div>

            {/* Study Pack Content Component Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 overflow-x-auto pb-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveViewerTab('summary')}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeViewerTab === 'summary'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>1. Tóm Tắt AI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewerTab('quiz')}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeViewerTab === 'quiz'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Câu Hỏi Quiz ({currentVersion.quiz.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewerTab('flashcards')}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeViewerTab === 'flashcards'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Flashcard ({currentVersion.flashcards.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewerTab('qaSeeds')}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeViewerTab === 'qaSeeds'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>4. Q&A Seeds ({currentVersion.qaSeeds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewerTab('sourceDoc')}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto ${
                  activeViewerTab === 'sourceDoc'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Học Liệu Gốc</span>
              </button>
            </div>

            {/* TAB 1: SUMMARY */}
            {activeViewerTab === 'summary' && (
              <div className="space-y-4 text-xs sm:text-sm animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                  <span className="font-bold text-teal-950 block">Tổng Quan Trọng Tâm:</span>
                  <p className="text-teal-900 leading-relaxed font-medium">
                    {currentVersion.summary.overview}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Ý Chính Cốt Lõi:</span>
                  <ul className="space-y-1.5 text-slate-700 list-disc pl-5">
                    {currentVersion.summary.keyPoints.map((pt, i) => (
                      <li key={i} className="leading-relaxed">{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Key terms */}
                {currentVersion.summary.keyTerms.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">Thuật Ngữ Cốt Lõi:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentVersion.summary.keyTerms.map((term, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <strong className="text-teal-800 block text-xs">{term.term}</strong>
                          <span className="text-[11px] text-slate-600">{term.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: QUIZ QUESTIONS */}
            {activeViewerTab === 'quiz' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {currentVersion.quiz.map((q, i) => (
                  <div key={q.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900">
                        Câu {i + 1}: {q.typeLabelVi}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800 text-sm leading-snug">
                      {q.question}
                    </p>

                    {/* Options if multiple choice */}
                    {q.options && (
                      <div className="space-y-1 pl-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl text-xs ${
                              optIdx === q.correctOptionIndex
                                ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                                : 'text-slate-600'
                            }`}
                          >
                            {opt} {optIdx === q.correctOptionIndex ? '✔ (Đáp án đúng)' : ''}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                        💡 Giải thích: {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: FLASHCARDS */}
            {activeViewerTab === 'flashcards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                {currentVersion.flashcards.map((fc, i) => (
                  <div key={fc.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">
                        {fc.frontCategoryTag}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">#{i + 1}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{fc.frontTitle}</h4>
                    {fc.frontSubtitle && <p className="text-[11px] text-slate-500">{fc.frontSubtitle}</p>}

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed text-xs">
                      {fc.backDefinition}
                    </div>

                    {fc.backMemoryTip && (
                      <p className="text-[10px] text-amber-800 font-medium">
                        ⭐ Mẹo nhớ: {fc.backMemoryTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: Q&A SEEDS */}
            {activeViewerTab === 'qaSeeds' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {currentVersion.qaSeeds.map((seed, i) => (
                  <div key={seed.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                        {seed.intentLabelVi || 'Q&A Seed'}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-sm">
                      🙋 Học sinh hỏi: "{seed.studentQuestion}"
                    </p>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
                      <strong>Trả lời ngắn:</strong> {seed.shortAnswer}
                    </div>

                    {seed.keywords && (
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-500">
                        <span>Từ khóa:</span>
                        {seed.keywords.map((kw, kIdx) => (
                          <span key={kIdx} className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: SOURCE DOCUMENT (NGUỒN GỐC BAN ĐẦU KHÔNG THAY ĐỔI) */}
            {activeViewerTab === 'sourceDoc' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {currentVersion.sourceDoc.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Nguồn Học Liệu Gốc Bất Biến
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs font-sans">
                  {currentVersion.sourceDoc.content}
                </p>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  Tham chiếu: {currentVersion.sourceDoc.referenceTag}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VERSION COMPARISON MODAL (PROMPT 06) */}
      {compareVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  So Sánh Version {currentVersion.versionTag} vs Version {compareVersion.versionTag}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompareVersionId(null)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 text-xs">
              {/* Left Column: Current Version */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-800 bg-teal-200 px-2 py-0.5 rounded">
                    {currentVersion.versionTag} (Đang xem)
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(currentVersion.createdAt).toLocaleTimeString('vi-VN')}</span>
                </div>

                <div className="space-y-1">
                  <strong className="block text-slate-800">Tổng quan:</strong>
                  <p className="text-slate-600 leading-relaxed">{currentVersion.summary.overview}</p>
                </div>

                <div className="space-y-1">
                  <strong className="block text-slate-800">Ý chính ({currentVersion.summary.keyPoints.length}):</strong>
                  <ul className="list-disc pl-4 text-slate-600 space-y-1">
                    {currentVersion.summary.keyPoints.slice(0, 3).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-[11px] text-slate-500">
                  Câu hỏi Quiz: {currentVersion.quiz.length} | Flashcards: {currentVersion.flashcards.length}
                </div>
              </div>

              {/* Right Column: Compare Version */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                    {compareVersion.versionTag}
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(compareVersion.createdAt).toLocaleTimeString('vi-VN')}</span>
                </div>

                <div className="space-y-1">
                  <strong className="block text-slate-800">Tổng quan:</strong>
                  <p className="text-slate-600 leading-relaxed">{compareVersion.summary.overview}</p>
                </div>

                <div className="space-y-1">
                  <strong className="block text-slate-800">Ý chính ({compareVersion.summary.keyPoints.length}):</strong>
                  <ul className="list-disc pl-4 text-slate-600 space-y-1">
                    {compareVersion.summary.keyPoints.slice(0, 3).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-[11px] text-slate-500">
                  Câu hỏi Quiz: {compareVersion.quiz.length} | Flashcards: {compareVersion.flashcards.length}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveVersionId(compareVersion.id);
                    setCompareVersionId(null);
                    showToast(`Đã chuyển sang học Version ${compareVersion.versionTag}!`);
                  }}
                  className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Chọn Học Version Này
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCompareVersionId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Đóng So Sánh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVERLESS PROXY ARCHITECTURE MODAL (Bảo mật K12 cho Vercel / Netlify) */}
      {showProxyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Kiến Trúc Serverless Proxy An Toàn (Vercel / Netlify)
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Đã xóa bỏ hoàn toàn việc lưu API Key ở LocalStorage
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProxyModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Visual Architecture Comparison: Local Key vs Serverless Proxy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Cách Cũ (Không an toàn)</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p className="font-mono bg-rose-100/60 p-1 rounded text-[10px] text-rose-900">
                    Frontend &rarr; LocalStorage &rarr; Google API
                  </p>
                  <p>
                    Học sinh lưu API key vào trình duyệt. Người khác chỉ cần nhấn <strong>F12 &rarr; Application &rarr; LocalStorage</strong> là đánh cắp được toàn bộ API key!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Serverless Proxy (Chuẩn bảo mật)</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p className="font-mono bg-emerald-100/60 p-1 rounded text-[10px] text-emerald-900">
                    Frontend &rarr; /api/gemini &rarr; Google API
                  </p>
                  <p>
                    Frontend không có key. API key được cất bí mật trong <strong>Biến môi trường (Environment Variable)</strong> trên Server Vercel/Netlify.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Steps Guide Summary for K12 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                4 Bước Chuyển Đổi Nhanh Cho Học Sinh K12:
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-700 leading-relaxed">
                <li>
                  <strong>Xóa code lưu key:</strong> Xóa <code className="bg-slate-200 px-1 rounded text-rose-700">localStorage.setItem</code>, ô nhập key và state giữ key ở phía Frontend.
                </li>
                <li>
                  <strong>Tạo Proxy Function:</strong> Tạo file <code className="bg-slate-200 px-1 rounded text-indigo-700">api/gemini.ts</code> nhận yêu cầu POST, đọc <code className="bg-slate-200 px-1 rounded">process.env.GEMINI_API_KEY</code> và gọi AI.
                </li>
                <li>
                  <strong>Cấu hình Environment Variable:</strong> Thêm <code className="bg-slate-200 px-1 rounded text-emerald-800">GEMINI_API_KEY</code> vào Vercel / Netlify Dashboard (Settings &rarr; Environment Variables).
                </li>
                <li>
                  <strong>Đổi luồng fetch:</strong> Frontend chỉ gọi <code className="bg-slate-200 px-1 rounded text-teal-800">fetch('/api/gemini')</code> thay vì gọi trực tiếp sang Google API.
                </li>
              </ol>
            </div>

            {/* Live Proxy Tester */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Thử Nghiệm Gọi Proxy Trực Tiếp (/api/gemini)
                </span>
                <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-bold">
                  Zero Client Key
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  value={proxyTestInput}
                  onChange={e => setProxyTestInput(e.target.value)}
                  placeholder="Nhập câu hỏi thử nghiệm cho Gemini qua Proxy..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
                />

                <button
                  type="button"
                  disabled={isTestingProxy || !proxyTestInput.trim()}
                  onClick={async () => {
                    setIsTestingProxy(true);
                    setProxyTestResult(null);
                    try {
                      const res = await fetch('/api/gemini', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: proxyTestInput.trim() })
                      });
                      const data = await res.json();
                      if (data.text) {
                        setProxyTestResult(data.text);
                      } else if (data.error) {
                        setProxyTestResult('⚠️ ' + data.error);
                      } else {
                        setProxyTestResult(JSON.stringify(data, null, 2));
                      }
                    } catch (e: any) {
                      setProxyTestResult('Lỗi kết nối proxy: ' + e.message);
                    } finally {
                      setIsTestingProxy(false);
                    }
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isTestingProxy ? 'animate-spin' : ''}`} />
                  <span>{isTestingProxy ? 'Đang gọi qua Proxy...' : 'Bấm Để Thử Nghiệm Gọi Proxy /api/gemini'}</span>
                </button>
              </div>

              {proxyTestResult && (
                <div className="mt-2 p-3 bg-white rounded-xl border border-teal-200 text-xs text-slate-800 space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[10px] text-teal-700 font-bold border-b border-slate-100 pb-1">
                    <span>Kết quả trả về từ Serverless Proxy:</span>
                    <span>An toàn tuyệt đối</span>
                  </div>
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed font-sans text-[11px]">
                    {proxyTestResult}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowProxyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
              >
                Đã Hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
