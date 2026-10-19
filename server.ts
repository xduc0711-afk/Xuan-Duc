import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { FALLBACK_RECIPES, VIETNAMESE_QUERY_MAP } from './server/spoonacularData';
import { FALLBACK_AI_MEAL_PLANS } from './server/aiMealPlanData';
import { INITIAL_ACCOUNTS, INITIAL_MATERIALS } from './server/materialsData';
import { summarizeWithGemini, PRESET_SAMPLE_DOCS } from './server/summarizerHelper';
import { generateQuizWithGemini, PRESET_CURRICULUM_TOPICS } from './server/quizGeneratorHelper';
import { generateQaSeedsWithGemini } from './server/qaSeedGeneratorHelper';
import { askGroundedChatbot } from './server/groundedChatHelper';
import { regenerateStudyPackWithGemini } from './server/studyPackHelper';
import { MaterialItem, UserAccount } from './src/types';

dotenv.config();

let accountsList: UserAccount[] = [...INITIAL_ACCOUNTS];
let materialsList: MaterialItem[] = [...INITIAL_MATERIALS];

const DEFAULT_SPOONACULAR_KEY = '46a297e3db7d46c380eb5c26c92ce6b4';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error creating GoogleGenAI client:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API 2: AI Coach for Physical Education & Health
  app.post('/api/ai/coach', async (req, res) => {
    try {
      const { question, studentGrade, fitnessGoal } = req.body;

      if (!question || typeof question !== 'string') {
        res.status(400).json({ error: 'Thiếu nội dung câu hỏi' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        // High quality fallback answers if API key is not configured
        const fallbackReplies: Record<string, string> = {
          default: `Chào em! Thầy/Cô Thể dục khuyên em nên duy trì thói quen tập luyện đều đặn 20-30 phút mỗi ngày. Đối với câu hỏi của em: hãy luôn nhớ khởi động kỹ 5-7 phút trước khi vận động và thả lỏng sau khi tập. Uống đủ 1.5 - 2 lít nước mỗi ngày và hạn chế thức khuya để cơ bắp phục hồi và phát triển chiều cao tối ưu nhé!`
        };
        res.json({
          reply: fallbackReplies.default,
          source: 'local_guidelines'
        });
        return;
      }

      const prompt = `Bạn là Thầy/Cô giáo môn Giáo dục Thể chất và Chuyên gia dinh dưỡng học đường tại Việt Nam.
Hãy trả lời câu hỏi của học sinh một cách gần gũi, chuẩn mực sư phạm, dễ hiểu, khoa học và đầy động lực.

Thông tin học sinh:
- Khối lớp: ${studentGrade || 'Học sinh cấp 2 - cấp 3'}
- Mục tiêu rèn luyện: ${fitnessGoal || 'Tăng cường sức khỏe và vóc dáng'}
- Câu hỏi của học sinh: "${question}"

Yêu cầu trả lời:
1. Giải thích ngắn gọn nguyên lý hoặc lợi ích bằng ngôn ngữ học sinh.
2. Đưa ra 2-4 hướng dẫn hoặc bài tập cụ thể, dễ thực hiện tại nhà hoặc ở trường.
3. Nhắc nhở lưu ý an toàn (khởi động, tư thế chuẩn tránh chấn thương cột sống/khớp).
4. Lời khích lệ tinh thần thể thao tích cực. Độ dài khoảng 150-250 từ, định dạng rõ ràng, dùng gạch đầu dòng ngắn gọn.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const reply = response.text || 'Thầy/Cô khuyên em hãy luôn khởi động kỹ và duy trì ăn uống đủ 4 nhóm chất nhé!';
      res.json({ reply, source: 'gemini' });
    } catch (error: any) {
      console.error('Error in /api/ai/coach:', error);
      res.json({
        reply: 'Để rèn luyện thể chất tốt, em nhớ duy trì 3 nguyên tắc: Khởi động kỹ trước khi tập, thực hiện đúng biên độ động tác và bổ sung nước đều đặn. Nếu cảm thấy đau nhức bất thường, hãy tạm nghỉ ngơi nhé!',
        source: 'fallback_error',
      });
    }
  });

  // API 3: Smart Meal Evaluator for Students
  app.post('/api/ai/meal-evaluator', async (req, res) => {
    try {
      const { mealDescription, mealType, studentAge } = req.body;

      if (!mealDescription) {
        res.status(400).json({ error: 'Thiếu mô tả bữa ăn' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Smart fallback logic
        const lower = mealDescription.toLowerCase();
        const hasVeg = lower.includes('rau') || lower.includes('canh') || lower.includes('xà lách') || lower.includes('dưa');
        const hasProtein = lower.includes('thịt') || lower.includes('cá') || lower.includes('trứng') || lower.includes('đậu') || lower.includes('tôm');
        const hasCarb = lower.includes('cơm') || lower.includes('bún') || lower.includes('phở') || lower.includes('bánh mì') || lower.includes('khoai');
        const isJunkFood = lower.includes('trà sữa') || lower.includes('mì tôm') || lower.includes('gà rán') || lower.includes('khoai tây chiên') || lower.includes('nước ngọt');

        let score = 7;
        if (hasCarb && hasProtein && hasVeg) score = 9;
        if (isJunkFood) score = Math.max(4, score - 3);

        res.json({
          score,
          assessment: score >= 8 ? 'Bữa ăn cân đối, giàu dưỡng chất cho học sinh!' : 'Bữa ăn tương đối ổn nhưng cần bổ sung thêm vi chất.',
          pros: [
            hasCarb ? 'Cung cấp năng lượng học tập tốt từ tinh bột' : 'Có năng lượng cơ bản',
            hasProtein ? 'Có nguồn đạm hỗ trợ phát triển cơ bắp và chiều cao' : 'Có dưỡng chất cần thiết',
          ],
          cons: [
            !hasVeg ? 'Còn thiếu rau xanh và chất xơ, vitamin khoáng chất' : null,
            isJunkFood ? 'Hạn chế dầu mỡ chiên rán và đường tinh luyện' : null,
          ].filter(Boolean),
          advice: 'Hãy nhớ uống thêm 1 ly nước lọc hoặc ăn thêm một loại trái cây tươi sau bữa ăn nhé!',
          source: 'local_rule'
        });
        return;
      }

      const prompt = `Bạn là chuyên gia dinh dưỡng học đường Việt Nam. Hãy đánh giá bữa ăn sau của học sinh:
- Lứa tuổi: ${studentAge || '12-17 tuổi'}
- Bữa ăn: ${mealType || 'Bữa chính'}
- Thực đơn: "${mealDescription}"

Hãy phân tích và trả về định dạng JSON thuần túy (không dùng markdown code block, chỉ chuỗi JSON hợp lệ):
{
  "score": <số nguyên từ 1 đến 10>,
  "assessment": "<Nhận xét tổng quan ngắn gọn khoảng 1-2 câu>",
  "pros": ["<Ưu điểm dinh dưỡng 1>", "<Ưu điểm 2>"],
  "cons": ["<Điểm cần lưu ý/hạn chế nếu có>"],
  "advice": "<Lời khuyên thiết thực dành riêng cho học sinh lứa tuổi này>"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(text);
        res.json({ ...parsed, source: 'gemini' });
      } catch {
        res.json({
          score: 8,
          assessment: 'Bữa ăn phù hợp với năng lượng học đường.',
          pros: ['Cung cấp năng lượng cho giờ học'],
          cons: ['Nên bổ sung đa dạng rau củ'],
          advice: 'Ăn thêm hoa quả tươi và uống đủ nước mỗi ngày.',
          source: 'gemini_fallback'
        });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/meal-evaluator:', error);
      res.json({
        score: 7,
        assessment: 'Bữa ăn cung cấp đủ năng lượng cho việc học tập.',
        pros: ['Cung cấp tinh bột và năng lượng'],
        cons: ['Cần chú ý ăn đủ 4 nhóm chất'],
        advice: 'Nên kết hợp thêm rau luộc hoặc canh để hỗ trợ tiêu hóa.',
        source: 'error_fallback'
      });
    }
  });

  // API 4: Spoonacular Food & Recipe Recommendations
  app.get('/api/spoonacular/recipes', async (req, res) => {
    try {
      const apiKey = process.env.SPOONACULAR_API_KEY || DEFAULT_SPOONACULAR_KEY;
      const rawQuery = (req.query.query as string || '').trim();
      const goal = (req.query.goal as string || 'all').trim();
      const limit = Math.min(Number(req.query.number) || 10, 20);

      // Map query if entered in Vietnamese
      let mappedQuery = rawQuery.toLowerCase();
      for (const [vi, en] of Object.entries(VIETNAMESE_QUERY_MAP)) {
        if (mappedQuery.includes(vi)) {
          mappedQuery = en;
          break;
        }
      }

      // If no query but goal is selected, build an appropriate nutrition search
      let searchTerms = mappedQuery;
      let minProtein = 0;
      let maxCalories = 800;

      if (goal === 'height') {
        if (!searchTerms) searchTerms = 'salmon broccoli milk';
        minProtein = 15;
      } else if (goal === 'strength') {
        if (!searchTerms) searchTerms = 'chicken high-protein egg';
        minProtein = 25;
      } else if (goal === 'weight_loss') {
        if (!searchTerms) searchTerms = 'healthy salad soup';
        maxCalories = 450;
      } else if (goal === 'breakfast') {
        if (!searchTerms) searchTerms = 'healthy breakfast oatmeal egg';
      } else if (goal === 'snack') {
        if (!searchTerms) searchTerms = 'yogurt fruit smoothie snack';
        maxCalories = 300;
      }

      if (!searchTerms) {
        searchTerms = 'healthy nutritious student';
      }

      const params = new URLSearchParams({
        apiKey,
        query: searchTerms,
        addRecipeNutrition: 'true',
        addRecipeInformation: 'true',
        number: limit.toString(),
        sort: 'healthiness',
      });

      if (minProtein > 0) params.append('minProtein', minProtein.toString());
      if (maxCalories < 800) params.append('maxCalories', maxCalories.toString());

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        throw new Error(`Spoonacular responded with status ${response.status}`);
      }

      const data: any = await response.json();
      const rawResults = data.results || [];

      if (rawResults.length === 0) {
        // Fallback filter
        const filtered = FALLBACK_RECIPES.filter(r => {
          if (goal === 'all') return true;
          if (goal === 'height' && r.studentTag.includes('Chiều Cao')) return true;
          if (goal === 'strength' && r.studentTag.includes('Cơ')) return true;
          if (goal === 'weight_loss' && r.studentTag.includes('Dáng')) return true;
          if (goal === 'breakfast' && (r.dishTypes.includes('breakfast') || r.studentTag.includes('Sáng'))) return true;
          if (goal === 'snack' && r.dishTypes.includes('snack')) return true;
          return true;
        });
        res.json({ recipes: filtered, source: 'fallback_empty' });
        return;
      }

      // Map Spoonacular recipe format to our clean frontend type
      const recipes = rawResults.map((r: any) => {
        const nutrients = r.nutrition?.nutrients || [];
        const findNutrient = (name: string) => {
          const item = nutrients.find((n: any) => n.name.toLowerCase() === name.toLowerCase());
          return item ? Math.round(item.amount) : undefined;
        };

        const cal = findNutrient('Calories');
        const prot = findNutrient('Protein');
        const carb = findNutrient('Carbohydrates');
        const fat = findNutrient('Fat');
        const fib = findNutrient('Fiber');

        // Derive student fitness tag
        let studentTag = 'Dinh Dưỡng Học Đường';
        if (prot && prot >= 25) studentTag = 'Tăng Cơ & Thể Lực';
        else if (r.title.toLowerCase().includes('salmon') || r.title.toLowerCase().includes('milk') || r.title.toLowerCase().includes('broccoli')) studentTag = 'Tăng Chiều Cao';
        else if (cal && cal < 350) studentTag = 'Ít Calo Giữ Dáng';
        else if (r.dishTypes?.includes('breakfast')) studentTag = 'Bữa Sáng Năng Lượng';

        return {
          id: r.id,
          title: r.title,
          vietnameseTitle: undefined,
          image: r.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
          readyInMinutes: r.readyInMinutes || 25,
          servings: r.servings || 2,
          healthScore: r.healthScore || 85,
          calories: cal || 380,
          protein: prot ? `${prot}g` : '18g',
          carbs: carb ? `${carb}g` : '42g',
          fat: fat ? `${fat}g` : '10g',
          fiber: fib ? `${fib}g` : '5g',
          summary: r.summary ? r.summary.replace(/<[^>]*>?/gm, '').slice(0, 200) + '...' : 'Món ăn bổ dưỡng cho học sinh.',
          dishTypes: r.dishTypes || ['main course'],
          diets: r.diets || [],
          sourceUrl: r.sourceUrl,
          studentTag,
        };
      });

      res.json({ recipes, source: 'spoonacular' });
    } catch (error: any) {
      console.warn('Spoonacular API call failed or timed out, serving curated student healthy recipes:', error.message);
      // Serve robust fallback collection
      const goal = (req.query.goal as string || 'all').trim();
      const filtered = FALLBACK_RECIPES.filter(r => {
        if (goal === 'all') return true;
        if (goal === 'height' && r.studentTag.includes('Chiều Cao')) return true;
        if (goal === 'strength' && r.studentTag.includes('Cơ')) return true;
        if (goal === 'weight_loss' && r.studentTag.includes('Dáng')) return true;
        if (goal === 'breakfast' && (r.dishTypes.includes('breakfast') || r.studentTag.includes('Sáng'))) return true;
        if (goal === 'snack' && r.dishTypes.includes('snack')) return true;
        return true;
      });
      res.json({ recipes: filtered.length > 0 ? filtered : FALLBACK_RECIPES, source: 'curated_fallback' });
    }
  });

  // API 5: Spoonacular Recipe Details
  app.get('/api/spoonacular/recipes/:id', async (req, res) => {
    const idNum = Number(req.params.id);
    const fallback = FALLBACK_RECIPES.find(r => r.id === idNum);

    try {
      const apiKey = process.env.SPOONACULAR_API_KEY || DEFAULT_SPOONACULAR_KEY;
      const url = `https://api.spoonacular.com/recipes/${idNum}/information?apiKey=${apiKey}&includeNutrition=true`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        if (fallback) {
          res.json({ recipe: fallback, source: 'fallback' });
          return;
        }
        throw new Error(`Spoonacular error ${response.status}`);
      }

      const r: any = await response.json();
      const nutrients = r.nutrition?.nutrients || [];
      const findNutrient = (name: string) => {
        const item = nutrients.find((n: any) => n.name.toLowerCase() === name.toLowerCase());
        return item ? Math.round(item.amount) : undefined;
      };

      const ingredients = (r.extendedIngredients || []).map((ing: any) => ing.original || ing.name);
      const instructions = (r.analyzedInstructions?.[0]?.steps || []).map((s: any) => s.step);

      res.json({
        recipe: {
          id: r.id,
          title: r.title,
          vietnameseTitle: fallback?.vietnameseTitle,
          image: r.image,
          readyInMinutes: r.readyInMinutes || 25,
          servings: r.servings || 2,
          healthScore: r.healthScore || 85,
          calories: findNutrient('Calories') || 400,
          protein: `${findNutrient('Protein') || 20}g`,
          carbs: `${findNutrient('Carbohydrates') || 45}g`,
          fat: `${findNutrient('Fat') || 10}g`,
          fiber: `${findNutrient('Fiber') || 5}g`,
          summary: r.summary ? r.summary.replace(/<[^>]*>?/gm, '') : '',
          ingredients: ingredients.length > 0 ? ingredients : fallback?.ingredients || ['Nguyên liệu tươi ngon'],
          instructions: instructions.length > 0 ? instructions : fallback?.instructions || ['Chế biến sạch sẽ và nêm nhạt vừa ăn.'],
          studentTag: fallback?.studentTag || 'Dinh Dưỡng Học Đường',
          benefitsVi: fallback?.benefitsVi || 'Cung cấp năng lượng dồi dào cho rèn luyện thể chất.',
          sourceUrl: r.sourceUrl,
        },
        source: 'spoonacular'
      });
    } catch (error) {
      if (fallback) {
        res.json({ recipe: fallback, source: 'fallback' });
      } else {
        res.status(404).json({ error: 'Không tìm thấy chi tiết món ăn' });
      }
    }
  });

  // API 6: AI-Powered Student Meal Plan Recommendation (Đề Xuất Thực Đơn Thông Minh Bằng AI)
  app.post('/api/ai/meal-suggestions', async (req, res) => {
    try {
      const { studentAge, grade, goal, context, notes } = req.body;
      const effectiveGoal = goal || 'height';

      const ai = getGeminiClient();
      if (!ai) {
        const fallback = FALLBACK_AI_MEAL_PLANS[effectiveGoal] || FALLBACK_AI_MEAL_PLANS.height;
        res.json({ plan: fallback, source: 'curated_fallback' });
        return;
      }

      const goalNames: Record<string, string> = {
        height: 'Tăng chiều cao tối đa trong giai đoạn dậy thì (giàu Canxi, Vitamin D, Protein)',
        strength: 'Tăng cường thể lực, sức bền thể dục, săn chắc cơ bắp (chạy bền 1500m, bóng rổ, bơi lội)',
        weight_loss: 'Kiểm soát cân nặng, tiêu mỡ lành mạnh, thon gọn vóc dáng (giàu chất xơ, ít calo)',
        study_energy: 'Tăng cường trí nhớ, tập trung cao độ khi ôn thi, không buồn ngủ',
      };

      const prompt = `Bạn là Chuyên gia Dinh dưỡng Thể thao Học đường hàng đầu Việt Nam.
Hãy lên một Kế hoạch Thực đơn 1 Ngày hoàn chỉnh, chuẩn mực, giàu năng lượng và phù hợp nhất cho học sinh Việt Nam theo yêu cầu sau:

Thông tin học sinh:
- Độ tuổi & Lớp: ${studentAge || 14} tuổi (${grade || 'Lớp 8/9'})
- Mục tiêu thể chất chính: ${goalNames[effectiveGoal] || effectiveGoal}
- Hoàn cảnh ăn uống: ${context === 'canteen' ? 'Ăn ở căng tin trường / quán gần trường' : context === 'home_cooked' ? 'Cơm gia đình nấu mang theo' : context === 'quick_prep' ? 'Tự chuẩn bị nhanh tại nhà dưới 15 phút' : 'Linh hoạt mọi hoàn cảnh'}
- Ghi chú thêm của học sinh: "${notes || 'Không'}"

Yêu cầu định dạng: Trả về duy nhất một chuỗi JSON hợp lệ (không chứa markdown, không dùng backticks \`\`\`json):
{
  "title": "<Tên thực đơn cuốn hút, giàu cảm hứng học đường>",
  "goal": "${goalNames[effectiveGoal] || effectiveGoal}",
  "targetCalories": <tổng calo trong ngày, khoảng 1800 - 2400 tùy mục tiêu>,
  "summary": "<Tổng quan 1-2 câu về cơ chế dinh dưỡng của thực đơn này với học sinh>",
  "breakfast": {
    "name": "<Tên món bữa sáng thuần Việt gần gũi>",
    "portion": "<Khẩu phần cụ thể>",
    "caloriesApprox": <calo khoảng 350-550>,
    "proteinApprox": "<số gram đạm, vd 20g>",
    "keyNutrients": "<Các vi chất chính>",
    "whyGoodForStudents": "<Lý do tốt cho học sinh vào buổi sáng>",
    "preparationTip": "<Mẹo chuẩn bị nhanh>"
  },
  "lunch": {
    "name": "<Tên bữa trưa cân đối 4 nhóm chất>",
    "portion": "<Khẩu phần>",
    "caloriesApprox": <calo khoảng 600-800>,
    "proteinApprox": "<vd 35g>",
    "keyNutrients": "<Các vi chất chính>",
    "whyGoodForStudents": "<Lợi ích dinh dưỡng>",
    "preparationTip": "<Mẹo ăn tại trường hoặc nấu tại nhà>"
  },
  "snack": {
    "name": "<Tên bữa xế chiều trước/sau giờ tập thể dục>",
    "portion": "<Khẩu phần>",
    "caloriesApprox": <calo khoảng 200-300>,
    "proteinApprox": "<vd 10g>",
    "keyNutrients": "<Điện giải, khoáng chất>",
    "whyGoodForStudents": "<Tại sao giúp vận động thể thao tốt, chống chuột rút mệt mỏi>",
    "preparationTip": "<Mẹo mang theo cặp sách>"
  },
  "dinner": {
    "name": "<Tên bữa tối nhẹ nhàng, dễ tiêu>",
    "portion": "<Khẩu phần>",
    "caloriesApprox": <calo khoảng 500-650>,
    "proteinApprox": "<vd 30g>",
    "keyNutrients": "<Chất dinh dưỡng an thần, phục hồi cơ>",
    "whyGoodForStudents": "<Hỗ trợ tuyến yên tiết hormone phát triển lúc ngủ>",
    "preparationTip": "<Lưu ý giờ ăn tối>"
  },
  "hydrationAdvice": "<Lời khuyên uống nước cụ thể cho ngày rèn luyện>",
  "physicalExerciseTip": "<Lời khuyên về bài tập thể dục kết hợp để phát huy tối đa thực đơn này>"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(text);
        res.json({ plan: parsed, source: 'gemini' });
      } catch (parseError) {
        console.error('Failed to parse Gemini meal suggestion JSON:', parseError, text);
        const fallback = FALLBACK_AI_MEAL_PLANS[effectiveGoal] || FALLBACK_AI_MEAL_PLANS.height;
        res.json({ plan: fallback, source: 'gemini_fallback' });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/meal-suggestions:', error);
      const effectiveGoal = req.body?.goal || 'height';
      const fallback = FALLBACK_AI_MEAL_PLANS[effectiveGoal] || FALLBACK_AI_MEAL_PLANS.height;
      res.json({ plan: fallback, source: 'error_fallback' });
    }
  });

  // API 6B: MindX Function #03 - AI Summarizer & Key Points Extractor (Tóm tắt và trích xuất ý chính)
  app.get('/api/ai/summarize/presets', (_req, res) => {
    res.json({ presets: PRESET_SAMPLE_DOCS });
  });

  app.post('/api/ai/summarize', async (req, res) => {
    try {
      const { text, title, depth, audience, sourceType, sourceId } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        res.status(400).json({ error: 'Vui lòng cung cấp nội dung hoặc tài liệu cần tóm tắt' });
        return;
      }

      const ai = getGeminiClient();
      const result = await summarizeWithGemini(ai, {
        text,
        title,
        depth,
        audience,
        sourceType,
        sourceId
      });

      res.json({
        summary: result,
        source: ai ? 'gemini' : 'curated_extractor',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error in /api/ai/summarize:', error);
      res.status(500).json({ error: 'Lỗi khi phân tích và tóm tắt tài liệu: ' + error.message });
    }
  });

  // API 6C: Practice Quiz Generator (Tạo bộ câu hỏi luyện tập ôn bài trên trường)
  app.get('/api/ai/quiz/presets', (_req, res) => {
    res.json({ presets: PRESET_CURRICULUM_TOPICS });
  });

  app.post('/api/ai/quiz/generate', async (req, res) => {
    try {
      const { topic, grade, subject } = req.body;

      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        res.status(400).json({ error: 'Vui lòng nhập chủ đề bài học cần tạo câu hỏi' });
        return;
      }

      const ai = getGeminiClient();
      const quizSet = await generateQuizWithGemini(ai, {
        topic: topic.trim(),
        grade: grade?.trim() || 'Lớp 8',
        subject: subject?.trim() || 'Giáo dục Thể chất',
      });

      res.json({
        quizSet,
        source: ai ? 'gemini' : 'curated_curriculum',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/ai/quiz/generate:', error);
      res.status(500).json({ error: 'Lỗi khi tạo bộ câu hỏi luyện tập: ' + error.message });
    }
  });

  // API 6D: Q&A Seed Dataset Generator (Function #04: Khởi tạo Q&A Seed chuẩn bị cho chatbot ôn bài)
  app.post('/api/ai/qa-seeds/generate', async (req, res) => {
    try {
      const { topic, grade, subject, seedCount } = req.body;
      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        res.status(400).json({ error: 'Vui lòng cung cấp chủ đề học tập để tạo Q&A seed' });
        return;
      }

      const ai = getGeminiClient();
      const dataset = await generateQaSeedsWithGemini(ai, {
        topic: topic.trim(),
        grade: grade?.trim() || 'Lớp 8',
        subject: subject?.trim() || 'Giáo dục Thể chất',
        seedCount: typeof seedCount === 'number' ? seedCount : 5,
      });

      res.json({
        dataset,
        source: ai ? 'gemini' : 'curated_pedagogy',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/ai/qa-seeds/generate:', error);
      res.status(500).json({ error: 'Lỗi khi tạo Q&A seed: ' + error.message });
    }
  });

  // API 6E: Grounded Study Chatbot (Chatbot hỗ trợ ôn bài bám sát sources, analysisPreview, studyPack)
  app.post('/api/ai/grounded-chat', async (req, res) => {
    try {
      const { topic, grade, question, context, history } = req.body;
      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        res.status(400).json({ error: 'Vui lòng nhập câu hỏi cần ôn bài' });
        return;
      }

      if (!context) {
        res.status(400).json({ error: 'Thiếu gói dữ liệu nền tảng context (sources, analysisPreview, studyPack)' });
        return;
      }

      const ai = getGeminiClient();
      const response = await askGroundedChatbot(ai, {
        topic: topic || context.topic || 'Chủ đề hiện tại',
        grade: grade || context.grade || 'Lớp 8',
        question: question.trim(),
        context,
        history: Array.isArray(history) ? history : [],
      });

      res.json({
        ...response,
        source: ai ? 'gemini-grounded' : 'curated-grounded-fallback',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/ai/grounded-chat:', error);
      res.status(500).json({ error: 'Lỗi xử lý chatbot grounded: ' + error.message });
    }
  });

  // API 6F: Study Pack Re-generate & Version Generator (PROMPT 05 & 06)
  app.post('/api/ai/studypack/regenerate', async (req, res) => {
    try {
      const { sourceDoc, versionNumber, localApiKey, versionNote } = req.body;
      if (!sourceDoc || !sourceDoc.content || typeof sourceDoc.content !== 'string') {
        res.status(400).json({ error: 'Vui lòng cung cấp nguồn học liệu gốc sourceDoc' });
        return;
      }

      const ai = getGeminiClient();
      const result = await regenerateStudyPackWithGemini(ai, {
        sourceDoc,
        versionNumber: typeof versionNumber === 'number' ? versionNumber : 2,
        localApiKey: typeof localApiKey === 'string' ? localApiKey : undefined,
        versionNote: typeof versionNote === 'string' ? versionNote : undefined,
      });

      res.json({
        ...result,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/ai/studypack/regenerate:', error);
      res.status(500).json({ error: 'Lỗi khi re-generate study pack: ' + error.message });
    }
  });

  // API 6F: Basic Serverless Proxy Route (/api/gemini)
  // Proxy bảo mật giúp frontend không bao giờ để lộ GEMINI_API_KEY
  app.post('/api/gemini', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body || {};
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Thiếu nội dung prompt cần gửi tới AI' });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback an toàn nếu chưa cấu hình biến môi trường
        res.json({
          text: `[Chế độ Proxy Cục bộ] Nhận được câu hỏi: "${prompt.slice(0, 100)}...". Chưa phát hiện GEMINI_API_KEY trong biến môi trường server, vui lòng cấu hình GEMINI_API_KEY trong .env hoặc cài đặt biến môi trường trên Vercel/Netlify.`,
          fallback: true,
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Timeout guard 6s để tránh treo request
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Quá thời gian phản hồi (timeout 6s)')), 6000)
      );

      const aiCallPromise = client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction: String(systemInstruction) } : undefined,
      });

      const response: any = await Promise.race([aiCallPromise, timeoutPromise]);

      res.json({
        text: response.text || '',
        timestamp: new Date().toISOString(),
        proxy: 'serverless-proxy-active'
      });
    } catch (error: any) {
      console.error('Error in /api/gemini proxy:', error);
      res.status(500).json({ error: 'Lỗi tại proxy serverless: ' + error.message });
    }
  });

  // API 7: Accounts Management (Danh sách tài khoản & Đăng ký tài khoản)
  app.get('/api/accounts', (_req, res) => {
    res.json({ accounts: accountsList });
  });

  app.post('/api/accounts/register', (req, res) => {
    try {
      const { username, fullName, role, gradeOrSchool, avatarColor, avatarEmoji } = req.body;
      if (!username || !fullName) {
        res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và họ tên đầy đủ' });
        return;
      }

      const cleanUsername = username.trim().toLowerCase();
      const existing = accountsList.find(a => a.username.toLowerCase() === cleanUsername);
      if (existing) {
        res.status(400).json({ error: 'Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác' });
        return;
      }

      const roleNameMap: Record<string, string> = {
        student: 'Học sinh',
        teacher: 'Giáo viên Thể Dục',
        coach: 'Huấn luyện viên',
        parent: 'Phụ huynh'
      };

      const newAccount: UserAccount = {
        id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        username: cleanUsername,
        fullName: fullName.trim(),
        role: role || 'student',
        roleNameVi: roleNameMap[role] || 'Học sinh',
        gradeOrSchool: gradeOrSchool?.trim() || 'Trường THCS/THPT',
        avatarColor: avatarColor || 'emerald',
        avatarEmoji: avatarEmoji || '🏃',
        createdAt: new Date().toISOString(),
      };

      accountsList.push(newAccount);
      res.status(201).json({ account: newAccount, message: 'Đăng ký tài khoản thành công!' });
    } catch (error: any) {
      res.status(500).json({ error: 'Không thể tạo tài khoản: ' + error.message });
    }
  });

  // API 8: Materials & Content Management (Thêm, Xem, Xóa Vật liệu & Học liệu theo tài khoản)
  app.get('/api/materials', (req, res) => {
    try {
      const { category, authorId, search } = req.query;
      let results = [...materialsList];

      if (category && category !== 'all') {
        results = results.filter(m => m.category === category);
      }

      if (authorId && typeof authorId === 'string') {
        results = results.filter(m => m.authorId === authorId);
      }

      if (search && typeof search === 'string') {
        const q = search.toLowerCase().trim();
        results = results.filter(m => 
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.authorName.toLowerCase().includes(q) ||
          m.locationOrOrigin.toLowerCase().includes(q) ||
          m.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      res.json({ materials: results, total: results.length });
    } catch (error: any) {
      res.status(500).json({ error: 'Lỗi tải danh sách vật liệu: ' + error.message });
    }
  });

  app.post('/api/materials', (req, res) => {
    try {
      const {
        title,
        category,
        description,
        quantity,
        status,
        locationOrOrigin,
        imageUrl,
        tags,
        authorId,
        authorName,
        authorRole,
        authorAvatarEmoji
      } = req.body;

      if (!title || !description || !authorId) {
        res.status(400).json({ error: 'Vui lòng nhập Tên vật liệu, Mô tả chi tiết và chọn Tài khoản người tạo' });
        return;
      }

      const categoryNames: Record<string, string> = {
        equipment: 'Dụng cụ thể chất',
        nutrition: 'Nguyên liệu dinh dưỡng',
        guide: 'Tài liệu & Giáo án',
        practice: 'Nội dung rèn luyện'
      };

      const statusLabels: Record<string, string> = {
        available: 'Sẵn sàng sử dụng',
        ready: 'Sẵn sàng bổ sung',
        in_use: 'Đang sử dụng',
        need_restock: 'Cần bổ sung'
      };

      const tagArray = Array.isArray(tags)
        ? tags.map((t: any) => String(t).trim()).filter(Boolean)
        : typeof tags === 'string'
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

      const newMaterial: MaterialItem = {
        id: `mat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        category: category || 'equipment',
        categoryNameVi: categoryNames[category] || 'Dụng cụ thể chất',
        description: description.trim(),
        quantity: quantity?.trim() || '1 đơn vị',
        status: status || 'available',
        statusLabelVi: statusLabels[status] || 'Sẵn sàng sử dụng',
        locationOrOrigin: locationOrOrigin?.trim() || 'Phòng kho Thể chất trường',
        imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        tags: tagArray.length > 0 ? tagArray : ['thể chất học đường'],
        authorId,
        authorName: authorName || 'Thành viên EduFit',
        authorRole: authorRole || 'Học sinh',
        authorAvatarEmoji: authorAvatarEmoji || '📦',
        createdAt: new Date().toISOString(),
      };

      materialsList.unshift(newMaterial);
      res.status(201).json({ material: newMaterial, message: 'Đã thêm vật liệu mới vào kho thành công!' });
    } catch (error: any) {
      res.status(500).json({ error: 'Lỗi thêm vật liệu: ' + error.message });
    }
  });

  app.delete('/api/materials/:id', (req, res) => {
    try {
      const { id } = req.params;
      const requesterId = req.query.requesterId as string;
      const requesterRole = req.query.requesterRole as string;

      const index = materialsList.findIndex(m => m.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Không tìm thấy vật liệu cần xóa' });
        return;
      }

      const item = materialsList[index];
      // Permission check: if requesterId is provided, only allow author or teacher
      if (requesterId && item.authorId !== requesterId && requesterRole !== 'teacher') {
        res.status(403).json({
          error: `Bạn không có quyền xóa vật liệu này! Chỉ tác giả tạo ra (${item.authorName}) hoặc Giáo viên Thể dục mới có quyền xóa.`
        });
        return;
      }

      const deleted = materialsList.splice(index, 1)[0];
      res.json({
        success: true,
        message: `Đã xóa thành công vật liệu "${deleted.title}"!`,
        deletedId: id
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Lỗi khi xóa vật liệu: ' + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduFit Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
