import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Eye,
  Search,
  User,
  UserCheck,
  UserPlus,
  Shield,
  Tag,
  MapPin,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  Dumbbell,
  Apple,
  BookOpen,
  Calendar,
  Info,
  GraduationCap
} from 'lucide-react';
import { MaterialCategory, MaterialItem, UserAccount } from '../types';

const STORAGE_ACCOUNT_KEY = 'edufit_active_account_id';

const SAMPLE_IMAGE_PRESETS: { label: string; url: string; category: MaterialCategory }[] = [
  {
    label: 'Dây nhảy thể thao',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    category: 'equipment',
  },
  {
    label: 'Thảm tập thể dục',
    url: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80',
    category: 'equipment',
  },
  {
    label: 'Bóng rổ tiêu chuẩn',
    url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&q=80',
    category: 'equipment',
  },
  {
    label: 'Chuối & Hoa quả nạp Kali',
    url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    category: 'nutrition',
  },
  {
    label: 'Sữa tươi & Hạt dinh dưỡng',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    category: 'nutrition',
  },
  {
    label: 'Giáo án & Kỹ thuật chạy',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    category: 'guide',
  },
  {
    label: 'Rèn luyện cột sống & Yoga',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    category: 'practice',
  },
];

const AVATAR_EMOJI_OPTIONS = ['🎒', '🏆', '⭐', '🏃', '🥇', '⚽', '🧘', '🥦', '🎯', '🚴'];

interface MaterialHubProps {
  onSummarizeMaterial?: (material: MaterialItem) => void;
  onOpenQuizPractice?: (topic: string, grade?: string) => void;
}

