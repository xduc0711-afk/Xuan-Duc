import { GoogleGenAI } from '@google/genai';
import { FlashcardDeck, FlashcardItem } from '../src/types';

export interface FlashcardGenerateRequest {
  topic: string;
  grade: string;
  subject?: string;
  cardCount?: number;
}

export const PRESET_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck_rice_first_aid',
    title: 'Sơ Cứu Chấn Thương & Quy Tắc R.I.C.E',
    topic: 'Sơ cứu chấn thương thể thao học đường',
    grade: 'Lớp 8',
    subject: 'Y tế & An toàn Thể chất',
    description: 'Bộ thẻ nhớ quy tắc cấp cứu tức thì khi bị lật sơ mi, bong gân, chuột rút và bầm tím trong giờ thể dục.',
    colorTheme: 'rose',
    createdAt: '2026-09-28T00:00:00.000Z',
    cards: [
      {
        id: 'fc_rice_1',
        frontTitle: 'Chữ R trong nguyên tắc R.I.C.E',
        frontSubtitle: 'Rest (Nghỉ ngơi tức thì)',
        frontCategoryTag: 'Nguyên tắc sơ cứu',
        backDefinition: 'Dừng ngay mọi hoạt động vận động, cố định vị trí chấn thương để tránh tổn thương thêm cho dây chằng và mạch máu.',
        backClassification: 'LOẠI: Xử trí ban đầu khẩn cấp (Phút thứ 0 - 5)',
        backExample: 'Khi bị tiếp đất lật cổ chân lúc nhảy cao, ngồi xuống sàn ngay lập tức, không cố đứng dậy đi tiếp.',
        backMemoryTip: 'R = Rest = Rời xa vận động ngay lập tức!',
      },
      {
        id: 'fc_rice_2',
        frontTitle: 'Chữ I trong nguyên tắc R.I.C.E',
        frontSubtitle: 'Ice (Chườm lạnh / Túi đá)',
        frontCategoryTag: 'Giảm đau & Tiêu sưng',
        backDefinition: 'Chườm đá gián tiếp qua khăn bông trong 15-20 phút mỗi 2-3 giờ, giúp co mạch máu, giảm chảy máu trong và xoa dịu cơn đau.',
        backClassification: 'LOẠI: Liệu pháp nhiệt lạnh (tuyệt đối KHÔNG chườm nóng)',
        backExample: 'Bọc 4-5 viên đá lạnh vào khăn mặt sạch áp nhẹ lên chỗ sưng mắt cá chân.',
        backMemoryTip: 'I = Ice = Băng đá làm mát, cấm xoa dầu nóng!',
      },
      {
        id: 'fc_rice_3',
        frontTitle: 'Chữ C trong nguyên tắc R.I.C.E',
        frontSubtitle: 'Compression (Băng ép vừa phải)',
        frontCategoryTag: 'Cố định cơ học',
        backDefinition: 'Dùng băng thun quấn quanh vùng chấn thương từ xa về gần tim với lực vừa phải để hạn chế tụ dịch phù nề.',
        backClassification: 'LOẠI: Cố định và kiểm soát sưng nề',
        backExample: 'Quấn băng thun quanh cổ chân theo hình số 8, đảm bảo các đầu ngón chân không bị tê tím do quá chặt.',
        backMemoryTip: 'C = Compression = Cuộn băng co giãn chặn sưng!',
      },
      {
        id: 'fc_rice_4',
        frontTitle: 'Chữ E trong nguyên tắc R.I.C.E',
        frontSubtitle: 'Elevation (Kê cao chi chấn thương)',
        frontCategoryTag: 'Tuần hoàn máu',
        backDefinition: 'Kê phần chi bị thương cao hơn mức tim (khoảng 15-20cm) để máu tĩnh mạch và dịch viêm dễ dàng hồi lưu về tim.',
        backClassification: 'LOẠI: Phục hồi tư thế tĩnh (24 - 48 giờ đầu)',
        backExample: 'Khi nằm nghỉ ngơi, kê một chiếc gối ôm mềm dưới cẳng chân bị đau.',
        backMemoryTip: 'E = Elevation = Êm ái gối cao hơn tim!',
      },
      {
        id: 'fc_rice_5',
        frontTitle: 'Chuột rút (Vọp bẻ) bắp chuối',
        frontSubtitle: 'Muscle Cramp cấp tính',
        frontCategoryTag: 'Tình huống thường gặp',
        backDefinition: 'Sự co thắt cơ đột ngột ngoài ý muốn do mất nước, thiếu khoáng (K+, Na+, Mg2+) hoặc cơ bị căng quá mức.',
        backClassification: 'LOẠI: Rối loạn co bóp cơ năng do điện giải',
        backExample: 'Bị chuột rút sau khi chạy 1500m dưới trời nắng gắt.',
        backMemoryTip: 'Xử trí: Duỗi thẳng gối, bẻ gập ngược các ngón chân về phía trán, xoa bóp nhẹ và uống nước oresol.',
      },
      {
        id: 'fc_rice_6',
        frontTitle: 'Phân biệt Bong gân vs Gãy xương',
        frontSubtitle: 'Sprain vs Fracture',
        frontCategoryTag: 'Chẩn đoán phân biệt',
        backDefinition: 'Bong gân là tổn thương dây chằng nối các khớp; Gãy xương là mất tính liên tục cấu trúc xương cứng.',
        backClassification: 'LOẠI: Chấn thương phần mềm (Bong gân) vs Chấn thương xương khớp nặng (Gãy xương)',
        backExample: 'Gãy xương có biến dạng lệch trục, lạo xạo xương và mất cơ năng hoàn toàn; cần nẹp bất động và gọi 115.',
        backMemoryTip: 'Biến dạng xương + đau nhói cực độ = Tuyệt đối không nắn bóp, nẹp cố định ngay!',
      }
    ]
  },
  {
    id: 'deck_nutrition_groups',
    title: '4 Nhóm Chất Dinh Dưỡng & Khẩu Phần Học Sinh',
    topic: 'Dinh dưỡng học đường lứa tuổi dậy thì',
    grade: 'Lớp 7',
    subject: 'Dinh dưỡng & Thể lực',
    description: 'Nắm vững vai trò, nguồn thực phẩm và phân loại 4 nhóm chất chính giúp phát triển chiều cao và trí lực.',
    colorTheme: 'emerald',
    createdAt: '2026-09-28T00:00:00.000Z',
    cards: [
      {
        id: 'fc_nut_1',
        frontTitle: 'Chất đạm (Protein)',
        frontSubtitle: 'Vật liệu xây dựng cơ bắp & tế bào',
        frontCategoryTag: 'Đại lượng dinh dưỡng',
        backDefinition: 'Cung cấp các acid amin thiết yếu để tái tạo mô cơ, sản sinh kháng thể miễn dịch và kích thích hormone tăng trưởng (GH).',
        backClassification: 'LOẠI: Đạm động vật (thịt, cá, trứng, sữa) & Đạm thực vật (đậu nành, đậu phụ, hạt óc chó)',
        backExample: 'Học sinh dậy thì cần khoảng 1.2 - 1.6g đạm/kg cân nặng mỗi ngày (Ví dụ: 50kg cần ~60-80g đạm tinh).',
        backMemoryTip: 'Protein = Đắp thịt nẩy cơ, cao lớn thông minh.',
      },
      {
        id: 'fc_nut_2',
        frontTitle: 'Chất bột đường (Carbohydrate)',
        frontSubtitle: 'Nhiên liệu chính của não bộ & cơ bắp',
        frontCategoryTag: 'Nguồn năng lượng',
        backDefinition: 'Chuyển hóa thành Glucose cung cấp năng lượng tức thời cho tế bào thần kinh học tập và cơ bắp vận động.',
        backClassification: 'LOẠI: Carb phức hấp thu chậm (gạo lứt, yến mạch, khoai lang) & Carb đơn giản (đường cát, bánh ngọt, nước có ga)',
        backExample: 'Bữa sáng nên ăn 1 bát phở hoặc yến mạch để duy trì tập trung suốt 5 tiết học trên lớp.',
        backMemoryTip: 'Ưu tiên Carb phức để đường huyết ổn định, tránh buồn ngủ giữa giờ.',
      },
      {
        id: 'fc_nut_3',
        frontTitle: 'Chất béo (Lipid)',
        frontSubtitle: 'Màng tế bào & Hấp thu vitamin A, D, E, K',
        frontCategoryTag: 'Dự trữ năng lượng',
        backDefinition: 'Dung môi hòa tan các vitamin tan trong dầu, cấu tạo bao myelin dây thần kinh và sản sinh nội tiết tố sinh học.',
        backClassification: 'LOẠI: Chất béo tốt chưa bão hòa (Omega-3 từ cá hồi, dầu ôliu, hạt) & Chất béo chuyển hóa xấu (đồ chiên rán dầu cũ)',
        backExample: 'Ăn cá biển 2-3 bữa/tuần giúp não bộ học nhớ bài nhanh hơn nhờ Omega-3 DHA.',
        backMemoryTip: 'Chọn dầu thực vật và cá biển, né xa chiên rán ngập dầu vỉa hè.',
      },
      {
        id: 'fc_nut_4',
        frontTitle: 'Canxi & Vitamin D3',
        frontSubtitle: 'Bộ đôi vàng kéo dài xương',
        frontCategoryTag: 'Khoáng chất & Vi chất',
        backDefinition: 'Canxi khoáng hóa tạo mật độ xương chắc khỏe; Vitamin D3 là chìa khóa mở cổng ruột để hấp thu canxi vào máu.',
        backClassification: 'LOẠI: Vi chất tăng trưởng thể chất (Micro-nutrients)',
        backExample: 'Uống 400-500ml sữa tươi/ngày kết hợp phơi nắng sớm hoặc vận động ngoài trời 20 phút.',
        backMemoryTip: 'Canxi là gạch xây xương, Vitamin D3 là bác thợ hồ gắn kết.',
      },
      {
        id: 'fc_nut_5',
        frontTitle: 'Nước & Cân bằng Điện giải',
        frontSubtitle: 'Dung dịch sống chiếm 65-70% cơ thể',
        frontCategoryTag: 'Chất điều hòa sinh học',
        backDefinition: 'Duy trì thân nhiệt, bôi trơn ổ khớp, vận chuyển chất dinh dưỡng và đào thải độc tố qua thận và tuyến mồ hôi.',
        backClassification: 'LOẠI: Nước lọc tinh khiết & Nước khoáng bù điện giải (Na+, K+)',
        backExample: 'Trước giờ tập 30 phút uống 200ml; trong lúc tập cứ 15 phút nhấp 2-3 ngụm nhỏ.',
        backMemoryTip: 'Đừng đợi khát mới uống! Nước tiểu màu vàng rơm nhạt là chuẩn.',
      }
    ]
  },
  {
    id: 'deck_short_sprint',
    title: 'Kỹ Thuật Chạy Cự Ly Ngắn (60m - 100m)',
    topic: 'Kỹ thuật xuất phát thấp & Giai đoạn chạy',
    grade: 'Lớp 8',
    subject: 'Giáo dục Thể chất',
    description: '4 giai đoạn kỹ thuật chạy cự ly ngắn: Xuất phát thấp, Chạy lao sau xuất phát, Chạy giữa quãng và Về đích.',
    colorTheme: 'amber',
    createdAt: '2026-09-28T00:00:00.000Z',
    cards: [
      {
        id: 'fc_sprint_1',
        frontTitle: '3 Khẩu lệnh Xuất phát thấp',
        frontSubtitle: 'Bàn đạp xuất phát trong Điền kinh',
        frontCategoryTag: 'Luật & Kỹ thuật xuất phát',
        backDefinition: '1. "Vào chỗ": Đặt chân vào bàn đạp, hạ gối sau, 2 tay chống sát vạch vát hình chữ V ngược; 2. "Sẵn sàng": Nâng mông cao hơn vai, trọng tâm dồn lên 2 tay và chân trước; 3. "Chạy" (hoặc tiếng súng): Đạp mạnh 2 chân lao người về phía trước.',
        backClassification: 'LOẠI: Kỹ thuật xuất phát cố định (Bắt buộc trong cự ly ngắn ≤ 400m)',
        backExample: 'Góc nghiêng bàn đạp trước thường là 45-50 độ, bàn đạp sau là 60-80 độ.',
        backMemoryTip: 'Vào chỗ (tĩnh lặng) -> Sẵn sàng (nâng mông nén lò xo) -> Chạy (bật nổ như tên bắn)!',
      },
      {
        id: 'fc_sprint_2',
        frontTitle: 'Giai đoạn Chạy lao sau xuất phát',
        frontSubtitle: 'Gia tốc ban đầu (0 - 25m)',
        frontCategoryTag: 'Giai đoạn 2',
        backDefinition: 'Tận dụng lực đạp sau mạnh mẽ của 2 chân để nhanh chóng đạt tốc độ tối đa; thân người nâng dần độ nghiêng từ thấp lên thẳng tự nhiên.',
        backClassification: 'LOẠI: Giai đoạn biến đổi tốc độ cực đại (Acceleration phase)',
        backExample: 'Không ngẩng đầu đứng thẳng dậy quá sớm ngay sau bước thứ nhất vì sẽ cản gió và triệt tiêu đà tiến.',
        backMemoryTip: 'Tăng dần độ dài bước, thân người nâng lên từ từ như máy bay cất cánh.',
      },
      {
        id: 'fc_sprint_3',
        frontTitle: 'Giai đoạn Chạy giữa quãng',
        frontSubtitle: 'Duy trì tốc độ cao nhất',
        frontCategoryTag: 'Giai đoạn 3',
        backDefinition: 'Duy trì tần số bước và độ dài bước tối ưu; tiếp đất bằng nửa trước bàn chân (ức chân); đánh tay nhịp nhàng so le với chân.',
        backClassification: 'LOẠI: Vận động hiếu khí công suất tối đa (Yếm khí Anaerobic Alactic)',
        backExample: 'Khớp khuỷu tay gập góc khoảng 90 độ, bàn tay nắm hờ thả lỏng, không gồng cứng cơ cổ mặt.',
        backMemoryTip: 'Tiếp đất ức chân bật nảy, tay đánh trước sau nhịp nhàng.',
      },
      {
        id: 'fc_sprint_4',
        frontTitle: 'Kỹ thuật Đánh đích (Về đích)',
        frontSubtitle: 'Quyết định chênh lệch từng 0.01 giây',
        frontCategoryTag: 'Giai đoạn 4',
        backDefinition: 'Dùng ngực (gập thân) hoặc dùng vai (xoay nghiêng thân) chạm vào dây đích / mặt phẳng cắt thẳng đứng của vạch đích.',
        backClassification: 'LOẠI: Đánh đích bằng ngực hoặc Đánh đích bằng vai',
        backExample: 'Ở bước chạy cuối cùng, chủ động gập nhanh thân trên về trước để ngực cắt dây đích sớm nhất.',
        backMemoryTip: 'Tuyệt đối KHÔNG nhảy nhảy bổ vào vạch đích vì vận tốc rơi sẽ giảm đi.',
      },
      {
        id: 'fc_sprint_5',
        frontTitle: 'Phân loại các cự ly chạy Điền kinh',
        frontSubtitle: 'Cự ly ngắn vs Cự ly trung bình vs Cự ly dài',
        frontCategoryTag: 'Phân loại môn Điền kinh',
        backDefinition: 'Hệ thống các môn chạy phân theo cự ly và cơ chế chuyển hóa năng lượng ATP.',
        backClassification: 'LOẠI: Cự ly ngắn (60m, 100m, 200m, 400m - Xuất phát thấp); Cự ly trung bình (800m, 1500m - Xuất phát cao); Cự ly dài (3000m, 5000m, Marathon 42.195km)',
        backExample: 'Học sinh THCS kiểm tra chạy ngắn 60m và chạy bền 500m (nữ) / 800m (nam).',
        backMemoryTip: 'Ngắn = Bùng nổ tốc độ tối đa; Trung bình = Phân phối sức nhịp thở 2-2.',
      }
    ]
  },
  {
    id: 'deck_basketball_tactics',
    title: 'Bóng Rổ Học Đường: Kỹ Thuật & Vị Trí',
    topic: 'Kỹ thuật cơ bản & 5 vị trí trên sân bóng rổ',
    grade: 'Lớp 10',
    subject: 'Giáo dục Thể chất',
    description: 'Nắm vững luật bước chân, kỹ thuật nhồi bóng, ném rổ 1 tay và phân loại 5 vị trí thi đấu chuẩn FIBA.',
    colorTheme: 'indigo',
    createdAt: '2026-09-28T00:00:00.000Z',
    cards: [
      {
        id: 'fc_ball_1',
        frontTitle: 'Kỹ thuật Dẫn bóng (Dribble)',
        frontSubtitle: 'Đẩy bóng có kiểm soát',
        frontCategoryTag: 'Kỹ thuật cá nhân',
        backDefinition: 'Dùng các đầu ngón tay và phần chai tay tiếp xúc ấn bóng xuống sàn, cổ tay mềm mại miết bóng, mắt ngẩng nhìn bao quát sân.',
        backClassification: 'LOẠI: Dẫn bóng thấp phòng thủ (dưới hông) & Dẫn bóng cao phản công nhanh (ngang ngực)',
        backExample: 'Không bao giờ dùng lòng bàn tay đập bóng chan chát vào quả bóng.',
        backMemoryTip: 'Dùng ngón tay ấn nhịp nhàng, mắt ngẩng cao, tay còn lại che chắn bóng.',
      },
      {
        id: 'fc_ball_2',
        frontTitle: 'Lỗi Chạy bước (Traveling)',
        frontSubtitle: 'Luật bóng rổ căn bản',
        frontCategoryTag: 'Luật thi đấu FIBA',
        backDefinition: 'Khi cầm bóng bằng 2 tay mà di chuyển quá 2 bước chân mà không nhồi bóng tiếp xuống sàn, hoặc nhấc chân trụ trước khi thả bóng.',
        backClassification: 'LOẠI: Lỗi vi phạm luật chuyển động (Turnover - Mất quyền kiểm soát bóng)',
        backExample: 'Sau khi bắt bóng trên không tiếp đất, bước 3 bước rồi mới ném rổ sẽ bị thổi còi chạy bước.',
        backMemoryTip: 'Quy tắc "Bắt bóng - 1 bước - 2 bước - Bật nhảy dứt điểm" (Layup 2 bước hợp lệ).',
      },
      {
        id: 'fc_ball_3',
        frontTitle: 'Kỹ thuật Ném rổ 1 tay trên vai (B.E.E.F)',
        frontSubtitle: 'Balance - Eyes - Elbow - Follow-through',
        frontCategoryTag: 'Kỹ thuật ghi điểm',
        backDefinition: 'Tư thế ném rổ cơ bản: Bàn chân hướng rổ (B), Mắt nhìn vành rổ (E), Khuỷu tay tạo góc vuông 90 độ (E), Cổ tay vẫy gập theo bóng (F).',
        backClassification: 'LOẠI: Động tác ném rổ tầm trung và ném phạt (Free throw)',
        backExample: 'Khi thả bóng, ngón trỏ và ngón giữa rời bóng sau cùng tạo độ xoáy ngược (backspin) vào rổ.',
        backMemoryTip: 'BEEF: Thăng bằng - Mắt nhìn - Cùi chỏ vuông - Vẫy cổ tay ngỗng.',
      },
      {
        id: 'fc_ball_4',
        frontTitle: 'Phân loại 5 Vị trí trên sân bóng rổ',
        frontSubtitle: 'PG, SG, SF, PF, C',
        frontCategoryTag: 'Chiến thuật đồng đội',
        backDefinition: '5 vị trí phối hợp tương hỗ tạo nên sơ đồ chiến thuật tấn công và phòng ngự hoàn hảo.',
        backClassification: 'LOẠI: 1. PG (Point Guard - Hậu vệ dẫn bóng); 2. SG (Shooting Guard - Hậu vệ ghi điểm); 3. SF (Small Forward - Tiền đạo phụ); 4. PF (Power Forward - Tiền đạo chính); 5. C (Center - Trung phong dưới bảng)',
        backExample: 'Học sinh nhanh nhẹn khéo léo dẫn bóng thường đá vị trí số 1 (PG - Đạo diễn trận đấu).',
        backMemoryTip: '1-Dẫn bóng, 2-Ném xa, 3-Đột phá, 4-Tranh chấp bảng, 5-Tháp canh dưới rổ.',
      }
    ]
  },
  {
    id: 'deck_volleyball_bump',
    title: 'Bóng Chuyền: Kỹ Thuật Đệm Bóng & Chuyền Bóng',
    topic: 'Kỹ thuật chuyền bóng thấp tay và cao tay',
    grade: 'Lớp 11',
    subject: 'Giáo dục Thể chất',
    description: 'Chuẩn hóa kỹ thuật đệm bóng đón bước 1, góc tạo mặt phẳng cẳng tay và chuyền bóng cao tay 2 tay.',
    colorTheme: 'violet',
    createdAt: '2026-09-28T00:00:00.000Z',
    cards: [
      {
        id: 'fc_vb_1',
        frontTitle: 'Kỹ thuật Đệm bóng (Chuyền thấp tay)',
        frontSubtitle: 'Đón bóng bước 1 và phòng thủ',
        frontCategoryTag: 'Kỹ thuật phòng thủ',
        backDefinition: 'Hai bàn tay nắm lồng vào nhau, 2 ngón cái song song kề sát, cẳng tay duỗi thẳng khóa khuỷu tạo thành một mặt phẳng đón bóng ở 1/3 trước cẳng tay.',
        backClassification: 'LOẠI: Kỹ thuật đón bóng rơi dưới tầm ngực',
        backExample: 'Nâng đùi kết hợp duỗi tay đưa nhẹ theo hướng bóng đi, không vung tay quá cao qua đầu.',
        backMemoryTip: 'Khóa chặt khuỷu tay, hai ngón cái bằng nhau, nhún gối đón bóng êm ái.',
      },
      {
        id: 'fc_vb_2',
        frontTitle: 'Kỹ thuật Chuyền bóng cao tay',
        frontSubtitle: 'Kiến tạo bóng bước 2 (Set)',
        frontCategoryTag: 'Kỹ thuật chuyền hai',
        backDefinition: 'Đón bóng ở phía trước trán khoảng 15-20cm; các ngón tay xòe đều tạo thành hình chiếc phễu/bát úp ôm lấy bóng, dùng sức bật của cổ tay và ngón tay đẩy bóng đi.',
        backClassification: 'LOẠI: Kỹ thuật chuyền kiến tạo cho chủ công đập bóng',
        backExample: 'Ngón tay cái hướng vào nhau và hướng về phía mặt, các ngón còn lại ôm đều các cạnh quả bóng.',
        backMemoryTip: 'Đón bóng trước trán, phễu tay đàn hồi, dùng lực từ chân truyền lên ngón tay.',
      },
      {
        id: 'fc_vb_3',
        frontTitle: 'Phân loại các quả Phát bóng',
        frontSubtitle: 'Serve trong môn bóng chuyền',
        frontCategoryTag: 'Kỹ thuật tấn công',
        backDefinition: 'Quả đánh mở màn hiệp đấu từ phía sau vạch cuối sân sang phần sân đối phương.',
        backClassification: 'LOẠI: 1. Phát bóng thấp tay chính diện (dễ thực hiện, học sinh cơ bản); 2. Phát bóng cao tay chính diện (quỹ đạo nhanh, hiểm); 3. Phát bóng nhảy tấn công (Jump Serve - vận động viên chuyên nghiệp)',
        backExample: 'Học sinh nữ và người mới học nên luyện thành thạo phát bóng thấp tay trước để đảm bảo tỷ lệ bóng qua lưới 100%.',
        backMemoryTip: 'Tung bóng vừa tầm, giữ cổ tay cứng khi tiếp xúc, hướng bóng qua điểm trống.',
      }
    ]
  },
  {
    id: 'deck_anatomy_joints',
    title: 'Hệ Vận Động & Phân Loại Các Khớp Xương',
    topic: 'Giải phẫu học thể chất & Cơ xương khớp',
    grade: 'Lớp 8',
    subject: 'Sinh học & Thể chất',
    description: 'Phân loại các loại khớp trong cơ thể người, dây chằng và sụn chêm giúp học sinh hiểu cơ chế vận động và phòng ngừa chấn thương.',
    colorTheme: 'sky',
    createdAt: '2026-09-28T00:00:00.000Z',
    cards: [
      {
        id: 'fc_anat_1',
        frontTitle: 'Phân loại 3 LOẠI Khớp trong cơ thể',
        frontSubtitle: 'Khớp bất động - Bán động - Động',
        frontCategoryTag: 'Giải phẫu xương',
        backDefinition: '1. Khớp bất động: Không cử động được (ví dụ: khớp nối các xương sọ); 2. Khớp bán động: Cử động hạn chế (khớp các đốt sống, khớp mu); 3. Khớp động (khớp hoạt dịch): Cử động tự do, linh hoạt nhờ có bao hoạt dịch và dịch bôi trơn.',
        backClassification: 'LOẠI: Phân loại theo chức năng và biên độ vận động',
        backExample: 'Khớp vai và khớp háng là loại khớp chỏm cầu có biên độ xoay rộng nhất cơ thể.',
        backMemoryTip: 'Bất động (khóa cứng) -> Bán động (nhún nhẹ) -> Khớp động (xoay nhảy tưng bừng).',
      },
      {
        id: 'fc_anat_2',
        frontTitle: 'Khớp Bản lề vs Khớp Chỏm cầu',
        frontSubtitle: 'Hinge joint vs Ball-and-socket joint',
        frontCategoryTag: 'Cơ chế cơ học khớp',
        backDefinition: 'Khớp bản lề chỉ cử động theo 1 mặt phẳng (gập - duỗi như khớp gối, khớp khuỷu); Khớp chỏm cầu cử động đa hướng xoay vòng 360 độ (khớp vai, khớp hông).',
        backClassification: 'LOẠI: Phân loại khớp động theo hình thái cấu trúc mặt khớp',
        backExample: 'Khớp gối không thể xoay ngang; nếu bị lực tác động bẻ ngang sẽ đứt dây chằng chéo trước (ACL).',
        backMemoryTip: 'Bản lề mở đóng 1 chiều gập duỗi; Chỏm cầu xoay tít như quả cầu bi.',
      },
      {
        id: 'fc_anat_3',
        frontTitle: 'Sụn chêm & Dịch khớp',
        frontSubtitle: 'Bộ giảm xóc sinh học tự nhiên',
        frontCategoryTag: 'Bảo vệ khớp',
        backDefinition: 'Sụn chêm nằm giữa các đầu xương để phân tán lực nén; Dịch khớp (hoạt dịch) bôi trơn giảm ma sát và nuôi dưỡng sụn.',
        backClassification: 'LOẠI: Cấu trúc đệm hấp thụ xung chấn',
        backExample: 'Khi khởi động xoay khớp cổ chân, cổ tay 5 phút, bao hoạt dịch tiết ra nhiều dịch bôi trơn giúp khớp êm ru.',
        backMemoryTip: 'Khởi động xoay khớp chính là "bơm nhớt" cho ổ bi cơ thể!',
      }
    ]
  }
];

