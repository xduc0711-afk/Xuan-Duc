export interface RecipeFallbackItem {
  id: number;
  title: string;
  vietnameseTitle: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  summary: string;
  dishTypes: string[];
  diets: string[];
  studentTag: string;
  benefitsVi: string;
  ingredients: string[];
  instructions: string[];
}

export const VIETNAMESE_QUERY_MAP: Record<string, string> = {
  'gà': 'chicken',
  'thịt gà': 'chicken breast',
  'ức gà': 'chicken breast',
  'trứng': 'egg',
  'cá': 'fish salmon',
  'cá hồi': 'salmon',
  'bò': 'beef',
  'thịt bò': 'beef',
  'rau': 'salad vegetable',
  'salad': 'salad',
  'yến mạch': 'oatmeal',
  'súp': 'soup',
  'canh': 'soup',
  'chuối': 'banana',
  'sữa': 'milk yogurt',
  'sữa chua': 'yogurt',
  'đậu': 'tofu beans',
  'đậu phụ': 'tofu',
  'tôm': 'shrimp',
  'cơm': 'rice',
  'gạo lứt': 'brown rice',
  'bánh mì': 'sandwich',
  'sinh tố': 'smoothie',
  'hoa quả': 'fruit',
  'trái cây': 'fruit',
};

