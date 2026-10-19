import { GoogleGenAI } from '@google/genai';
import { SummaryResult, KeyPointItem, ActionStepItem, QuizQuestionItem, MindmapNode } from '../src/types';

export interface SummarizeRequest {
  text: string;
  title?: string;
  depth?: 'quick' | 'standard' | 'detailed';
  audience?: 'student' | 'teacher' | 'athlete';
  sourceType?: 'material' | 'custom' | 'exercise' | 'preset';
  sourceId?: string;
}

export const PRESET_SAMPLE_DOCS = [
  {
    id: 'doc_run_1500',
    title: 'Kỹ Thuật Chạy Cự Ly Trung Bình 1500m & Bí Quyết Tránh Xóc Hông',
    category: 'Điền kinh & Thể lực',
    badge: 'Chạy bền',
    text: `Chạy cự ly trung bình 1500m là nội dung bắt buộc trong bài kiểm tra thể lực học kỳ của học sinh THCS và THPT.
Để đạt điểm Giỏi và không bị kiệt sức giữa chừng, học sinh cần nắm vững 4 nguyên tắc kỹ thuật vàng sau:

1. Kỹ thuật xuất phát và phân phối sức:
Trong 100m đầu tiên, nhiều bạn có thói quen bứt tốc tối đa, dẫn đến tích tụ acid lactic ở cơ bắp gây căng cứng và hụt hơi ở vòng thứ 2. Hãy xuất phát với 75-80% tốc độ, nhanh chóng chiếm vị trí đường chạy trong sát mép sân (đường số 1) để tiết kiệm quãng đường. Duy trì nhịp chạy đều đặn ở 2 vòng giữa và chỉ bứt tốc tăng dần trong 150-200m cuối về đích.

2. Nhịp thở đồng bộ 2-2:
Hít thở nông bằng ngực là nguyên nhân chính gây thiếu oxy lên não và xóc hông (đau nhói dưới sườn phải do co thắt cơ hoành). Kỹ thuật chuẩn: Chạy 2 bước hít vào sâu bằng mũi đẩy phồng bụng, 2 bước tiếp theo thở mạnh ra bằng miệng (nhịp 2-2). Khi thấy hơi tức hông, hãy chủ động giảm nhẹ tốc độ, thở sâu hết cỡ bằng cách hóp bụng lại để tống hết khí cặn ra ngoài.

3. Kỹ thuật tiếp đất bàn chân:
Tránh tuyệt đối thói quen nện gót chân xuống mặt đường chạy vì phản lực sẽ dội thẳng lên khớp gối và đốt sống lưng, dễ gây viêm cơ chày trước (shin splints). Hãy tiếp đất bằng nửa trước bàn chân (ức bàn chân) hoặc phần giữa bàn chân, sau đó lăn nhẹ sang cả bàn chân rồi bật miết mũi chân về phía trước.

4. Hồi tĩnh và tiếp nước sau khi về đích:
Sau khi qua vạch đích, không được ngồi bệt hoặc nằm ngay xuống đất vì máu đang dồn ở chi dưới chưa kịp hồi lưu về tim, rất dễ tụt huyết áp và ngất xỉu. Phải đi bộ nhẹ nhàng 3-5 phút, vung tay thả lỏng các cơ. Uống từng ngụm nhỏ nước ấm hoặc nước khoáng điện giải, không uống ừng ực nước đá lạnh.`
  },
  {
    id: 'doc_height_growth',
    title: 'Khoa Học Tăng Chiều Cao Tuổi Dậy Thì: Dinh Dưỡng, Kéo Giãn & Giấc Ngủ',
    category: 'Phát triển vóc dáng',
    badge: 'Tăng chiều cao',
    text: `Giai đoạn dậy thì (11-17 tuổi) là cơ hội vàng cuối cùng để học sinh bứt phá chiều cao thêm từ 8 đến 15cm trước khi các đĩa sụn tiếp hợp ở đầu xương dài đóng lại hoàn toàn.
Chiều cao không chỉ phụ thuộc 23% vào di truyền, mà 77% còn lại do dinh dưỡng, vận động thể chất và giấc ngủ quyết định.

1. Ba môn thể thao kéo giãn đĩa sụn tốt nhất:
- Bơi lội (đặc biệt là bơi ếch): Lực nâng của nước giải phóng toàn bộ trọng lực đè lên cột sống và khớp gối, cho phép sụn phát triển tự do khi duỗi thẳng tay chân.
- Bóng rổ & Nhảy dây: Động tác bật nhảy liên tục tạo kích thích cơ học lên vùng sụn tăng trưởng ở đầu xương chày và xương đùi, thúc đẩy phân chia tế bào sụn nhanh hơn.
- Treo xà đơn & Bài tập Rắn hổ mang (Cobra stretch): Giúp kéo giãn các khoang đốt sống, ngăn ngừa tình trạng gù lưng do ngồi cúi học bài nhiều giờ.

2. Dinh dưỡng bổ sung Canxi kết hợp Vitamin D3 & K2:
Uống sữa chỉ có Canxi là chưa đủ. Nếu thiếu Vitamin D3 (hấp thụ từ ánh nắng sáng sớm hoặc cá hồi, lòng đỏ trứng), Canxi không thể đi từ ruột vào máu. Nếu thiếu Vitamin K2 (có trong phô mai, sữa chua, đậu nành lên men), Canxi sẽ lắng đọng ở mạch máu thay vì gắn vào xương. Mỗi ngày nên uống 400-500ml sữa tươi kết hợp ăn cá nhỏ nguyên xương, tôm, đậu phụ và rau xanh thẫm.

3. Khung giờ vàng tiết hormone tăng trưởng (GH):
Hormone tăng trưởng GH được tuyến yên tiết ra mạnh nhất vào khoảng 22h00 đến 01h00 sáng khi cơ thể bước vào giấc ngủ sâu (sóng chậm). Học sinh ngủ sau 23h30 sẽ bỏ lỡ đỉnh tiết GH cao nhất, khiến chiều cao khó phát triển dù ăn uống đầy đủ. Hãy tập thói quen hoàn thành bài tập trước 22h và ngủ trước 22h30.`
  },
  {
    id: 'doc_cramp_prevention',
    title: 'Quy Tắc Sơ Cứu Chuột Rút & Phòng Ngừa Căng Cơ Thể Thao Học Đường',
    category: 'An toàn & Y tế học đường',
    badge: 'An toàn thể chất',
    text: `Chuột rút (co thắt cơ đột ngột và đau đớn) là tai nạn thể thao rất phổ biến trong các tiết học thể dục, bóng đá, bóng rổ hoặc bơi lội ở trường.

Nguyên nhân chính:
- Không khởi động kỹ các khớp cổ chân và bắp chân trước khi vận động mạnh.
- Mất nước và mất cân bằng các ion điện giải (Kali, Magie, Natri, Canxi) do đổ nhiều mồ hôi dưới trời nắng.
- Cơ bắp hoạt động quá tải liên tục trong tình trạng mệt mỏi.

Quy trình xử lý sơ cứu 4 bước khi bị chuột rút bắp chân:
1. Dừng vận động ngay lập tức: Bình tĩnh ngồi hoặc nằm xuống nơi râm mát, thả lỏng toàn bộ chân bị chuột rút.
2. Kéo giãn thụ động ngược chiều cơ co: Nếu bị chuột rút bắp chuối, hãy giữ thẳng chân, dùng tay nắm lấy các ngón chân và từ từ kéo ngược ngón chân về phía đầu gối. Giữ nguyên tư thế căng cơ này trong 20-30 giây cho đến khi cơn co thắt dịu hẳn. Tuyệt đối không xoa bóp hoặc đấm mạnh vào chỗ cơ đang co cứng vì có thể gây rách sợi cơ.
3. Chườm ấm hoặc xoa vuốt nhẹ nhàng: Sau khi hết co thắt, xoa vuốt nhẹ bắp chân theo chiều từ gót lên đùi để kích thích tuần hoàn máu hồi phục.
4. Bù nước điện giải: Uống từ từ 200-300ml nước bù điện giải (oresol hoặc nước dừa tươi, chuối chín nạp lại Kali).

Phòng ngừa trước giờ học thể dục:
- Khởi động tối thiểu 7-10 phút, xoay kỹ cổ tay, cổ chân, khớp gối và ép dọc, ép ngang.
- Uống 150ml nước trước khi vận động 20 phút.`
  },
  {
    id: 'doc_spine_posture',
    title: 'Phòng Ngừa Gù Lưng & Cận Thị: Tư Thế Chuẩn Khi Ngồi Học Bài',
    category: 'Vóc dáng học sinh',
    badge: 'Chống gù lưng',
    text: `Thói quen ngồi cong lưng, tì ngực vào bàn, cúi gằm mặt xuống sách vở hay gác chân lên ghế trong nhiều giờ liên tục là thủ phạm hàng đầu gây thoái hóa đốt sống cổ sớm, cong vẹo cột sống và cận thị học đường.

Quy tắc tư thế vàng 90-90-90 khi ngồi học:
- Khớp khuỷu tay gập góc 90 độ khi đặt cẳng tay lên bàn viết.
- Khớp hông và lưng tạo góc 90-100 độ, tựa nhẹ lưng dưới vào lưng ghế có đệm nâng đỡ.
- Khớp đầu gối vuông góc 90 độ, hai bàn chân đặt phẳng chạm đất, không bắt chéo chân cản trở lưu thông máu.

Khoảng cách từ mắt đến trang sách:
Khoảng cách an toàn nhất là 25cm đối với học sinh Tiểu học và 30-35cm đối với học sinh THCS, THPT. Màn hình máy tính hoặc điện thoại học online phải đặt ngang tầm mắt, không cúi gục đầu.

Quy tắc giải lao 20-20-20 & Bài tập giãn cơ 3 phút:
Cứ sau 40-45 phút ngồi học, học sinh nên đứng dậy vươn vai, mở rộng lồng ngực và nhìn xa 20 mét trong 20 giây để điều tiết mắt. Thực hiện 2 động tác kéo giãn cổ và xoay vai ra sau 10 lần để giải phóng áp lực tích tụ ở cơ thang và cột sống cổ.`
  }
];

