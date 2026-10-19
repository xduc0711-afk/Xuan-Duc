import { GoogleGenAI } from '@google/genai';
import { PracticeQuizSet, PracticeQuestion, QuizQuestionType } from '../src/types';

export interface QuizGenerateRequest {
  topic: string;
  grade: string; // e.g. "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12", "Tiểu học"
  subject?: string;
  questionCount?: number;
  questionTypes?: QuizQuestionType[];
}

export const PRESET_CURRICULUM_TOPICS = [
  {
    topic: 'Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở',
    defaultGrade: 'Lớp 8',
    subject: 'Giáo dục Thể chất',
    description: 'Ôn tập kỹ thuật phân phối sức, nhịp thở 2-2, tiếp đất bàn chân và chống xóc hông trong bài kiểm tra thể lực.',
  },
  {
    topic: 'Kỹ thuật Xuất phát thấp & Chạy cự ly ngắn (60m / 100m)',
    defaultGrade: 'Lớp 7',
    subject: 'Giáo dục Thể chất',
    description: '3 khẩu lệnh "Vào chỗ" - "Sẵn sàng" - "Chạy", góc đạp bàn đạp và duy trì tần số bước chạy.',
  },
  {
    topic: 'Kỹ thuật Nhảy xa kiểu ngồi (4 giai đoạn kỹ thuật)',
    defaultGrade: 'Lớp 9',
    subject: 'Giáo dục Thể chất',
    description: 'Chạy đà, giậm nhảy trên ván, bay trên không (thu gối sát ngực) và tiếp đất an toàn trong hố cát.',
  },
  {
    topic: 'Bóng rổ: Kỹ thuật Dẫn bóng & Ném rổ 1 tay trên vai',
    defaultGrade: 'Lớp 10',
    subject: 'Giáo dục Thể chất',
    description: 'Kỹ thuật ấn bóng bằng ngón tay, mắt quan sát, tư thế khuỷu tay vuông góc và miết cổ tay theo bóng.',
  },
  {
    topic: 'Bóng chuyền: Kỹ thuật Đệm bóng (chuyền bóng thấp tay)',
    defaultGrade: 'Lớp 11',
    subject: 'Giáo dục Thể chất',
    description: 'Bàn tay lồng vào nhau, cẳng tay tạo mặt phẳng 1/3 trước cổ tay, nâng đùi kết hợp duỗi tay đón bóng.',
  },
  {
    topic: 'Dinh dưỡng 4 nhóm chất & Khẩu phần ăn cho học sinh dậy thì',
    defaultGrade: 'Lớp 9',
    subject: 'Dinh dưỡng & Thể lực',
    description: 'Chất đạm (Protein), tinh bột (Carb), chất béo (Lipid), vitamin khoáng chất (Canxi, Sắt, D3) và bù nước.',
  },
  {
    topic: 'Sơ cứu chấn thương thể thao học đường (Bong gân, Chuột rút)',
    defaultGrade: 'Lớp 8',
    subject: 'Y tế & An toàn Thể chất',
    description: 'Quy tắc R.I.C.E (Nghỉ - Chườm lạnh - Băng ép - Kê cao), kéo giãn cơ ngược chiều khi bị chuột rút bắp chuối.',
  },
  {
    topic: 'Bài thể dục phát triển chung & Thể dục nhịp điệu',
    defaultGrade: 'Lớp 6',
    subject: 'Giáo dục Thể chất',
    description: '9 động tác phát triển chung: Vươn thở, Tay, Chân, Lườn, Bụng, Toàn thân, Nhảy, Điều hòa.',
  },
];

