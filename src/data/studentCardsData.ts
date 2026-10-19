import { StudentVisualCard, StudentHack, StudentBadge } from '../types';

export const STUDENT_VISUAL_CARDS: StudentVisualCard[] = [
  {
    id: 'card-running',
    topic: 'running',
    topicLabel: '🏃 Chạy Bền 1500m',
    catchphrase: 'CHẠY ĐỀU GA - ĐỪNG SỢ HỤT HƠI',
    tagline: 'Chiến thuật hít 2 bước, thở 2 bước',
    summary: 'Chạy bền không phải là đua tốc độ ở 100m đầu, mà là phân phối sức đều và giữ nhịp thở nhịp nhàng suốt vòng sân trường.',
    steps: [
      'Xuất phát chạy vừa sức, giữ nhịp thở 2 bước hít vào - 2 bước thở ra qua mũi & miệng.',
      'Mắt nhìn thẳng về phía trước 10-15m, thả lỏng hai vai, không gồng cứng bàn tay.',
      'Khi mệt đừng ngồi bệt xuống ngay! Đi bộ thả lỏng 2 phút để tim trở về nhịp bình thường.'
    ],
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: '#f97316',
    iconName: 'Flame',
    studentQuote: '“Thầy thể dục bảo: Ai chạy chậm lúc đầu thì sẽ là người cười tươi lúc cán đích!”',
    relatableScenario: 'Chuông reo báo tiết chạy bền 800m/1500m? Áp dụng ngay mẹo thở 2-2 để không bị xóc hông!',
    likesCount: 284,
  },
  {
    id: 'card-height',
    topic: 'height',
    topicLabel: '🦒 Bứt Phá Chiều Cao',
    catchphrase: 'NGỦ SỚM 22H - CAO THÊM VÀI PHÂN',
    tagline: 'Bí kíp tuổi dậy thì không thể bỏ lỡ',
    summary: 'Hormone tăng trưởng GH tiết ra mạnh nhất từ 22h đến 2h sáng khi bạn ngủ thật say. Kèm theo đu xà và nhảy dây là combo vàng!',
    steps: [
      'Đi ngủ trước 22h tối, cất điện thoại trước khi lên giường 30 phút để ngủ sâu.',
      'Mỗi ngày nhảy dây 300 - 500 cái hoặc đu xà đơn giãn cơ 3 - 5 phút sau giờ học.',
      'Uống 1 hộp sữa tươi nguyên chất hoặc sữa hạt sau giờ ăn sáng hoặc chiều tan học.'
    ],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    accentColor: '#059669',
    iconName: 'Sparkles',
    studentQuote: '“Chỉ cần ngủ đủ giấc và bật nhảy mỗi ngày, thước đo chiều cao sẽ làm bạn bất ngờ sau một học kỳ!”',
    relatableScenario: 'Muốn cao hơn đứa bạn cùng bàn? Bắt đầu từ tối nay bằng việc tắt điện thoại lúc 21h45.',
    likesCount: 512,
  },
  {
    id: 'card-posture',
    topic: 'posture',
    topicLabel: '🎒 Chống Gù Lưng Học Đường',
    catchphrase: 'LƯNG THẲNG TỰ TIN - CẶP SÁCH 2 QUAI',
    tagline: 'Bảo vệ cột sống tuổi học trò',
    summary: 'Ngồi học khom lưng bấm điện thoại hoặc đeo cặp chéo 1 bên vai sẽ khiến cột sống bị vẹo. Lưng thẳng giúp bạn trông cao ráo và tỉnh táo hơn nhiều!',
    steps: [
      'Đeo cặp sách bằng CẢ HAI QUAI, chỉnh quai sao cho đáy cặp cao ngang thắt lưng.',
      'Quy tắc 1 nắm tay: Ngực cách mép bàn học khoảng 1 nắm tay, mắt cách vở 25-30cm.',
      'Cứ sau 45 phút học bài: Đứng dậy xoay vai ra sau 10 vòng và ngửa cổ nhìn trần nhà 15 giây.'
    ],
    gradient: 'from-sky-500 via-indigo-500 to-purple-600',
    accentColor: '#6366f1',
    iconName: 'ShieldCheck',
    studentQuote: '“Tập thói quen ngồi thẳng lưng không chỉ giúp đỡ mỏi mà mặc đồng phục chụp ảnh kỷ yếu cũng đẹp hơn!”',
    relatableScenario: 'Đeo cặp sách nặng trĩu mỗi sáng? Hãy chỉnh lại quai đeo và dọn bớt sách không cần thiết.',
    likesCount: 390,
  },
  {
    id: 'card-water',
    topic: 'water',
    topicLabel: '💧 Uống Nước Đầy Đủ',
    catchphrase: 'NƯỚC VÀO NÃO TỈNH - ĐIỂM SỐ TĂNG CAO',
    tagline: 'Bình nước cá nhân là bạn thân',
    summary: 'Khi cơ thể thiếu nước chỉ 2%, não bộ sẽ giảm 20% khả năng tập trung, khiến bạn ngáp ngắn ngáp dài trong giờ học.',
    steps: [
      'Mang theo bình nước 500ml đi học, đặt ngay góc bàn để tiện uống.',
      'Uống từng ngụm nhỏ sau mỗi tiết học, không uống ừng ực cả chai khi vừa chạy mệt.',
      'Hạn chế trà sữa ngọt khé hay nước ngọt có ga vì chúng chỉ làm bạn khát nước thêm.'
    ],
    gradient: 'from-cyan-500 via-blue-500 to-sky-600',
    accentColor: '#0284c7',
    iconName: 'Droplet',
    studentQuote: '“Một ngụm nước mát giờ ra chơi giúp bạn giải quyết đề toán khó trong vòng 1 nốt nhạc!”',
    relatableScenario: 'Tiết 3 bắt đầu thấy khô cổ và mắt díp lại? Uống ngay 3 ngụm nước lọc để reset não bộ nhé!',
    likesCount: 445,
  },
  {
    id: 'card-energy',
    topic: 'energy',
    topicLabel: '🍌 Nạp Pin Giờ Ra Chơi',
    catchphrase: 'ĂN VẶT THÔNG MINH - HỌC TẬP HẾT MÌNH',
    tagline: 'Thay trà sữa bằng đồ ăn tự nhiên',
    summary: 'Đồ ngọt nhiều đường làm đường huyết tăng vọt rồi tụt dốc khiến bạn mệt lả. Chọn chuối, khoai luộc hoặc sữa chua cho năng lượng bền bỉ cả buổi.',
    steps: [
      'Ăn sáng đàng hoàng: Bánh mì trứng, xôi lạc hoặc phở bò cung cấp năng lượng cho 4 tiết học.',
      'Bữa xế thể dục: 1 quả chuối trước khi tập 30 phút cung cấp kali chống chuột rút.',
      'Nhóm bạn cùng chia sẻ táo, ổi, sữa chua thay vì bim bim dầu mỡ hay đồ chiên rán cổng trường.'
    ],
    gradient: 'from-rose-500 via-pink-500 to-amber-500',
    accentColor: '#e11d48',
    iconName: 'Apple',
    studentQuote: '“Bụng đói cồn cào thì không giải nổi phương trình. Bữa sáng no nê là vũ khí bí mật của học sinh giỏi!”',
    relatableScenario: 'Giờ ra chơi chạy xuống căng tin phân vân? Hãy chọn sữa chua hoặc sữa tươi thay vì nước có ga.',
    likesCount: 318,
  },
  {
    id: 'card-pe-test',
    topic: 'pe_test',
    topicLabel: '🎯 Vượt Ải Kiểm Tra Thể Dục',
    catchphrase: 'TỰ TIN LẤY ĐIỂM 10 MÔN THỂ DỤC',
    tagline: 'Bật xa, nhảy dây, kéo xà chuẩn form',
    summary: 'Môn Thể dục không khó như bạn nghĩ! Bí quyết 90% nằm ở việc khởi động kĩ các khớp và giữ tâm lý thật thoải mái khi đến lượt gọi tên.',
    steps: [
      'Xoay kĩ khớp cổ tay, cổ chân, khớp gối và xoay hông trước khi vào bài kiểm tra.',
      'Nhảy dây: Nhảy bằng mũi chân, nhịp cổ tay nhẹ nhàng, tuyệt đối không nhảy cả bàn chân.',
      'Bật xa: Khi rơi xuống tiếp đất, khuỵu gối tạo góc 90 độ và vung tay ra trước để không bị ngã dập mông.'
    ],
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    accentColor: '#7c3aed',
    iconName: 'Trophy',
    studentQuote: '“Không có bạn nào yếu thể dục, chỉ là bạn chưa biết cách khởi động và điều chỉnh nhịp thở thôi!”',
    relatableScenario: 'Sắp đến lượt lên kiểm tra nhảy dây hay chạy 60m? Hít một hơi thật sâu và thả lỏng bắp tay nào!',
    likesCount: 602,
  },
];

