import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  BookOpen,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Layers,
  FileText,
  HelpCircle,
  RotateCcw,
  Tag,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import {
  GroundedContextPackage,
  GroundedChatMessage,
  GroundedSourceItem,
  GroundedAnalysisPreview,
  GroundedStudyPack
} from '../types';

const OUT_OF_SCOPE_PHRASE = 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.';

// Pre-configured curriculum groundings for top school PE topics
const PRESET_GROUNDED_PACKAGES: Record<string, GroundedContextPackage> = {
  '1500m': {
    topic: 'Kỹ thuật Chạy cự ly trung bình (1500m / 800m) & Nhịp thở',
    grade: 'Lớp 8',
    subject: 'Giáo dục Thể chất',
    sources: [
      {
        id: 'src_1',
        title: 'SGK GDTC Lớp 8 - Bài 3: Kỹ thuật Chạy cự ly trung bình',
        content: `Chạy cự ly trung bình (800m - 1500m) đòi hỏi sự phối hợp chặt chẽ giữa sức bền chung và nhịp thở. 
1. Kỹ thuật xuất phát: Sử dụng xuất phát cao với 2 khẩu lệnh "Vào chỗ" và "Chạy". Sau lệnh chạy, nhanh chóng tăng tốc chiếm vị trí thuận lợi ở đường chạy số 1.
2. Chạy giữa quãng: Duy trì tần số bước và độ dài bước hợp lý, thân người hơi ngả về trước khoảng 4-5 độ. Hai tay gập ở khớp khuỷu khoảng 90 độ, đánh nhịp nhàng so le với bước chạy.
3. Kỹ thuật đặt bàn chân: Tiếp đất bằng nửa trước bàn chân hoặc phần giữa bàn chân rồi miết êm, hơi chùng nhẹ khớp gối để giảm chấn động dội lên cột sống.
4. Hiện tượng cực điểm và hồi tĩnh: Khi cơ thể có cảm giác tức ngực khó thở (cực điểm), cần chủ động giảm nhẹ tốc độ và thở sâu. Về đích tuyệt đối không được ngồi bệt ngay, phải đi bộ thả lỏng 3-5 phút.`,
        referenceTag: 'SGK Giáo dục Thể chất 8 - Cánh Diều & Kết Nối Tri Thức'
      },
      {
        id: 'src_2',
        title: 'Tài liệu hướng dẫn an toàn & Nhịp thở học đường',
        content: `Nhịp thở chuẩn: 2 bước hít vào sâu bằng mũi - 2 bước thở mạnh ra bằng miệng (nhịp 2-2). Thở sâu bằng cơ hoành giúp tống khí cặn CO2.
Phòng chống xóc hông: Xóc hông xảy ra do co thắt cơ hoành khi ăn quá no trước giờ chạy hoặc thở nông. Cách xử lý: giảm tốc độ, hít sâu bằng mũi, thở mạnh bằng miệng, ấn nhẹ tay vào vùng sườn đau kết hợp cúi nhẹ thân người khi thở ra.
Quy định uống nước: Không uống nước ngọt có ga trước khi chạy. Chỉ nhấp từng ngụm nhỏ 50-100ml nước lọc ấm trước giờ kiểm tra 15 phút.`,
        referenceTag: 'Hướng dẫn Y tế & Thể thao Học đường 2026'
      }
    ],
    analysisPreview: {
      summaryPoints: [
        'Kỹ thuật chạy 1500m yêu cầu phân phối sức đều ở 75-80% khả năng và bứt tốc ở 150m cuối.',
        'Nhịp thở tối ưu là 2 bước hít bằng mũi - 2 bước thở mạnh bằng miệng (nhịp 2-2).',
        'Tiếp đất bằng nửa trước bàn chân hoặc giữa bàn chân để tránh chấn thương khớp gối.',
        'Xóc hông là hiện tượng co thắt cơ hoành do thở nông hoặc ăn no trước giờ tập.',
        'Sau khi về đích phải hồi tĩnh bằng đi bộ thả lỏng 3-5 phút, cấm ngồi bệt ngay vì dễ tụt huyết áp gây ngất xỉu.'
      ],
      keyTerms: [
        { term: 'Nhịp thở 2-2', definition: '2 bước chân hít sâu bằng mũi, 2 bước chân thở mạnh qua miệng.' },
        { term: 'Xóc hông', definition: 'Cơn đau nhói ở vùng sườn do cơ hoành bị co thắt cục bộ vì thiếu oxy hoặc dạ dày co bóp.' },
        { term: 'Cực điểm', definition: 'Trạng thái mệt mỏi, khó thở tạm thời khi cơ thể chuyển dịch từ hô hấp kỵ khí sang hiếu khí.' },
        { term: 'Hồi tĩnh', definition: 'Quá trình đi bộ thả lỏng, hít thở sâu để đưa nhịp tim và tuần hoàn máu về trạng thái bình thường.' }
      ],
      commonErrors: [
        'Dốc toàn bộ sức chạy quá nhanh ngay từ vòng 1 dẫn đến kiệt sức sớm do tích tụ acid lactic.',
        'Nện mạnh gót chân xuống mặt đường gây đau nhức cẳng chân và khớp gối.',
        'Ngồi bệt hoặc nằm ngay xuống đất sau khi vừa chạm vạch đích.',
        'Uống nước ngọt có ga hoặc ăn no sát giờ kiểm tra chạy bền.'
      ],
      actionableTips: [
        'Giữ nhịp thở đều đặn ngay từ những mét đầu tiên, không đợi mệt mới thở dốc.',
        'Thả lỏng hai vai và khớp hàm khi chạy để tiết kiệm năng lượng tiêu hao.',
        'Khi bị xóc hông: giảm tốc độ, hít sâu bằng mũi rồi thở dốc mạnh bằng miệng.'
      ]
    },
    studyPack: {
      qaSeeds: [
        {
          question: 'Tại sao khi chạy được 1-2 vòng sân em hay bị đau nhói buốt ở một bên sườn phải?',
          answer: 'Đây là hiện tượng xóc hông do cơ hoành bị co thắt vì hít thở nông hoặc ăn uống quá no trước giờ chạy. Em hãy giảm tốc độ, hít sâu bằng mũi rồi thở dốc mạnh bằng miệng để tống khí cặn ra ngoài.',
          intent: 'Triệu chứng & An toàn'
        },
        {
          question: 'Em có nên dốc toàn bộ sức chạy thật nhanh ngay từ vạch xuất phát để dẫn đầu đoàn chạy không?',
          answer: 'Không nên. Bứt tốc quá sớm sẽ khiến cơ bắp tích tụ nhiều acid lactic gây mỏi cơ và kiệt sức nhanh. Em nên duy trì tốc độ đều ở 75-80% sức và chỉ dồn sức nước rút ở 150m cuối.',
          intent: 'Mẹo thi thực hành'
        },
        {
          question: 'Vừa chạy qua vạch đích mệt quá, em có thể ngồi bệt hoặc nằm luôn ra sân nghỉ được không?',
          answer: 'Tuyệt đối không! Khi vừa dừng chạy, máu đang dồn nhiều ở chân; nếu ngồi bệt ngay, máu chưa kịp hồi lưu về não dễ gây tụt huyết áp và ngất xỉu. Em phải đi bộ thả lỏng 3-5 phút.',
          intent: 'An toàn & Hồi tĩnh'
        },
        {
          question: 'Trước giờ kiểm tra chạy khoảng 15 phút em thấy khát, em có nên uống một chai nước ngọt có ga không?',
          answer: 'Không nên uống nước ngọt có ga vì dễ gây đầy hơi và tức bụng khi chạy. Em chỉ nên nhấp từng ngụm nhỏ 50-100ml nước lọc ấm.',
          intent: 'Dinh dưỡng & Bù nước'
        }
      ],
      quizQuestions: [
        {
          question: 'Nhịp thở chuẩn trong chạy 1500m là gì?',
          answer: 'Nhịp 2-2: 2 bước hít vào bằng mũi - 2 bước thở ra bằng miệng.',
          explanation: 'Giúp thông khí phế nang tối đa và chống co thắt cơ hoành.'
        },
        {
          question: 'Kỹ thuật tiếp đất bàn chân đúng nhất trong chạy cự ly trung bình là gì?',
          answer: 'Tiếp đất bằng nửa trước bàn chân hoặc giữa bàn chân rồi miết êm.',
          explanation: 'Giúp cơ bắp chân giảm xóc và bảo vệ khớp gối.'
        }
      ]
    }
  },
  'sprint': {
    topic: 'Kỹ thuật Xuất phát thấp & Chạy cự ly ngắn (60m / 100m)',
    grade: 'Lớp 7',
    subject: 'Giáo dục Thể chất',
    sources: [
      {
        id: 'src_sprint_1',
        title: 'SGK GDTC Lớp 7 - Bài 2: Chạy cự ly ngắn (60m - 100m)',
        content: `Chạy cự ly ngắn gồm 4 giai đoạn kỹ thuật: Xuất phát, Chạy lao sau xuất phát, Chạy giữa quãng và Về đích.
1. Xuất phát thấp: Sử dụng bàn đạp với 3 khẩu lệnh: "Vào chỗ", "Sẵn sàng" và "Chạy" (hoặc tiếng súng/còi). Ở lệnh "Sẵn sàng", từ từ nâng mông cao hơn vai khoảng 10-20cm, mắt nhìn chếch về phía trước vạch xuất phát 1-1.5m.
2. Chạy lao sau xuất phát: Duy trì độ ngả thân người về phía trước khoảng 45-50 độ trong 15-20m đầu, tăng dần độ dài bước chạy.
3. Chạy giữa quãng: Thân người thẳng tự nhiên, đánh tay biên độ rộng, đạp sau mạnh mẽ và nâng cao đùi.
4. Về đích: Chủ động gập thân trên đánh ngực hoặc xoay vai chạm dây đích. Tuyệt đối không nhảy qua vạch đích.`,
        referenceTag: 'SGK Giáo dục Thể chất 7'
      }
    ],
    analysisPreview: {
      summaryPoints: [
        'Xuất phát thấp thực hiện theo 3 khẩu lệnh nghiêm ngặt: Vào chỗ - Sẵn sàng - Chạy.',
        'Ở lệnh "Sẵn sàng", mông cao hơn vai 10-20cm, dồn trọng tâm đều vào 2 tay và chân trước.',
        'Giai đoạn chạy lao giữ thân người nghiêng ngả về trước để tạo gia tốc tiến tới tối đa.',
        'Khi về đích phải đánh ngực hoặc nghiêng vai, không được nhảy lên qua vạch vì làm giảm tốc độ.'
      ],
      keyTerms: [
        { term: 'Xuất phát thấp', definition: 'Kỹ thuật xuất phát có sử dụng bàn đạp giúp tận dụng lực đạp sau mạnh nhất trong chạy cự ly ngắn.' },
        { term: 'Chạy lao', definition: 'Đoạn đường từ 15-20m đầu sau xuất phát để đạt tốc độ tối đa.' },
        { term: 'Đánh ngực về đích', definition: 'Động tác gập thân trên chạm dây đích ở bước chạy cuối cùng.' }
      ],
      commonErrors: [
        'Nghe lệnh "Sẵn sàng" nâng mông quá cao làm chúi đầu ngã ra trước vạch.',
        'Dựng thẳng đứng người dậy ngay ở bước chạy đầu tiên sau xuất phát.',
        'Cướp còi (xuất phát trước hiệu lệnh) dẫn đến phạm quy.',
        'Nhảy bật lên khi qua vạch đích.'
      ],
      actionableTips: [
        'Tập trung lắng nghe tiếng còi, không nhìn ngó xung quanh.',
        'Đạp mạnh cả 2 chân vào bàn đạp khi phát lệnh.'
      ]
    },
    studyPack: {
      qaSeeds: [
        {
          question: 'Tại sao khi nghe hiệu lệnh "Sẵn sàng" em hay bị mất thăng bằng và ngã chúi ra trước vạch?',
          answer: 'Do em nâng mông quá cao hoặc dồn toàn bộ trọng lượng lên các ngón tay. Hãy giữ mông cao hơn vai chỉ khoảng 10-20cm và chống ngón tay hình vòm cầu vững chắc.',
          intent: 'Lỗi kỹ thuật'
        },
        {
          question: 'Khi có tiếng còi xuất phát, em có nên dựng thẳng đứng người dậy ngay ở bước đầu tiên không?',
          answer: 'Không nên. Cần giữ thân người ngả về trước trong 15-20m đầu để tạo lực lao tối đa, sau đó mới từ từ nâng thẳng thân người khi chạy giữa quãng.',
          intent: 'Lỗi kỹ thuật'
        }
      ]
    }
  },
  'rice': {
    topic: 'Sơ cứu chấn thương thể thao (Bong gân cổ chân & Chuột rút)',
    grade: 'Lớp 8',
    subject: 'Y tế & An toàn Thể chất',
    sources: [
      {
        id: 'src_rice_1',
        title: 'Cẩm nang Sơ cứu chấn thương thể thao học đường',
        content: `1. Bong gân (lật sơ mi cổ chân): Tổn thương dây chằng do trẹo khớp.
Áp dụng ngay quy tắc R.I.C.E trong 48 giờ đầu:
- R (Rest): Dừng vận động ngay, cố định khớp tổn thương.
- I (Ice): Chườm lạnh bằng túi đá bọc khăn trong 15-20 phút, không chườm đá trực tiếp lên da trần.
- C (Compression): Băng ép nhẹ nhàng bằng băng thun để giảm sưng phù.
- E (Elevation): Kê cao chân bị thương cao hơn mức tim khi nằm nghỉ.
CHỐNG CHỈ ĐỊNH: Tuyệt đối KHÔNG bôi dầu nóng, cồn xoa bóp hoặc chườm nóng vì gây giãn mạch và chảy máu trong nặng hơn.

2. Chuột rút (co thắt cơ đột ngột): Thường gặp ở bắp chuối chân.
Cách xử lý: Bình tĩnh ngồi duỗi thẳng chân, kéo ngược các ngón chân về phía đầu gối để kéo giãn cơ bắp chuối, xoa bóp nhẹ nhàng và bù nước có chứa điện giải.`,
        referenceTag: 'Y tế học đường & Sơ cứu ban đầu'
      }
    ],
    analysisPreview: {
      summaryPoints: [
        'Quy tắc R.I.C.E là chuẩn vàng sơ cứu bong gân: Nghỉ ngơi - Chườm đá - Băng ép - Kê cao chi.',
        'Tuyệt đối không dùng dầu nóng hay cao xoa bóp trong 48 giờ đầu sau chấn thương phần mềm.',
        'Xử lý chuột rút bằng cách kéo giãn cơ ngược chiều (kéo ngược ngón chân về phía đầu gối).'
      ],
      keyTerms: [
        { term: 'R.I.C.E', definition: 'Quy tắc 4 bước sơ cứu chấn thương: Rest (Nghỉ), Ice (Chườm lạnh), Compression (Băng ép), Elevation (Kê cao).' },
        { term: 'Bong gân', definition: 'Tình trạng giãn hoặc rách dây chằng giữ khớp do chấn thương vặn xoắn quá mức.' },
        { term: 'Chuột rút', definition: 'Sự co thắt cơ bắp đột ngột, không tự chủ, gây đau nhói do mất nước, thiếu muối khoáng hoặc cơ bắp bị quá tải.' }
      ],
      commonErrors: [
        'Xoa bóp dầu nóng ngay khi vừa bị lật cổ chân khiến khớp bị sưng to và tụ máu nhiều hơn.',
        'Cố co gập chân lại khi bị chuột rút bắp chuối khiến cơ càng co thắt đau đớn.'
      ],
      actionableTips: [
        'Luôn chuẩn bị túi đá lạnh và băng thun trong tủ y tế thể dục.',
        'Uống đủ nước chứa kali và magie trước khi tham gia các hoạt động gắng sức.'
      ]
    },
    studyPack: {
      qaSeeds: [
        {
          question: 'Đang tập bỗng nhiên bị chuột rút thắt cứng ở bắp chuối chân thì em phải làm gì ngay lúc đó?',
          answer: 'Hãy ngồi xuống, duỗi thẳng chân ra và dùng tay kéo ngược các ngón chân về phía đầu gối để kéo giãn cơ. Sau đó xoa bóp nhẹ nhàng từ gót chân lên bắp chuối.',
          intent: 'Sơ cứu khẩn cấp'
        },
        {
          question: 'Vừa bị lật sơ mi (bong gân cổ chân), em có nên bôi dầu gió nóng hoặc rượu thuốc xoa bóp không?',
          answer: 'Tuyệt đối KHÔNG bôi dầu nóng hay chườm nóng! Dầu nóng làm các mao mạch giãn nở mạnh, khiến cổ chân xuất huyết và sưng phù nặng hơn. Em phải chườm đá lạnh theo quy tắc R.I.C.E.',
          intent: 'Chống chỉ định an toàn'
        }
      ]
    }
  }
};

