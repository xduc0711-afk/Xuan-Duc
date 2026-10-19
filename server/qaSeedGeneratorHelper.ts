import { GoogleGenAI } from '@google/genai';
import { QaSeedDataset, QaSeedPair, QaIntentCategory } from '../src/types';

export interface QaSeedRequest {
  topic: string;
  grade: string;
  subject?: string;
  seedCount?: number;
}

export function generateOfflineQaSeeds(request: QaSeedRequest): QaSeedDataset {
  const { topic, grade, subject = 'Giáo dục Thể chất' } = request;
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  const seeds: QaSeedPair[] = [];

  if (lower.includes('1500m') || lower.includes('chạy bền') || lower.includes('trung bình') || lower.includes('nhịp thở')) {
    seeds.push(
      {
        id: 'seed_1',
        studentQuestion: 'Tại sao khi chạy được khoảng 1–2 vòng sân em hay bị đau nhói buốt ở một bên sườn phải?',
        intentCategory: 'symptom_safety',
        intentLabelVi: 'Triệu chứng & An toàn',
        shortAnswer: 'Đây là hiện tượng xóc hông do cơ hoành bị co thắt vì hít thở nông hoặc do ăn uống quá no trước giờ chạy. Em hãy chủ động giảm tốc độ, hít thật sâu bằng mũi rồi thở dốc mạnh bằng miệng để tống hết khí cặn ra ngoài.',
        keywords: ['xóc hông', 'đau nhói sườn', 'nhịp thở', 'cơ hoành', 'thở dốc'],
        followUpPrompt: 'Em có muốn biết cách phối hợp nhịp thở 2 bước hít - 2 bước thở để không bị xóc hông nữa không?',
        curriculumContext: 'Sách giáo khoa Giáo dục Thể chất - Hiện tượng sinh lý và xử lý xóc hông khi chạy cự ly trung bình.'
      },
      {
        id: 'seed_2',
        studentQuestion: 'Em có nên dốc toàn bộ sức chạy thật nhanh ngay từ vạch xuất phát để dẫn đầu đoàn chạy không?',
        intentCategory: 'exam_tip',
        intentLabelVi: 'Mẹo thi thực hành',
        shortAnswer: 'Không nên. Bứt tốc quá sớm sẽ khiến cơ bắp tích tụ nhiều axit lactic gây căng cứng cơ và kiệt sức nhanh. Em nên chạy đều với khoảng 75–80% sức ở các vòng giữa và chỉ dồn sức tăng tốc nước rút ở 150m cuối.',
        keywords: ['xuất phát', 'phân phối sức', 'chạy nhanh từ đầu', 'nước rút', 'mệt sớm'],
        followUpPrompt: 'Em thường cảm thấy hụt hơi nhiều nhất ở đoạn nào trong bài kiểm tra chạy bền?',
        curriculumContext: 'Chiến thuật phân phối sức cự ly trung bình (800m - 1500m).'
      },
      {
        id: 'seed_3',
        studentQuestion: 'Vừa chạy qua vạch đích mệt quá, em có thể ngồi bệt hoặc nằm luôn ra sân nghỉ được không thầy/cô?',
        intentCategory: 'symptom_safety',
        intentLabelVi: 'Triệu chứng & An toàn',
        shortAnswer: 'Tuyệt đối không! Khi vừa dừng chạy, máu đang dồn nhiều ở chân; nếu ngồi bệt ngay, máu chưa kịp hồi lưu về tim và não rất dễ gây hoa mắt, tụt huyết áp và ngất xỉu. Em phải đi bộ thả lỏng 3–5 phút và vung tay hít thở sâu.',
        keywords: ['ngồi bệt', 'về đích', 'hoa mắt', 'ngất xỉu', 'hồi tĩnh', 'đi bộ thả lỏng'],
        followUpPrompt: 'Em đã biết 3 động tác thả lỏng cơ bắp chân sau khi chạy chưa?',
        curriculumContext: 'Nguyên tắc an toàn và hồi phục (hồi tĩnh) sau vận động gắng sức.'
      },
      {
        id: 'seed_4',
        studentQuestion: 'Khi chạy bàn chân em nên tiếp đất bằng gót chân hay mũi chân để không bị đau khớp gối?',
        intentCategory: 'technique_error',
        intentLabelVi: 'Lỗi kỹ thuật',
        shortAnswer: 'Em nên tiếp đất bằng nửa trước bàn chân (ức bàn chân) hoặc phần giữa bàn chân rồi miết êm, hơi chùng nhẹ gối để giảm lực dội. Tránh nện thẳng gót chân vì lực va đập sẽ dội thẳng lên khớp gối và cột sống.',
        keywords: ['tiếp đất bàn chân', 'đau khớp gối', 'nện gót chân', 'nửa trước bàn chân'],
        followUpPrompt: 'Em có thấy sau mỗi buổi chạy chân hay bị đau nhức ở cẳng chân phía trước không?',
        curriculumContext: 'Kỹ thuật đặt bàn chân trong chạy cự ly trung bình.'
      },
      {
        id: 'seed_5',
        studentQuestion: 'Trước giờ kiểm tra chạy khoảng 15 phút em thấy khát, em có nên uống một chai nước ngọt có ga không?',
        intentCategory: 'nutrition_habit',
        intentLabelVi: 'Dinh dưỡng & Thể lực',
        shortAnswer: 'Không nên uống nước có ga hay nước quá ngọt sát giờ chạy vì sẽ gây đầy hơi, nặng bụng và co thắt dạ dày khi vận động. Em chỉ nên nhấp 1–2 ngụm nhỏ nước lọc ấm (khoảng 50–100ml) để làm ẩm cổ họng.',
        keywords: ['uống nước trước khi chạy', 'nước có ga', 'nước ngọt', 'đầy bụng', 'khát nước'],
        followUpPrompt: 'Em có muốn biết thời gian ăn nhẹ trước giờ thể dục bao lâu là tốt nhất không?',
        curriculumContext: 'Vệ sinh dinh dưỡng và bù nước an toàn học đường.'
      }
    );
  } else if (lower.includes('xuất phát thấp') || lower.includes('chạy ngắn') || lower.includes('60m') || lower.includes('100m')) {
    seeds.push(
      {
        id: 'seed_1',
        studentQuestion: 'Tại sao khi nghe hiệu lệnh "Sẵn sàng" em hay bị mất thăng bằng và ngã dúi ra trước vạch xuất phát?',
        intentCategory: 'technique_error',
        intentLabelVi: 'Lỗi kỹ thuật',
        shortAnswer: 'Lỗi này do em dồn quá nhiều trọng tâm về hai bàn tay hoặc nâng mông quá cao. Khi "Sẵn sàng", mông chỉ nên cao hơn vai khoảng 10–20cm, mắt nhìn chếch về phía trước vạch khoảng 1–1.5m và giữ hai tay mở rộng bằng vai vững chãi.',
        keywords: ['sẵn sàng', 'mất thăng bằng', 'ngã chúi', 'mông cao hơn vai', 'trọng tâm'],
        followUpPrompt: 'Em đã thử cách chống ngón tay hình vòm cầu sau vạch xuất phát chưa?',
        curriculumContext: 'Kỹ thuật xuất phát thấp - Giai đoạn Sẵn sàng và bố trí bàn đạp.'
      },
      {
        id: 'seed_2',
        studentQuestion: 'Khi có tiếng còi xuất phát, em có nên dựng thẳng đứng người dậy ngay ở bước đầu tiên để nhìn đường không?',
        intentCategory: 'technique_error',
        intentLabelVi: 'Lỗi kỹ thuật',
        shortAnswer: 'Không nên dựng thẳng người ngay! Thân người cần giữ độ nghiêng ngả về phía trước (khoảng 45–50 độ) trong 15–20m đầu để tạo lực lao tối đa, sau đó mới từ từ nâng thẳng thân người khi bước vào chạy giữa quãng.',
        keywords: ['chạy lao', 'dựng đứng người', 'bước chạy đầu', 'độ ngả thân người'],
        followUpPrompt: 'Em có muốn biết cách đánh tay biên độ rộng ở những bước chạy lao đầu tiên không?',
        curriculumContext: 'Kỹ thuật chạy lao sau xuất phát.'
      },
      {
        id: 'seed_3',
        studentQuestion: 'Làm sao để chạm vạch đích nhanh hơn khi có bạn chạy song song sát nút với em?',
        intentCategory: 'exam_tip',
        intentLabelVi: 'Mẹo thi thực hành',
        shortAnswer: 'Ở bước cuối cùng sát vạch đích, em hãy chủ động gập thân trên đánh ngực chạm dây đích hoặc xoay nghiêng vai về trước. Tuyệt đối không nhảy lên qua vạch vì nhảy sẽ làm giảm tốc độ tiến tới.',
        keywords: ['đánh đích bằng ngực', 'nghiêng vai', 'về đích', 'không nhảy qua vạch'],
        followUpPrompt: 'Em đã luyện tập động tác đánh ngực về đích lần nào chưa?',
        curriculumContext: 'Kỹ thuật về đích trong chạy cự ly ngắn.'
      },
      {
        id: 'seed_4',
        studentQuestion: 'Nếu em bị giật mình chạy trước khi thầy/cô thổi còi thì có bị phạm quy và loại không?',
        intentCategory: 'rule_concept',
        intentLabelVi: 'Quy tắc & Khái niệm',
        shortAnswer: 'Hành động rời khỏi vị trí trước hiệu lệnh phát lệnh là lỗi "xuất phát phạm quy" (cướp còi). Trong giờ học và kiểm tra, học sinh thường được nhắc nhở và thực hiện lại, nhưng trong thi đấu chính thức lỗi này có thể bị truất quyền thi đấu.',
        keywords: ['xuất phát phạm quy', 'cướp còi', 'phạt lỗi', 'luật điền kinh'],
        followUpPrompt: 'Em có bí quyết nào để tập trung lắng nghe hiệu lệnh còi mà không bị giật mình không?',
        curriculumContext: 'Luật thi đấu điền kinh nội dung chạy cự ly ngắn.'
      }
    );
  } else if (lower.includes('bóng rổ') || lower.includes('ném rổ') || lower.includes('dẫn bóng')) {
    seeds.push(
      {
        id: 'seed_1',
        studentQuestion: 'Làm sao để khi em dẫn bóng chạy mà không bị cúi gằm mặt xuống nhìn bóng?',
        intentCategory: 'technique_error',
        intentLabelVi: 'Lỗi kỹ thuật',
        shortAnswer: 'Em hãy tập cảm giác bóng bằng các đầu ngón tay và phần chai tay chứ không đập bằng lòng bàn tay. Khi dẫn bóng, giữ lưng thẳng, đầu ngẩng nhẹ và tập nhìn về bảng rổ hoặc đồng đội để quen phản xạ không cần nhìn bóng.',
        keywords: ['dẫn bóng', 'cúi nhìn bóng', 'cảm giác bóng', 'đầu ngón tay', 'ngẩng đầu'],
        followUpPrompt: 'Em có muốn biết bài tập bịt mắt dẫn bóng tại chỗ để rèn cảm giác ngón tay không?',
        curriculumContext: 'Kỹ thuật dẫn bóng cơ bản môn Bóng rổ.'
      },
      {
        id: 'seed_2',
        studentQuestion: 'Khi ném rổ một tay trên vai, mắt em nên ngắm vào đâu: vành trước hay vành sau hay tấm bảng kính?',
        intentCategory: 'exam_tip',
        intentLabelVi: 'Mẹo thi thực hành',
        shortAnswer: 'Điểm ngắm chuẩn nhất khi ném trực diện là mép trước hoặc tâm của vành rổ; nếu ném ở góc chéo 45 độ, em nên ngắm vào góc trên bên phải hoặc bên trái của ô chữ nhật nhỏ trên bảng rổ để bóng đập bảng rơi vào rổ.',
        keywords: ['điểm ngắm ném rổ', 'vành rổ', 'đập bảng', 'ô chữ nhật bảng rổ'],
        followUpPrompt: 'Khuỷu tay của em khi chuẩn bị ném đã tạo được góc vuông 90 độ chưa?',
        curriculumContext: 'Kỹ thuật ném rổ một tay trên vai và điểm ngắm chuẩn.'
      },
      {
        id: 'seed_3',
        studentQuestion: 'Tại sao quả bóng của em ném ra cứ hay bay thẳng tuột hoặc đập mạnh vành nảy ra ngoài?',
        intentCategory: 'technique_error',
        intentLabelVi: 'Lỗi kỹ thuật',
        shortAnswer: 'Lỗi thường gặp là em ném đẩy bóng bằng cánh tay mà quên động tác "miết cổ tay và gập các ngón tay" khi bóng rời tay. Miết cổ tay giúp tạo độ xoáy ngược (backspin), làm đường bóng có hình cầu vồng mềm mại và dễ rơi lọt lưới khi chạm vành.',
        keywords: ['miết cổ tay', 'độ xoáy ngược', 'đường bóng cầu vồng', 'bóng nảy mạnh'],
        followUpPrompt: 'Em có muốn thử động tác miết cổ tay theo bóng hình cổ thiên nga không?',
        curriculumContext: 'Động tác theo bóng (Follow-through) và góc phóng ném rổ.'
      }
    );
  } else if (lower.includes('chuột rút') || lower.includes('bong gân') || lower.includes('chấn thương') || lower.includes('sơ cứu')) {
    seeds.push(
      {
        id: 'seed_1',
        studentQuestion: 'Đang tập bỗng nhiên bị chuột rút thắt cứng ở bắp chuối chân thì em phải làm gì ngay lúc đó?',
        intentCategory: 'symptom_safety',
        intentLabelVi: 'Triệu chứng & An toàn',
        shortAnswer: 'Hãy bình tĩnh ngồi xuống, duỗi thẳng chân ra và dùng tay kéo ngược các ngón chân về phía đầu gối để kéo giãn cơ bắp chuối. Tuyệt đối không co gập chân lại. Sau đó xoa bóp nhẹ nhàng từ gót chân lên bắp chuối.',
        keywords: ['chuột rút', 'bắp chuối', 'co thắt cơ', 'kéo ngược ngón chân', 'duỗi thẳng chân'],
        followUpPrompt: 'Em có hay bị chuột rút khi trời lạnh hoặc khi không uống đủ nước không?',
        curriculumContext: 'Kỹ năng sơ cứu và xử lý co cơ (chuột rút) trong thể thao học đường.'
      },
      {
        id: 'seed_2',
        studentQuestion: 'Vừa bị lật sơ mi (bong gân cổ chân), em có nên bôi dầu gió nóng hoặc rượu thuốc xoa bóp cho đỡ đau không?',
        intentCategory: 'symptom_safety',
        intentLabelVi: 'Triệu chứng & An toàn',
        shortAnswer: 'Tuyệt đối KHÔNG bôi dầu nóng hay chườm nóng! Dầu nóng làm các mao mạch máu giãn nở mạnh, khiến cổ chân bị xuất huyết và sưng phù nặng hơn. Em phải chườm lạnh (đá lạnh bọc khăn) ngay trong 48 giờ đầu theo quy tắc R.I.C.E.',
        keywords: ['bong gân', 'lật sơ mi', 'dầu nóng', 'chườm đá lạnh', 'quy tắc RICE'],
        followUpPrompt: 'Em đã nghe qua 4 bước của quy tắc R.I.C.E bao giờ chưa?',
        curriculumContext: 'Xử lý chấn thương phần mềm và chống chỉ định nhiệt nóng ban đầu.'
      }
    );
  } else {
    // General student-centered seed questions for any topic
    seeds.push(
      {
        id: 'seed_1',
        studentQuestion: `Trước khi bước vào bài học "${cleanTopic}", nếu em lười không khởi động thì có bị làm sao không?`,
        intentCategory: 'symptom_safety',
        intentLabelVi: 'Triệu chứng & An toàn',
        shortAnswer: 'Khởi động giúp khớp tiết chất nhờn và làm ấm cơ bắp. Nếu không khởi động, cơ bắp đang nguội gặp vận động đột ngột rất dễ bị rách cơ, trật khớp hoặc bong gân, đồng thời tim không kịp thích ứng dễ gây khó thở chóng mặt.',
        keywords: ['khởi động', 'chấn thương', 'chất nhờn khớp', 'làm ấm cơ', 'chuột rút'],
        followUpPrompt: 'Em thường dành bao nhiêu phút để xoay các khớp trước giờ tập?',
        curriculumContext: `Nguyên tắc an toàn bài tập ${cleanTopic} - SGK Giáo dục Thể chất ${grade}.`
      },
      {
        id: 'seed_2',
        studentQuestion: `Làm thế nào để em biết mình đã thực hiện đúng kỹ thuật động tác "${cleanTopic}" mà không bị sai tư thế?`,
        intentCategory: 'technique_error',
        intentLabelVi: 'Lỗi kỹ thuật',
        shortAnswer: 'Hãy quan sát biên độ chuyển động của tay chân và giữ thăng bằng thân người ổn định. Động tác đúng kỹ thuật sẽ mang lại cảm giác thoải mái, không bị gồng cứng hay đau nhói bất thường ở các khớp xương.',
        keywords: ['đúng kỹ thuật', 'sai tư thế', 'biên độ', 'thăng bằng', 'gồng cơ'],
        followUpPrompt: 'Khi tập động tác này, em cảm thấy bộ phận cơ bắp nào đang hoạt động nhiều nhất?',
        curriculumContext: `Kỹ thuật chuẩn và lỗi sai thường gặp - ${cleanTopic}.`
      },
      {
        id: 'seed_3',
        studentQuestion: `Để đạt điểm 9 hoặc điểm 10 trong bài kiểm tra thực hành "${cleanTopic}", thầy/cô thường chấm kỹ những tiêu chí nào nhất?`,
        intentCategory: 'exam_tip',
        intentLabelVi: 'Mẹo thi thực hành',
        shortAnswer: 'Thầy cô sẽ ưu tiên chấm: 1) Biên độ và sự chuẩn xác của kỹ thuật động tác; 2) Nhịp điệu và khả năng phối hợp nhịp nhàng; 3) Ý thức nghiêm túc và tinh thần tự tin khi thực hiện bài kiểm tra.',
        keywords: ['tiêu chí chấm điểm', 'điểm cao', 'bài kiểm tra thực hành', 'kỹ thuật chuẩn'],
        followUpPrompt: 'Em cảm thấy tự tin nhất ở phần nào của bài kiểm tra này?',
        curriculumContext: `Tiêu chí đánh giá xếp loại học sinh theo Thông tư môn GDTC.`
      }
    );
  }

  return {
    id: `seed_dataset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    topic: cleanTopic,
    grade: grade || 'Lớp 8',
    subject,
    purpose: 'Tập dữ liệu Q&A seed khởi tạo chuẩn bị cho chatbot hỗ trợ ôn bài ở buổi sau',
    createdAt: new Date().toISOString(),
    seeds,
    totalSeeds: seeds.length,
  };
}

export async function generateQaSeedsWithGemini(
  ai: GoogleGenAI | null,
  request: QaSeedRequest
): Promise<QaSeedDataset> {
  const { topic, grade, subject = 'Giáo dục Thể chất', seedCount = 5 } = request;

  if (!ai) {
    return generateOfflineQaSeeds(request);
  }

  try {
    const prompt = `Bạn là Cố vấn Sư phạm Thể chất & Khoa học Thể thao Học đường tại Việt Nam.
Nhiệm vụ: Tạo tập dữ liệu "Q&A SEED" cho chủ đề học tập hiện tại để chuẩn bị dữ liệu khởi tạo cho chatbot hỗ trợ ôn bài ở buổi sau.

Thông tin chủ đề:
- Chủ đề bài học: "${topic}"
- Khối lớp: "${grade || 'Lớp 8'}" (Phù hợp ngôn ngữ và tâm lý lứa tuổi học sinh khối này)
- Môn học: "${subject}"
- Số lượng cặp Q&A seed: ${seedCount} cặp

LƯU Ý CỐT LÕI (BẮT BUỘC TUÂN THỦ 100%):
1. CHỈ Ở MỨC KHỞI TẠO (starter seeds):
   - Danh sách các câu hỏi gợi mở và câu trả lời ngắn ban đầu.
   - CHƯA CẦN chatbot hoàn chỉnh hay hội thoại nhiều lượt.
2. KHÔNG ĐI SANG BUỔI 5:
   - Tập trung thuần túy vào việc tạo, chuẩn hóa và lưu trữ bộ seed dữ liệu chuẩn bị cho chatbot.
3. ƯU TIÊN CÁC CÂU HỎI MÀ HỌC SINH THẬT SỰ CÓ THỂ HỎI VỀ CHỦ ĐỀ:
   - Câu hỏi phải mang giọng điệu tự nhiên, gần gũi, chân thực của học sinh (Ví dụ: "Tại sao khi chạy em hay bị...", "Làm sao để...", "Em mắc lỗi... thì sửa thế nào?", "Trước giờ kiểm tra có nên...").
   - Tránh câu hỏi hàn lâm sáo rỗng hoặc câu hỏi triết lý xa vời.
   - Tập trung vào: lỗi kỹ thuật hay mắc, triệu chứng cơ thể (xóc hông, chuột rút, hụt hơi, đau khớp), mẹo kiểm tra thực hành đạt điểm cao, an toàn và thói quen ăn uống/uống nước.
4. CÂU TRẢ LỜI NGẮN (shortAnswer):
   - Ngắn gọn (1 đến 3 câu), súc tích, đi thẳng vào nguyên nhân và giải pháp thực tế, dễ nhớ.
5. TỪ KHÓA (keywords):
   - 3 đến 5 từ khóa cốt lõi giúp chatbot sau này nhận diện ý định của học sinh.
6. CÂU HỎI GỢI MỞ TIẾP (followUpPrompt):
   - 1 câu hỏi gợi mở để chatbot tương tác tiếp ở buổi sau.

HÃY TRẢ VỀ DUY NHẤT MỘT CHUỖI JSON HỢP LỆ (KHÔNG DÙNG BACKTICKS \`\`\`json HOẶC BẤT KỲ VĂN BẢN NGOÀI NÀO):
{
  "topic": "${topic}",
  "grade": "${grade || 'Lớp 8'}",
  "subject": "${subject}",
  "purpose": "Tập dữ liệu Q&A seed khởi tạo chuẩn bị cho chatbot hỗ trợ ôn bài ở buổi sau",
  "seeds": [
    {
      "id": "seed_1",
      "studentQuestion": "<Câu hỏi tự nhiên học sinh thật sự hay hỏi>",
      "intentCategory": "<technique_error | symptom_safety | exam_tip | rule_concept | nutrition_habit>",
      "intentLabelVi": "<Lỗi kỹ thuật | Triệu chứng & An toàn | Mẹo thi thực hành | Quy tắc & Khái niệm | Dinh dưỡng & Thể lực>",
      "shortAnswer": "<Câu trả lời ngắn 1-3 câu chuẩn xác, dễ hiểu>",
      "keywords": ["<từ khóa 1>", "<từ khóa 2>", "<từ khóa 3>"],
      "followUpPrompt": "<Câu hỏi gợi mở tiếp theo>",
      "curriculumContext": "<Căn cứ bài học SGK>"
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
        setTimeout(() => reject(new Error('Gemini API timeout for QA seed - using offline seeds')), 4500)
      )
    ]);

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed.seeds) && parsed.seeds.length >= 2) {
      return {
        id: `seed_dataset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        topic: parsed.topic || topic,
        grade: parsed.grade || grade,
        subject: parsed.subject || subject,
        purpose: parsed.purpose || 'Tập dữ liệu Q&A seed khởi tạo chuẩn bị cho chatbot hỗ trợ ôn bài ở buổi sau',
        createdAt: new Date().toISOString(),
        seeds: parsed.seeds.map((s: any, idx: number) => ({
          ...s,
          id: s.id || `seed_${idx + 1}`,
          intentLabelVi:
            s.intentLabelVi ||
            (s.intentCategory === 'technique_error'
              ? 'Lỗi kỹ thuật'
              : s.intentCategory === 'symptom_safety'
              ? 'Triệu chứng & An toàn'
              : s.intentCategory === 'exam_tip'
              ? 'Mẹo thi thực hành'
              : s.intentCategory === 'nutrition_habit'
              ? 'Dinh dưỡng & Thể lực'
              : 'Quy tắc & Khái niệm')
        })),
        totalSeeds: parsed.seeds.length,
      };
    }

    return generateOfflineQaSeeds(request);
  } catch (error) {
    console.error('Error generating QA seeds with Gemini, falling back to offline seeds:', error);
    return generateOfflineQaSeeds(request);
  }
}