export const STUDENT_HACKS: StudentHack[] = [
  {
    id: 'hack-side-stitch',
    question: 'Chạy bền bị nhói một bên bụng (xóc hông) thì xử lý thế nào?',
    relatableProblem: 'Đang chạy bon bon bỗng thấy một bên mạn sườn nhói đau dữ dội, không thể hít thở bình thường.',
    quickSolution: 'Giảm tốc độ chuyển sang đi bộ nhanh. Dùng 2 ngón tay ấn nhẹ vào điểm đau, gập người về phía trước một chút và thở ra thật sâu bằng miệng 3-5 lần.',
    whyItWorks: 'Xóc hông là do cơ hoành bị co thắt vì thiếu oxy hoặc ăn quá no trước khi chạy. Thở sâu giúp giải phóng áp lực cơ hoành ngay lập tức!',
    icon: '⚡',
    badgeTag: 'Cứu nguy chạy bền',
  },
  {
    id: 'hack-jump-rope',
    question: 'Tại sao nhảy dây cứ được 5-10 cái là bị vấp vào chân?',
    relatableProblem: 'Quạt tay mỏi rã rời mà dây cứ va vào ngón chân, nhảy mệt đứt hơi mà không đếm được số lần.',
    quickSolution: 'Chỉ nhảy cách mặt đất 2-3cm bằng mũi chân. Khép khuỷu tay sát sườn và CHỈ DÙNG CỔ TAY để xoay dây, đừng quạt cả cánh tay!',
    whyItWorks: 'Dùng cổ tay giúp dây quay với tốc độ đều và vòng dây ổn định, chân nhảy thấp giúp tiết kiệm 70% sức lực.',
    icon: '🪢',
    badgeTag: 'Kỷ lục nhảy dây',
  },
  {
    id: 'hack-sleepy-class',
    question: 'Tiết 3 - tiết 4 buồn ngủ rũ mắt, làm sao tỉnh táo không cần cà phê?',
    relatableProblem: 'Mắt díp lại, nghe tiếng thầy cô giảng như ru ngủ, đầu óc lờ đờ không thể chép bài.',
    quickSolution: 'Xoa hai bàn tay vào nhau cho thật nóng rồi áp lên mắt. Sau đó dùng ngón tay xoa vành tai 15 giây và uống 3 ngụm nước lọc mát.',
    whyItWorks: 'Vành tai tập trung nhiều dây thần kinh kích thích vỏ não. Xoa nóng tai và làm mát họng kích hoạt trạng thái tỉnh táo tức thì!',
    icon: '💡',
    badgeTag: 'Bí kíp chống gục',
  },
  {
    id: 'hack-cramp',
    question: 'Bị chuột rút bắp chân khi đá bóng hoặc bơi lội?',
    relatableProblem: 'Bắp chân cứng đờ như khúc gỗ, đau buốt không cử động được.',
    quickSolution: 'Ngồi xuống, duỗi thẳng chân ra. Nhờ bạn hoặc tự tay nắm chặt các ngón chân rồi KÉO NGƯỢC VỀ PHÍA ĐẦU GỐI, giữ yên 20 giây.',
    whyItWorks: 'Kéo ngược ngón chân giúp kéo giãn nhóm cơ bắp chuối đang bị co cứng đột ngột, giúp cơ thả lỏng trở lại.',
    icon: '🦵',
    badgeTag: 'Xử lý chuột rút',
  },
  {
    id: 'hack-heavy-backpack',
    question: 'Cặp sách nặng trĩu làm mỏi vai và gù lưng cả ngày?',
    relatableProblem: 'Đeo cặp sách 4-5kg khiến vai trĩu xuống, cổ rụt lại và lưng cong vòng.',
    quickSolution: 'Xếp sách vở nặng nhất sát vào vách lưng của cặp. Thu ngắn dây quai sao cho đáy cặp nằm đúng vùng eo, không thõng xuống mông.',
    whyItWorks: 'Trọng lượng sát người sẽ chuyển lực xuống hông thay vì kéo ghì khớp vai của bạn ra phía sau.',
    icon: '🎒',
    badgeTag: 'Cứu vai học trò',
  },
];