// Offline rich fallback generator grounded in real textbook facts
export function generateOfflineQuiz(request: QuizGenerateRequest): PracticeQuizSet {
  const { topic, grade, subject = 'Giáo dục Thể chất' } = request;
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  const questions: PracticeQuestion[] = [];

  if (lower.includes('1500m') || lower.includes('chạy bền') || lower.includes('trung bình') || lower.includes('nhịp thở')) {
    questions.push(
      // 1. Multiple Choice
      {
        id: 'q1_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: 'Trong cự ly chạy 1500m, nhịp thở chuẩn mực được khuyên dùng để phòng ngừa xóc hông là gì?',
        options: [
          'A. 1 bước hít vào - 1 bước thở ra',
          'B. 2 bước hít vào bằng mũi - 2 bước thở ra bằng miệng (nhịp 2-2)',
          'C. Nín thở khi chạy nhanh rồi thở dốc',
          'D. Chỉ hít thở bằng miệng'
        ],
        correctOptionIndex: 1,
        explanation: 'Nhịp thở 2-2 (2 bước hít sâu bằng mũi phồng cơ hoành, 2 bước thở mạnh qua miệng) giúp cung cấp đủ oxy cho cơ thể và ngăn ngừa co thắt cơ hoành (xóc hông).',
        studyTip: 'Ghi nhớ: "2 hít mũi - 2 thở miệng" theo nhịp bước chân.',
        curriculumReference: 'Sách giáo khoa Giáo dục Thể chất - Chủ đề Điền kinh cự ly trung bình.'
      },
      // 2. Multiple Choice
      {
        id: 'q2_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: 'Khi chạy cự ly 1500m, kỹ thuật tiếp đất bàn chân đúng nhất để bảo vệ khớp gối là:',
        options: [
          'A. Nện mạnh gót chân xuống đường chạy',
          'B. Tiếp đất bằng cạnh ngoài bàn chân',
          'C. Tiếp đất bằng nửa trước bàn chân (ức bàn chân) hoặc phần giữa bàn chân rồi lăn êm',
          'D. Nhón hoàn toàn ngón chân cái'
        ],
        correctOptionIndex: 2,
        explanation: 'Tiếp đất bằng nửa trước/giữa bàn chân giúp bàn chân và cơ bắp chân đóng vai trò lò xo giảm xóc, tránh lực phản chấn dội thẳng vào khớp gối và cột sống.',
        studyTip: 'Không nện gót chân để tránh chấn thương khớp gối.',
        curriculumReference: 'Kỹ thuật chạy cự ly trung bình - Phần Đặt bàn chân.'
      },
      // 3. True / False
      {
        id: 'q3_tf',
        type: 'true_false',
        typeLabelVi: 'Đúng / Sai',
        question: 'Sau khi chạy qua vạch đích 1500m, học sinh nên ngồi bệt hoặc nằm ngay xuống đất để cơ thể nghỉ ngơi nhanh nhất.',
        correctBoolean: false,
        explanation: 'SAI. Khi vừa dừng chạy, máu đang dồn nhiều ở chi dưới. Nếu ngồi bệt ngay, máu chưa kịp hồi lưu về tim và não, rất dễ gây tụt huyết áp đột ngột, hoa mắt và ngất xỉu. Phải đi bộ nhẹ nhàng 3-5 phút và vung tay thả lỏng.',
        studyTip: 'Quy tắc hồi tĩnh: Luôn đi bộ thả lỏng sau khi về đích.',
        curriculumReference: 'Nguyên tắc an toàn và hồi phục sau bài chạy cự ly bền.'
      },
      // 4. True / False
      {
        id: 'q4_tf',
        type: 'true_false',
        typeLabelVi: 'Đúng / Sai',
        question: 'Trong 100m đầu tiên của cự ly chạy 1500m, học sinh nên bứt tốc 100% sức để dẫn đầu đoàn chạy.',
        correctBoolean: false,
        explanation: 'SAI. Bứt tốc tối đa quá sớm sẽ làm tích tụ acid lactic ở cơ bắp, khiến cơ bị căng cứng, cạn kiệt năng lượng và hụt hơi ở các vòng tiếp theo. Nên chạy khoảng 75-80% sức và phân phối đều.',
        studyTip: 'Phân phối sức: Xuất phát đều sức, giữ nhịp ở vòng giữa, tăng tốc nước rút 150m cuối.',
        curriculumReference: 'Chiến thuật phân phối sức cự ly trung bình.'
      },
      // 5. Fill in the Blank
      {
        id: 'q5_fb',
        type: 'fill_blank',
        typeLabelVi: 'Điền từ ngắn',
        question: 'Hiện tượng đau nhói dưới sườn phải khi chạy cự ly trung bình do cơ hoành bị co thắt và thiếu oxy được gọi là bị ___.',
        correctTextAnswer: 'xóc hông',
        acceptableAnswers: ['xóc hông', 'đau xóc hông', 'soc hong', 'xoc hong'],
        explanation: 'Xóc hông là hiện tượng phổ biến do hít thở nông hoặc vận động mạnh sau khi vừa ăn no. Cách khắc phục: Giảm tốc độ, hít sâu bằng mũi và thở dốc hết cỡ bằng miệng.',
        studyTip: 'Từ khóa y khoa học đường: xóc hông (co thắt cơ hoành).',
        curriculumReference: 'Hiện tượng sinh lý thường gặp khi rèn luyện thể chất.'
      },
      // 6. Short Answer
      {
        id: 'q6_sa',
        type: 'short_answer',
        typeLabelVi: 'Hỏi – đáp ngắn',
        question: 'Nêu 2 việc học sinh cần làm ngay khi đang chạy bền mà cảm thấy bị xóc hông (đau nhói sườn)?',
        modelAnswer: 'Chủ động giảm tốc độ chạy và hít thật sâu bằng mũi sau đó thở mạnh hết cỡ bằng miệng (hóp bụng lại để tống hết khí cặn ra ngoài).',
        keyConcepts: ['giảm tốc độ', 'hít sâu bằng mũi', 'thở mạnh ra bằng miệng'],
        explanation: 'Giúp đưa lượng oxy dồi dào về giải tỏa cơn co thắt cơ hoành mà không cần phải dừng lại đột ngột làm đứt đoạn bài chạy.',
        studyTip: 'Ghi đủ 2 ý: giảm tốc độ + thở sâu tống khí cặn.',
        curriculumReference: 'Kỹ năng xử lý hiện tượng xóc hông trong giờ học Thể chất.'
      }
    );
  } else if (lower.includes('xuất phát thấp') || lower.includes('chạy ngắn') || lower.includes('60m') || lower.includes('100m')) {
    questions.push(
      {
        id: 'q1_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: 'Kỹ thuật xuất phát thấp trong chạy cự ly ngắn gồm có mấy khẩu lệnh theo thứ tự chuẩn?',
        options: [
          'A. 2 khẩu lệnh: "Chuẩn bị" - "Chạy"',
          'B. 3 khẩu lệnh: "Vào chỗ" - "Sẵn sàng" - "Chạy" (hoặc tiếng súng/còi phát lệnh)',
          'C. 3 khẩu lệnh: "Chuẩn bị" - "Chú ý" - "Đi"',
          'D. 1 khẩu lệnh duy nhất: "Bắt đầu"'
        ],
        correctOptionIndex: 1,
        explanation: 'Theo luật thi đấu điền kinh môn chạy cự ly ngắn: Có 3 lệnh tuần tự: "Vào chỗ" -> "Sẵn sàng" (nâng mông cao hơn vai) -> "Chạy" (hoặc phát lệnh bằng súng/còi).',
        studyTip: 'Thứ tự vàng: Vào chỗ -> Sẵn sàng -> Chạy.',
        curriculumReference: 'SGK Giáo dục Thể chất - Kỹ thuật Xuất phát thấp chạy ngắn.'
      },
      {
        id: 'q2_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: 'Ở hiệu lệnh "Sẵn sàng" trong xuất phát thấp, vị trí của mông so với vai là:',
        options: [
          'A. Thấp hơn vai',
          'B. Ngang bằng vai',
          'C. Cao hơn vai khoảng 10 - 20cm, trọng tâm dồn về hai tay và chân trước',
          'D. Ngồi bệt ra sau gót chân'
        ],
        correctOptionIndex: 2,
        explanation: 'Khi nghe lệnh "Sẵn sàng", người chạy từ từ nâng mông cao hơn vai khoảng 10-20cm, đẩy trọng tâm cơ thể về phía trước để tích trữ thế năng bật phóng mạnh khi có lệnh "Chạy".',
        studyTip: 'Mông cao hơn vai 10-20cm, trọng tâm dồn ra trước.',
        curriculumReference: 'Kỹ thuật xuất phát thấp - Giai đoạn Sẵn sàng.'
      },
      {
        id: 'q3_tf',
        type: 'true_false',
        typeLabelVi: 'Đúng / Sai',
        question: 'Khi có lệnh "Chạy", người chạy nên dựng thẳng đứng thân người ngay ở bước chạy đầu tiên.',
        correctBoolean: false,
        explanation: 'SAI. Khi xuất phát, thân người phải giữ độ ngả về phía trước (góc ngả khoảng 45-50 độ) và tăng dần độ dài bước chạy. Thân người chỉ dựng thẳng dần dần sau 15-20m để duy trì gia tốc tối đa.',
        studyTip: 'Không dựng thẳng thân người quá sớm sau xuất phát.',
        curriculumReference: 'Giai đoạn chạy lao sau xuất phát.'
      },
      {
        id: 'q4_fb',
        type: 'fill_blank',
        typeLabelVi: 'Điền từ ngắn',
        question: 'Trong chạy cự ly ngắn, kỹ thuật chạy được chia làm 4 giai đoạn: Xuất phát, Chạy lao, Chạy ___ và Về đích.',
        correctTextAnswer: 'giữa quãng',
        acceptableAnswers: ['giữa quãng', 'giua quang', 'chay giua quang'],
        explanation: '4 giai đoạn kỹ thuật chạy cự ly ngắn: Xuất phát -> Chạy lao sau xuất phát -> Chạy giữa quãng -> Về đích.',
        studyTip: '4 giai đoạn: Xuất phát - Chạy lao - Giữa quãng - Về đích.',
        curriculumReference: 'Khái niệm và cấu trúc kỹ thuật chạy cự ly ngắn.'
      },
      {
        id: 'q5_sa',
        type: 'short_answer',
        typeLabelVi: 'Hỏi – đáp ngắn',
        question: 'Để đánh đích hiệu quả trong chạy cự ly ngắn, người chạy thường dùng kỹ thuật nào?',
        modelAnswer: 'Đánh đích bằng ngực (gập thân trên về phía trước) hoặc đánh đích bằng cách nghiêng vai chạm dây đích.',
        keyConcepts: ['đánh đích bằng ngực', 'nghiêng vai', 'gập thân trên'],
        explanation: 'Không được nhảy lên để chạm vạch đích vì nhảy sẽ làm giảm tốc độ chạy về phía trước.',
        studyTip: 'Dùng ngực hoặc vai chạm dây đích, không nhảy qua đích.',
        curriculumReference: 'Kỹ thuật về đích trong chạy cự ly ngắn.'
      }
    );
  } else if (lower.includes('bóng rổ') || lower.includes('ném rổ') || lower.includes('dẫn bóng')) {
    questions.push(
      {
        id: 'q1_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: 'Khi thực hiện kỹ thuật dẫn bóng trong bóng rổ, bộ phận nào của bàn tay tiếp xúc và đẩy bóng xuống sàn?',
        options: [
          'A. Lòng bàn tay đập mạnh',
          'B. Các ngón tay và phần chai tay (ức bàn tay), không để lòng bàn tay chạm bóng',
          'C. Mu bàn tay',
          'D. Khớp đốt ngón tay'
        ],
        correctOptionIndex: 1,
        explanation: 'Dẫn bóng đúng kỹ thuật sử dụng các ngón tay và phần ức ngón tay ấn nhịp nhàng theo bóng. Không dùng lòng bàn tay tát hoặc đập bóng vì sẽ mất kiểm soát hướng bóng và bóng nảy không đều.',
        studyTip: 'Ấn bóng bằng đầu các ngón tay, mắt nhìn bao quát sân.',
        curriculumReference: 'SGK Giáo dục Thể chất - Môn Thể thao tự chọn Bóng rổ.'
      },
      {
        id: 'q2_tf',
        type: 'true_false',
        typeLabelVi: 'Đúng / Sai',
        question: 'Trong luật bóng rổ, khi một cầu thủ đang dẫn bóng rồi cầm bóng bằng cả 2 tay lại tiếp tục dẫn bóng đi tiếp thì không phạm luật.',
        correctBoolean: false,
        explanation: 'SAI. Đây là lỗi "dẫn bóng 2 lần" (Double Dribble). Khi đã cầm bóng bằng 2 tay sau khi dẫn bóng, cầu thủ chỉ được phép chuyền hoặc ném rổ.',
        studyTip: 'Cầm bóng bằng 2 tay sau khi dẫn -> Không được dẫn tiếp.',
        curriculumReference: 'Luật thi đấu bóng rổ học sinh.'
      },
      {
        id: 'q3_fb',
        type: 'fill_blank',
        typeLabelVi: 'Điền từ ngắn',
        question: 'Trong kỹ thuật ném rổ một tay trên vai, khi chuẩn bị ném, góc tạo bởi cánh tay và cẳng tay của tay ném nên xấp xỉ ___ độ.',
        correctTextAnswer: '90',
        acceptableAnswers: ['90', '90 độ', 'vuông góc'],
        explanation: 'Tư thế chữ L: Cẳng tay vuông góc với cánh tay (90 độ) tạo thành đòn bẩy ổn định trước khi duỗi thẳng tay và vẫy cổ tay đẩy bóng hình vòng cung.',
        studyTip: 'Góc vuông 90 độ ở khuỷu tay ném rổ.',
        curriculumReference: 'Kỹ thuật ném rổ một tay trên vai.'
      },
      {
        id: 'q4_sa',
        type: 'short_answer',
        typeLabelVi: 'Hỏi – đáp ngắn',
        question: 'Nêu động tác kết thúc của bàn tay và cổ tay sau khi bóng vừa rời tay trong pha ném rổ một tay trên vai?',
        modelAnswer: 'Cổ tay gập chúc xuống theo hướng rổ (miết cổ tay), các ngón tay hướng xuống dưới sàn như hình dáng cổ thiên nga (Follow-through).',
        keyConcepts: ['miết cổ tay', 'gập chúc cổ tay', 'ngón tay hướng xuống rổ'],
        explanation: 'Động tác vẫy cổ tay giúp tạo độ xoáy ngược (backspin) cho bóng, giúp bóng bay êm và dễ rơi vào rổ khi chạm vành.',
        studyTip: 'Miết cổ tay gập chúc (cổ thiên nga) sau khi ném.',
        curriculumReference: 'Kỹ thuật tiếp tục theo bóng (Follow-through) môn Bóng rổ.'
      }
    );
  } else if (lower.includes('dinh dưỡng') || lower.includes('canxi') || lower.includes('chiều cao') || lower.includes('thực phẩm')) {
    questions.push(
      {
        id: 'q1_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: 'Để cơ thể học sinh hấp thu Canxi tối đa từ thực phẩm vào máu rồi gắn chắc vào xương, cần có sự hỗ trợ của bộ đôi vi chất nào?',
        options: [
          'A. Vitamin C và Sắt',
          'B. Vitamin D3 và Vitamin K2',
          'C. Vitamin A và Vitamin B1',
          'D. Magie và Natri'
        ],
        correctOptionIndex: 1,
        explanation: 'Vitamin D3 giúp chuyển Canxi từ ruột non vào dòng máu; Vitamin K2 đóng vai trò điều hướng gắn Canxi chính xác vào khung xương, tránh lắng đọng ở mạch máu.',
        studyTip: 'Canxi cần D3 để vào máu và K2 để vào xương.',
        curriculumReference: 'Dinh dưỡng phát triển thể chất lứa tuổi học sinh.'
      },
      {
        id: 'q2_tf',
        type: 'true_false',
        typeLabelVi: 'Đúng / Sai',
        question: 'Học sinh nên nhịn ăn sáng trước khi tham gia bài kiểm tra chạy bền để bụng nhẹ nhàng và chạy nhanh hơn.',
        correctBoolean: false,
        explanation: 'SAI. Nhịn ăn sáng làm tụt đường huyết nghiêm trọng. Khi vận động gắng sức, não bộ và cơ bắp thiếu glucose sẽ gây chóng mặt, hoa mắt, run tay chân và ngất xỉu. Nên ăn nhẹ trước giờ tập 1.5 - 2 tiếng.',
        studyTip: 'Tuyệt đối không nhịn ăn sáng trước giờ học Thể chất.',
        curriculumReference: 'Vệ sinh dinh dưỡng và an toàn thể dục học đường.'
      },
      {
        id: 'q3_fb',
        type: 'fill_blank',
        typeLabelVi: 'Điền từ ngắn',
        question: 'Bữa ăn cân đối chuẩn khoa học học đường cần gồm đủ 4 nhóm chất: Chất bột đường, chất đạm, chất béo, cùng với ___ và khoáng chất.',
        correctTextAnswer: 'vitamin',
        acceptableAnswers: ['vitamin', 'các loại vitamin', 'vi chất'],
        explanation: '4 nhóm chất dinh dưỡng thiết yếu: Tinh bột (Carbohydrate), Đạm (Protein), Chất béo (Lipid), Vitamin & Khoáng chất.',
        studyTip: '4 nhóm chất: Tinh bột - Đạm - Béo - Vitamin & Khoáng chất.',
        curriculumReference: 'Tháp dinh dưỡng hợp lý cho trẻ em và học sinh Việt Nam.'
      },
      {
        id: 'q4_sa',
        type: 'short_answer',
        typeLabelVi: 'Hỏi – đáp ngắn',
        question: 'Trước giờ thi đấu thể thao khoảng 30-45 phút, loại thực phẩm nhẹ nào rất giàu Kali và đường tự nhiên thích hợp nhất cho học sinh?',
        modelAnswer: 'Quả chuối chín (chuối già hoặc chuối tây) kèm 1 ly nước ấm nhỏ.',
        keyConcepts: ['chuối', 'chuối chín', 'nước ấm'],
        explanation: 'Chuối cung cấp carbohydrate hấp thu nhanh nạp năng lượng tức thì và lượng Kali dồi dào giúp chống chuột rút co thắt cơ khi vận động.',
        studyTip: 'Chuối chín là món ăn nhẹ số 1 trước giờ vận động thể thao.',
        curriculumReference: 'Thực đơn nạp năng lượng nhanh cho học sinh thi đấu.'
      }
    );
  } else {
    // General factual physical education questions for any custom topic
    questions.push(
      {
        id: 'q1_mc',
        type: 'multiple_choice',
        typeLabelVi: 'Trắc nghiệm lựa chọn',
        question: `Thời gian khởi động chung tối thiểu được khuyến cáo trước khi bước vào luyện tập cho chủ đề "${cleanTopic}" là:`,
        options: [
          'A. Không cần khởi động, tập ngay',
          'B. 5 đến 10 phút xoay kỹ các khớp (cổ tay, cổ chân, khớp gối, vai, hông) và ép dẻo',
          'C. 30 giây chạy nhanh',
          'D. 45 phút khởi động'
        ],
        correctOptionIndex: 1,
        explanation: 'Khởi động 5-10 phút giúp làm nóng cơ bắp, kích thích tiết chất nhờn bao hoạt dịch ở các khớp, tăng dần nhịp tim và ngăn ngừa chấn thương bong gân, rách cơ.',
        studyTip: 'Nguyên tắc vàng: Luôn khởi động kỹ 5-10 phút trước mọi bài tập.',
        curriculumReference: `Giáo trình GDPT môn Giáo dục Thể chất - ${grade}.`
      },
      {
        id: 'q2_tf',
        type: 'true_false',
        typeLabelVi: 'Đúng / Sai',
        question: `Trong quá trình thực hiện bài tập "${cleanTopic}", khi cơ thể đang gắng sức, học sinh nên nín thở thật chặt để dồn toàn bộ sức mạnh.`,
        correctBoolean: false,
        explanation: 'SAI. Nín thở khi gắng sức làm tăng vọt áp lực lồng ngực và huyết áp, giảm lưu lượng máu lên não, rất dễ gây choáng váng và nguy hiểm. Cần duy trì nhịp thở điều hòa theo nhịp động tác.',
        studyTip: 'Không nín thở khi vận động gắng sức, thở đều đặn.',
        curriculumReference: 'Nguyên lý hô hấp trong vận động thể chất học đường.'
      },
      {
        id: 'q3_fb',
        type: 'fill_blank',
        typeLabelVi: 'Điền từ ngắn',
        question: `Mục tiêu quan trọng hàng đầu trong tiết học Giáo dục Thể chất "${cleanTopic}" đối với học sinh ${grade} là thực hiện đúng ___ động tác trước khi tăng tốc độ hay cường độ.`,
        correctTextAnswer: 'kỹ thuật',
        acceptableAnswers: ['kỹ thuật', 'ky thuat', 'tư thế', 'tu the'],
        explanation: 'Đúng kỹ thuật chuẩn là nền tảng cốt lõi để nâng cao thành tích thể chất và tránh các chấn thương khớp hay cột sống lâu dài.',
        studyTip: 'Đúng kỹ thuật quan trọng hơn làm thật nhanh.',
        curriculumReference: `Mục tiêu chuẩn đầu ra môn Thể chất - ${grade}.`
      },
      {
        id: 'q4_sa',
        type: 'short_answer',
        typeLabelVi: 'Hỏi – đáp ngắn',
        question: `Nêu 2 nguyên tắc an toàn cần tuân thủ khi tự rèn luyện chủ đề "${cleanTopic}" tại trường hoặc tại nhà?`,
        modelAnswer: 'Khởi động kỹ các khớp trước khi tập và lựa chọn trang phục, giày thể thao vừa vặn, sân bãi sạch sẽ không trơn trượt.',
        keyConcepts: ['khởi động kỹ', 'giày thể thao', 'sân bãi an toàn', 'uống đủ nước'],
        explanation: 'Đảm bảo môi trường tập luyện không có vật cản và trang phục co giãn tốt giúp bảo vệ tối đa học sinh.',
        studyTip: 'An toàn sân bãi + khởi động kỹ + trang phục phù hợp.',
        curriculumReference: 'Vệ sinh và an toàn sân bãi môn Giáo dục Thể chất.'
      }
    );
  }

  return {
    id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    topic: cleanTopic,
    grade: grade || 'Lớp 8',
    subject,
    description: `Bộ câu hỏi luyện tập cơ bản bám sát kiến thức trên trường dành cho học sinh ${grade || 'Lớp 8'}.`,
    questions,
    createdAt: new Date().toISOString(),
    totalQuestions: questions.length
  };
}

