import { AIMealPlan } from '../src/types';

export const FALLBACK_AI_MEAL_PLANS: Record<string, AIMealPlan> = {
  height: {
    title: 'Thực Đơn Tăng Chiều Cao Đột Phá Lứa Tuổi Học Sinh',
    goal: 'Tăng Chiều Cao & Phát Triển Khung Xương',
    targetCalories: 2150,
    summary: 'Thực đơn tập trung tối đa vào Canxi sinh học, Vitamin D3, Magie và Đạm tinh khiết từ sữa tươi, cá hồi, trứng gà và rau sẫm màu để kích thích sụn xương dài ra mạnh mẽ trong giai đoạn vàng dậy thì.',
    breakfast: {
      name: 'Cháo Yến Mạch Nấu Sữa Tươi, Chuối Lát & 1 Trứng Gà Luộc',
      portion: '1 tô cháo vừa + 1 quả trứng',
      caloriesApprox: 420,
      proteinApprox: '22g',
      keyNutrients: 'Canxi tự nhiên, Protein chất lượng cao, Vitamin B complex',
      whyGoodForStudents: 'Cung cấp năng lượng bền bỉ cho não bộ, đồng thời khởi động quá trình hấp thu canxi ngay từ sáng sớm.',
      preparationTip: 'Nấu yến mạch 3 phút với sữa tươi nguyên kem, thêm 1 quả chuối chín thái lát mỏng.'
    },
    lunch: {
      name: 'Cơm Gạo Tẻ, Cá Hồi Hoặc Cá Nục Kho Thơm, Canh Cua Rau Đay Mồng Tơi',
      portion: '1.5 chén cơm + 1 khúc cá lớn + 1 tô canh',
      caloriesApprox: 720,
      proteinApprox: '36g',
      keyNutrients: 'Canxi hữu cơ từ cua đồng, Omega-3 DHA, Vitamin D3',
      whyGoodForStudents: 'Canh cua mồng tơi là "kho tàng canxi" dân gian tuyệt vời, kết hợp cá béo giúp tăng mật độ xương vượt trội.',
      preparationTip: 'Nên ăn cả xương cá nhỏ ninh mềm nếu có để tận dụng nguồn canxi vô giá.'
    },
    snack: {
      name: '1 Hộp Sữa Tươi Tiệt Trùng Ít Đường (220ml) + 1 Quả Cam Sành Mọng Nước',
      portion: '1 hộp sữa + 1 quả cam',
      caloriesApprox: 210,
      proteinApprox: '8g',
      keyNutrients: 'Vitamin C kích thích sinh tổng hợp Collagen sụn khớp, Canxi',
      whyGoodForStudents: 'Vitamin C trong cam giúp ruột non hấp thu canxi từ sữa vào máu hiệu quả hơn 60%.',
      preparationTip: 'Dùng vào giờ ra chơi chiều (khoảng 15h30 - 16h00) trước khi tham gia lớp thể dục hoặc chơi bóng rổ.'
    },
    dinner: {
      name: 'Cơm Trắng, Thịt Nạc Thăn Xào Bông Cải Xanh Nấm Hương, Canh Đậu Hũ Rong Biển',
      portion: '1 chén cơm + 1 đĩa xào vừa + 1 bát canh',
      caloriesApprox: 600,
      proteinApprox: '32g',
      keyNutrients: 'I-ốt, Kẽm, Canxi thực vật từ đậu hũ và bông cải xanh',
      whyGoodForStudents: 'Cung cấp Kẽm giúp tuyến yên tiết hormone tăng trưởng (GH) đạt đỉnh trong giấc ngủ đêm lúc 23h - 2h sáng.',
      preparationTip: 'Ăn tối trước 19h30 và nhớ đi ngủ trước 22h30 để tuyến yên hoạt động tối đa.'
    },
    hydrationAdvice: 'Uống tối thiểu 1.8 - 2.2 lít nước lọc mỗi ngày, chia đều làm 8 cốc. Đĩa sụn tiếp hợp cần nước để luôn mềm mại và kéo giãn tốt khi nhảy cao, đu xà.',
    physicalExerciseTip: 'Tập bài Nhảy dây 500-1000 cái/ngày hoặc bài Bật nhảy vươn người, đu xà đơn 15 phút vào buổi chiều để kéo giãn sụn khớp tối đa.'
  },
  strength: {
    title: 'Thực Đơn Tăng Thể Lực, Sức Bền & Cơ Bắp Thể Dục',
    goal: 'Tăng Cường Thể Lực & Sức Bền Vận Động',
    targetCalories: 2300,
    summary: 'Dành riêng cho học sinh tập luyện thể dục, chuẩn bị thi chạy bền 1500m, bóng đá, bóng chuyền hoặc rèn luyện thể lực săn chắc. Giàu carbohydrate phức và protein phục hồi cơ bắp.',
    breakfast: {
      name: 'Bánh Mì Thịt Nạc Trứng Ốp La + 1 Ly Sữa Hạt Đậu Nành Tươi',
      portion: '1 ổ bánh mì kẹp 2 trứng/thịt nạc + 250ml sữa đậu nành',
      caloriesApprox: 520,
      proteinApprox: '28g',
      keyNutrients: 'Protein hoàn chỉnh, Tinh bột giải phóng vừa, Lecithin',
      whyGoodForStudents: 'Trứng cung cấp choline cho phản xạ thần kinh vận động nhạy bén và năng lượng dồi dào cả buổi tập.',
      preparationTip: 'Ốp la lòng đào vừa tới, hạn chế dùng quá nhiều mỡ lợn hoặc sốt béo ngấy.'
    },
    lunch: {
      name: 'Cơm Trắng Đầy Đặn, Ức Gà Xào Nấm Cay Nhẹ, Canh Bí Đao Nấu Tôm Tươi',
      portion: '2 chén cơm + 150g ức gà + 1 tô canh bí',
      caloriesApprox: 780,
      proteinApprox: '44g',
      keyNutrients: 'Axit amin phân nhánh (BCAA), Kali, Phốt pho',
      whyGoodForStudents: 'Nguồn đạm ức gà tinh khiết giúp sửa chữa vi tổn thương cơ bắp sau các bài tập thể lực nặng ở trường.',
      preparationTip: 'Cắt ức gà miếng vừa ăn, xào lửa to để thịt giữ độ ngọt mềm mọng nước.'
    },
    snack: {
      name: '2 Quả Chuối Tiêu Chín + 1 Hộp Sữa Chua Lên Men Tự Nhiên',
      portion: '2 quả chuối + 1 hộp sữa chua',
      caloriesApprox: 240,
      proteinApprox: '7g',
      keyNutrients: 'Kali, Magie chống chuột rút cơ bắp, Men vi sinh đường ruột',
      whyGoodForStudents: 'Kali trong chuối là khoáng chất điện giải số 1 giúp cơ bắp co giãn nhịp nhàng, triệt tiêu nguy cơ co rút khi chạy.',
      preparationTip: 'Ăn trước giờ tập thể dục hoặc thi đấu 30-40 phút.'
    },
    dinner: {
      name: 'Cơm Gạo Lứt (hoặc Gạo Trắng), Thịt Bò Xào Hành Tây Ớt Chuông, Đĩa Rau Muống Luộc',
      portion: '1.5 chén cơm + 120g thịt bò + rau muống chấm mắm gừng',
      caloriesApprox: 640,
      proteinApprox: '38g',
      keyNutrients: 'Sắt Heme dễ hấp thu, Creatine tự nhiên, Vitamin C từ ớt chuông',
      whyGoodForStudents: 'Sắt trong thịt bò tạo huyết sắc tố Hemoglobin vận chuyển oxy bền bỉ trong máu, giúp chạy bền không bị hụt hơi.',
      preparationTip: 'Thịt bò xào chín tái vừa để không bị dai và giữ trọn vẹn khoáng chất sắt.'
    },
    hydrationAdvice: 'Uống từng ngụm nhỏ 100-150ml mỗi 15-20 phút trong lúc vận động thể thao. Không uống ừng ực cả cốc to một lúc để tránh tức bụng sóc hông.',
    physicalExerciseTip: 'Kết hợp các bài Squat, Hít đất (Push-up) và Chạy nâng cao đùi 3 hiệp mỗi buổi để cơ đùi và cơ cốt lõi (core) luôn săn chắc.'
  },
  weight_loss: {
    title: 'Thực Đơn Giữ Dáng Thon Gọn & Tiêu Mỡ Khoa Học Học Đường',
    goal: 'Kiểm Soát Cân Nặng & Thon Gọn Vóc Dáng',
    targetCalories: 1650,
    summary: 'Tuyệt đối KHÔNG nhịn ăn hay kiêng khem mù quáng gây ngất xỉu trong giờ học. Thực đơn tập trung vào thực phẩm giàu chất xơ, đường huyết thấp (Low GI) giúp no lâu, tỉnh táo và đốt cháy mỡ thừa tự nhiên.',
    breakfast: {
      name: 'Khoai Lang Vàng Hấp Dẻo + 2 Quả Trứng Gà Luộc + 1 Quả Dưa Chuột',
      portion: '1 củ khoai vừa + 2 trứng luộc',
      caloriesApprox: 340,
      proteinApprox: '15g',
      keyNutrients: 'Tinh bột kháng, Chất xơ hòa tan, Vitamin A',
      whyGoodForStudents: 'Khoai lang tiêu hóa từ từ giúp đường huyết không tăng vọt, loại bỏ hoàn toàn cảm giác thèm ăn vặt ở căng tin.',
      preparationTip: 'Luộc khoai từ tối hôm trước, sáng hôm sau chỉ cần hâm nóng trong lò vi sóng 1 phút.'
    },
    lunch: {
      name: 'Cơm Trắng Vừa Phải (1 Bát Nhỏ), Đậu Phụ Sốt Cà Chua, Đĩa Rau Cải Xanh Luộc Chấm Trứng',
      portion: '1 bát cơm gạt ngang + 1 bìa đậu phụ + 1 đĩa rau to',
      caloriesApprox: 540,
      proteinApprox: '24g',
      keyNutrients: 'Chất xơ tự nhiên, Isoflavone, Folate thực vật',
      whyGoodForStudents: 'Ăn rau xanh trước khi ăn cơm giúp tạo một lớp lưới chất xơ ngăn hấp thụ chất béo dư thừa vào cơ thể.',
      preparationTip: 'Luôn duy trì quy tắc: 1/2 đĩa là rau xanh củ quả, 1/4 đĩa là chất đạm, 1/4 đĩa là cơm/tinh bột.'
    },
    snack: {
      name: '1 Quả Táo Tươi Hoặc 1 Quả Lê Thái Lát + 1 Cốc Nước Lọc Mát',
      portion: '1 quả táo giòn',
      caloriesApprox: 95,
      proteinApprox: '1g',
      keyNutrients: 'Pectin chất xơ hòa tan, Vitamin C, Nước sinh học',
      whyGoodForStudents: 'Pectin trương nở trong dạ dày đánh bay cơn đói giờ tan học, giúp học sinh không bị cám dỗ bởi trà sữa và đồ chiên rán trước cổng trường.',
      preparationTip: 'Rửa sạch ngâm nước muối loãng và ăn cả vỏ để lấy trọn vẹn chất xơ Pectin.'
    },
    dinner: {
      name: 'Cá Trắm/Cá Hấp Gừng Hành (hoặc Tôm Luộc), Canh Rau Ngót Nấu Thịt Bằm Ít Dầu',
      portion: '1 khúc cá hấp + 1 bát canh lớn (hạn chế cơm trắng buổi tối)',
      caloriesApprox: 460,
      proteinApprox: '32g',
      keyNutrients: 'Chất đạm dễ tiêu hóa, Vitamin K, Canxi',
      whyGoodForStudents: 'Bữa tối nhẹ bụng giúp dạ dày được nghỉ ngơi, ngủ sâu giấc và cơ thể chuyển sang trạng thái đốt mỡ tự nhiên.',
      preparationTip: 'Tránh ăn sau 20h00 tối. Nếu thấy đói muộn, chỉ nên uống 1 cốc nước ấm hoặc vài lát dưa leo.'
    },
    hydrationAdvice: 'Uống đủ 2 - 2.5 lít nước lọc ấm mỗi ngày. Uống 1 ly nước đầy 30 phút trước mỗi bữa ăn chính để tăng cường trao đổi chất.',
    physicalExerciseTip: 'Tập bài Nhảy dây tốc độ vừa 15-20 phút, bài Plank bụng 3 hiệp x 45 giây và đi bộ nhanh quanh sân trường trong giờ giải lao.'
  },
  study_energy: {
    title: 'Thực Đơn Tăng Tập Trung Trí Não & Năng Lượng Học Tập',
    goal: 'Tăng Cường Trí Nhớ & Đạt Kết Quả Cao',
    targetCalories: 2000,
    summary: 'Tối ưu hóa các chất dinh dưỡng thần kinh (Choline, Omega-3, Axit Folic, Kẽm, Vitamin nhóm B) giúp tế bào não dẫn truyền tín hiệu nhanh chóng, ghi nhớ bài học lâu hơn và chống buồn ngủ trong giờ học.',
    breakfast: {
      name: 'Bún / Phở Bò Tươi Hoặc Phở Gà Thơm Lừng + 1 Quả Trứng Trần',
      portion: '1 bát phở vừa nước trong + 1 trứng',
      caloriesApprox: 480,
      proteinApprox: '26g',
      keyNutrients: 'Nước dùng ninh xương giàu khoáng chất, Kẽm, Sắt, Vitamin B12',
      whyGoodForStudents: 'Một bát phở nóng hổi ấm bụng đánh thức toàn bộ giác quan, cung cấp đường glucose đều đặn lên vỏ não.',
      preparationTip: 'Nên dặn người bán lấy nước dùng trong, không lấy thêm mỡ ngấy (nước béo).'
    },
    lunch: {
      name: 'Cơm Tấm Cơm Trắng, Trứng Đúc Thịt Băm Nấm Mèo, Canh Bí Đỏ Hầm Xương',
      portion: '1.5 chén cơm + 1 miếng trứng thịt lớn + 1 bát canh bí đỏ',
      caloriesApprox: 680,
      proteinApprox: '30g',
      keyNutrients: 'Axit Glutamic trong bí đỏ nuôi dưỡng não bộ, Choline từ trứng',
      whyGoodForStudents: 'Bí đỏ được mệnh danh là "thực phẩm vàng cho trí não" học sinh, giúp tăng tuần hoàn máu não và giảm căng thẳng.',
      preparationTip: 'Bí đỏ hầm nhừ bùi ngậy, nêm chút hành ngò thơm tăng hương vị.'
    },
    snack: {
      name: 'Một Nắm Hạt Hạnh Nhân Hoặc Hạt Óc Chó (30g) + 1 Quả Chuối Chín',
      portion: '30g hạt dinh dưỡng + 1 quả chuối',
      caloriesApprox: 260,
      proteinApprox: '6g',
      keyNutrients: 'Axit béo Omega-3 thực vật (ALA), Magie, Vitamin E chống oxy hóa',
      whyGoodForStudents: 'Hạt óc chó và hạnh nhân bảo vệ màng tế bào thần kinh, chống lại căng thẳng oxy hóa khi giải toán và học thuộc lòng.',
      preparationTip: 'Mang sẵn 1 túi zip nhỏ hạt dinh dưỡng trong cặp sách để ăn vào giờ ra chơi tiết 3.'
    },
    dinner: {
      name: 'Cơm Gạo Tẻ, Tôm Rim Mặn Ngọt, Canh Cải Cúc Nấu Thịt Nạc',
      portion: '1 chén cơm + 8-10 con tôm rim + 1 bát canh',
      caloriesApprox: 580,
      proteinApprox: '34g',
      keyNutrients: 'Canxi, I-ốt, Vitamin nhóm B giúp an thần ngủ ngon',
      whyGoodForStudents: 'Rau cải cúc có tính mát, hương thơm nhẹ giúp làm dịu hệ thần kinh sau 1 ngày học tập căng thẳng, giúp vào giấc ngủ nhanh.',
      preparationTip: 'Ăn tôm nhai kỹ cả phần vỏ mỏng giòn để thu nhận thêm nguồn canxi dồi dào.'
    },
    hydrationAdvice: 'Tuyệt đối không uống nước tăng lực (Red Bull, Monster) hoặc trà sữa nhiều đường để "chống buồn ngủ" vì sẽ gây tụt đường huyết đột ngột và hồi hộp tim đập nhanh. Uống nước lọc ấm hoặc trà hoa cúc nhẹ.',
    physicalExerciseTip: 'Cứ sau mỗi 45-50 phút ngồi bàn học, đứng dậy thực hiện bài tập Cổ Vai Gáy 3 phút và vươn vai nhìn ra xa 20 giây để mắt thư giãn.'
  }
};
