import { FoodItem } from '../types';

export const NUTRITION_GROUPS = [
  {
    id: 'carb',
    name: 'Nhóm Tinh Bột (Chất Bột Đường)',
    role: 'Nhiên liệu chính nuôi dưỡng não bộ và năng lượng chạy nhảy',
    sources: 'Cơm gạo, yến mạch, khoai lang, bánh mì nguyên cám, bún, phở',
    dailyAdvice: 'Chiếm 55-65% tổng năng lượng. Ưu tiên tinh bột hấp thu chậm như gạo lứt, khoai lang để học bài không bị buồn ngủ.',
    color: 'amber'
  },
  {
    id: 'protein',
    name: 'Nhóm Chất Đạm (Protein)',
    role: 'Xây dựng cơ bắp, phát triển tế bào và tăng trưởng chiều cao tối đa',
    sources: 'Thịt nạc, cá đồng/biển, trứng gà, đậu phụ, tôm cua, các loại hạt đậu',
    dailyAdvice: 'Học sinh đang tuổi lớn cần khoảng 1.2 - 1.5g đạm/kg cân nặng mỗi ngày để bứt phá chiều cao.',
    color: 'rose'
  },
  {
    id: 'fat',
    name: 'Nhóm Chất Béo Tốt (Lipid)',
    role: 'Phát triển màng tế bào não, hòa tan vitamin A, D, E, K',
    sources: 'Dầu mè, dầu thực vật, mỡ cá béo (hồi, basa), quả bơ, đậu phộng',
    dailyAdvice: 'Chiếm 20-25% năng lượng. Nên ăn cá 2-3 bữa/tuần, hạn chế đồ chiên ngập dầu mỡ cháy khét ngoài cổng trường.',
    color: 'yellow'
  },
  {
    id: 'vitamin_mineral',
    name: 'Nhóm Vitamin & Khoáng Chất / Chất Xơ',
    role: 'Tăng cường đề kháng, sáng mắt, hỗ trợ tiêu hóa chống táo bón',
    sources: 'Rau ngót, rau muống, súp lơ, cà rốt, chuối, cam, táo, dưa hấu',
    dailyAdvice: 'Tối thiểu 300 - 400g rau xanh và 200g quả chín mỗi ngày. Rau càng sẫm màu càng giàu canxi và sắt.',
    color: 'emerald'
  },
  {
    id: 'hydration',
    name: 'Nước & Sữa Phát Triển Thể Chất',
    role: 'Vận chuyển dưỡng chất, điều hòa thân nhiệt trong giờ thể dục',
    sources: 'Nước lọc, sữa tươi không đường, sữa chua, nước dừa tươi',
    dailyAdvice: 'Uống 1.5 - 2 lít nước/ngày (khoảng 6-8 ly). Uống ngay cả khi chưa thấy khát, chia đều trong ngày.',
    color: 'sky'
  }
];