export const STUDENT_BADGES: StudentBadge[] = [
  {
    id: 'b-water-hero',
    title: 'Chiến Thần Nước Lọc',
    description: 'Uống đủ 8 ly nước trong ngày để tế bào não luôn tươi mới',
    icon: '💧',
    unlocked: true,
    progressText: 'Đã hoàn thành hôm nay (6/8 ly)',
    color: 'from-sky-400 to-blue-600',
  },
  {
    id: 'b-height-booster',
    title: 'Dũng Sĩ Bật Cao',
    description: 'Bật nhảy hoặc nhảy dây 10 phút kích thích sụn xương phát triển',
    icon: '🚀',
    unlocked: true,
    progressText: 'Chuỗi 3 ngày liên tiếp',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'b-back-champion',
    title: 'Lưng Thẳng Kiêu Hãnh',
    description: 'Hoàn thành bài tập 5 phút chống gù lưng sau giờ học bài',
    icon: '🧘',
    unlocked: true,
    progressText: 'Đã tập hôm qua',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    id: 'b-morning-energy',
    title: 'Chim Sớm Khởi Động',
    description: 'Tập bài xoay khớp buổi sáng trước khi đến trường',
    icon: '☀️',
    unlocked: false,
    progressText: 'Cần thêm 1 buổi sáng mai',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'b-fruit-master',
    title: 'Bậc Thầy Ăn Sạch',
    description: 'Chọn trái cây tươi & sữa hạt thay cho đồ ăn vặt nhiều đường',
    icon: '🍎',
    unlocked: false,
    progressText: 'Ghi nhật ký 2 bữa ăn lành mạnh',
    color: 'from-rose-400 to-red-500',
  },
];

