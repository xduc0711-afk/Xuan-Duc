import { GoogleGenAI } from '@google/genai';
import {
  StudyPackSourceDoc,
  StudyPackVersion,
  StudyPackSummary,
  PracticeQuestion,
  FlashcardItem,
  QaSeedPair
} from '../src/types';
import { summarizeWithGemini } from './summarizerHelper';
import { generateQuizWithGemini } from './quizGeneratorHelper';
import { generateFlashcardsWithGemini } from './flashcardGeneratorHelper';
import { generateQaSeedsWithGemini } from './qaSeedGeneratorHelper';

export interface StudyPackRegenerateRequest {
  sourceDoc: StudyPackSourceDoc;
  versionNumber: number;
  localApiKey?: string;
  versionNote?: string;
}

export async function regenerateStudyPackWithGemini(
  serverAi: GoogleGenAI | null,
  request: StudyPackRegenerateRequest
): Promise<{ version: StudyPackVersion; source: string }> {
  const { sourceDoc, versionNumber, localApiKey, versionNote } = request;

  // If client provided a local API key for this round, instantiate a client with it
  let activeAi = serverAi;
  let sourceLabel = serverAi ? 'gemini-server-key' : 'curated-offline-fallback';

  if (localApiKey && typeof localApiKey === 'string' && localApiKey.trim().length > 10) {
    try {
      activeAi = new GoogleGenAI({ apiKey: localApiKey.trim() });
      sourceLabel = 'gemini-local-key';
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI with localApiKey, falling back to server key', e);
    }
  }

  const topic = sourceDoc.topic || sourceDoc.title;
  const grade = sourceDoc.grade || 'Lớp 8';
  const subject = sourceDoc.subject || 'Giáo dục Thể chất';
  const content = sourceDoc.content;

  try {
    // Run all 4 generators in parallel: Summary, Quiz, Flashcards, Q&A Seeds
    const [summaryResult, quizResult, flashcardResult, qaSeedResult] = await Promise.all([
      summarizeWithGemini(activeAi, {
        text: content,
        title: sourceDoc.title,
        depth: 'standard',
        audience: 'student',
      }),
      generateQuizWithGemini(activeAi, {
        topic,
        grade,
        subject,
        questionCount: 5
      }),
      generateFlashcardsWithGemini(activeAi, {
        topic,
        grade,
        subject,
        cardCount: 5
      }),
      generateQaSeedsWithGemini(activeAi, {
        topic,
        grade,
        subject,
        seedCount: 5
      })
    ]);

    const summary: StudyPackSummary = {
      overview: summaryResult.quickDigest || summaryResult.studentTakeaway || 'Tóm tắt bài học',
      keyPoints: summaryResult.keyPoints.map(kp => `${kp.title}: ${kp.detail}`),
      keyTerms: summaryResult.keyPoints.map(kp => ({
        term: kp.title,
        definition: kp.detail
      })),
      commonErrors: summaryResult.keyPoints.filter(kp => kp.tag === 'An toàn' || kp.tag === 'Kỹ thuật').map(kp => kp.detail),
      actionableTips: summaryResult.actionItems.map(ai => ai.tip ? `${ai.step} (Mẹo: ${ai.tip})` : ai.step)
    };

    const newVersion: StudyPackVersion = {
      id: `spv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      versionNumber,
      versionTag: `v${versionNumber}`,
      versionNote: versionNote || `Re-generated bởi Gemini AI (${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})`,
      createdAt: new Date().toISOString(),
      // CRITICAL: Preserve original source document completely intact!
      sourceDoc: {
        id: sourceDoc.id || `src_${Date.now()}`,
        title: sourceDoc.title,
        topic: sourceDoc.topic,
        grade: sourceDoc.grade,
        subject: sourceDoc.subject,
        content: sourceDoc.content,
        referenceTag: sourceDoc.referenceTag || 'Học liệu gốc ban đầu'
      },
      summary,
      quiz: quizResult.questions,
      flashcards: flashcardResult.cards,
      qaSeeds: qaSeedResult.seeds
    };

    return {
      version: newVersion,
      source: sourceLabel
    };
  } catch (error: any) {
    console.error('Error in regenerateStudyPackWithGemini, using offline fallback', error);

    // Fallback generation
    const [summaryResult, quizResult, flashcardResult, qaSeedResult] = await Promise.all([
      summarizeWithGemini(null, {
        text: content,
        title: sourceDoc.title,
        depth: 'standard',
        audience: 'student',
      }),
      generateQuizWithGemini(null, { topic, grade, subject }),
      generateFlashcardsWithGemini(null, { topic, grade, subject }),
      generateQaSeedsWithGemini(null, { topic, grade, subject })
    ]);

    const summary: StudyPackSummary = {
      overview: summaryResult.quickDigest || summaryResult.studentTakeaway || 'Tóm tắt bài học',
      keyPoints: summaryResult.keyPoints.map(kp => `${kp.title}: ${kp.detail}`),
      keyTerms: summaryResult.keyPoints.map(kp => ({
        term: kp.title,
        definition: kp.detail
      })),
      commonErrors: summaryResult.keyPoints.filter(kp => kp.tag === 'An toàn' || kp.tag === 'Kỹ thuật').map(kp => kp.detail),
      actionableTips: summaryResult.actionItems.map(ai => ai.tip ? `${ai.step} (Mẹo: ${ai.tip})` : ai.step)
    };

    const fallbackVersion: StudyPackVersion = {
      id: `spv_fb_${Date.now()}`,
      versionNumber,
      versionTag: `v${versionNumber}`,
      versionNote: versionNote || `Tái tạo chuẩn sư phạm GDPT (v${versionNumber})`,
      createdAt: new Date().toISOString(),
      sourceDoc: { ...sourceDoc },
      summary,
      quiz: quizResult.questions,
      flashcards: flashcardResult.cards,
      qaSeeds: qaSeedResult.seeds
    };

    return {
      version: fallbackVersion,
      source: 'curated-offline-fallback'
    };
  }
}