export async function generateFlashcardsWithGemini(
  ai: GoogleGenAI | null,
  request: FlashcardGenerateRequest
): Promise<FlashcardDeck> {
  const { topic, grade, subject = 'Giáo dục Thể chất & Sức khỏe', cardCount = 6 } = request;
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  // If Gemini client is not available or offline, search matched presets or generate dynamically
  if (!ai) {
    const matched = PRESET_FLASHCARD_DECKS.find(d => 
      d.topic.toLowerCase().includes(lower) || 
      lower.includes(d.topic.toLowerCase()) ||
      d.title.toLowerCase().includes(lower) ||
      lower.includes(d.title.toLowerCase())
    );

    if (matched) {
      return {
        ...matched,
        id: `deck_${Date.now()}`,
        grade: grade || matched.grade,
        subject: subject || matched.subject,
        createdAt: new Date().toISOString()
      };
    }

    // Dynamic tailored fallback cards
    return generateFallbackDeck(cleanTopic, grade, subject, cardCount);
  }

  const prompt = `Bạn là Chuyên gia Khảo thí và Giáo viên môn ${subject} tại Việt Nam.
Hãy tạo một bộ Thẻ Ghi Nhớ Flashcard ôn thi chuẩn mực, hiện đại dành cho học sinh ${grade} về chủ đề: "${cleanTopic}".

Số lượng thẻ yêu cầu: ${Math.min(Math.max(cardCount, 4), 10)} thẻ.
ĐẶC BIỆT CHÚ TRỌNG:
- Mỗi thẻ gồm 2 mặt rõ ràng: Mặt Trước (Khái niệm/Thuật ngữ/Câu hỏi gợi mở) và Mặt Sau (Định nghĩa súc tích, PHÂN LOẠI "LOẠI: ...", Ví dụ thực tế học sinh, Mẹo nhớ thần chú).
- Trên mặt sau, BẮT BUỘC có trường "backClassification" bắt đầu bằng "LOẠI: [Tên phân loại hoặc phân nhóm cụ thể]" (Ví dụ: "LOẠI: Vận động hiếu khí", "LOẠI: Xử trí khẩn cấp cấp độ 1", "LOẠI: Đạm động vật hoàn chỉnh").
- Trình bày sư phạm, chuẩn xác theo sách giáo khoa Chương trình GDPT mới, dễ thuộc, ngôn phong khích lệ học trò.

Yêu cầu trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm markdown ngoài khối json) theo cấu trúc sau:
{
  "title": "Tiêu đề bộ thẻ hấp dẫn, ngắn gọn",
  "description": "Mô tả ngắn về nội dung ôn tập",
  "colorTheme": "emerald", // một trong các màu: 'emerald', 'indigo', 'amber', 'rose', 'sky', 'violet'
  "cards": [
    {
      "frontTitle": "Khái niệm hoặc câu hỏi chính ngắn gọn",
      "frontSubtitle": "Gợi ý hoặc thuật ngữ tiếng Anh/tiếng Việt đi kèm",
      "frontCategoryTag": "Danh mục thẻ (VD: Kỹ thuật, Luật thi đấu, An toàn, Dinh dưỡng)",
      "backDefinition": "Định nghĩa cốt lõi, giải thích ngắn gọn trong 1-2 câu",
      "backClassification": "LOẠI: [Phân loại hoặc nhóm tương ứng]",
      "backExample": "Ví dụ cụ thể dễ hình dung trong đời sống học sinh hoặc giờ thể dục",
      "backMemoryTip": "Mẹo nhớ thần chú ngắn để học thuộc ngay"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(rawText);

    const cards: FlashcardItem[] = (parsed.cards || []).map((c: any, idx: number) => ({
      id: `fc_${Date.now()}_${idx + 1}`,
      frontTitle: String(c.frontTitle || `Khái niệm ${idx + 1}`).trim(),
      frontSubtitle: c.frontSubtitle ? String(c.frontSubtitle).trim() : undefined,
      frontCategoryTag: c.frontCategoryTag ? String(c.frontCategoryTag).trim() : 'Kiến thức cốt lõi',
      backDefinition: String(c.backDefinition || 'Đang cập nhật định nghĩa...').trim(),
      backClassification: c.backClassification ? String(c.backClassification).trim() : 'LOẠI: Kiến thức chuẩn GDPT',
      backExample: c.backExample ? String(c.backExample).trim() : undefined,
      backMemoryTip: c.backMemoryTip ? String(c.backMemoryTip).trim() : undefined,
      mastery: 'unlearned',
    }));

    return {
      id: `deck_${Date.now()}`,
      title: parsed.title || `Bộ Flashcard: ${cleanTopic}`,
      topic: cleanTopic,
      grade,
      subject,
      description: parsed.description || `Bộ thẻ ghi nhớ ôn tập nhanh chủ đề ${cleanTopic}`,
      colorTheme: (['emerald', 'indigo', 'amber', 'rose', 'sky', 'violet'].includes(parsed.colorTheme) ? parsed.colorTheme : 'emerald') as any,
      cards: cards.length > 0 ? cards : generateFallbackDeck(cleanTopic, grade, subject, cardCount).cards,
      createdAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Error generating flashcards with Gemini:', err);
    return generateFallbackDeck(cleanTopic, grade, subject, cardCount);
  }
}

function generateFallbackDeck(
  topic: string,
  grade: string,
  subject: string,
  _cardCount: number
): FlashcardDeck {
  return {
    id: `deck_fallback_${Date.now()}`,
    title: `Bộ Flashcard: ${topic}`,
    topic,
    grade,
    subject,
    description: `Bộ thẻ ghi nhớ chuẩn mực biên soạn cho học sinh ${grade} môn ${subject}.`,
    colorTheme: 'emerald',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: `fc_fb_1`,
        frontTitle: `Khái niệm Cốt lõi về ${topic}`,
        frontSubtitle: 'Trọng tâm bài học',
        frontCategoryTag: 'Cốt lõi',
        backDefinition: `${topic} là kiến thức căn bản trong chương trình ${grade}, giúp rèn luyện thể chất, tư duy chiến thuật và hình thành thói quen rèn luyện bền vững.`,
        backClassification: 'LOẠI: Kiến thức lý thuyết nền tảng',
        backExample: 'Áp dụng đều đặn trong các buổi tập thể dục và bài kiểm tra học kỳ.',
        backMemoryTip: 'Ghi nhớ từ khóa chính và rèn luyện lặp lại ngắt quãng 3 lần/tuần.',
        mastery: 'unlearned',
      },
      {
        id: `fc_fb_2`,
        frontTitle: `Kỹ thuật Thực Hiện & Biên độ Động tác`,
        frontSubtitle: 'Yêu cầu kỹ năng thực hành',
        frontCategoryTag: 'Kỹ thuật',
        backDefinition: 'Thực hiện động tác đúng biên độ, giữ nhịp thở điều hòa và phối hợp nhịp nhàng giữa tay, chân và trọng tâm cơ thể.',
        backClassification: 'LOẠI: Kỹ năng vận động có ý thức',
        backExample: 'Khởi động kỹ các khớp cổ chân, cổ tay và xoay hông trước khi bước vào bài tập chính.',
        backMemoryTip: 'Khởi động kỹ -> Động tác chuẩn -> Thả lỏng tích cực.',
        mastery: 'unlearned',
      },
      {
        id: `fc_fb_3`,
        frontTitle: `Lưu ý An Toàn & Phòng ngừa Chấn thương`,
        frontSubtitle: 'Bảo vệ bản thân trong vận động',
        frontCategoryTag: 'An toàn học đường',
        backDefinition: 'Tuyệt đối không tập luyện khi đang quá đói hoặc quá no; trang bị giày đế bám êm và kiểm tra mặt sân bằng phẳng trước khi vận động mạnh.',
        backClassification: 'LOẠI: Quy chuẩn an toàn thể thao',
        backExample: 'Nếu thấy choáng váng hoặc đau nhói vùng khớp gối, dừng bài tập ngay và báo với giáo viên.',
        backMemoryTip: 'Lắng nghe cơ thể, an toàn là số 1!',
        mastery: 'unlearned',
      },
      {
        id: `fc_fb_4`,
        frontTitle: `Dinh Dưỡng & Phục Hồi Sau Tập Luyện`,
        frontSubtitle: 'Tái tạo năng lượng và cơ bắp',
        frontCategoryTag: 'Dinh dưỡng',
        backDefinition: 'Sau bài tập 30 phút, bổ sung nước lọc, chuối chín hoặc 1 ly sữa tươi để bù glycogen và tái tạo sợi cơ bị vi tổn thương.',
        backClassification: 'LOẠI: Dinh dưỡng phục hồi cửa sổ vàng (Golden window)',
        backExample: 'Ăn 1 quả chuối chín và uống 250ml nước dừa tươi để bù kali và magiê.',
        backMemoryTip: 'Nước + Trái cây ngọt tự nhiên + Nghỉ ngơi đủ giấc.',
        mastery: 'unlearned',
      }
    ]
  };
}