export interface QuizQuestion {
  id: number;
  question: string;
  emoji: string;
  options: {
    label: string;
    text: string;
    animal: 'cheetah' | 'giraffe' | 'bear' | 'eagle';
    pointsHint: string;
  }[];
}

export const STUDENT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Giờ ra chơi 15-20 phút, bạn và nhóm bạn thường thích làm gì nhất?',
    emoji: '🔔',
    options: [
      { label: 'A', text: 'Chạy nhanh xuống sân đá cầu, rượt bắt, bắn bi rôm rả!', animal: 'cheetah', pointsHint: 'Nhanh nhẹn & bùng nổ' },
      { label: 'B', text: 'Ra cột bóng rổ ném bóng hoặc nhảy với xà đơn kéo giãn cơ thể', animal: 'giraffe', pointsHint: 'Đam mê chiều cao' },
      { label: 'C', text: 'Đi dạo quanh sân trường hít thở khí trời, nói chuyện dẻo dai', animal: 'bear', pointsHint: 'Bền bỉ & bình tĩnh' },
      { label: 'D', text: 'Chơi cầu lông, bóng bàn phản xạ nhanh thoăn thoắt', animal: 'eagle', pointsHint: 'Mắt sáng & chuẩn xác' },
    ],
  },
  {
    id: 2,
    question: 'Khi thầy giáo hô: "Hôm nay cả lớp kiểm tra chạy bền nhé!", bạn nghĩ gì?',
    emoji: '📢',
    options: [
      { label: 'A', text: 'Chạy luôn sợ gì, phóng về đích cho xong để được nghỉ sớm!', animal: 'cheetah', pointsHint: 'Tốc độ bùng nổ' },
      { label: 'B', text: 'Chân dài là lợi thế, sải bước dài nhẹ nhàng theo nhịp thở!', animal: 'giraffe', pointsHint: 'Tối ưu sải chân' },
      { label: 'C', text: 'Bật chế độ chạy bền tàng tàng, cứ hít 2 thở 2 kiểu gì cũng về đích!', animal: 'bear', pointsHint: 'Chiến thuật bền bỉ' },
      { label: 'D', text: 'Quan sát các bạn chạy trước để căn sức, chọn vị trí chạy hợp lý', animal: 'eagle', pointsHint: 'Chiến lược thông minh' },
    ],
  },
  {
    id: 3,
    question: 'Món "nạp pin" chân ái của bạn sau tiết thể dục toát mồ hôi là?',
    emoji: '🥤',
    options: [
      { label: 'A', text: 'Một quả chuối tiêu bẻ đôi nạp năng lượng tức thì', animal: 'cheetah', pointsHint: 'Kali & điện giải' },
      { label: 'B', text: 'Hộp sữa tươi nguyên chất mát lành cho xương chắc khỏe', animal: 'giraffe', pointsHint: 'Canxi & protein' },
      { label: 'C', text: 'Bình nước lọc mát lạnh uống từng ngụm chậm rãi sảng khoái', animal: 'bear', pointsHint: 'Bù nước tinh khiết' },
      { label: 'D', text: 'Sữa chua dầm hoa quả thanh mát, giải nhiệt tức thì', animal: 'eagle', pointsHint: 'Vitamin & khoáng' },
    ],
  },
  {
    id: 4,
    question: 'Mục tiêu thể chất số 1 bạn muốn đạt được trong năm học này là?',
    emoji: '🎯',
    options: [
      { label: 'A', text: 'Chạy nhanh nhất lớp, phản xạ nhanh như chớp', animal: 'cheetah', pointsHint: 'Tăng tốc độ' },
      { label: 'B', text: 'Tăng thêm 5-7cm chiều cao để không phải đứng đầu hàng!', animal: 'giraffe', pointsHint: 'Tăng chiều cao' },
      { label: 'C', text: 'Sức bền dồi dào, leo cầu thang hay chạy bền không thở dốc', animal: 'bear', pointsHint: 'Sức bền & tim phổi' },
      { label: 'D', text: 'Lưng thẳng tắp, cơ thể dẻo dai khỏe khoắn, kiểm tra thể dục điểm 10', animal: 'eagle', pointsHint: 'Thể hình toàn diện' },
    ],
  },
];