export const SCHOOL_FOODS: FoodItem[] = [
  // Tinh bột
  {
    id: 'food-white-rice',
    name: 'White Rice',
    vietnameseName: 'Cơm trắng',
    category: 'carb',
    categoryNameVi: 'Tinh bột',
    portion: '1 chén vừa (150g)',
    calories: 200,
    proteinGrams: 4.2,
    carbGrams: 44.5,
    fatGrams: 0.4,
    fiberGrams: 0.6,
    rating: 'Nên ăn thường xuyên',
    tipsForStudents: 'Nền tảng năng lượng chính cho bữa trưa và tối của học sinh Việt Nam.',
    iconName: 'Bowl'
  },
  {
    id: 'food-sweet-potato',
    name: 'Steamed Sweet Potato',
    vietnameseName: 'Khoai lang hấp',
    category: 'carb',
    categoryNameVi: 'Tinh bột lành mạnh',
    portion: '1 củ vừa (120g)',
    calories: 103,
    proteinGrams: 2.0,
    carbGrams: 24.0,
    fatGrams: 0.2,
    fiberGrams: 3.6,
    rating: 'Tốt',
    tipsForStudents: 'Rất giàu vitamin A sáng mắt và chất xơ, lý tưởng cho bữa sáng hoặc ăn nhẹ trước giờ thể dục.',
    iconName: 'Flame'
  },
  {
    id: 'food-pho-bo',
    name: 'Beef Pho',
    vietnameseName: 'Phở bò chín',
    category: 'carb',
    categoryNameVi: 'Món ăn sáng truyền thống',
    portion: '1 tô vừa',
    calories: 420,
    proteinGrams: 22.0,
    carbGrams: 55.0,
    fatGrams: 10.0,
    fiberGrams: 2.0,
    rating: 'Tốt',
    tipsForStudents: 'Bữa sáng hoàn hảo cung cấp cả tinh bột bánh phở, đạm và nước dùng ấm bụng.',
    iconName: 'Soup'
  },
  {
    id: 'food-bread-egg',
    name: 'Egg Sandwich',
    vietnameseName: 'Bánh mì kẹp trứng ốp la + dưa leo',
    category: 'carb',
    categoryNameVi: 'Ăn sáng tiện lợi',
    portion: '1 ổ',
    calories: 330,
    proteinGrams: 13.0,
    carbGrams: 38.0,
    fatGrams: 12.0,
    fiberGrams: 2.5,
    rating: 'Tốt',
    tipsForStudents: 'Tiện lợi mang đi học, nên thêm nhiều dưa leo, ngò rí và ít sốt mayonnaise nhiều béo.',
    iconName: 'Sandwich'
  },

  // Đạm (Protein)
  {
    id: 'food-boiled-egg',
    name: 'Boiled Egg',
    vietnameseName: 'Trứng gà luộc',
    category: 'protein',
    categoryNameVi: 'Chất đạm',
    portion: '1 quả (55g)',
    calories: 78,
    proteinGrams: 6.3,
    carbGrams: 0.6,
    fatGrams: 5.3,
    fiberGrams: 0,
    rating: 'Tốt',
    tipsForStudents: 'Nguồn đạm sinh học tiêu chuẩn vàng, chứa choline phát triển trí nhớ và trí não học sinh.',
    iconName: 'Egg'
  },
  {
    id: 'food-chicken-breast',
    name: 'Grilled / Steamed Chicken',
    vietnameseName: 'Thịt gà xé / luộc',
    category: 'protein',
    categoryNameVi: 'Chất đạm ít béo',
    portion: '100g thịt',
    calories: 165,
    proteinGrams: 31.0,
    carbGrams: 0,
    fatGrams: 3.6,
    fiberGrams: 0,
    rating: 'Tốt',
    tipsForStudents: 'Giàu protein nạc giúp phục hồi cơ bắp thần tốc sau tiết học chạy bền.',
    iconName: 'Drumstick'
  },
  {
    id: 'food-braised-fish',
    name: 'Braised Fish',
    vietnameseName: 'Cá lóc kho tộ',
    category: 'protein',
    categoryNameVi: 'Chất đạm & Omega-3',
    portion: '1 khứa vừa (100g)',
    calories: 140,
    proteinGrams: 20.0,
    carbGrams: 2.0,
    fatGrams: 5.0,
    fiberGrams: 0,
    rating: 'Tốt',
    tipsForStudents: 'Cá dễ tiêu hóa, giàu khoáng chất photpho và canxi giúp xương chắc khỏe.',
    iconName: 'Fish'
  },
  {
    id: 'food-tofu',
    name: 'Steamed Tofu',
    vietnameseName: 'Đậu phụ sốt cà chua',
    category: 'protein',
    categoryNameVi: 'Đạm thực vật',
    portion: '1 bìa (120g)',
    calories: 120,
    proteinGrams: 12.0,
    carbGrams: 5.0,
    fatGrams: 6.0,
    fiberGrams: 1.5,
    rating: 'Tốt',
    tipsForStudents: 'Đạm lành mạnh từ đậu nành thanh mát, giàu canxi thực vật hỗ trợ phát triển thể chất.',
    iconName: 'Salad'
  },

  // Rau củ & Trái cây (Vitamin, khoáng chất, xơ)
  {
    id: 'food-boiled-spinach',
    name: 'Boiled Morning Glory',
    vietnameseName: 'Rau muống luộc + nước chanh',
    category: 'vitamin_mineral',
    categoryNameVi: 'Rau xanh & khoáng chất',
    portion: '1 đĩa nhỏ (150g)',
    calories: 35,
    proteinGrams: 3.0,
    carbGrams: 4.5,
    fatGrams: 0.3,
    fiberGrams: 3.5,
    rating: 'Tốt',
    tipsForStudents: 'Món rau quốc dân giàu sắt và vitamin C, nước luộc vắt chanh giúp giải nhiệt sau giờ thể dục.',
    iconName: 'Leaf'
  },
  {
    id: 'food-sour-soup',
    name: 'Sour Soup with Veggies',
    vietnameseName: 'Canh chua cà chua, đậu bắp, dứa',
    category: 'vitamin_mineral',
    categoryNameVi: 'Canh rau củ',
    portion: '1 bát canh vừa (200ml)',
    calories: 60,
    proteinGrams: 2.0,
    carbGrams: 8.0,
    fatGrams: 1.0,
    fiberGrams: 2.8,
    rating: 'Tốt',
    tipsForStudents: 'Vị chua thanh kích thích ăn ngon miệng, bổ sung nước và chất xơ tuyệt vời.',
    iconName: 'Soup'
  },
  {
    id: 'food-banana',
    name: 'Ripe Banana',
    vietnameseName: 'Chuối tiêu chín',
    category: 'vitamin_mineral',
    categoryNameVi: 'Trái cây năng lượng',
    portion: '1 quả vừa (100g)',
    calories: 89,
    proteinGrams: 1.1,
    carbGrams: 22.8,
    fatGrams: 0.3,
    fiberGrams: 2.6,
    rating: 'Tốt',
    tipsForStudents: 'Giàu kali chống co rút cơ (chuột rút), ăn 1 quả trước giờ thể dục 30 phút rất tốt.',
    iconName: 'Apple'
  },
  {
    id: 'food-orange',
    name: 'Fresh Orange',
    vietnameseName: 'Cam tươi hoặc nước cam vắt',
    category: 'vitamin_mineral',
    categoryNameVi: 'Trái cây vitamin C',
    portion: '1 quả vừa (150g)',
    calories: 62,
    proteinGrams: 1.2,
    carbGrams: 15.4,
    fatGrams: 0.2,
    fiberGrams: 3.1,
    rating: 'Tốt',
    tipsForStudents: 'Tăng cường hệ miễn dịch, chống cảm cúm giúp học sinh không phải nghỉ học vì ốm vặt.',
    iconName: 'Citrus'
  },

  // Nước & Sữa
  {
    id: 'food-fresh-milk',
    name: 'Fresh Milk',
    vietnameseName: 'Sữa tươi tiệt trùng ít đường / không đường',
    category: 'hydration',
    categoryNameVi: 'Sữa học đường',
    portion: '1 hộp 180ml',
    calories: 120,
    proteinGrams: 6.0,
    carbGrams: 8.5,
    fatGrams: 4.5,
    fiberGrams: 0,
    rating: 'Tốt',
    tipsForStudents: 'Cung cấp 200mg canxi và vitamin D giúp xương dài ra tối đa trong độ tuổi học sinh.',
    iconName: 'Milk'
  },
  {
    id: 'food-pure-water',
    name: 'Pure Drinking Water',
    vietnameseName: 'Nước lọc tinh khiết',
    category: 'hydration',
    categoryNameVi: 'Nước uống',
    portion: '1 ly 250ml',
    calories: 0,
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 0,
    fiberGrams: 0,
    rating: 'Tốt',
    tipsForStudents: 'Uống từng ngụm nhỏ, luôn mang theo bình nước cá nhân khi đến trường.',
    iconName: 'GlassWater'
  },

  // Đồ ăn vặt / Thức ăn nhanh học đường (Cần hạn chế)
  {
    id: 'food-milk-tea',
    name: 'Bubble Milk Tea',
    vietnameseName: 'Trà sữa trân châu',
    category: 'treat',
    categoryNameVi: 'Đồ uống ngọt cổng trường',
    portion: '1 ly cỡ vừa (500ml)',
    calories: 450,
    proteinGrams: 1.5,
    carbGrams: 75.0,
    fatGrams: 15.0,
    fiberGrams: 0,
    rating: 'Nên hạn chế',
    tipsForStudents: 'Chứa lượng đường tương đương 15-18 thìa đường cát, dễ gây béo phì và buồn ngủ khi học.',
    iconName: 'Coffee'
  },
  {
    id: 'food-instant-noodles',
    name: 'Instant Noodles',
    vietnameseName: 'Mì tôm ăn liền',
    category: 'treat',
    categoryNameVi: 'Đồ ăn liền nhiều muối',
    portion: '1 gói (75g)',
    calories: 350,
    proteinGrams: 7.0,
    carbGrams: 48.0,
    fatGrams: 14.5,
    fiberGrams: 1.0,
    rating: 'Nên hạn chế',
    tipsForStudents: 'Chiên dầu nhiệt độ cao và rất nhiều muối (natri), nếu ăn nên cho thêm trứng và rau xanh.',
    iconName: 'Soup'
  },
  {
    id: 'food-fried-chicken',
    name: 'Crispy Fried Chicken',
    vietnameseName: 'Gà rán giòn rụm',
    category: 'treat',
    categoryNameVi: 'Đồ chiên rán dầu mỡ',
    portion: '1 miếng đùi chiên',
    calories: 320,
    proteinGrams: 18.0,
    carbGrams: 12.0,
    fatGrams: 22.0,
    fiberGrams: 0.5,
    rating: 'Ăn vừa phải',
    tipsForStudents: 'Ngon miệng nhưng lớp bột chiên ngấm nhiều dầu mỡ, chỉ nên ăn 1-2 lần/tháng như phần thưởng.',
    iconName: 'Utensils'
  }
];