// Offline heuristic generator
export function generateOfflineSummary(
  text: string,
  title?: string,
  depth: 'quick' | 'standard' | 'detailed' = 'standard',
  audience: 'student' | 'teacher' | 'athlete' = 'student'
): SummaryResult {
  const cleanText = text.trim();
  const rawWords = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = rawWords.length;

  // Split into sentences / paragraphs
  const paragraphs = cleanText.split(/\n+/).map(p => p.trim()).filter(p => p.length > 10);
  const sentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const effectiveTitle = title?.trim() || paragraphs[0]?.slice(0, 70) || 'Tài Liệu Giáo Dục Thể Chất & Sức Khỏe Học Đường';

  // Identify core themes
  const lower = cleanText.toLowerCase();
  const hasRunning = lower.includes('chạy') || lower.includes('bước') || lower.includes('thở') || lower.includes('1500m');
  const hasHeight = lower.includes('chiều cao') || lower.includes('sụn') || lower.includes('canxi') || lower.includes('dậy thì');
  const hasCramp = lower.includes('chuột rút') || lower.includes('co thắt') || lower.includes('sơ cứu') || lower.includes('kali');
  const hasPosture = lower.includes('gù') || lower.includes('cột sống') || lower.includes('ngồi học') || lower.includes('lưng');
  const hasNutrition = lower.includes('dinh dưỡng') || lower.includes('ăn') || lower.includes('protein') || lower.includes('nước') || lower.includes('calo');

  // Key takeaways extraction
  const keyPoints: KeyPointItem[] = [];
  const actionItems: ActionStepItem[] = [];
  const quizQuestions: QuizQuestionItem[] = [];
  const mindmapNodes: MindmapNode[] = [];

  if (hasRunning) {
    keyPoints.push(
      {
        id: 'kp_1',
        title: 'Phân phối sức thông minh ở 100m đầu',
        detail: 'Không bứt tốc tối đa ngay từ đầu để tránh dồn ứ acid lactic ở cơ bắp gây đuối sức ở các vòng sau. Chạy với 75-80% sức và giữ nhịp ổn định.',
        tag: 'Chiến thuật',
        importance: 'high'
      },
      {
        id: 'kp_2',
        title: 'Nhịp thở sâu 2-2 đồng bộ nhịp chạy',
        detail: '2 bước hít sâu bằng mũi phồng bụng - 2 bước thở mạnh qua miệng. Giúp chống xóc hông hiệu quả do cơ hoành được cung cấp đủ oxy.',
        tag: 'Kỹ thuật',
        importance: 'high'
      },
      {
        id: 'kp_3',
        title: 'Tiếp đất bằng nửa trước / giữa bàn chân',
        detail: 'Không nện gót chân xuống đất để giảm chấn động dội lên khớp gối và cột sống, hạn chế đau cẳng chân.',
        tag: 'An toàn',
        importance: 'medium'
      },
      {
        id: 'kp_4',
        title: 'Hồi tĩnh đi bộ sau khi về đích',
        detail: 'Đi bộ thả lỏng 3-5 phút, tuyệt đối không ngồi bệt ngay vì máu chưa hồi lưu kịp về tim có thể gây tụt huyết áp.',
        tag: 'An toàn',
        importance: 'medium'
      }
    );

    actionItems.push(
      { id: 'act_1', step: 'Khởi động xoay khớp cổ chân, đầu gối và ép dẻo tối thiểu 5 phút trước khi chạy', tip: 'Làm nóng khớp giúp tiết chất nhờn bao hoạt dịch' },
      { id: 'act_2', step: 'Tập đếm nhịp thở 2 bước hít vào - 2 bước thở ra khi chạy chậm khởi động', tip: 'Hít bằng mũi, thở bằng miệng' },
      { id: 'act_3', step: 'Sau khi qua đích, đi bộ chậm và vung nhẹ hai tay để điều hòa nhịp tim', tip: 'Không ngồi bệt ngay xuống đất' }
    );

    quizQuestions.push(
      {
        id: 'q_1',
        question: 'Tại sao không nên bứt tốc 100% sức ngay trong 100m đầu của bài chạy 1500m?',
        answer: 'Vì cơ thể sẽ bị tích tụ acid lactic sớm gây căng cơ, kiệt sức và đuối ở các vòng tiếp theo.',
        hint: 'Nghĩ về sự tích tụ mỏi cơ bắp và năng lượng yếm khí.'
      },
      {
        id: 'q_2',
        question: 'Nguyên nhân chính gây xóc hông khi chạy là gì và cách khắc phục ngay tức thì?',
        answer: 'Do cơ hoành thiếu oxy vì thở nông. Khắc phục: Giảm tốc độ, hít sâu bằng mũi và thở dốc hết cỡ bằng miệng.',
        hint: 'Liên quan đến nhịp thở và cơ hoành.'
      }
    );

    mindmapNodes.push(
      { topic: 'Kỹ thuật Chạy 1500m', subtopics: ['Xuất phát 75-80% sức', 'Bám đường trong số 1', 'Nước rút 150m cuối'] },
      { topic: 'Hô hấp & An toàn', subtopics: ['Nhịp thở 2-2 phồng bụng', 'Tiếp đất nửa bàn chân trước', 'Đi bộ hồi tĩnh 3-5 phút'] }
    );
  } else if (hasHeight) {
    keyPoints.push(
      {
        id: 'kp_1',
        title: 'Thời kỳ vàng đĩa sụn tuổi dậy thì (11-17 tuổi)',
        detail: 'Cơ hội cuối cùng để tăng 8-15cm trước khi các đĩa sụn tiếp hợp ở đầu xương dài cốt hóa hoàn toàn.',
        tag: 'Cốt lõi',
        importance: 'high'
      },
      {
        id: 'kp_2',
        title: 'Vận động kéo giãn kích thích phân chia tế bào sụn',
        detail: 'Bơi ếch, bóng rổ, nhảy dây và xà đơn tạo kích thích cơ học giúp kéo giãn cột sống và kích thích đầu xương phát triển.',
        tag: 'Kỹ thuật',
        importance: 'high'
      },
      {
        id: 'kp_3',
        title: 'Bộ ba Canxi + Vitamin D3 + Vitamin K2',
        detail: 'Canxi cần D3 để vào máu và cần K2 để gắn đúng vào xương thay vì lắng đọng ở mạch máu. Bổ sung từ sữa tươi, cá nhỏ, sữa chua.',
        tag: 'Dinh dưỡng',
        importance: 'high'
      },
      {
        id: 'kp_4',
        title: 'Khung giờ vàng tiết hormone GH (22h - 01h)',
        detail: 'Tuyến yên tiết hormone tăng trưởng cao nhất khi ngủ sâu từ 22h-1h sáng. Thức khuya sau 23h làm giảm mạnh lượng GH tiết ra.',
        tag: 'Mẹo nhớ',
        importance: 'medium'
      }
    );

    actionItems.push(
      { id: 'act_1', step: 'Đi ngủ trước 22h30 mỗi đêm để bắt trọn đỉnh tiết hormone tăng trưởng GH', tip: 'Tắt màn hình điện thoại 30 phút trước khi ngủ' },
      { id: 'act_2', step: 'Tập nhảy dây 300-500 cái hoặc đu xà đơn 2-3 phút mỗi buổi chiều', tip: 'Kích thích sụn tăng trưởng ở đầu gối' },
      { id: 'act_3', step: 'Uống 1 ly sữa tươi ấm 200ml vào buổi sáng và 1 ly trước khi đi ngủ 1 tiếng', tip: 'Bổ sung Canxi hấp thụ ban đêm' }
    );

    quizQuestions.push(
      {
        id: 'q_1',
        question: 'Tại sao uống nhiều sữa chứa Canxi nhưng không phơi nắng hoặc thiếu Vitamin D3 thì xương vẫn khó dài ra?',
        answer: 'Vì Vitamin D3 là chất dẫn cần thiết giúp Canxi hấp thụ từ ruột vào máu. Thiếu D3, Canxi sẽ bị đào thải ra ngoài.',
        hint: 'Vitamin D3 được cơ thể tổng hợp từ ánh nắng mặt trời.'
      },
      {
        id: 'q_2',
        question: 'Khung giờ nào tuyến yên tiết ra hormone tăng trưởng chiều cao GH mạnh nhất?',
        answer: 'Từ 22h00 đến 01h00 sáng khi cơ thể ở trạng thái ngủ sâu.',
        hint: 'Thời điểm ban đêm khi học sinh nên ngủ say.'
      }
    );

    mindmapNodes.push(
      { topic: 'Tăng Chiều Cao Tuổi Dậy Thì', subtopics: ['3 Môn kích sụn: Bơi, Bóng rổ, Xà đơn', 'Canxi + D3 + K2 gắn vào xương'] },
      { topic: 'Thói Quen Vàng', subtopics: ['Ngủ sâu 22h - 01h tiết GH', 'Uống 400-500ml sữa/ngày', 'Hạn chế nước ngọt có gas'] }
    );
  } else if (hasCramp) {
    keyPoints.push(
      {
        id: 'kp_1',
        title: 'Nguyên nhân: Mất nước, cạn điện giải & thiếu khởi động',
        detail: 'Cơ bắp bị mất Kali, Magie, Canxi qua mồ hôi và chưa được làm nóng khiến dây thần kinh kích thích cơ co thắt quá mức.',
        tag: 'Cốt lõi',
        importance: 'high'
      },
      {
        id: 'kp_2',
        title: 'Sơ cứu: Duỗi thẳng chân và kéo ngược ngón chân về phía gối',
        detail: 'Kéo giãn cơ thụ động ngược hướng co thắt trong 20-30 giây để cơ bắp thả lỏng. Tuyệt đối không xoa bóp đấm mạnh.',
        tag: 'An toàn',
        importance: 'high'
      },
      {
        id: 'kp_3',
        title: 'Bù nước điện giải và nạp Kali nhanh',
        detail: 'Sau khi qua cơn co thắt, uống nước oresol hoặc ăn 1 quả chuối chín để bổ sung lại nguồn điện giải cho cơ thể.',
        tag: 'Dinh dưỡng',
        importance: 'medium'
      }
    );

    actionItems.push(
      { id: 'act_1', step: 'Dừng tập ngay và nằm nghỉ chỗ râm mát khi chớm thấy cơ co cứng', tip: 'Không cố chạy tiếp gây rách cơ' },
      { id: 'act_2', step: 'Dùng tay kéo ngược mũi chân về phía đầu gối và giữ yên 30 giây', tip: 'Thở đều và thả lỏng bắp chân' },
      { id: 'act_3', step: 'Uống từng ngụm nước bù điện giải và ăn chuối chín', tip: 'Nạp lại Kali và Magie cho tế bào cơ' }
    );

    quizQuestions.push(
      {
        id: 'q_1',
        question: 'Khi bạn học sinh bị chuột rút bắp chuối, hành động nào là SAI và nguy hiểm nhất?',
        answer: 'Đấm mạnh hoặc bóp giật mạnh vào chỗ cơ đang co cứng vì dễ làm rách sợi cơ và xuất huyết vi thể.',
        hint: 'Chỉ nên kéo căng cơ nhẹ nhàng ngược chiều co thắt.'
      }
    );

    mindmapNodes.push(
      { topic: 'Sơ Cứu Chuột Rút', subtopics: ['Dừng vận động ngay', 'Kéo ngược ngón chân về gối', 'Giữ yên 20-30 giây'] },
      { topic: 'Phòng Ngừa Học Đường', subtopics: ['Khởi động 7-10 phút', 'Bổ sung nước trước 20 phút', 'Ăn chuối nạp Kali'] }
    );
  } else if (hasPosture) {
    keyPoints.push(
      {
        id: 'kp_1',
        title: 'Tư thế ngồi học chuẩn 90-90-90',
        detail: 'Khuỷu tay vuông góc mặt bàn, hông tựa lưng ghế góc 90-100 độ, đầu gối gập 90 độ và hai bàn chân chạm sàn.',
        tag: 'Kỹ thuật',
        importance: 'high'
      },
      {
        id: 'kp_2',
        title: 'Khoảng cách mắt an toàn 30-35cm',
        detail: 'Không tì ngực vào cạnh bàn, giữ ngực cách mép bàn khoảng 1 nắm tay để bảo vệ thị lực và tránh gù cột sống ngực.',
        tag: 'An toàn',
        importance: 'high'
      },
      {
        id: 'kp_3',
        title: 'Quy tắc nghỉ giải lao 45 phút - 3 phút',
        detail: 'Cứ sau mỗi tiết học 45 phút, đứng dậy vươn vai mở ngực và xoay khớp cổ để giải phóng áp lực ở đốt sống cổ C5-C7.',
        tag: 'Mẹo nhớ',
        importance: 'medium'
      }
    );

    actionItems.push(
      { id: 'act_1', step: 'Kiểm tra khoảng cách ngực cách mép bàn 1 nắm tay khi ngồi học', tip: 'Giữ lưng thẳng tự nhiên' },
      { id: 'act_2', step: 'Cứ sau 40 phút ngồi học, đứng lên vươn vai và nhìn xa 20m trong 20 giây', tip: 'Thư giãn cơ mi của mắt' },
      { id: 'act_3', step: 'Tập bài tập ngửa cổ nhìn trần nhà và ép xương bả vai ra sau 10 lần mỗi tối', tip: 'Chống gù lưng và rụt cổ' }
    );

    quizQuestions.push(
      {
        id: 'q_1',
        question: 'Tư thế ngồi học 90-90-90 bao gồm 3 góc vuông ở những vị trí nào trên cơ thể?',
        answer: 'Góc khuỷu tay trên mặt bàn, góc hông - lưng và góc đầu gối khi hai bàn chân chạm đất.',
        hint: 'Khuỷu tay, hông và đầu gối.'
      }
    );

    mindmapNodes.push(
      { topic: 'Tư Thế Ngồi Học 90-90-90', subtopics: ['Khuỷu tay 90 độ', 'Hông tựa lưng 90-100 độ', 'Bàn chân chạm đất'] },
      { topic: 'Chống Gù & Mỏi Mắt', subtopics: ['Ngực cách bàn 1 nắm tay', 'Mắt cách sách 30-35cm', 'Vươn vai sau mỗi 45 phút'] }
    );
  } else {
    // General text extraction
    const firstFew = sentences.slice(0, 3).join(' ');
    keyPoints.push(
      {
        id: 'kp_1',
        title: 'Trọng tâm nội dung chính',
        detail: firstFew.slice(0, 200) || 'Nội dung cốt lõi của tài liệu được trích xuất cho học sinh rèn luyện.',
        tag: 'Cốt lõi',
        importance: 'high'
      },
      {
        id: 'kp_2',
        title: 'Quy tắc an toàn & Kỹ thuật thực hành',
        detail: sentences[3] ? sentences[3].slice(0, 180) : 'Tuân thủ hướng dẫn kỹ thuật chuẩn mực để đạt hiệu quả thể chất cao nhất và phòng tránh chấn thương.',
        tag: 'Kỹ thuật',
        importance: 'medium'
      },
      {
        id: 'kp_3',
        title: 'Lời khuyên áp dụng vào sinh hoạt học đường',
        detail: sentences[4] ? sentences[4].slice(0, 180) : 'Duy trì thói quen vận động đều đặn kết hợp nghỉ ngơi, uống đủ nước và ngủ đủ giấc.',
        tag: 'Mẹo nhớ',
        importance: 'medium'
      }
    );

    actionItems.push(
      { id: 'act_1', step: 'Đọc kỹ các bước hướng dẫn trước khi bắt đầu thực hành', tip: 'Hiểu đúng động tác tránh sai tư thế' },
      { id: 'act_2', step: 'Khởi động nhẹ nhàng và duy trì nhịp thở đều trong suốt buổi tập', tip: 'Không nín thở khi gắng sức' },
      { id: 'act_3', step: 'Ghi chú lại thời gian và số lần thực hiện vào sổ tay thể chất', tip: 'Theo dõi sự tiến bộ từng tuần' }
    );

    quizQuestions.push(
      {
        id: 'q_1',
        question: 'Ý nghĩa quan trọng nhất của việc nắm vững kỹ thuật và an toàn trong tài liệu này là gì?',
        answer: 'Giúp đạt hiệu quả rèn luyện tối ưu, tránh chấn thương và hình thành thói quen rèn luyện thể chất bền vững.',
        hint: 'Hướng tới sức khỏe lâu dài và an toàn bản thân.'
      }
    );

    mindmapNodes.push(
      { topic: effectiveTitle.slice(0, 30), subtopics: ['Nội dung lý thuyết', 'Quy tắc thực hành an toàn', 'Kế hoạch rèn luyện'] }
    );
  }

  // Quick digest
  let quickDigest = '';
  if (depth === 'quick') {
    quickDigest = `Tài liệu nhấn mạnh: Cần nắm vững kỹ thuật chuẩn (${keyPoints[0]?.title || 'nguyên lý cơ bản'}), đảm bảo an toàn vận động và duy trì thói quen thực hành đều đặn mỗi ngày.`;
  } else {
    quickDigest = `Tóm tắt cốt lõi: ${keyPoints.slice(0, 2).map(k => k.title + ' (' + k.detail.slice(0, 80) + '...)').join('. ')}. Áp dụng các nguyên tắc này sẽ giúp học sinh tối ưu thể lực, phòng tránh rủi ro chấn thương và nâng cao kết quả học tập.`;
  }

  const condensedWords = (quickDigest + ' ' + keyPoints.map(k => k.title + ' ' + k.detail).join(' ')).split(/\s+/).length;
  const compressionRatio = wordCount > 0 ? Math.max(40, Math.min(85, Math.round((1 - condensedWords / Math.max(wordCount, condensedWords + 50)) * 100))) : 65;

  return {
    title: effectiveTitle,
    quickDigest,
    studentTakeaway: '💪 "Luyện tập đúng kỹ thuật quan trọng hơn tập thật nhiều - An toàn và đều đặn là chìa khóa của sức khỏe học đường!"',
    keyPoints,
    actionItems,
    quizQuestions,
    mindmapNodes,
    originalWordCount: wordCount || 350,
    condensedWordCount: condensedWords || 110,
    compressionPercentage: compressionRatio,
    readingTimeMinutes: Math.max(1, Math.round(condensedWords / 150)),
    sourceType: 'custom',
    sourceTitle: effectiveTitle
  };
}