export interface QuizAnimalProfile {
  animal: 'cheetah' | 'giraffe' | 'bear' | 'eagle';
  name: string;
  title: string;
  avatarEmoji: string;
  badge: string;
  motto: string;
  description: string;
  superpower: string;
  schoolAdvice: string;
  recommendedRoutine: string;
}

export const ANIMAL_PROFILES: Record<string, QuizAnimalProfile> = {
  cheetah: {
    animal: 'cheetah',
    name: 'Báo Thủ Tốc Độ',
    title: 'Ngôi Sao Nước Rút Học Đường',
    avatarEmoji: '🐆',
    badge: 'Tốc độ & Phản xạ',
    motto: '“Nhanh như chớp, xuất phát là dẫn đầu!”',
    description: 'Bạn có sợi cơ phản xạ nhanh bẩm sinh, thích các môn thể thao đòi hỏi sự bùng nổ như chạy cự ly ngắn 60m-100m, đá cầu, bóng đá mini.',
    superpower: 'Khả năng bứt tốc tuyệt vời trong các hiệp đấu ngắn!',
    schoolAdvice: 'Hãy chú ý khởi động thật kỹ các khớp cổ chân và gân kheo trước khi bung sức để tránh căng cơ nhé!',
    recommendedRoutine: 'Bài tập khởi động toàn diện & Bật nhảy Jumping Jacks.',
  },
  giraffe: {
    animal: 'giraffe',
    name: 'Hươu Cao Bứt Phá',
    title: 'Chiến Binh Chinh Phục Chiều Cao',
    avatarEmoji: '🦒',
    badge: 'Cao ráo & Sải bước',
    motto: '“Vươn cao mỗi ngày, ngắm nhìn bầu trời rộng mở!”',
    description: 'Bạn đang ở giai đoạn vàng của sự phát triển chiều cao. Các động tác kéo giãn, bóng rổ, bơi lội và đu xà chính là người bạn thân nhất của bạn.',
    superpower: 'Khả năng bật nhảy kéo giãn và sải chân dài thênh thang!',
    schoolAdvice: 'Ngủ đủ trước 22h đêm và duy trì 1-2 hộp sữa tươi mỗi ngày để sụn tiếp hợp phát triển tối đa nhé!',
    recommendedRoutine: 'Bài tập kéo giãn phát triển chiều cao & đu xà.',
  },
  bear: {
    animal: 'bear',
    name: 'Gấu Bền Bỉ Kiên Cường',
    title: 'Chiến Thần Chạy Bền 1500m',
    avatarEmoji: '🐻',
    badge: 'Ý chí & Bền bỉ',
    motto: '“Chậm mà chắc, không gì cản bước ta về đích!”',
    description: 'Bạn có sức bền tim phổi tuyệt vời và tinh thần thép. Không bao giờ bỏ cuộc giữa chừng dù chặng đường có dốc hay mệt đến đâu.',
    superpower: 'Nhịp thở ổn định và khả năng duy trì phong độ đường dài!',
    schoolAdvice: 'Đừng quên nạp nước từng ngụm nhỏ và bổ sung tinh bột chậm (khoai, ngô, yến mạch) để pin cơ thể luôn đầy ắp!',
    recommendedRoutine: 'Bài tập chạy bền theo nhịp thở & Squat tăng sức mạnh chân.',
  },
  eagle: {
    animal: 'eagle',
    name: 'Đại Bàng Sáng Suốt',
    title: 'Bậc Thầy Kỹ Thuật & Cột Sống Đẹp',
    avatarEmoji: '🦅',
    badge: 'Tư thế & Phong thái',
    motto: '“Lưng thẳng như tùng, mắt sáng như sao!”',
    description: 'Bạn luôn chú trọng tư thế chuẩn mực, lưng thẳng tự tin và tinh thần minh mẫn. Kiểm tra thể dục luôn đạt điểm xuất sắc nhờ làm đúng từng động tác.',
    superpower: 'Tư thế chuẩn chỉnh và khả năng tập trung cao độ trong giờ học!',
    schoolAdvice: 'Giữ vững thói quen vươn vai sau mỗi tiết học và chia đều trọng lượng cặp sách trên hai vai!',
    recommendedRoutine: 'Bài tập chống gù lưng & giải lao 5 phút giữa giờ.',
  },
};
