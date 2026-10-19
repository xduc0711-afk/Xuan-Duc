// api/gemini.ts
// Serverless Proxy Function (Tương thích với Vercel / Netlify / Node Server)
// File này chạy trên SERVERLESS BACKEND, không bao giờ gửi API key về trình duyệt của học sinh.

import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // 1. Chỉ chấp nhận phương thức POST từ Frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không hợp lệ. Chỉ chấp nhận POST.' });
  }

  // 2. Lấy GEMINI_API_KEY từ biến môi trường (Environment Variable) bí mật trên Server
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(500).json({
      error: 'Server chưa được cấu hình GEMINI_API_KEY trong biến môi trường an toàn.',
    });
  }

  try {
    const { prompt, systemInstruction } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Thiếu nội dung prompt cần xử lý.' });
    }

    // 3. Gọi Google Gemini API trực tiếp từ Server (trình duyệt học sinh không biết API key)
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction
        ? { systemInstruction: String(systemInstruction) }
        : undefined,
    });

    // 4. Trả kết quả văn bản sạch về cho Frontend
    return res.status(200).json({
      text: response.text || '',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Lỗi tại Serverless Proxy:', error);
    return res.status(500).json({
      error: 'Lỗi từ dịch vụ Gemini: ' + (error.message || 'Lỗi không xác định'),
    });
  }
}
