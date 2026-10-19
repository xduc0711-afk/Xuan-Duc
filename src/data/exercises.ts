import { Exercise, WorkoutRoutine } from '../types';

export const EXERCISES: Exercise[] = [
  // Nhóm 1: Thể dục phát triển chung & Khởi động
  {
    id: 'ex-warmup-joints',
    name: 'Xoay các khớp toàn thân',
    category: 'warmup',
    level: 'Mọi lứa tuổi',
    durationSeconds: 45,
    repsText: '2 lần 8 nhịp mỗi khớp',
    caloriesBurnedApprox: 15,
    targetMuscles: ['Cổ tay', 'Khuỷu tay', 'Khớp vai', 'Khớp gối', 'Cổ chân'],
    benefits: [
      'Bôi trơn các bao hoạt dịch khớp xương',
      'Làm nóng cơ thể, phòng tránh chuột rút và bong gân',
      'Tăng lưu thông máu chuẩn bị cho vận động'
    ],
    mistakes: [
      'Xoay giật cục hoặc quá mạnh làm trật khớp',
      'Đứng chùng gối sai tư thế làm mất thăng bằng'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng hai chân rộng bằng vai, hai tay đan vào nhau xoay cổ tay kết hợp cổ chân.' },
      { stepNumber: 2, instruction: 'Chuyển sang đặt tay lên bả vai, xoay tròn từ trước ra sau rồi đổi chiều.' },
      { stepNumber: 3, instruction: 'Hai tay chạm gối xoay nhẹ từ ngoài vào trong và ngược lại.' }
    ],
    animationType: 'neck',
    badgeLabel: 'Chuẩn SGK Giáo Dục Thể Chất'
  },
  {
    id: 'ex-arm-chest-swing',
    name: 'Động tác Tay - Ngực học đường',
    category: 'warmup',
    level: 'Mọi lứa tuổi',
    durationSeconds: 40,
    repsText: '2 lần 8 nhịp',
    caloriesBurnedApprox: 20,
    targetMuscles: ['Cơ ngực', 'Cơ bả vai', 'Cơ tay trước'],
    benefits: [
      'Mở rộng lồng ngực, tăng dung tích sống của phổi',
      'Giúp học sinh hít thở sâu, nạp oxy cho não bộ minh mẫn',
      'Giảm gù lưng và mỏi vai khi mang cặp sách nặng'
    ],
    mistakes: [
      'Tay đưa lỏng lẻo không thẳng khuỷu tay',
      'Gập cổ về phía trước khi mở ngực'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Nhịp 1: Chân trái bước sang ngang, hai tay dang ngang lòng bàn tay úp.' },
      { stepNumber: 2, instruction: 'Nhịp 2: Hai tay gập trước ngực, vỗ nhẹ hoặc mở rộng ra sau căng ngực.' },
      { stepNumber: 3, instruction: 'Nhịp 3-4: Lặp lại và đổi chân, giữ lưng thẳng tự nhiên.' }
    ],
    animationType: 'arm_swing',
    badgeLabel: 'Tăng Dung Tích Phổi'
  },
  {
    id: 'ex-jumping-jacks',
    name: 'Nhảy dang tay chân (Jumping Jacks)',
    category: 'warmup',
    level: 'Mọi lứa tuổi',
    durationSeconds: 45,
    repsText: '30 - 45 giây liên tục',
    caloriesBurnedApprox: 45,
    targetMuscles: ['Toàn thân', 'Cơ bắp chân', 'Vai', 'Tim mạch'],
    benefits: [
      'Tăng nhịp tim khỏe mạnh, đốt cháy năng lượng nhanh',
      'Rèn luyện sự phối hợp nhịp nhàng giữa tay và chân',
      'Kích hoạt trạng thái hưng phấn, xua tan buồn ngủ trong giờ học'
    ],
    mistakes: [
      'Tiếp đất bằng cả bàn chân dội lực lên đầu gối (cần tiếp đất bằng nửa trước bàn chân)',
      'Nín thở trong khi nhảy'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng nghiêm, hai chân khép sát, hai tay buông xuôi bên thân.' },
      { stepNumber: 2, instruction: 'Bật nhảy nhẹ, đồng thời mở hai chân sang hai bên rộng hơn vai và đưa hai tay vỗ trên đỉnh đầu.' },
      { stepNumber: 3, instruction: 'Bật nhảy lần nữa để thu chân và tay về tư thế chuẩn bị, tiếp đất êm ái.' }
    ],
    animationType: 'jumping_jack',
    badgeLabel: 'Khởi Động Nhanh'
  },

  // Nhóm 2: Chống gù lưng & Mỏi cổ vai gáy
  {
    id: 'ex-neck-relief',
    name: 'Kéo giãn cơ cổ 4 hướng',
    category: 'posture',
    level: 'Mọi lứa tuổi',
    durationSeconds: 40,
    repsText: 'Giữ 8 giây mỗi bên',
    caloriesBurnedApprox: 10,
    targetMuscles: ['Cơ cổ', 'Cơ thang trên', 'Đốt sống cổ'],
    benefits: [
      'Giải tỏa áp lực lên đốt sống cổ do cúi nhìn vở hoặc màn hình',
      'Giúp máu lưu thông lên não, giảm nhức đầu và mỏi mắt',
      'Cải thiện vóc dáng thẳng đầu tự nhiên'
    ],
    mistakes: [
      'Dùng tay giật mạnh cổ sang bên gây tổn thương đốt sống',
      'Nâng vai lên khi nghiêng đầu'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Ngồi hoặc đứng thẳng lưng, mắt nhìn thẳng.' },
      { stepNumber: 2, instruction: 'Nhẹ nhàng nghiêng đầu sang phải, tay phải đặt hờ qua đỉnh đầu trợ lực nhẹ.' },
      { stepNumber: 3, instruction: 'Giữ 8 giây rồi từ từ trở về, làm tương tự với bên trái, cúi nhẹ và ngửa cổ vừa phải.' }
    ],
    animationType: 'neck',
    badgeLabel: 'Chống Mỏi Khi Học'
  },
  {
    id: 'ex-w-to-y-stretch',
    name: 'Kéo căng bả vai chữ W - Y',
    category: 'posture',
    level: 'THCS',
    durationSeconds: 45,
    repsText: '10 - 12 lần',
    caloriesBurnedApprox: 18,
    targetMuscles: ['Cơ trám', 'Cơ lưng trên', 'Cơ ngực'],
    benefits: [
      'Khắc phục triệt để tật gù lưng và vai bị cuộn về phía trước do bàn học thấp',
      'Định hình khung xương thẳng đẹp cho tuổi dậy thì',
      'Tạo thói quen ngồi học ngay ngắn, tự tin'
    ],
    mistakes: [
      'Ưỡn bụng quá mức làm đau thắt lưng',
      'Gồng cổ thay vì siết bả vai'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng sát tường hoặc đứng thẳng, đưa hai cánh tay tạo hình chữ W hai bên sườn.' },
      { stepNumber: 2, instruction: 'Ép hai bả vai về sau gần nhau, hít sâu giữ 2 giây.' },
      { stepNumber: 3, instruction: 'Thở ra từ từ vươn tay lên tạo thành chữ Y, rồi hạ lại chữ W nhịp nhàng.' }
    ],
    animationType: 'stretch',
    badgeLabel: 'Dáng Chuẩn Học Đường'
  },
  {
    id: 'ex-cobra-stretch',
    name: 'Tư thế vươn lưng rắn hổ mang',
    category: 'posture',
    level: 'THCS',
    durationSeconds: 50,
    repsText: 'Giữ 15 giây x 3 hiệp',
    caloriesBurnedApprox: 20,
    targetMuscles: ['Cơ dựng sống lưng', 'Cơ bụng', 'Cơ ngực'],
    benefits: [
      'Kéo giãn toàn bộ mặt trước cơ thể, thư giãn cột sống sau giờ ngồi dài',
      'Tăng độ dẻo dai và bảo vệ đĩa đệm lưng',
      'Giúp lồng ngực mở rộng tự nhiên'
    ],
    mistakes: [
      'Gập ngửa cổ quá sâu gây chèn ép gáy',
      'Nhấc hông rời khỏi mặt sàn'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Nằm sấp trên thảm, hai bàn tay đặt ngang ngực, mu bàn chân úp xuống sàn.' },
      { stepNumber: 2, instruction: 'Hít sâu, dùng cơ lưng và lực tay đẩy nhẹ ngực lên khỏi sàn, giữ khuỷu tay hơi cong.' },
      { stepNumber: 3, instruction: 'Mở vai ra sau, mắt nhìn chếch lên 45 độ, thở đều trong 15 giây.' }
    ],
    animationType: 'back_arch',
    badgeLabel: 'Phục Hồi Cột Sống'
  },

  // Nhóm 3: Tăng chiều cao & Kéo giãn
  {
    id: 'ex-reach-to-sky',
    name: 'Vươn người kiễng gót đón ánh nắng',
    category: 'height',
    level: 'Mọi lứa tuổi',
    durationSeconds: 40,
    repsText: '10 lần kiễng giữ 3 giây',
    caloriesBurnedApprox: 15,
    targetMuscles: ['Cột sống', 'Cơ bắp chân', 'Toàn bộ thân người'],
    benefits: [
      'Kích thích sụn tiếp hợp ở đầu xương dài phát triển',
      'Kéo dài các đốt sống, giải tỏa áp lực đè nén ban ngày',
      'Tăng cường sự cân bằng và linh hoạt của cổ chân'
    ],
    mistakes: [
      'Mất thăng bằng ngã ra sau do nhìn ngửa quá mức',
      'Không kiễng cao hết biên độ ngón chân'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng thẳng, hai chân khép nhẹ, hai tay đan ngón vào nhau.' },
      { stepNumber: 2, instruction: 'Hít sâu, lật lòng bàn tay hướng lên trần nhà và vươn tay hết mức có thể.' },
      { stepNumber: 3, instruction: 'Đồng thời kiễng cao gót chân, giữ thăng bằng 3 giây rồi thở ra hạ gót nhẹ nhàng.' }
    ],
    animationType: 'stretch',
    badgeLabel: 'Kích Thích Chiều Cao'
  },
  {
    id: 'ex-jump-rope-simulation',
    name: 'Bật nhảy dây nhịp điệu',
    category: 'height',
    level: 'Mọi lứa tuổi',
    durationSeconds: 60,
    repsText: '60 - 80 nhịp nhảy',
    caloriesBurnedApprox: 55,
    targetMuscles: ['Xương cẳng chân', 'Khớp gối', 'Cơ bắp chân', 'Cổ chân'],
    benefits: [
      'Tạo lực tác động theo phương thẳng đứng kích thích tăng sinh tế bào xương',
      'Bài tập vàng được các bác sĩ khuyên dùng cho tuổi dậy thì',
      'Cải thiện tốc độ phản xạ và sự dẻo dai'
    ],
    mistakes: [
      'Nhảy quá cao tốn sức hoặc tiếp đất dội mạnh vào gót chân',
      'Căng cứng cánh tay khi xoay'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Hai bàn tay nắm hờ hai bên hông như đang cầm dây nhảy.' },
      { stepNumber: 2, instruction: 'Bật nhảy liên tục cách mặt đất 3-5cm, tiếp đất nhẹ nhàng bằng nửa trước bàn chân.' },
      { stepNumber: 3, instruction: 'Cổ tay xoay vòng tròn nhịp nhàng theo từng bước nhảy, hít thở đều đặn.' }
    ],
    animationType: 'jumping_jack',
    badgeLabel: 'Tăng Trưởng Xương'
  },
  {
    id: 'ex-standing-forward-bend',
    name: 'Gập người chạm mũi chân',
    category: 'height',
    level: 'THCS',
    durationSeconds: 45,
    repsText: 'Giữ 10 giây x 3 lần',
    caloriesBurnedApprox: 18,
    targetMuscles: ['Gân kheo (sau đùi)', 'Bắp chân', 'Cột sống thắt lưng'],
    benefits: [
      'Kéo giãn toàn bộ chuỗi cơ mặt sau cơ thể',
      'Tăng độ dẻo dai của cột sống và khớp háng',
      'Giúp cơ thể không bị co rút do ngồi học lâu'
    ],
    mistakes: [
      'Cố gập cong lưng lưng tôm thay vì gập từ khớp háng',
      'Khóa cứng khớp gối quá mức gây đau nhói sau gối'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng thẳng, hít vào vươn hai tay lên cao qua đầu.' },
      { stepNumber: 2, instruction: 'Thở ra, từ từ gập người về phía trước từ khớp háng, giữ lưng dài thẳng.' },
      { stepNumber: 3, instruction: 'Đưa tay chạm dần vào cẳng chân, cổ chân hoặc mũi chân tùy độ dẻo, thả lỏng đầu cổ.' }
    ],
    animationType: 'toe_touch',
    badgeLabel: 'Dẻo Dai Cột Sống'
  },

  // Nhóm 4: Thể lực & Sức bền học sinh
  {
    id: 'ex-high-knees',
    name: 'Nâng cao đùi tại chỗ',
    category: 'strength',
    level: 'THCS',
    durationSeconds: 45,
    repsText: '40 - 50 nhịp bước',
    caloriesBurnedApprox: 50,
    targetMuscles: ['Cơ gập hông', 'Cơ đùi trước', 'Cơ bụng dưới', 'Tim mạch'],
    benefits: [
      'Bài tập cốt lõi trong phân môn Chạy cự ly ngắn môn Thể Dục',
      'Phát triển sức mạnh cơ đùi và tốc độ phản xạ của đôi chân',
      'Đốt cháy mỡ thừa và rèn luyện dung tích phổi'
    ],
    mistakes: [
      'Ngả người ra sau khi nâng chân làm mất lực',
      'Đùi không nâng vuông góc với thân'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng thẳng, hai tay gập 90 độ ở khuỷu tay chuẩn bị đánh tay đối diện.' },
      { stepNumber: 2, instruction: 'Nâng đùi phải lên cao ngang tầm thắt lưng (vuông góc 90 độ), tay trái đánh về trước.' },
      { stepNumber: 3, instruction: 'Đổi chân liên tục với nhịp điệu nhanh dần, tiếp đất bằng ức bàn chân.' }
    ],
    animationType: 'high_knees',
    badgeLabel: 'Chuẩn Điểm 10 Môn Chạy'
  },
  {
    id: 'ex-student-squat',
    name: 'Đứng lên ngồi xuống (Squat học đường)',
    category: 'strength',
    level: 'Mọi lứa tuổi',
    durationSeconds: 50,
    repsText: '12 - 15 lần',
    caloriesBurnedApprox: 40,
    targetMuscles: ['Cơ tứ đầu đùi', 'Cơ mông', 'Khớp gối', 'Cơ lõi bụng'],
    benefits: [
      'Tăng sức mạnh đôi chân phục vụ môn Nhảy xa, Bật xa và Đá bóng',
      'Củng cố gân khớp gối khỏe mạnh, chống chấn thương',
      'Cải thiện sự thăng bằng và sức chịu đựng'
    ],
    mistakes: [
      'Đầu gối chụm vào nhau (phải mở đầu gối theo hướng mũi chân)',
      'Gót chân bị nhấc lên khỏi mặt đất'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Đứng hai chân rộng hơn vai một chút, mũi chân hơi chếch 15 độ, hai tay đan trước ngực.' },
      { stepNumber: 2, instruction: 'Hít vào, từ từ đẩy hông ra sau và hạ đùi xuống như đang ngồi vào ghế, đùi song song sàn.' },
      { stepNumber: 3, instruction: 'Thở ra, dùng lực gót chân đẩy người đứng thẳng dậy về vị trí ban đầu.' }
    ],
    animationType: 'squat',
    badgeLabel: 'Bật Xa Tốt Hơn'
  },
  {
    id: 'ex-knee-pushup',
    name: 'Chống đẩy gối hoặc chống tường',
    category: 'strength',
    level: 'THCS',
    durationSeconds: 45,
    repsText: '8 - 12 lần',
    caloriesBurnedApprox: 35,
    targetMuscles: ['Cơ tay sau', 'Cơ ngực', 'Cơ vai', 'Cơ bụng'],
    benefits: [
      'Tăng lực cơ tay phục vụ môn Ném bóng, Bóng rổ, Cầu lông',
      'Phù hợp với thể trạng học sinh, không gây quá tải khớp vai',
      'Tăng cường sức mạnh thân trên'
    ],
    mistakes: [
      'Võng lưng hoặc chổng mông quá cao',
      'Khuỷu tay tòe ngang 90 độ làm đau khớp vai'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Chống hai tay xuống sàn rộng hơn vai một chút, hai đầu gối chạm sàn, thân tạo thành đường thẳng.' },
      { stepNumber: 2, instruction: 'Hít vào, từ từ gập khuỷu tay hạ ngực gần chạm sàn, giữ cổ thẳng.' },
      { stepNumber: 3, instruction: 'Thở ra, dùng lực ngực và tay đẩy người trở lại vị trí ban đầu.' }
    ],
    animationType: 'plank',
    badgeLabel: 'Khỏe Tay Ném Xa'
  },

  // Nhóm 5: Vận động 5 phút giữa giờ học
  {
    id: 'ex-desk-recess',
    name: 'Thư giãn cơ thể & Massage mắt giữa giờ',
    category: 'recess',
    level: 'Mọi lứa tuổi',
    durationSeconds: 60,
    repsText: 'Thực hiện 2 lượt',
    caloriesBurnedApprox: 10,
    targetMuscles: ['Cơ mắt', 'Cơ cổ vai gáy', 'Cổ tay cầm bút'],
    benefits: [
      'Giảm mỏi mắt, ngăn ngừa cận thị học đường do nhìn gần liên tục',
      'Giảm tê bì ngón tay và cổ tay sau khi ghi chép nhiều',
      'Giúp bộ não tỉnh táo, tiếp thu bài học tiếp theo tốt hơn'
    ],
    mistakes: [
      'Dụi mắt bằng ngón tay chưa rửa sạch',
      'Vặn cổ phát ra tiếng rắc mạnh gây hại sụn khớp'
    ],
    steps: [
      { stepNumber: 1, instruction: 'Chà xát hai lòng bàn tay vào nhau cho thật ấm rồi nhẹ nhàng áp lên hai mắt trong 10 giây.' },
      { stepNumber: 2, instruction: 'Nhìn ra xa qua cửa sổ ngắm cây xanh ít nhất 20 giây để điều tiết mắt.' },
      { stepNumber: 3, instruction: 'Đan các ngón tay xoay tròn cổ tay nhẹ nhàng, vươn người hít sâu 3 nhịp.' }
    ],
    animationType: 'stretch',
    badgeLabel: 'Bảo Vệ Đôi Mắt'
  }
];

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-standard-pe',
    title: 'Bài Thể Dục Khởi Động Chuẩn Bộ GD&ĐT',
    subtitle: '8 động tác toàn diện khởi động trước tiết học thể dục',
    category: 'warmup',
    durationMinutes: 7,
    targetAudience: 'Học sinh từ lớp 1 đến lớp 12',
    description: 'Quy trình khởi động bài bản giúp bôi trơn các khớp, tăng nhịp tim dần dần và phòng chống mọi nguy cơ chấn thương thể thao học đường.',
    colorTheme: 'emerald',
    exercises: [
      EXERCISES[0], // Xoay khớp
      EXERCISES[1], // Tay ngực
      EXERCISES[2], // Jumping Jacks
      EXERCISES[6], // Vươn người kiễng gót
      EXERCISES[9], // Nâng cao đùi
    ]
  },
  {
    id: 'routine-anti-slouch',
    title: 'Giải Cứu Cột Sống - Chống Gù & Mỏi Vai',
    subtitle: 'Dành riêng cho học sinh ngồi bàn học nhiều hoặc xem màn hình',
    category: 'posture',
    durationMinutes: 6,
    targetAudience: 'Học sinh hay bị mỏi cổ, gù lưng, mỏi gáy',
    description: 'Bộ động tác kéo giãn chuyên sâu giúp mở rộng lồng ngực, kéo giãn đốt sống cổ và trả lại vóc dáng đứng thẳng thanh lịch, tự tin.',
    colorTheme: 'blue',
    exercises: [
      EXERCISES[3], // Kéo giãn cổ 4 hướng
      EXERCISES[4], // Kéo căng W - Y
      EXERCISES[5], // Rắn hổ mang
      EXERCISES[8], // Gập người chạm mũi chân
    ]
  },
  {
    id: 'routine-height-boost',
    title: 'Kích Hoạt Chiều Cao Tuổi Dậy Thì',
    subtitle: 'Kéo giãn sụn khớp & tác động xương phát triển tối đa',
    category: 'height',
    durationMinutes: 8,
    targetAudience: 'Học sinh 10 - 18 tuổi muốn bứt phá chiều cao',
    description: 'Tập hợp các bài tập nhảy theo trục dọc và kéo căng toàn thân giúp kích thích hormone tăng trưởng và kéo dài các đĩa sụn xương đùi.',
    colorTheme: 'amber',
    exercises: [
      EXERCISES[6], // Vươn người kiễng gót
      EXERCISES[7], // Bật nhảy dây nhịp điệu
      EXERCISES[8], // Gập người chạm mũi chân
      EXERCISES[10], // Squat học đường
    ]
  },
  {
    id: 'routine-5min-recess',
    title: 'Nạp Lại Năng Lượng 5 Phút Ra Chơi',
    subtitle: 'Tập ngay tại chỗ ngồi giữa 2 tiết học',
    category: 'recess',
    durationMinutes: 4,
    targetAudience: 'Mọi học sinh trong giờ nghỉ giải lao',
    description: 'Xua tan cơn buồn ngủ, giảm áp lực cho mắt và cổ tay sau 45 phút ghi bài tập trung.',
    colorTheme: 'purple',
    exercises: [
      EXERCISES[12], // Thư giãn cơ thể & Massage mắt
      EXERCISES[3], // Kéo giãn cổ 4 hướng
      EXERCISES[1], // Tay ngực
    ]
  }
];