export default function MaterialHub({ onSummarizeMaterial, onOpenQuizPractice }: MaterialHubProps = {}) {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [authorFilter, setAuthorFilter] = useState<'all' | 'mine'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [inspectingMaterial, setInspectingMaterial] = useState<MaterialItem | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<MaterialItem | null>(null);

  // Form State for Adding Material
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<MaterialCategory>('equipment');
  const [formDescription, setFormDescription] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formStatus, setFormStatus] = useState<'available' | 'in_use' | 'need_restock' | 'ready'>('available');
  const [formLocation, setFormLocation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [formTags, setFormTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Registering Account
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'coach' | 'parent'>('student');
  const [regGradeOrSchool, setRegGradeOrSchool] = useState('');
  const [regEmoji, setRegEmoji] = useState('🎒');
  const [isRegistering, setIsRegistering] = useState(false);

  // Show Toast Helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Fetch Accounts
  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const data = await res.json();
        const accs: UserAccount[] = data.accounts || [];
        setAccounts(accs);

        // Pick active account from localStorage or first
        const savedId = localStorage.getItem(STORAGE_ACCOUNT_KEY);
        const found = accs.find((a) => a.id === savedId) || accs[0] || null;
        setActiveAccount(found);
        if (found) {
          localStorage.setItem(STORAGE_ACCOUNT_KEY, found.id);
        }
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  };

  // 2. Fetch Materials
  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
      }
    } catch (err) {
      console.error('Failed to load materials:', err);
      showToast('Không thể tải danh sách vật liệu từ máy chủ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchMaterials();
  }, []);

  // Handle Switch Account
  const handleSelectAccount = (account: UserAccount) => {
    setActiveAccount(account);
    localStorage.setItem(STORAGE_ACCOUNT_KEY, account.id);
    setIsAccountModalOpen(false);
    showToast(`Đã chuyển sang tài khoản: ${account.fullName} (${account.roleNameVi})`, 'success');
  };

  // Handle Register New Account
  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regFullName.trim()) {
      showToast('Vui lòng nhập tên đăng nhập và họ tên đầy đủ', 'error');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await fetch('/api/accounts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername.trim(),
          fullName: regFullName.trim(),
          role: regRole,
          gradeOrSchool: regGradeOrSchool.trim() || 'Học sinh',
          avatarEmoji: regEmoji,
          avatarColor: regRole === 'teacher' ? 'blue' : 'emerald',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký không thành công');
      }

      showToast(data.message || 'Tạo tài khoản mới thành công!', 'success');
      await fetchAccounts();
      if (data.account) {
        handleSelectAccount(data.account);
      }
      setIsRegisterModalOpen(false);
      setRegUsername('');
      setRegFullName('');
      setRegGradeOrSchool('');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tạo tài khoản', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle Add Material
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) {
      showToast('Vui lòng đăng nhập hoặc chọn tài khoản trước khi thêm vật liệu', 'error');
      return;
    }
    if (!formTitle.trim() || !formDescription.trim()) {
      showToast('Vui lòng điền tên vật liệu và mô tả chi tiết', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          description: formDescription.trim(),
          quantity: formQuantity.trim() || '1 đơn vị',
          status: formStatus,
          locationOrOrigin: formLocation.trim() || 'Kho thiết bị học đường',
          imageUrl: formImageUrl.trim(),
          tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
          authorId: activeAccount.id,
          authorName: activeAccount.fullName,
          authorRole: activeAccount.roleNameVi,
          authorAvatarEmoji: activeAccount.avatarEmoji,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi thêm vật liệu');
      }

      showToast(`Đã thêm thành công vật liệu "${data.material.title}" bằng tài khoản ${activeAccount.fullName}!`, 'success');
      setMaterials((prev) => [data.material, ...prev]);
      setIsAddModalOpen(false);

      // Reset form
      setFormTitle('');
      setFormDescription('');
      setFormQuantity('');
      setFormLocation('');
      setFormTags('');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi thêm vật liệu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Material
  const handleConfirmDelete = async () => {
    if (!deletingMaterial) return;
    if (!activeAccount) {
      showToast('Vui lòng chọn tài khoản để thực hiện thao tác', 'error');
      return;
    }

    try {
      const res = await fetch(
        `/api/materials/${deletingMaterial.id}?requesterId=${activeAccount.id}&requesterRole=${activeAccount.role}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể xóa vật liệu');
      }

      showToast(data.message || 'Đã xóa vật liệu thành công!', 'success');
      setMaterials((prev) => prev.filter((m) => m.id !== deletingMaterial.id));
      setDeletingMaterial(null);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa vật liệu', 'error');
      setDeletingMaterial(null);
    }
  };

  // Filtered Materials
  const filteredMaterials = materials.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (authorFilter === 'mine' && activeAccount && item.authorId !== activeAccount.id) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchAuthor = item.authorName.toLowerCase().includes(q);
      const matchLocation = item.locationOrOrigin.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchAuthor || matchLocation || matchTags;
    }
    return true;
  });

  const myMaterialsCount = activeAccount
    ? materials.filter((m) => m.authorId === activeAccount.id).length
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium transition-all transform duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75 text-white/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header & Active Account Ribbon */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Package className="w-3.5 h-3.5" />
              <span>Kho Quản Lý Vật Liệu & Học Liệu Đa Tài Khoản</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Nhập, Xem & Quản Lý Vật Liệu Học Đường
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Khu vực nhập dụng cụ thể chất, nguyên liệu dinh dưỡng và tài liệu rèn luyện. Từng tài khoản học sinh, giáo viên hay huấn luyện viên có thể chủ động thêm mới, tra cứu kho chung và xóa các vật liệu của chính mình.
            </p>
          </div>

          {/* Active Account Card & Controls */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 shadow-md shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {activeAccount ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shadow-inner">
                  {activeAccount.avatarEmoji || '🎒'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{activeAccount.fullName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                      {activeAccount.roleNameVi}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    @{activeAccount.username} • {activeAccount.gradeOrSchool}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">Chưa chọn tài khoản</div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-4">
              <button
                id="btn-switch-account"
                onClick={() => setIsAccountModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đổi tài khoản</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <button
                id="btn-register-account"
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tạo mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Tổng vật liệu trong kho</div>
            <div className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              {materials.length} mục
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Đóng góp bởi bạn</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              {myMaterialsCount} mục
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Dụng cụ rèn luyện</div>
            <div className="text-xl font-bold text-sky-400 mt-1 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-sky-400" />
              {materials.filter((m) => m.category === 'equipment').length} dụng cụ
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Nguyên liệu dinh dưỡng</div>
            <div className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-2">
              <Apple className="w-4 h-4 text-amber-400" />
              {materials.filter((m) => m.category === 'nutrition').length} món
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls, Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-materials"
              type="text"
              placeholder="Tìm kiếm vật liệu, dụng cụ, nguyên liệu, người đăng, vị trí lưu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Add New Material Button */}
          <button
            id="btn-open-add-material-modal"
            onClick={() => {
              if (!activeAccount) {
                showToast('Vui lòng chọn tài khoản trước khi thêm', 'error');
                return;
              }
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nhập Vật Liệu Mới</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Phân loại:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({materials.length})
            </button>
            <button
              onClick={() => setSelectedCategory('equipment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'equipment'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              Dụng cụ thể chất
            </button>
            <button
              onClick={() => setSelectedCategory('nutrition')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'nutrition'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              Nguyên liệu dinh dưỡng
            </button>
            <button
              onClick={() => setSelectedCategory('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'guide'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Tài liệu & Giáo án
            </button>
            <button
              onClick={() => setSelectedCategory('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'practice'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Nội dung rèn luyện
            </button>
          </div>

          {/* Account Filter Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              id="filter-materials-all"
              onClick={() => setAuthorFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                authorFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất cả tài khoản
            </button>
            <button
              id="filter-materials-mine"
              onClick={() => setAuthorFilter('mine')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                authorFilter === 'mine'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3 h-3" />
              Vật liệu của tôi ({myMaterialsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Đang tải kho vật liệu & học liệu...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy vật liệu nào</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {authorFilter === 'mine'
                ? `Tài khoản "${activeAccount?.fullName}" chưa thêm vật liệu nào thuộc danh mục này. Hãy bấm nút "+ Nhập Vật Liệu Mới" để đóng góp!`
                : 'Thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục khác.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setAuthorFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => {
            const isMyItem = activeAccount?.id === item.authorId;
            const canDelete = isMyItem || activeAccount?.role === 'teacher';

            return (
              <div
                key={item.id}
                id={`material-card-${item.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs backdrop-blur-md ${
                      item.category === 'equipment'
                        ? 'bg-sky-600/90'
                        : item.category === 'nutrition'
                        ? 'bg-amber-600/90'
                        : item.category === 'guide'
                        ? 'bg-indigo-600/90'
                        : 'bg-emerald-600/90'
                    }`}
                  >
                    {item.categoryNameVi}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-xs backdrop-blur-md ${
                      item.status === 'available' || item.status === 'ready'
                        ? 'bg-emerald-500/90 text-white'
                        : item.status === 'in_use'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {item.statusLabelVi}
                  </span>

                  {/* Quantity Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Định lượng: {item.quantity}
                    </span>
                    <span className="text-[11px] text-slate-200 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {item.locationOrOrigin}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author Attribution & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Author Info */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0">
                        {item.authorAvatarEmoji || '📦'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1">
                          {item.authorName}
                          {isMyItem && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded-sm">
                              (Bạn)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.authorRole}
                        </div>
                      </div>
                    </div>

                    {/* Actions: View & Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onSummarizeMaterial && (
                        <button
                          onClick={() => onSummarizeMaterial(item)}
                          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                          title="Tóm tắt & Trích xuất ý chính bằng AI (MindX #03)"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="hidden sm:inline">Tóm tắt</span>
                        </button>
                      )}

                      {onOpenQuizPractice && (
                        <button
                          onClick={() => onOpenQuizPractice(item.title)}
                          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition-colors"
                          title="Tạo bộ câu hỏi luyện tập ôn bài trên trường"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                          <span className="hidden sm:inline">Luyện tập</span>
                        </button>
                      )}

                      <button
                        onClick={() => setInspectingMaterial(item)}
                        className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Xem chi tiết vật liệu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canDelete ? (
                        <button
                          onClick={() => setDeletingMaterial(item)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa vật liệu này khỏi kho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            showToast(
                              `Chỉ người tạo (${item.authorName}) hoặc Giáo viên mới có quyền xóa vật liệu này!`,
                              'error'
                            )
                          }
                          className="p-2 rounded-xl text-slate-300 hover:text-slate-400 cursor-not-allowed"
                          title="Bạn không thể xóa vật liệu của tài khoản khác"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD NEW MATERIAL (FORM NHẬP VẬT LIỆU) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Nhập Vật Liệu & Học Liệu Mới</h2>
                  <p className="text-xs text-slate-500">
                    Đăng bằng tài khoản:{' '}
                    <span className="font-semibold text-emerald-700">
                      {activeAccount?.fullName} ({activeAccount?.roleNameVi})
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="mt-6 space-y-4">
              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phân loại nội dung *
                  </label>
                  <select
                    id="input-material-category"
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as MaterialCategory;
                      setFormCategory(cat);
                      // Pick relevant image preset
                      const preset = SAMPLE_IMAGE_PRESETS.find((p) => p.category === cat);
                      if (preset) setFormImageUrl(preset.url);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  >
                    <option value="equipment">Dụng cụ / Thiết bị thể chất</option>
                    <option value="nutrition">Nguyên liệu / Thực phẩm dinh dưỡng</option>
                    <option value="guide">Tài liệu / Giáo án rèn luyện</option>
                    <option value="practice">Nội dung rèn luyện / Thử thách</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tình trạng sẵn sàng
                  </label>
                  <select
                    id="input-material-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  >
                    <option value="available">Sẵn sàng sử dụng</option>
                    <option value="ready">Sẵn sàng bổ sung</option>
                    <option value="in_use">Đang sử dụng</option>
                    <option value="need_restock">Cần bảo dưỡng / Cần mua thêm</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên vật liệu / Nội dung *
                </label>
                <input
                  id="input-material-title"
                  type="text"
                  required
                  placeholder="Ví dụ: Dây nhảy thể dục cán nhôm, Chuối già nạp Kali, Sơ đồ tiếp đất..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Quantity & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số lượng / Định lượng
                  </label>
                  <input
                    id="input-material-quantity"
                    type="text"
                    placeholder="Ví dụ: 10 chiếc, 1 nải, 1 bộ tài liệu, 200g..."
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nơi lưu giữ / Địa điểm
                  </label>
                  <input
                    id="input-material-location"
                    type="text"
                    placeholder="Ví dụ: Phòng kho thể chất B2, Cặp sách, Tủ cá nhân..."
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mô tả chi tiết, hướng dẫn hoặc lưu ý sử dụng *
                </label>
                <textarea
                  id="input-material-description"
                  required
                  rows={3}
                  placeholder="Ghi rõ công dụng, cách bảo quản hoặc hướng dẫn thực hiện cho học sinh..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Image Selection Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hình ảnh minh họa
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        formImageUrl === preset.url
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  id="input-material-image-url"
                  type="url"
                  placeholder="Hoặc dán URL ảnh trực tiếp..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gắn thẻ (cách nhau bởi dấu phẩy)
                </label>
                <input
                  id="input-material-tags"
                  type="text"
                  placeholder="Ví dụ: thể lực, nhảy dây, chống xóc, tăng chiều cao"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  id="btn-submit-material"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lưu Vật Liệu Vào Kho</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SWITCH ACCOUNT (ĐỔI TÀI KHOẢN ĐANG DÙNG) */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Chọn Tài Khoản Sử Dụng</h3>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Bạn có thể luân chuyển nhanh giữa các tài khoản học sinh, giáo viên hoặc huấn luyện viên để kiểm tra tính năng thêm, xem và xóa vật liệu theo từng tài khoản:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isSelected = activeAccount?.id === acc.id;
                const authorItemCount = materials.filter((m) => m.authorId === acc.id).length;

                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                        {acc.avatarEmoji || '🎒'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {acc.fullName}
                          {isSelected && (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                              Đang dùng
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {acc.roleNameVi} • @{acc.username}
                        </div>
                        {acc.gradeOrSchool && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {acc.gradeOrSchool}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md">
                        {authorItemCount} vật liệu
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsRegisterModalOpen(true);
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Đăng ký tài khoản khác</span>
              </button>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTER NEW ACCOUNT (TẠO TÀI KHOẢN MỚI) */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Tạo Tài Khoản Mới</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập (username) *
                </label>
                <input
                  id="reg-input-username"
                  type="text"
                  required
                  placeholder="Ví dụ: nam_lop9a, cobinh_pe..."
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên đầy đủ *
                </label>
                <input
                  id="reg-input-fullname"
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Hải Nam"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vai trò trong trường
                </label>
                <select
                  id="reg-input-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên Thể Dục</option>
                  <option value="coach">Huấn luyện viên Thể thao</option>
                  <option value="parent">Phụ huynh học sinh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lớp hoặc Đơn vị trường học
                </label>
                <input
                  id="reg-input-school"
                  type="text"
                  placeholder="Ví dụ: Lớp 9A - THCS Đoàn Thị Điểm"
                  value={regGradeOrSchool}
                  onChange={(e) => setRegGradeOrSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn biểu tượng đại diện
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setRegEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${
                        regEmoji === emoji
                          ? 'border-emerald-600 bg-emerald-50 scale-110 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  id="btn-submit-register-account"
                  type="submit"
                  disabled={isRegistering}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isRegistering ? 'Đang tạo...' : 'Tạo Tài Khoản & Đăng Nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW MATERIAL DETAILS (XEM CHI TIẾT VẬT LIỆU) */}
      {inspectingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={inspectingMaterial.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'}
                alt={inspectingMaterial.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs backdrop-blur-md ${
                  inspectingMaterial.category === 'equipment'
                    ? 'bg-sky-600'
                    : inspectingMaterial.category === 'nutrition'
                    ? 'bg-amber-600'
                    : inspectingMaterial.category === 'guide'
                    ? 'bg-indigo-600'
                    : 'bg-emerald-600'
                }`}
              >
                {inspectingMaterial.categoryNameVi}
              </span>
              <button
                onClick={() => setInspectingMaterial(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {inspectingMaterial.title}
                </h2>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                  {inspectingMaterial.statusLabelVi}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Định lượng / Số lượng:</span>
                  <span className="font-bold text-slate-800 text-sm">{inspectingMaterial.quantity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nơi lưu giữ:</span>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {inspectingMaterial.locationOrOrigin}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mô tả & Hướng dẫn sử dụng
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100">
                  {inspectingMaterial.description}
                </p>
              </div>

              {inspectingMaterial.tags && inspectingMaterial.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1.5">Từ khóa & Thẻ liên quan</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingMaterial.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{inspectingMaterial.authorAvatarEmoji || '📦'}</span>
                  <div>
                    <span className="text-slate-700 font-bold block">{inspectingMaterial.authorName}</span>
                    <span className="text-[11px] text-slate-400">{inspectingMaterial.authorRole}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(inspectingMaterial.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {onSummarizeMaterial && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = inspectingMaterial;
                      setInspectingMaterial(null);
                      onSummarizeMaterial(target);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-200" />
                    <span>Tóm Tắt AI #03</span>
                  </button>
                )}

                {onOpenQuizPractice && (
                  <button
                    type="button"
                    onClick={() => {
                      const title = inspectingMaterial.title;
                      setInspectingMaterial(null);
                      onOpenQuizPractice(title);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Luyện Câu Hỏi</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setInspectingMaterial(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CONFIRMATION (XÁC NHẬN XÓA VẬT LIỆU) */}
      {deletingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa vật liệu?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn đang chuẩn bị xóa vật liệu: <br />
                <span className="font-bold text-slate-800 text-sm">"{deletingMaterial.title}"</span>
              </p>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs border border-amber-200 text-left flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Thao tác này sẽ xóa vật liệu vĩnh viễn khỏi kho chung. Chỉ người tạo hoặc Giáo viên mới có quyền thực hiện.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingMaterial(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                id="btn-confirm-delete-material"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