export const STUDENT_NUTRITION_RULES = [
  {
    title: 'Nguyên tắc "Đĩa Ăn Học Đường Cân Đối"',
    content: 'Mỗi bữa chính nên chia đĩa làm 4 phần: 1/2 là Rau củ quả nhiều màu sắc, 1/4 là Tinh bột tốt (cơm, khoai), và 1/4 là Chất đạm chất lượng (cá, thịt nạc, trứng, đậu).'
  },
  {
    title: 'Bữa Sáng Là "Xăng" Cho Não Bộ',
    content: 'Không bao giờ nhịn ăn sáng trước khi đến trường! Học sinh bỏ bữa sáng sẽ bị hạ đường huyết, hoa mắt, giảm trí nhớ 30% và mệt lả trong giờ thể dục.'
  },
  {
    title: 'Bí Quyết Uống Nước Đúng Cách Trong Giờ Thể Dục',
    content: 'Uống 150ml nước trước khi khởi động 15 phút. Trong lúc tập, chỉ uống từng ngụm nhỏ làm ướt cổ họng, không tu liền 1 chai nước lạnh gây sốc dạ dày.'
  },
  {
    title: 'Tam Giác Vàng Tăng Chiều Cao: Dinh Dưỡng + Thể Thao + Giấc Ngủ',
    content: '90% hormone tăng trưởng chiều cao được tiết ra từ 22h00 đến 02h00 đêm khi học sinh ngủ sâu. Hãy ngủ trước 22h30 và duy trì nhảy dây 15 phút mỗi ngày.'
  }
];
