import { Activity, Dumbbell, Apple, Scale, CalendarCheck2, Bot, Droplets, Trophy, Sparkles, Package, GraduationCap, MessageSquarePlus, CheckCircle2, History } from 'lucide-react';

interface NavbarProps {
  currentTab: 'exercises' | 'nutrition' | 'bmi' | 'tracker' | 'student_zone' | 'materials' | 'summarizer' | 'quiz_practice' | 'qa_seeds' | 'quiz_mode' | 'grounded_chat' | 'study_pack';
  onTabChange: (tab: 'exercises' | 'nutrition' | 'bmi' | 'tracker' | 'student_zone' | 'materials' | 'summarizer' | 'quiz_practice' | 'qa_seeds' | 'quiz_mode' | 'grounded_chat' | 'study_pack') => void;
  onOpenAiCoach: () => void;
  waterGlasses: number;
  streakDays: number;
}

export default function Navbar({
  currentTab,
  onTabChange,
  onOpenAiCoach,
  waterGlasses,
  streakDays,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand & School PE Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('exercises')}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
                  Edu<span className="text-emerald-600">Fit</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Thể Dục Học Đường
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Rèn luyện thể chất chuẩn mực & Dinh dưỡng lứa tuổi học sinh
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              id="nav-tab-exercises"
              onClick={() => onTabChange('exercises')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'exercises'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              Động Tác & Bài Tập
            </button>
            <button
              id="nav-tab-nutrition"
              onClick={() => onTabChange('nutrition')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'nutrition'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Apple className="w-4 h-4" />
              Dinh Dưỡng Lành Mạnh
            </button>
            <button
              id="nav-tab-bmi"
              onClick={() => onTabChange('bmi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'bmi'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Scale className="w-4 h-4" />
              Chỉ Số Thể Lực (BMI)
            </button>
            <button
              id="nav-tab-tracker"
              onClick={() => onTabChange('tracker')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'tracker'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" />
              Nhật Ký & Thử Thách
            </button>
            <button
              id="nav-tab-student-zone"
              onClick={() => onTabChange('student_zone')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'student_zone'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
              Góc Học Trò
            </button>
            <button
              id="nav-tab-materials"
              onClick={() => onTabChange('materials')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'materials'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Package className="w-4 h-4" />
              Kho Vật Liệu
            </button>
            <button
              id="nav-tab-summarizer"
              onClick={() => onTabChange('summarizer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'summarizer'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xs'
                  : 'text-indigo-700 hover:text-indigo-950 hover:bg-indigo-50/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
              <span>Tóm Tắt AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black tracking-tight leading-none">
                #03
              </span>
            </button>
            <button
              id="nav-tab-quiz-practice"
              onClick={() => onTabChange('quiz_practice')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'quiz_practice'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50/80'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Luyện Câu Hỏi</span>
            </button>
            <button
              id="nav-tab-qa-seeds"
              onClick={() => onTabChange('qa_seeds')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'qa_seeds'
                  ? 'bg-gradient-to-r from-slate-900 to-teal-950 text-white shadow-xs border border-teal-500/40'
                  : 'text-slate-700 hover:text-teal-900 hover:bg-teal-50/80'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-teal-500" />
              <span>Q&A Seed</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500 text-slate-950 font-black tracking-tight leading-none">
                #04
              </span>
            </button>
            <button
              id="nav-tab-quiz-mode"
              onClick={() => onTabChange('quiz_mode')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'quiz_mode'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs ring-1 ring-teal-400'
                  : 'text-teal-900 hover:text-emerald-950 hover:bg-teal-50/80 font-bold'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Quiz Mode</span>
            </button>
            <button
              id="nav-tab-grounded-chat"
              onClick={() => onTabChange('grounded_chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'grounded_chat'
                  ? 'bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-xs border border-indigo-500/50'
                  : 'text-indigo-800 hover:text-indigo-950 hover:bg-indigo-50/80 font-bold'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Chatbot Ôn Bài</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black tracking-tight leading-none">
                #05
              </span>
            </button>
            <button
              id="nav-tab-study-pack"
              onClick={() => onTabChange('study_pack')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'study_pack'
                  ? 'bg-gradient-to-r from-slate-900 to-teal-950 text-white shadow-xs ring-1 ring-teal-400'
                  : 'text-slate-800 hover:text-teal-950 hover:bg-teal-50/80 font-bold'
              }`}
            >
              <History className="w-4 h-4 text-teal-500" />
              <span>Study Pack</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500 text-slate-950 font-black tracking-tight leading-none">
                #06
              </span>
            </button>
          </nav>

          {/* Right Action & Quick Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Water Status */}
            <div
              onClick={() => onTabChange('tracker')}
              title="Nhật ký uống nước hôm nay"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100/80 text-sky-700 rounded-xl text-xs font-semibold cursor-pointer border border-sky-200/70 transition-colors"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-500 fill-sky-400" />
              <span>{waterGlasses}/8 ly</span>
            </div>

            {/* Streak */}
            <div
              onClick={() => onTabChange('tracker')}
              title="Số ngày rèn luyện liên tục"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold border border-amber-200/70"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{streakDays} ngày</span>
            </div>

            {/* AI Teacher Coach Button */}
            <button
              id="btn-open-ai-coach"
              onClick={onOpenAiCoach}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs md:text-sm font-semibold shadow-sm shadow-emerald-600/25 transition-all active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Thầy/Cô Thể Dục AI</span>
              <span className="sm:hidden">Hỏi AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-200/60 bg-slate-50/95 px-2 py-1.5 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max gap-1">
          <button
            onClick={() => onTabChange('exercises')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              currentTab === 'exercises' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Động Tác
          </button>
          <button
            onClick={() => onTabChange('nutrition')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              currentTab === 'nutrition' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            Dinh Dưỡng
          </button>
          <button
            onClick={() => onTabChange('bmi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              currentTab === 'bmi' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Thể Lực BMI
          </button>
          <button
            onClick={() => onTabChange('tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              currentTab === 'tracker' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            Nhật Ký
          </button>
          <button
            onClick={() => onTabChange('student_zone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              currentTab === 'student_zone' ? 'bg-amber-500 text-white font-semibold' : 'text-amber-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Góc Học Trò
          </button>
          <button
            onClick={() => onTabChange('materials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              currentTab === 'materials' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Kho Vật Liệu
          </button>
          <button
            onClick={() => onTabChange('summarizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'summarizer'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-indigo-700 bg-indigo-50/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
            Tóm Tắt #03
          </button>
          <button
            onClick={() => onTabChange('quiz_practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'quiz_practice'
                ? 'bg-teal-600 text-white font-bold'
                : 'text-teal-800 bg-teal-50/80'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            Luyện Câu Hỏi
          </button>
          <button
            onClick={() => onTabChange('qa_seeds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'qa_seeds'
                ? 'bg-slate-900 text-teal-300 font-bold border border-teal-500/50'
                : 'text-slate-700 bg-slate-100'
            }`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-teal-500" />
            Q&A Seed #04
          </button>
          <button
            onClick={() => onTabChange('quiz_mode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'quiz_mode'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-800 bg-emerald-50/80 font-semibold'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Quiz Mode
          </button>
          <button
            onClick={() => onTabChange('grounded_chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'grounded_chat'
                ? 'bg-indigo-700 text-white font-bold'
                : 'text-indigo-800 bg-indigo-50/80 font-semibold'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            Chatbot #05
          </button>
          <button
            onClick={() => onTabChange('study_pack')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'study_pack'
                ? 'bg-slate-900 text-teal-300 font-bold border border-teal-500/50'
                : 'text-slate-800 bg-teal-50 font-semibold'
            }`}
          >
            <History className="w-3.5 h-3.5 text-teal-500" />
            Study Pack #06
          </button>
        </div>
      </div>
    </header>
  );
}
