import { useState } from 'react';
import { Scale, Heart, Droplets, Flame, ArrowRight, CheckCircle, AlertCircle, Dumbbell } from 'lucide-react';
import { StudentProfile } from '../types';

interface BmiCalculatorProps {
  onNavigateToExercises: () => void;
  onUpdateProfile?: (profile: StudentProfile) => void;
  onNavigateToStudentZone?: () => void;
}

export default function BmiCalculator({
  onNavigateToExercises,
  onUpdateProfile,
  onNavigateToStudentZone,
}: BmiCalculatorProps) {
  const [age, setAge] = useState<number>(14);
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');
  const [heightCm, setHeightCm] = useState<number>(160);
  const [weightKg, setWeightKg] = useState<number>(50);
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>('medium');

  // BMI Calculation
  const heightMeters = heightCm / 100;
  const bmi = heightMeters > 0 ? parseFloat((weightKg / (heightMeters * heightMeters)).toFixed(1)) : 0;

  // Water need calculation (ml): weight * 40ml
  const waterNeedMl = Math.round(weightKg * 40);
  const waterGlasses = Math.round(waterNeedMl / 250);

  // Calorie requirement (BMR + Activity)
  let bmr = 0;
  if (gender === 'nam') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const multiplier = activityLevel === 'low' ? 1.3 : activityLevel === 'medium' ? 1.55 : 1.75;
  const tdeeCalories = Math.round(bmr * multiplier);

  // Classification for Asian adolescents
  let statusText = 'Cân đối - Thể lực tốt';
  let statusColor = 'emerald';
  let adviceExercise = 'Duy trì các bài tập thể lực 20-30 phút/ngày và kéo giãn tăng chiều cao.';
  let adviceDiet = 'Tiếp tục duy trì khẩu phần ăn đủ 4 nhóm chất, uống đủ sữa và nước lọc.';

  if (bmi < 18.5) {
    statusText = 'Thể trạng gầy / Thiếu cân';
    statusColor = 'amber';
    adviceExercise = 'Tập các bài tăng sức mạnh cơ bắp (chống đẩy gối, squat học đường), tránh các bài tập tiêu hao quá nhiều calo mà không ăn bù.';
    adviceDiet = 'Cần tăng thêm 1-2 bữa phụ lành mạnh (sữa chua, chuối chín, bánh mì trứng, sữa tươi), không bỏ bữa.';
  } else if (bmi >= 18.5 && bmi <= 22.9) {
    statusText = 'Thể trạng Cân Đối - Lý Tưởng';
    statusColor = 'emerald';
    adviceExercise = 'Bạn có thể trạng rất đẹp! Hãy tích cực tham gia các môn thể thao trường học như bóng đá, cầu lông, bơi lội hoặc chạy bền.';
    adviceDiet = 'Duy trì đĩa ăn cân đối với nhiều rau xanh và trái cây tươi để duy trì sức bền.';
  } else if (bmi >= 23 && bmi <= 24.9) {
    statusText = 'Nguy cơ thừa cân';
    statusColor = 'amber';
    adviceExercise = 'Tăng cường các bài tập bật nhảy (Jumping jacks, nâng cao đùi, nhảy dây) 30 phút mỗi ngày để đốt cháy mỡ thừa.';
    adviceDiet = 'Hạn chế tối đa nước ngọt có gas, trà sữa trân châu và đồ chiên rán ngoài cổng trường. Ăn nhiều rau luộc.';
  } else {
    statusText = 'Thừa cân / Cần điều chỉnh';
    statusColor = 'rose';
    adviceExercise = 'Bắt đầu nhẹ nhàng bằng đi bộ nhanh, xoay khớp và squat học đường. Kiên trì vận động mỗi ngày, không tập quá sức đột ngột.';
    adviceDiet = 'Thay cơm trắng bằng khoai lang hoặc gạo lứt, ăn canh rau trước khi ăn cơm để giảm bớt cảm giác thèm ăn.';
  }

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: 'Học sinh',
        age,
        grade: `Lớp ${Math.min(12, Math.max(1, age - 5))}`,
        gender,
        heightCm,
        weightKg,
        activityLevel,
      });
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
          Theo Tiêu Chuẩn Thể Lực Thanh Thiếu Niên WHO & Châu Á
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Đo Chỉ Số Thể Lực & Thể Trạng Học Sinh (BMI)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Nhập thông tin chiều cao, cân nặng và thói quen vận động để tính toán mức calo cần thiết và lời khuyên rèn luyện phù hợp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
            <Scale className="w-5 h-5 text-emerald-600" />
            Thông Tin Thể Chất Học Sinh
          </h2>

          <div className="space-y-4">
            {/* Gender Toggle */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Giới tính:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('nam')}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    gender === 'nam'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  👦 Nam (Học sinh nam)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('nu')}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    gender === 'nu'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  👧 Nữ (Học sinh nữ)
                </button>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Tuổi của bạn:</span>
                <span className="text-sm font-extrabold text-emerald-700">{age} tuổi</span>
              </div>
              <input
                type="range"
                min="6"
                max="19"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-2xs text-slate-400 mt-0.5">
                <span>6 tuổi (Tiểu học)</span>
                <span>14 tuổi (THCS)</span>
                <span>18 tuổi (THPT)</span>
              </div>
            </div>

            {/* Height & Weight Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chiều cao (cm):
                </label>
                <input
                  type="number"
                  min="90"
                  max="210"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Math.max(50, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Cân nặng (kg):
                </label>
                <input
                  type="number"
                  min="15"
                  max="150"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(10, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Mức độ vận động thể chất:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'low', label: 'Ít vận động', desc: 'Chỉ học bài, ít chơi thể thao ngoài giờ' },
                  { id: 'medium', label: 'Vừa phải (Khuyên dùng)', desc: 'Tập thể dục 2-3 buổi/tuần, đi bộ nhiều' },
                  { id: 'high', label: 'Rất năng động', desc: 'Chơi bóng đá, bóng rổ, chạy bộ hằng ngày' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActivityLevel(item.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      activityLevel === item.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{item.label}</p>
                      <p className="text-2xs opacity-80">{item.desc}</p>
                    </div>
                    {activityLevel === item.id && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Kết Quả Đánh Giá Thể Lực
            </h2>

            {/* BMI Score Display */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-2xl border border-emerald-100">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-xs border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-3xl font-black text-emerald-700 font-heading">
                  {bmi}
                </span>
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  Chỉ số BMI
                </span>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-500">Phân loại thể trạng:</span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {statusText}
                </h3>
                <p className="text-xs text-slate-600">
                  {gender === 'nam' ? 'Học sinh nam' : 'Học sinh nữ'} • {age} tuổi • Chiều cao {heightCm}cm • Cân nặng {weightKg}kg
                </p>
              </div>
            </div>

            {/* Daily Needs: Calories & Water */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                  <Flame className="w-4 h-4" />
                  <span>Nhu cầu Năng lượng</span>
                </div>
                <p className="text-xl font-black text-amber-900">
                  {tdeeCalories} <span className="text-xs font-normal">kcal/ngày</span>
                </p>
                <p className="text-2xs text-amber-800">
                  Đủ cho học tập và vui chơi
                </p>
              </div>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-700 text-xs font-bold">
                  <Droplets className="w-4 h-4" />
                  <span>Lượng Nước Cần Uống</span>
                </div>
                <p className="text-xl font-black text-sky-900">
                  {(waterNeedMl / 1000).toFixed(1)} <span className="text-xs font-normal">Lít ({waterGlasses} ly)</span>
                </p>
                <p className="text-2xs text-sky-800">
                  Khoảng {waterGlasses} cốc nước 250ml
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-emerald-600" />
                  Lời khuyên tập luyện môn Thể Dục:
                </span>
                <p className="text-slate-700 leading-relaxed">{adviceExercise}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Lời khuyên dinh dưỡng hàng ngày:
                </span>
                <p className="text-slate-700 leading-relaxed">{adviceDiet}</p>
              </div>
            </div>

            <button
              onClick={onNavigateToExercises}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Xem các bài tập phù hợp với thể trạng của bạn</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Student Friendly Non-Technical Tip Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <span>🌟 Lời nhắn nhủ tuổi học trò:</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Đừng quá lo lắng hay áp lực về một vài con số! Ở lứa tuổi học sinh, cơ thể đang phát triển từng ngày. Chỉ cần bạn ăn đủ bữa, uống đủ nước và ngủ trước 22h, cơ thể sẽ tự khắc cao ráo và cân đối.
              </p>
              {onNavigateToStudentZone && (
                <button
                  onClick={onNavigateToStudentZone}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-2"
                >
                  <span>Xem Thẻ Ảnh Chữ & Trắc Nghiệm Linh Vật Thể Thao tại Góc Học Trò →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