interface GroundedChatScreenProps {
  initialTopicKey?: string;
  onNavigateToExercises?: () => void;
  onNavigateToMaterials?: () => void;
  onNavigateToQuizPractice?: () => void;
}

export default function GroundedChatScreen({
  initialTopicKey = '1500m',
  onNavigateToQuizPractice
}: GroundedChatScreenProps) {
  // Topic selection
  const [selectedTopicKey, setSelectedTopicKey] = useState<string>(initialTopicKey);
  const activePackage: GroundedContextPackage = PRESET_GROUNDED_PACKAGES[selectedTopicKey] || PRESET_GROUNDED_PACKAGES['1500m'];

  // Left sidebar view tab: sources vs analysisPreview vs studyPack
  const [activeContextTab, setActiveContextTab] = useState<'sources' | 'analysisPreview' | 'studyPack'>('sources');
  const [showContextDrawer, setShowContextDrawer] = useState<boolean>(true);

  // Chat message history
  const [messages, setMessages] = useState<GroundedChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Chào em! Thầy/cô là Trợ lý Sư phạm Grounded hỗ trợ ôn tập cho chủ đề "${activePackage.topic}" (${activePackage.grade}).

Em hãy đặt các câu hỏi liên quan đến kiến thức bài học để cùng ôn bài nhé!
Lưu ý: Thầy/cô chỉ trả lời trong phạm vi các tài liệu đã cung cấp (sources, analysisPreview, studyPack). Nếu câu hỏi nằm ngoài phạm vi tài liệu, thầy/cô sẽ thông báo rõ: "${OUT_OF_SCOPE_PHRASE}".`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      groundedSource: 'sources',
      sourceCitation: 'Hệ thống Trợ lý Sư phạm Grounded',
      suggestedFollowUps: [
        'Tại sao khi chạy 1500m em hay bị đau nhói bên sườn phải?',
        'Nhịp thở chuẩn 2-2 khi chạy bền thực hiện như thế nào?',
        'Sau khi về đích có được ngồi bệt ngay xuống đất không?'
      ]
    }
  ]);

  // Input state
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Reset conversation when topic changes
  const handleSwitchTopic = (key: string) => {
    setSelectedTopicKey(key);
    const newPkg = PRESET_GROUNDED_PACKAGES[key] || PRESET_GROUNDED_PACKAGES['1500m'];
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'assistant',
        content: `Chào em! Đã chuyển sang chủ đề ôn tập: "${newPkg.topic}" (${newPkg.grade}).

Thầy/cô chỉ trả lời trong phạm vi 3 phần tài liệu: sources, analysisPreview và studyPack của bài học này. Nếu câu hỏi không có trong tài liệu, thầy/cô sẽ thông báo rõ: "${OUT_OF_SCOPE_PHRASE}".`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        groundedSource: 'sources',
        sourceCitation: 'Hệ thống Trợ lý Sư phạm Grounded',
        suggestedFollowUps: newPkg.studyPack.qaSeeds.slice(0, 3).map(s => s.question)
      }
    ]);
  };

  // Submit Question to Grounded Chatbot API
  const handleSendMessage = async (customText?: string) => {
    const questionToSend = (customText || inputQuestion).trim();
    if (!questionToSend || isLoading) return;

    const userMessage: GroundedChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: questionToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      // Build history
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/grounded-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activePackage.topic,
          grade: activePackage.grade,
          question: questionToSend,
          context: activePackage,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (data.reply) {
        const botMessage: GroundedChatMessage = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isOutOfScope: Boolean(data.isOutOfScope),
          groundedSource: data.groundedSource,
          sourceCitation: data.sourceCitation,
          suggestedFollowUps: data.suggestedFollowUps || []
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMsg: GroundedChatMessage = {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content: data.error || `${OUT_OF_SCOPE_PHRASE} Đã xảy ra lỗi kết nối máy chủ.`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isOutOfScope: true,
          groundedSource: 'out_of_scope'
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: GroundedChatMessage = {
        id: `bot_catch_${Date.now()}`,
        role: 'assistant',
        content: `${OUT_OF_SCOPE_PHRASE} Thầy/cô chỉ giải đáp thắc mắc trong phạm vi bài học "${activePackage.topic}".`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isOutOfScope: true,
        groundedSource: 'out_of_scope'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    handleSwitchTopic(selectedTopicKey);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Banner - Matches Function #05 Dark Terminal/Card Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-400 text-slate-950 uppercase tracking-wider shadow-sm">
                LOẠI: FUNCTION #05
              </span>
              <span className="text-xs text-indigo-200 font-semibold px-2.5 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-700/50">
                Chatbot Grounded Ôn Bài
              </span>
              <span className="text-xs text-amber-300 font-medium px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/40">
                Phạm vi nghiêm ngặt: sources • analysisPreview • studyPack
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Chatbot Grounded Hỗ Trợ Ôn Bài Cho Chủ Đề Hiện Tại
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trợ lý sư phạm chuyên biệt hỗ trợ học sinh ôn tập bám sát tài liệu bài học. Nếu câu hỏi không có trong tài liệu hoặc không suy ra được từ tài liệu, hệ thống bắt buộc trả lời: <code className="text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded text-xs font-bold">"{OUT_OF_SCOPE_PHRASE}"</code>
            </p>
          </div>

          {/* Quick Topic Switcher Dropdown */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Chủ Đề Học Tập Đang Grounded:
              </label>
              <select
                value={selectedTopicKey}
                onChange={e => handleSwitchTopic(e.target.value)}
                className="w-full bg-slate-800/90 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
              >
                <option value="1500m">Lớp 8: Chạy 1500m & Nhịp thở</option>
                <option value="sprint">Lớp 7: Xuất phát thấp 60m/100m</option>
                <option value="rice">Lớp 8: Sơ cứu chấn thương R.I.C.E</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-all border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm Mới Lịch Sử Ôn Bài</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Context Drawer (4 cols) & Right Chat Stream (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Grounding Materials Context Viewer (sources, analysisPreview, studyPack) */}
        <div className={`lg:col-span-4 space-y-4 ${showContextDrawer ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Tài Liệu Nền Tảng (Grounded Scope)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {activePackage.grade}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dưới đây là 3 phạm vi dữ liệu duy nhất mà chatbot được phép đọc và trả lời:
            </p>

            {/* Context 3 Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveContextTab('sources')}
                className={`py-1.5 px-2 text-center rounded-xl text-xs font-bold transition-all ${
                  activeContextTab === 'sources'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. sources
              </button>
              <button
                type="button"
                onClick={() => setActiveContextTab('analysisPreview')}
                className={`py-1.5 px-2 text-center rounded-xl text-xs font-bold transition-all ${
                  activeContextTab === 'analysisPreview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. analysis
              </button>
              <button
                type="button"
                onClick={() => setActiveContextTab('studyPack')}
                className={`py-1.5 px-2 text-center rounded-xl text-xs font-bold transition-all ${
                  activeContextTab === 'studyPack'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. studyPack
              </button>
            </div>

            {/* TAB 1: sources */}
            {activeContextTab === 'sources' && (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {activePackage.sources.map((src, i) => (
                  <div key={src.id || i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="line-clamp-1">{src.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                      {src.content}
                    </p>
                    <span className="text-[10px] text-teal-700 font-semibold block pt-1 border-t border-slate-200/70">
                      Tham chiếu: {src.referenceTag}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: analysisPreview */}
            {activeContextTab === 'analysisPreview' && (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 text-xs">
                {/* Summary points */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Ý Chính Trọng Tâm
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc pl-4">
                    {activePackage.analysisPreview.summaryPoints.map((pt, idx) => (
                      <li key={idx} className="leading-relaxed">{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Common errors */}
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                  <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Lỗi Sai Thường Gặp
                  </span>
                  <ul className="space-y-1 text-[11px] text-rose-800 list-disc pl-4">
                    {activePackage.analysisPreview.commonErrors.map((err, idx) => (
                      <li key={idx} className="leading-relaxed">{err}</li>
                    ))}
                  </ul>
                </div>

                {/* Key terms */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Bảng Thuật Ngữ</span>
                  <div className="space-y-1">
                    {activePackage.analysisPreview.keyTerms.map((t, idx) => (
                      <div key={idx} className="text-[11px]">
                        <strong className="text-slate-800">{t.term}:</strong>{' '}
                        <span className="text-slate-600">{t.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: studyPack */}
            {activeContextTab === 'studyPack' && (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 text-xs">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Q&A Seeds Khởi Tạo Chuẩn Bị Cho Chatbot:
                </span>
                {activePackage.studyPack.qaSeeds.map((seed, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                        {seed.intent || `Seed #${i + 1}`}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-[11px]">
                      "{seed.question}"
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {seed.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test out of scope card helper */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Kiểm Tra Quy Tắc Từ Chối Grounded:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Hãy thử gõ câu hỏi không liên quan (ví dụ: <em>"Thủ đô của nước Pháp là gì?"</em> hoặc <em>"Cách chơi cờ vua thế nào?"</em>) để xem chatbot bắt buộc trả lời đúng câu:
            </p>
            <div className="p-2 rounded-xl bg-white border border-amber-300 font-mono text-[11px] font-bold text-amber-900">
              "{OUT_OF_SCOPE_PHRASE}"
            </div>
          </div>
        </div>

        {/* Right Column: Grounded Chat Interface (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Chat Stream Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 flex flex-col h-[650px] overflow-hidden">
            {/* Stream Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Phòng Ôn Bài Trực Tuyến - {activePackage.topic}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Grounded: sources • analysisPreview • studyPack
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowContextDrawer(!showContextDrawer)}
                className="lg:hidden text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl"
              >
                {showContextDrawer ? 'Ẩn Tài Liệu' : 'Xem Tài Liệu'}
              </button>
            </div>

            {/* Message History Scroll Container (Yêu cầu: Có vùng hiển thị lịch sử hỏi đáp) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} space-y-1.5 animate-in fade-in duration-200`}
                  >
                    {/* Role & Time Header */}
                    <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600">
                        {isAssistant ? 'Trợ Lý Sư Phạm (Grounded)' : 'Học Sinh'}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed transition-all ${
                        isAssistant
                          ? msg.isOutOfScope
                            ? 'bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs'
                            : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                          : 'bg-teal-600 text-white font-medium rounded-br-sm shadow-sm'
                      }`}
                    >
                      {/* Out of scope special indicator */}
                      {isAssistant && msg.isOutOfScope && (
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 pb-2 mb-2 border-b border-amber-200 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Thông Báo Phạm Vi Kiến Thức</span>
                        </div>
                      )}

                      <div className="whitespace-pre-line font-sans">
                        {msg.content}
                      </div>

                      {/* Grounded Citation Badge (for assistant messages) */}
                      {isAssistant && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                              msg.isOutOfScope
                                ? 'bg-amber-200 text-amber-900'
                                : msg.groundedSource === 'studyPack'
                                ? 'bg-indigo-100 text-indigo-800'
                                : msg.groundedSource === 'analysisPreview'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            Nguồn: {msg.groundedSource || 'sources'}
                          </span>

                          {msg.sourceCitation && (
                            <span className="text-slate-400 italic line-clamp-1">
                              {msg.sourceCitation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Suggested follow-up prompts */}
                    {isAssistant && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 max-w-[85%]">
                        {msg.suggestedFollowUps.map((promptText, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleSendMessage(promptText)}
                            className="text-[11px] text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-xl font-medium transition-all text-left"
                          >
                            💬 {promptText}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-start space-y-1.5 animate-in fade-in duration-200">
                  <div className="px-1 text-[11px] text-slate-400 font-semibold">
                    Trợ lý đang tra cứu trong sources, analysisPreview và studyPack...
                  </div>
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-600 font-medium">
                      Đang đối chiếu tài liệu và tạo câu trả lời ôn bài...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompts Bar (Gợi ý câu hỏi ôn bài) */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Hỏi nhanh:</span>
              <button
                type="button"
                onClick={() => handleSendMessage('Tại sao khi chạy 1500m lại bị đau nhói bên hông?')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-slate-700 text-[11px]"
              >
                🏃 Xóc hông khi chạy
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Nhịp thở 2-2 khi chạy bền thực hiện như thế nào?')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-slate-700 text-[11px]"
              >
                💨 Nhịp thở 2-2
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Vừa chạy về đích ngồi bệt ngay có được không?')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-slate-700 text-[11px]"
              >
                🛑 Hồi tĩnh về đích
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Thủ đô của nước Pháp là gì?')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 hover:border-amber-400 text-amber-900 text-[11px] font-bold"
                title="Bấm để test phản hồi từ chối 'Nội dung này nằm ngoài phạm vi tài liệu đã cung cấp.'"
              >
                🧪 Test câu hỏi ngoài lề
              </button>
            </div>

            {/* Question Input Box (Yêu cầu: Có khung nhập câu hỏi) */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Gõ câu hỏi ôn bài (chỉ trong phạm vi sources, analysisPreview, studyPack)..."
                  value={inputQuestion}
                  onChange={e => setInputQuestion(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputQuestion.trim()}
                  className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  <span>Gửi</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
