import { GoogleGenAI } from '@google/genai';
import { GroundedContextPackage, GroundedChatMessage } from '../src/types';

export interface GroundedChatRequest {
  topic: string;
  grade: string;
  question: string;
  context: GroundedContextPackage;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface GroundedChatResponse {
  reply: string;
  isOutOfScope: boolean;
  groundedSource: 'sources' | 'analysisPreview' | 'studyPack' | 'out_of_scope';
  sourceCitation?: string;
  suggestedFollowUps: string[];
}

const OUT_OF_SCOPE_PHRASE = 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.';

// Offline fallback matcher if Gemini is unavailable
export function resolveOfflineGroundedChat(request: GroundedChatRequest): GroundedChatResponse {
  const { question, context } = request;
  const qClean = question.trim().toLowerCase();

  // 1. Check in studyPack Q&A seeds
  if (context.studyPack?.qaSeeds && context.studyPack.qaSeeds.length > 0) {
    for (const seed of context.studyPack.qaSeeds) {
      const seedQuestion = seed.question.toLowerCase();
      // Simple similarity check
      if (
        qClean.includes('xóc hông') && seedQuestion.includes('xóc hông') ||
        qClean.includes('nhịp thở') && seedQuestion.includes('nhịp thở') ||
        qClean.includes('ngồi bệt') && seedQuestion.includes('ngồi bệt') ||
        qClean.includes('tiếp đất') && seedQuestion.includes('tiếp đất') ||
        qClean.includes('uống nước') && seedQuestion.includes('uống nước') ||
        qClean.includes('chuột rút') && seedQuestion.includes('chuột rút') ||
        qClean.includes('bong gân') && seedQuestion.includes('bong gân') ||
        qClean.includes('ném rổ') && seedQuestion.includes('ném rổ') ||
        qClean.includes('dẫn bóng') && seedQuestion.includes('dẫn bóng') ||
        qClean.includes('sẵn sàng') && seedQuestion.includes('sẵn sàng') ||
        qClean.includes('xuất phát') && seedQuestion.includes('xuất phát')
      ) {
        return {
          reply: `${seed.answer}`,
          isOutOfScope: false,
          groundedSource: 'studyPack',
          sourceCitation: `Tài liệu ôn bài: Gói Q&A Seed (${seed.intent || 'Kiến thức cốt lõi'})`,
          suggestedFollowUps: [
            'Lỗi sai nào học sinh hay mắc phải nhất ở phần này?',
            'Có mẹo nào giúp nhớ nhanh động tác này trước khi thi không?'
          ]
        };
      }
    }
  }

  // 2. Check in analysisPreview (Common errors, key terms, summary points)
  if (context.analysisPreview) {
    const { commonErrors, keyTerms, summaryPoints, actionableTips } = context.analysisPreview;

    if (qClean.includes('lỗi sai') || qClean.includes('sai lầm') || qClean.includes('khắc phục') || qClean.includes('chú ý')) {
      if (commonErrors && commonErrors.length > 0) {
        return {
          reply: `Dưới đây là các lỗi sai thường gặp đã được tổng hợp trong tài liệu phân tích:\n${commonErrors.map((err, i) => `${i + 1}. ${err}`).join('\n')}`,
          isOutOfScope: false,
          groundedSource: 'analysisPreview',
          sourceCitation: 'Mục Lỗi Sai Thường Gặp (analysisPreview)',
          suggestedFollowUps: [
            'Làm thế nào để phân phối sức chạy đều các vòng?',
            'Cách thở đúng nhịp 2-2 khi chạy 1500m là gì?'
          ]
        };
      }
    }

    if (qClean.includes('thuật ngữ') || qClean.includes('khái niệm') || qClean.includes('định nghĩa')) {
      if (keyTerms && keyTerms.length > 0) {
        return {
          reply: `Các thuật ngữ trọng tâm trong bài học gồm:\n${keyTerms.map(k => `• **${k.term}**: ${k.definition}`).join('\n')}`,
          isOutOfScope: false,
          groundedSource: 'analysisPreview',
          sourceCitation: 'Bảng Thuật Ngữ Cốt Lõi (analysisPreview)',
          suggestedFollowUps: [
            'Các ý chính cần ghi nhớ trong bài học này là gì?',
            'Cho em lời khuyên thực hành an toàn nhất.'
          ]
        };
      }
    }

    if (qClean.includes('tóm tắt') || qClean.includes('ý chính') || qClean.includes('trọng tâm') || qClean.includes('nội dung chính')) {
      if (summaryPoints && summaryPoints.length > 0) {
        return {
          reply: `Ý chính ôn bài được trích xuất từ tài liệu bài học:\n${summaryPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
          isOutOfScope: false,
          groundedSource: 'analysisPreview',
          sourceCitation: 'Ý Chính Trọng Tâm (analysisPreview)',
          suggestedFollowUps: [
            'Hiện tượng xóc hông là gì và cách phòng tránh?',
            'Tại sao không được ngồi nghỉ ngay sau khi về đích?'
          ]
        };
      }
    }
  }

  // 3. Check in sources
  if (context.sources && context.sources.length > 0) {
    for (const src of context.sources) {
      const srcText = (src.title + ' ' + src.content).toLowerCase();
      // Check keywords
      const topicKeywords = context.topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const matchCount = topicKeywords.filter(k => qClean.includes(k)).length;
      if (matchCount >= 1 && src.content.length > 20) {
        return {
          reply: `Dựa vào tài liệu bài học "${src.title}": ${src.content.slice(0, 300)}...`,
          isOutOfScope: false,
          groundedSource: 'sources',
          sourceCitation: src.referenceTag || src.title,
          suggestedFollowUps: [
            'Em có thể hỏi thêm về các lưu ý an toàn không?',
            'Nêu cách rèn luyện kỹ thuật này tại nhà.'
          ]
        };
      }
    }
  }

  // 4. If completely unrelated to the topic and materials -> STRICT REFUSAL
  return {
    reply: `${OUT_OF_SCOPE_PHRASE} Thầy/cô chỉ hỗ trợ giải đáp các thắc mắc bám sát nội dung bài học "${context.topic}" (${context.grade}) đã được cung cấp trong sources, analysisPreview và studyPack. Em vui lòng đặt câu hỏi liên quan đến bài học để cùng ôn tập nhé!`,
    isOutOfScope: true,
    groundedSource: 'out_of_scope',
    sourceCitation: 'Ngoài phạm vi tài liệu',
    suggestedFollowUps: [
      `Ý chính bài học "${context.topic}" gồm những gì?`,
      'Những lỗi sai học sinh hay mắc phải là gì?',
      'Quy tắc an toàn và hồi phục sau vận động?'
    ]
  };
}

export async function askGroundedChatbot(
  ai: GoogleGenAI | null,
  request: GroundedChatRequest
): Promise<GroundedChatResponse> {
  const { question, context, history = [] } = request;

  if (!ai) {
    return resolveOfflineGroundedChat(request);
  }

  try {
    // Format the 3 distinct grounding pillars clearly for Gemini
    const sourcesText = context.sources && context.sources.length > 0
      ? context.sources.map((s, i) => `[SOURCE #${i + 1}: ${s.title} (Tham chiếu: ${s.referenceTag})]\n${s.content}`).join('\n\n')
      : 'Không có tài liệu sources bổ sung.';

    const analysisPreviewText = context.analysisPreview
      ? `[Ý CHÍNH TỔNG QUAN]\n${(context.analysisPreview.summaryPoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}
\n[THUẬT NGỮ CỐT LÕI]\n${(context.analysisPreview.keyTerms || []).map(k => `• ${k.term}: ${k.definition}`).join('\n')}
\n[LỖI SAI THƯỜNG GẶP]\n${(context.analysisPreview.commonErrors || []).map((e, i) => `${i + 1}. ${e}`).join('\n')}
\n[MẸO THỰC HÀNH AN TOÀN]\n${(context.analysisPreview.actionableTips || []).map((t, i) => `• ${t}`).join('\n')}`
      : 'Không có dữ liệu analysisPreview.';

    const studyPackText = context.studyPack
      ? `[CÂU HỎI Q&A SEEDS ÔN BÀI]\n${(context.studyPack.qaSeeds || []).map((s, i) => `Q${i + 1}: ${s.question}\nA${i + 1}: ${s.answer} (Ý định: ${s.intent || 'Cốt lõi'})`).join('\n\n')}
\n[CÂU HỎI TRẮC NGHIỆM/LUYỆN TẬP]\n${(context.studyPack.quizQuestions || []).map((q, i) => `Quiz #${i + 1}: ${q.question} => Đáp án: ${q.answer}. Giải thích: ${q.explanation || ''}`).join('\n\n')}`
      : 'Không có dữ liệu studyPack.';

    const recentHistoryText = history.slice(-4).map(h => `${h.role === 'user' ? 'Học sinh' : 'Trợ lý ôn bài'}: ${h.content}`).join('\n');

    const systemPrompt = `Bạn là Trợ Lý Sư Phạm Grounded hỗ trợ học sinh ôn tập môn Giáo dục Thể chất & Khoa học Thể thao Học đường cho chủ đề "${context.topic}" (${context.grade}).

PHẠM VI TRẢ LỜI CỐT LÕI (BẮT BUỘC TUÂN THỦ TUYỆT ĐỐI):
Bạn CHỈ ĐƯỢC PHÉP trả lời trong phạm vi 3 phần tài liệu đã cung cấp dưới đây:
1. "sources":
${sourcesText}

2. "analysisPreview":
${analysisPreviewText}

3. "studyPack":
${studyPackText}

QUY TẮC BẮT BUỘC VỀ PHẠM VI NGOÀI TÀI LIỆU (CỰC KỲ QUAN TRỌNG):
Nếu câu hỏi của học sinh:
- KHÔNG CÓ trong tài liệu
- HOẶC KHÔNG THỂ suy luận logic trực tiếp từ 3 phần tài liệu trên (ví dụ hỏi về chuyện phiếm đời tư, lịch sử thế giới, game, ca sĩ, toán học ngoài lề, hoặc các kỹ thuật thể thao hoàn toàn không xuất hiện trong tài liệu đã cấp):
BẠN PHẢI BẮT ĐẦU CÂU TRẢ LỜI BẰNG CHÍNH XÁC CỤM TỪ SAU ĐÂY:
"Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp."
Sau cụm từ trên, bạn có thể giải thích ngắn 1 câu thân thiện và mời học sinh hỏi các nội dung trong bài học "${context.topic}".
Khi đó, trường "isOutOfScope" trong JSON phải là true, và "groundedSource" là "out_of_scope".

QUY TẮC KHI CÂU HỎI NẰM TRONG PHẠM VI:
- Phù hợp cho việc ôn bài: giải thích ngắn gọn (2-4 câu), súc tích, dễ nhớ, nhấn mạnh lỗi sai và mẹo làm bài.
- Ngôn ngữ thân thiện, chuẩn mực sư phạm, xưng hô gần gũi ("thầy/cô" hoặc người bạn ôn bài).
- Xác định rõ câu trả lời được lấy từ nguồn nào: "sources" | "analysisPreview" | "studyPack"
- Trích dẫn ngắn gọn vị trí thông tin trong tài liệu.
- Đưa ra 2-3 gợi ý câu hỏi tiếp theo bám sát bài học để học sinh tiếp tục ôn.

Lịch sử trò chuyện gần nhất:
${recentHistoryText || 'Chưa có lịch sử trước đó.'}

Câu hỏi hiện tại của học sinh:
"${question}"

HÃY TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON HỢP LỆ (KHÔNG DÙNG BACKTICKS \`\`\`json):
{
  "reply": "<Nội dung câu trả lời. Nếu ngoài phạm vi, PHẢI bắt đầu bằng: 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.'>",
  "isOutOfScope": <true nếu câu hỏi ngoài tài liệu, false nếu trong tài liệu>,
  "groundedSource": "<'sources' | 'analysisPreview' | 'studyPack' | 'out_of_scope'>",
  "sourceCitation": "<Tên phần tài liệu hoặc mục đã dùng để trả lời>",
  "suggestedFollowUps": ["<Gợi ý câu hỏi ôn bài 1>", "<Gợi ý câu hỏi ôn bài 2>"]
}`;

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
        }
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout - using offline grounded resolver')), 5000)
      )
    ]);

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    if (parsed.reply && typeof parsed.reply === 'string') {
      let finalReply = parsed.reply;
      const isOutOfScope = Boolean(parsed.isOutOfScope);

      // Enforce the exact phrase if model determined it is out of scope
      if (isOutOfScope && !finalReply.includes(OUT_OF_SCOPE_PHRASE)) {
        finalReply = `${OUT_OF_SCOPE_PHRASE} ${finalReply}`;
      }

      return {
        reply: finalReply,
        isOutOfScope,
        groundedSource: parsed.groundedSource || (isOutOfScope ? 'out_of_scope' : 'sources'),
        sourceCitation: parsed.sourceCitation || (isOutOfScope ? 'Ngoài phạm vi tài liệu' : 'Tài liệu bài học'),
        suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) && parsed.suggestedFollowUps.length > 0
          ? parsed.suggestedFollowUps
          : [
              `Ý chính cần nhớ của "${context.topic}" là gì?`,
              'Những lỗi sai kỹ thuật thường gặp nhất?'
            ]
      };
    }

    return resolveOfflineGroundedChat(request);
  } catch (error) {
    console.error('Error in askGroundedChatbot, using offline fallback:', error);
    return resolveOfflineGroundedChat(request);
  }
}