export const FALLBACK_RECIPES: RecipeFallbackItem[] = [
  {
    id: 716429,
    title: 'Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs',
    vietnameseTitle: 'Mì Ý Sốt Súp Lơ Trắng, Tỏi Thơm & Dầu Oliu',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 25,
    servings: 2,
    healthScore: 88,
    calories: 420,
    protein: 15,
    carbs: 62,
    fat: 12,
    fiber: 7,
    summary: 'Món mì Ý lành mạnh kết hợp súp lơ trắng giàu chất xơ, vitamin C và carbohydrate phức hợp, cung cấp năng lượng bền bỉ cho buổi chiều học tập và rèn luyện thể chất.',
    dishTypes: ['lunch', 'main course'],
    diets: ['vegetarian'],
    studentTag: 'Năng Lượng Học Tập',
    benefitsVi: 'Cung cấp năng lượng tinh bột hấp thu chậm, không gây buồn ngủ gật gù trong giờ học.',
    ingredients: ['150g mì Ý luộc vừa chín', '1 chén súp lơ trắng cắt nhỏ', '2 tép tỏi băm', '1 thìa dầu oliu', 'Một chút phô mai parmesan rắc mặt'],
    instructions: [
      'Luộc mì Ý theo hướng dẫn trên bao bì đến khi vừa chín (al dente).',
      'Hấp chín mềm súp lơ trắng trong 4 phút.',
      'Phi thơm tỏi băm với dầu oliu trên chảo nhỏ, cho súp lơ và mì Ý vào đảo đều.',
      'Nêm chút muối tiêu vừa ăn và rắc phô mai lên trên thưởng thức nóng.'
    ]
  },
  {
    id: 715538,
    title: 'Grilled Lemon Herb Chicken with Brown Rice',
    vietnameseTitle: 'Ức Gà Nướng Thảo Mộc & Cơm Gạo Lứt Bổ Dưỡng',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 30,
    servings: 2,
    healthScore: 94,
    calories: 460,
    protein: 38,
    carbs: 45,
    fat: 9,
    fiber: 5,
    summary: 'Ức gà nướng mềm mọng nước, giàu đạm tinh khiết giúp phục hồi và phát triển các sợi cơ sau buổi học Thể dục chạy bền hoặc nhảy cao.',
    dishTypes: ['lunch', 'dinner', 'main course'],
    diets: ['high-protein', 'gluten free'],
    studentTag: 'Tăng Cơ & Thể Lực',
    benefitsVi: 'Hàm lượng protein cao (38g) hỗ trợ xây dựng cơ bắp săn chắc và phòng ngừa mỏi cơ sau khi tập.',
    ingredients: ['200g ức gà tươi', '1 chén cơm gạo lứt dẻo', 'Nước cốt nửa quả chanh', '1 thìa mật ong', 'Rau thơm, tiêu và muối hồng'],
    instructions: [
      'Khứa nhẹ miếng ức gà, ướp với nước cốt chanh, mật ong, tiêu và chút muối trong 15 phút.',
      'Áp chảo hoặc nướng trong nồi chiên không dầu ở 180°C trong 12-15 phút.',
      'Thái lát vừa ăn, bày lên đĩa cùng cơm gạo lứt nóng và dưa leo thái mỏng.'
    ]
  },
  {
    id: 716381,
    title: 'High-Calcium Pan-Seared Salmon with Steamed Greens',
    vietnameseTitle: 'Cá Hồi Áp Chảo Giàu Canxi & Bông Cải Xanh Hấp',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 20,
    servings: 1,
    healthScore: 96,
    calories: 490,
    protein: 34,
    carbs: 18,
    fat: 22,
    fiber: 6,
    summary: 'Cá hồi tự nhiên chứa dồi dào Omega-3 DHA phát triển trí não và Vitamin D giúp hấp thụ Canxi tối đa cho xương dài ra trong giai đoạn dậy thì.',
    dishTypes: ['dinner', 'main course'],
    diets: ['pescatarian', 'high-protein'],
    studentTag: 'Tăng Chiều Cao Tối Đa',
    benefitsVi: 'Giàu Canxi, Vitamin D3 và Axit béo Omega-3 tối ưu hóa đĩa sụn tiếp hợp phát triển chiều cao vượt trội.',
    ingredients: ['150g phi lê cá hồi tươi', '1 chén bông cải xanh cắt búp', '1 lát bơ lạt', 'Nửa quả chanh vàng', 'Tiêu sọ đập dập'],
    instructions: [
      'Thấm khô miếng cá hồi, rắc tiêu và chút muối biển lên hai mặt.',
      'Áp chảo mặt có da trước 4 phút với chút bơ lạt, lật mặt còn lại áp thêm 3 phút.',
      'Hấp chín tới bông cải xanh để giữ nguyên độ giòn ngọt và vitamin.',
      'Vắt chút chanh lên cá hồi và thưởng thức nóng cùng cơm trắng hoặc khoai lang.'
    ]
  },
  {
    id: 782585,
    title: 'Cannellini Bean and Spinach Power Soup',
    vietnameseTitle: 'Súp Đậu Trắng & Cải Bó Xôi Nạp Sắt Học Đường',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 20,
    servings: 2,
    healthScore: 91,
    calories: 280,
    protein: 16,
    carbs: 42,
    fat: 4,
    fiber: 11,
    summary: 'Món súp nhẹ bụng, thanh mát giàu chất sắt từ cải bó xôi và đạm thực vật từ hạt đậu trắng, giúp vận chuyển oxy lên não bộ giúp học sinh tỉnh táo.',
    dishTypes: ['soup', 'starter', 'dinner'],
    diets: ['vegan', 'vegetarian'],
    studentTag: 'Ít Calo & Dễ Tiêu',
    benefitsVi: 'Hàm lượng chất xơ dồi dào (11g) và chất sắt tự nhiên ngăn ngừa chứng thiếu máu do học tập căng thẳng.',
    ingredients: ['1 hộp đậu trắng ninh mềm (hoặc đậu tươi ninh chín)', '1 bó cải bó xôi (rau chân vịt)', 'Cà rốt thái hạt lựu', 'Nước dùng rau củ ngọt thanh'],
    instructions: [
      'Xào thơm hành tím cùng cà rốt thái hạt lựu.',
      'Đổ nước dùng rau củ vào đun sôi, cho đậu trắng vào nấu 5 phút cho ngấm gia vị.',
      'Thả cải bó xôi vào nấu nhanh 2 phút để giữ màu xanh mướt.',
      'Múc ra bát, ăn ấm vào buổi tối hoặc trước khi đi học thêm.'
    ]
  },
  {
    id: 716268,
    title: 'Energy Banana Oatmeal with Chia Seeds & Almonds',
    vietnameseTitle: 'Cháo Yến Mạch Chuối Sữa Chua & Hạt Chia Năng Lượng',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 10,
    servings: 1,
    healthScore: 95,
    calories: 340,
    protein: 14,
    carbs: 58,
    fat: 7,
    fiber: 9,
    summary: 'Bữa sáng hoặc bữa xế siêu nhanh chỉ mất 5 phút chuẩn bị. Giàu Kali từ chuối phòng ngừa chuột rút khi chạy bộ và kiểm tra thể dục.',
    dishTypes: ['breakfast', 'snack'],
    diets: ['vegetarian'],
    studentTag: 'Bữa Sáng Nhanh Gọn',
    benefitsVi: 'Giàu Magie & Kali giúp cơ bắp thư giãn, cung cấp năng lượng phóng thích chậm cho suốt 4 tiết học buổi sáng.',
    ingredients: ['40g yến mạch cán dẹt', '1 hộp sữa tươi không đường (hoặc sữa chua)', '1 quả chuối chín thái lát', '1 thìa hạt chia', 'Vài hạt hạnh nhân bẻ nhỏ'],
    instructions: [
      'Cho yến mạch vào bát, chế sữa tươi ấm hoặc sữa chua khuấy đều trong 3 phút.',
      'Xếp chuối chín thái lát lên trên bề mặt.',
      'Rắc hạt chia và hạt hạnh nhân giòn rụm.',
      'Thưởng thức ngay hoặc chuẩn bị sẵn từ tối hôm trước để trong ngăn mát tủ lạnh.'
    ]
  },
  {
    id: 641803,
    title: 'Rainbow Egg Roll with Crunchy Vegetables',
    vietnameseTitle: 'Trứng Cuộn Cầu Vồng Cà Rốt & Hành Hoa',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 15,
    servings: 2,
    healthScore: 86,
    calories: 220,
    protein: 14,
    carbs: 4,
    fat: 14,
    fiber: 2,
    summary: 'Món trứng cuộn màu sắc bắt mắt, cung cấp đạm hoàn hảo cùng Lutein bảo vệ mắt học sinh khỏi ánh sáng xanh từ màn hình máy tính và điện thoại.',
    dishTypes: ['breakfast', 'lunch', 'side dish'],
    diets: ['high-protein', 'low-carb'],
    studentTag: 'Bổ Mắt & Dễ Làm',
    benefitsVi: 'Lutein và Zeaxanthin trong lòng đỏ trứng kết hợp Beta-carotene từ cà rốt giúp mắt sáng khỏe khi ôn bài.',
    ingredients: ['3 quả trứng gà ta tươi', 'Nửa củ cà rốt băm nhuyễn', '2 nhánh hành hoa thái nhỏ', '1 thìa nhỏ dầu thực vật', 'Chút hạt nêm'],
    instructions: [
      'Đập trứng vào bát, đánh tan đều cùng cà rốt băm, hành hoa và chút hạt nêm.',
      'Làm nóng chảo chống dính với một lớp dầu mỏng.',
      'Đổ 1 lớp trứng mỏng, khi mặt trứng se lại thì dùng đũa cuộn tròn dần về một phía.',
      'Đổ tiếp lớp trứng mới nối vào cuộn cũ và lặp lại cho đến hết.',
      'Cắt khoanh tròn đẹp mắt, cho vào hộp cơm mang đến trường.'
    ]
  },
  {
    id: 658615,
    title: 'Roasted Sweet Potato & Steamed Tofu Bowl',
    vietnameseTitle: 'Khoai Lang Mật Nướng & Đậu Hũ Non Hấp Thanh Đạm',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 20,
    servings: 1,
    healthScore: 92,
    calories: 310,
    protein: 17,
    carbs: 48,
    fat: 6,
    fiber: 8,
    summary: 'Lựa chọn lý tưởng cho học sinh muốn kiểm soát cân nặng, thanh lọc cơ thể nhưng vẫn đủ năng lượng cho các bài tập thể dục tại trường.',
    dishTypes: ['lunch', 'dinner'],
    diets: ['vegan', 'vegetarian'],
    studentTag: 'Giữ Dáng Thon Gọn',
    benefitsVi: 'Chỉ số đường huyết (GI) thấp từ khoai lang giúp no lâu, không tích mỡ thừa và hỗ trợ tiêu hóa êm dịu.',
    ingredients: ['1 củ khoai lang vàng luộc hoặc nướng', '1 bìa đậu phụ non hấp', '1 đĩa rau cải luộc xanh', 'Nước tương tỏi ớt ít muối'],
    instructions: [
      'Rửa sạch khoai lang, nướng hoặc hấp chín dẻo thơm.',
      'Đậu phụ non cắt miếng vừa ăn, hấp cách thủy 5 phút cho nóng sốt.',
      'Chấm cùng nước tương tỏi ớt pha nhạt ăn kèm rau cải luộc.'
    ]
  },
  {
    id: 649931,
    title: 'Blueberry Greek Yogurt Pre-Workout Cup',
    vietnameseTitle: 'Sữa Chua Hy Lạp Trộn Quả Mọng Nạp Năng Lượng Trước Tập',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    readyInMinutes: 5,
    servings: 1,
    healthScore: 97,
    calories: 210,
    protein: 18,
    carbs: 26,
    fat: 3,
    fiber: 4,
    summary: 'Bữa phụ hoàn hảo 30-45 phút trước giờ học Thể dục hoặc sau buổi tập chạy. Cung cấp axit amin BCAA tự nhiên giúp cơ thể không bị kiệt sức.',
    dishTypes: ['snack', 'dessert'],
    diets: ['high-protein', 'gluten-free'],
    studentTag: 'Bữa Phụ Trước Giờ Thể Dục',
    benefitsVi: '18g protein chất lượng cao từ sữa chua Hy Lạp kết hợp chất chống oxy hóa giúp giảm đau nhức cơ bắp.',
    ingredients: ['1 hộp sữa chua Hy Lạp nguyên chất', '1 nắm quả việt quất hoặc dâu tây tươi', '1 thìa cà phê mật ong rừng nguyên chất', '1 thìa hạt bí ngô'],
    instructions: [
      'Múc sữa chua Hy Lạp ra cốc hoặc hũ thủy tinh nhỏ.',
      'Xếp quả mọng tươi lên trên.',
      'Rưới mật ong và rắc hạt bí ngô giòn bùi lên mặt.',
      'Ăn mát lành trước giờ thể dục khoảng 30 phút.'
    ]
  }
];