// Full summarizer function calling Gemini API
export async function summarizeWithGemini(
  ai: GoogleGenAI | null,
  params: SummarizeRequest
): Promise<SummaryResult> {
  const { text, title, depth = 'standard', audience = 'student' } = params;

  if (!ai) {
    return generateOfflineSummary(text, title, depth, audience);
  }

  try {
    const depthInstruction =
      depth === 'quick'
        ? 'Tập trung vào tính siêu cô đọng: Tóm tắt 2-3 câu ngắn gọn, 3 ý chính quan trọng nhất, 2 hành động cần làm.'
        : depth === 'detailed'
        ? 'Tóm tắt toàn diện và chuyên sâu: 4-6 ý chính phân tích rõ cơ chế khoa học, 4 bước hành động cụ thể, 3 câu hỏi kiểm tra độ hiểu bài, và sơ đồ phân nhánh.'
        : 'Tóm tắt tiêu chuẩn: Cân đối giữa lý thuyết và hướng dẫn thực hành cho học sinh, 3-4 ý chính, 3 hành động, 2 câu hỏi ôn tập.';

    const audienceInstruction =
      audience === 'teacher'
        ? 'Ngôn ngữ chuẩn mực sư phạm, phù hợp để giáo viên đưa vào giáo án và truyền đạt trên lớp.'
        : audience === 'athlete'
        ? 'Tập trung vào hiệu suất vận động, chiến thuật thi đấu, tốc độ hồi phục và tâm lý thi đấu.'
        : 'Ngôn ngữ thân thiện, trực quan, dễ hiểu, giàu cảm hứng và gần gũi với học sinh lứa tuổi 11-18.';

    const prompt = `Bạn là Trợ lý AI Chuyên gia Tóm tắt & Trích xuất Ý chính Giáo dục Thể chất và Sức khỏe Học đường (MindX Function #03 - AI Summarizer & Key Points Extractor).
Nhiệm vụ của bạn là phân tích tài liệu/dữ liệu được cung cấp dưới đây, sau đó trích xuất các ý chính cốt lõi, bước hành động thực tế và câu hỏi ôn tập một cách khoa học, chuẩn xác, hấp dẫn.

Yêu cầu định dạng tóm tắt:
${depthInstruction}
Đối tượng tiếp nhận:
${audienceInstruction}

Tiêu đề gợi ý (nếu có): ${title || 'Chưa cung cấp'}

Nội dung tài liệu cần phân tích và tóm tắt:
"""
${text}
"""

HÃY TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON HỢP LỆ (KHÔNG DÙNG BACKTICKS \`\`\`json HOẶC BẤT KỲ VĂN BẢN NGOÀI NÀO):
{
  "title": "<Tiêu đề tóm tắt ngắn gọn, thu hút, phản ánh đúng chủ đề>",
  "quickDigest": "<Tóm tắt súc tích trong 2-3 câu nêu bật thông điệp quan trọng nhất>",
  "studentTakeaway": "<Một câu đúc kết hoặc câu châm ngôn ngắn gọn truyền cảm hứng cho học sinh>",
  "keyPoints": [
    {
      "id": "kp_1",
      "title": "<Tên ngắn gọn của ý chính 1>",
      "detail": "<Nội dung giải thích súc tích trong 1-2 câu>",
      "tag": "<Cốt lõi | Kỹ thuật | An toàn | Dinh dưỡng | Mẹo nhớ | Chiến thuật>",
      "importance": "<high | medium | normal>"
    }
  ],
  "actionItems": [
    {
      "id": "act_1",
      "step": "<Hành động cụ thể, bắt đầu bằng động từ hành động>",
      "tip": "<Mẹo nhỏ hoặc lưu ý an toàn khi làm>"
    }
  ],
  "quizQuestions": [
    {
      "id": "q_1",
      "question": "<Câu hỏi kích thích tư duy tự kiểm tra kiến thức>",
      "answer": "<Câu trả lời ngắn gọn, chuẩn xác>",
      "hint": "<Gợi ý ngắn>"
    }
  ],
  "mindmapNodes": [
    {
      "topic": "<Tên nhánh kiến thức chính>",
      "subtopics": ["<Ý con 1>", "<Ý con 2>", "<Ý con 3>"]
    }
  ]
}`;

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout - switching to instant extractor')), 4500)
      )
    ]);

    const rawResponseText = response.text?.trim() || '{}';
    const parsed = JSON.parse(rawResponseText);

    const originalWords = text.trim().split(/\s+/).length;
    const condensedWords = (
      (parsed.quickDigest || '') +
      ' ' +
      (parsed.keyPoints || []).map((k: any) => k.title + ' ' + k.detail).join(' ')
    ).trim().split(/\s+/).length;

    const compressionPercentage = originalWords > 0
      ? Math.max(35, Math.min(88, Math.round((1 - condensedWords / Math.max(originalWords, condensedWords + 40)) * 100)))
      : 65;

    return {
      title: parsed.title || title || 'Tóm Tắt Ý Chính Học Đường',
      quickDigest: parsed.quickDigest || 'Nội dung đã được tóm tắt các điểm quan trọng nhất.',
      studentTakeaway: parsed.studentTakeaway || 'Rèn luyện đúng phương pháp là nền tảng của sự bứt phá!',
      keyPoints: Array.isArray(parsed.keyPoints) && parsed.keyPoints.length > 0
        ? parsed.keyPoints
        : generateOfflineSummary(text, title, depth, audience).keyPoints,
      actionItems: Array.isArray(parsed.actionItems) && parsed.actionItems.length > 0
        ? parsed.actionItems
        : generateOfflineSummary(text, title, depth, audience).actionItems,
      quizQuestions: Array.isArray(parsed.quizQuestions) && parsed.quizQuestions.length > 0
        ? parsed.quizQuestions
        : generateOfflineSummary(text, title, depth, audience).quizQuestions,
      mindmapNodes: Array.isArray(parsed.mindmapNodes) && parsed.mindmapNodes.length > 0
        ? parsed.mindmapNodes
        : generateOfflineSummary(text, title, depth, audience).mindmapNodes,
      originalWordCount: originalWords,
      condensedWordCount: condensedWords,
      compressionPercentage,
      readingTimeMinutes: Math.max(1, Math.round(condensedWords / 150)),
      sourceType: params.sourceType || 'custom',
      sourceTitle: title || parsed.title,
      sourceId: params.sourceId
    };
  } catch (error) {
    console.error('Error generating summary with Gemini, using fallback:', error);
    return generateOfflineSummary(text, title, depth, audience);
  }
}
