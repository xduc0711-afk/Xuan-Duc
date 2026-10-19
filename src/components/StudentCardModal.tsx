import { useState, useRef } from 'react';
import { StudentVisualCard } from '../types';
import { X, Heart, Copy, Check, Sparkles, Share2, Download, ArrowRight } from 'lucide-react';

interface StudentCardModalProps {
  card: StudentVisualCard | null;
  onClose: () => void;
  onLike: (cardId: string) => void;
  liked: boolean;
  onNavigateToExercise?: () => void;
}

const POSTER_THEMES = [
  { id: 'original', name: 'Mặc định', gradient: 'from-amber-500 via-orange-500 to-rose-500', textLight: true },
  { id: 'mint', name: 'Xanh Lá Tươi Mát', gradient: 'from-emerald-500 via-teal-600 to-cyan-600', textLight: true },
  { id: 'neon', name: 'Tím Gen Z', gradient: 'from-violet-600 via-purple-600 to-fuchsia-600', textLight: true },
  { id: 'sky', name: 'Xanh Nắng Ban Mai', gradient: 'from-sky-400 via-blue-500 to-indigo-600', textLight: true },
  { id: 'clean', name: 'Trắng Tinh Khôi', gradient: 'from-slate-900 via-slate-800 to-slate-900', textLight: true },
];

export default function StudentCardModal({
  card,
  onClose,
  onLike,
  liked,
  onNavigateToExercise,
}: StudentCardModalProps) {
  const [activeTheme, setActiveTheme] = useState(POSTER_THEMES[0]);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  if (!card) return null;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`${card.catchphrase}\n👉 ${card.tagline}\n${card.studentQuote}\n(Trích từ EduFit - Thể Dục Học Đường)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCard = () => {
    // Friendly simulated download / export for students
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const currentGradient = activeTheme.id === 'original' ? card.gradient : activeTheme.gradient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Thẻ Ảnh Chữ Truyền Động Lực Học Đường
              </h3>
              <p className="text-xs text-slate-500">Mẹo vui thể chất ngắn gọn, dễ nhớ, dễ áp dụng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Theme Palette Picker */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Chọn màu nền thẻ poster:
            </span>
            <div className="flex items-center gap-1.5">
              {POSTER_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t)}
                  title={t.name}
                  className={`w-6 h-6 rounded-full bg-gradient-to-tr ${t.gradient} transition-transform ${
                    activeTheme.id === t.id ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* MAIN VISUAL POSTER ("ẢNH CHỮ") */}
          <div
            ref={posterRef}
            className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${currentGradient} text-white shadow-xl overflow-hidden transition-all duration-300`}
          >
            {/* Background Decorative Rings */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Badge & Topic */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md border border-white/30 tracking-wide uppercase">
                  {card.topicLabel}
                </span>
                <span className="text-xs font-medium text-white/80 bg-black/20 px-2.5 py-0.5 rounded-full">
                  #HocSinhKhoeDep
                </span>
              </div>

              {/* BOLD CATCHPHRASE (Typography Display) */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase drop-shadow-sm font-heading">
                  {card.catchphrase}
                </h2>
                <p className="text-base sm:text-lg font-semibold text-white/90">
                  ✨ {card.tagline}
                </p>
              </div>

              {/* Student Motto / Relatable Quote */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-xs sm:text-sm italic font-medium leading-relaxed">
                {card.studentQuote}
              </div>

              {/* 3 Step Action Blueprint */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  <span>📌 3 Bước Thực Hành Nhanh:</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm font-medium">
                  {card.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-black/15 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                      <span className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug text-white/95">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watermark Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-white/20 text-[11px] text-white/70">
                <span>Cẩm nang thể chất lứa tuổi học sinh</span>
                <span className="font-bold tracking-wider text-white">EduFit Học Đường</span>
              </div>
            </div>
          </div>

          {/* Action Bar (Like, Copy, Download, Practice) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLike(card.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  liked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{card.likesCount + (liked ? 1 : 0)} Thả tim</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã chép câu nói!' : 'Chép khẩu hiệu'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCard}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {downloadSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                <span>{downloadSuccess ? 'Đã lưu thẻ!' : 'Lưu thẻ về máy'}</span>
              </button>

              {onNavigateToExercise && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToExercise();
                  }}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                >
                  <span>Tập luyện ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