// Generate with Gemini API
export async function generateQuizWithGemini(
  ai: GoogleGenAI | null,
  request: QuizGenerateRequest
): Promise<PracticeQuizSet> {
  const { topic, grade, subject = 'Giáo dục Thể chất' } = request;

  if (!ai) {
    return generateOfflineQuiz(request);
  }

  try {
    const prompt = `Bạn là Giáo viên môn Giáo dục Thể chất & Khoa học Sức khỏe Học đường tại Việt Nam.
Nhiệm vụ của bạn là tạo một bộ câu hỏi luyện tập CƠ BẢN giúp học sinh ôn bài trên trường, chuẩn bị cho bài kiểm tra 15 phút, 1 tiết hoặc thi học kỳ.

Thông tin yêu cầu:
- Chủ đề đang học: "${topic}"
- Khối lớp: "${grade || 'Lớp 8'}" (Phù hợp độ tuổi, khả năng vận động và thuật ngữ sách giáo khoa của khối lớp này)
- Môn học: "${subject}"

YÊU CẦU QUAN TRỌNG VỀ NỘI DUNG (TUÂN THỦ 100%):
1. TRÁNH CÂU HỎI QUÁ CHUNG CHUNG HOẶC QUÁ META:
   - KHÔNG đặt các câu hỏi triết lý mơ hồ (như "tập thể dục có tốt không", "bạn cảm thấy thế nào khi chạy", "môn thể thao này mang lại niềm vui gì").
   - BẮT BUỘC đặt câu hỏi BÁM KIẾN THỨC THẬT: kỹ thuật động tác cụ thể (góc khuỷu tay, tư thế chân, nhịp thở 2-2, 4 giai đoạn kỹ thuật, khẩu lệnh xuất phát, lỗi phạm quy, sơ cứu chấn thương, chất dinh dưỡng cụ thể).
2. PHẢI CÓ ĐỦ 4 DẠNG CÂU HỎI CƠ BẢN:
   - Dạng 1: 'multiple_choice' (Trắc nghiệm 4 lựa chọn A, B, C, D rõ ràng, 1 đáp án đúng duy nhất).
   - Dạng 2: 'true_false' (Khẳng định Đúng/Sai cụ thể, có giải thích vì sao đúng hoặc sai).
   - Dạng 3: 'fill_blank' (Điền từ/cụm từ ngắn vào chỗ trống '___', kèm các cách viết được chấp nhận).
   - Dạng 4: 'short_answer' (Hỏi - đáp ngắn bám sát sách giáo khoa, kèm câu trả lời mẫu 1-2 câu và từ khóa cốt lõi).
3. TỔNG SỐ CÂU HỎI: Khoảng 5 - 7 câu hỏi (mỗi dạng tối thiểu 1-2 câu).
4. Mỗi câu hỏi phải có 'explanation' (giải thích chi tiết) và 'studyTip' (mẹo ghi nhớ nhanh).

HÃY TRẢ VỀ DUY NHẤT MỘT CHUỖI JSON HỢP LỆ (KHÔNG DÙNG BACKTICKS \`\`\`json HOẶC BẤT KỲ VĂN BẢN NGOÀI NÀO):
{
  "topic": "${topic}",
  "grade": "${grade || 'Lớp 8'}",
  "subject": "${subject}",
  "description": "<Mô tả ngắn gọn về phạm vi kiến thức ôn bài>",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "typeLabelVi": "Trắc nghiệm lựa chọn",
      "question": "<Nội dung câu hỏi trắc nghiệm cụ thể>",
      "options": ["A. <Lựa chọn 1>", "B. <Lựa chọn 2>", "C. <Lựa chọn 3>", "D. <Lựa chọn 4>"],
      "correctOptionIndex": <0 hoặc 1 hoặc 2 hoặc 3>,
      "explanation": "<Giải thích vì sao đáp án này đúng theo SGK>",
      "studyTip": "<Mẹo nhớ nhanh>",
      "curriculumReference": "<Tên bài/chương trong SGK>"
    },
    {
      "id": "q2",
      "type": "true_false",
      "typeLabelVi": "Đúng / Sai",
      "question": "<Khẳng định kỹ thuật hoặc quy tắc cụ thể>",
      "correctBoolean": <true hoặc false>,
      "explanation": "<Giải thích chi tiết tại sao đúng hoặc sai>",
      "studyTip": "<Mẹo lưu ý>",
      "curriculumReference": "<Tên bài trong SGK>"
    },
    {
      "id": "q3",
      "type": "fill_blank",
      "typeLabelVi": "Điền từ ngắn",
      "question": "<Câu có một chỗ trống dạng ___ để học sinh điền từ/số ngắn>",
      "correctTextAnswer": "<Từ hoặc số chính xác>",
      "acceptableAnswers": ["<từ 1>", "<từ 2 không dấu hoặc từ đồng nghĩa ngắn>"],
      "explanation": "<Giải thích cơ chế khoa học hoặc quy tắc>",
      "studyTip": "<Mẹo ghi nhớ>",
      "curriculumReference": "<Tên bài trong SGK>"
    },
    {
      "id": "q4",
      "type": "short_answer",
      "typeLabelVi": "Hỏi – đáp ngắn",
      "question": "<Câu hỏi ngắn yêu cầu nêu 2-3 điểm kỹ thuật hoặc bước xử lý>",
      "modelAnswer": "<Câu trả lời mẫu súc tích 1-2 câu>",
      "keyConcepts": ["<từ khóa 1>", "<từ khóa 2>", "<từ khóa 3>"],
      "explanation": "<Phân tích kiến thức lý thuyết>",
      "studyTip": "<Mẹo ôn bài>",
      "curriculumReference": "<Tên bài trong SGK>"
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
        setTimeout(() => reject(new Error('Gemini API timeout - fallback to curriculum set')), 4500)
      )
    ]);

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed.questions) && parsed.questions.length >= 3) {
      return {
        id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        topic: parsed.topic || topic,
        grade: parsed.grade || grade,
        subject: parsed.subject || subject,
        description: parsed.description || `Bộ câu hỏi luyện tập ôn bài trên trường môn ${subject} cho ${grade}.`,
        questions: parsed.questions.map((q: any, idx: number) => ({
          ...q,
          id: q.id || `q_${idx + 1}`,
          typeLabelVi:
            q.type === 'multiple_choice'
              ? 'Trắc nghiệm lựa chọn'
              : q.type === 'true_false'
              ? 'Đúng / Sai'
              : q.type === 'fill_blank'
              ? 'Điền từ ngắn'
              : 'Hỏi – đáp ngắn',
        })),
        createdAt: new Date().toISOString(),
        totalQuestions: parsed.questions.length,
      };
    }

    return generateOfflineQuiz(request);
  } catch (error) {
    console.error('Error in generateQuizWithGemini, using offline generator:', error);
    return generateOfflineQuiz(request);
  }
}
