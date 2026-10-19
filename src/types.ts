export type ExerciseCategory = 
  | 'warmup' // Bài tập khởi động & phát triển chung
  | 'posture' // Chống gù lưng & mỏi cổ vai gáy khi ngồi học
  | 'height' // Tăng chiều cao & kéo giãn cơ thể
  | 'strength' // Rèn luyện thể lực & sức bền
  | 'recess'; // Vận động giải lao 5 phút giữa giờ

export interface ExerciseStep {
  stepNumber: number;
  instruction: string;
  breathingTip?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  level: 'Tiểu học' | 'THCS' | 'THPT' | 'Mọi lứa tuổi';
  durationSeconds: number;
  repsText: string;
  caloriesBurnedApprox: number;
  targetMuscles: string[];
  benefits: string[];
  mistakes: string[];
  steps: ExerciseStep[];
  animationType: 'neck' | 'stretch' | 'jumping_jack' | 'squat' | 'plank' | 'arm_swing' | 'high_knees' | 'back_arch' | 'toe_touch';
  badgeLabel?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  category: ExerciseCategory;
  durationMinutes: number;
  targetAudience: string;
  description: string;
  colorTheme: string;
  exercises: Exercise[];
}

export type FoodCategory = 'carb' | 'protein' | 'fat' | 'vitamin_mineral' | 'hydration' | 'treat';

export interface FoodItem {
  id: string;
  name: string;
  vietnameseName: string;
  category: FoodCategory;
  categoryNameVi: string;
  portion: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  fiberGrams: number;
  rating: 'Tốt' | 'Nên ăn thường xuyên' | 'Nên hạn chế' | 'Ăn vừa phải';
  tipsForStudents: string;
  iconName: string;
}

export interface StudentProfile {
  name: string;
  age: number;
  grade: string;
  gender: 'nam' | 'nu';
  heightCm: number;
  weightKg: number;
  activityLevel: 'low' | 'medium' | 'high';
}

export interface DailyHealthLog {
  date: string; // YYYY-MM-DD
  waterGlasses: number; // Mỗi ly 250ml
  targetWaterGlasses: number;
  completedWorkoutMinutes: number;
  targetWorkoutMinutes: number;
  completedExerciseIds: string[];
  mealsLogged: {
    id: string;
    mealType: 'Sáng' | 'Trưa' | 'Xế' | 'Tối';
    description: string;
    score: number;
  }[];
  notes?: string;
}

export interface AIMealAssessment {
  score: number;
  assessment: string;
  pros: string[];
  cons: string[];
  advice: string;
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  vietnameseTitle?: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  healthScore?: number;
  calories?: number;
  protein?: number | string;
  carbs?: number | string;
  fat?: number | string;
  fiber?: number | string;
  summary?: string;
  dishTypes?: string[];
  diets?: string[];
  sourceUrl?: string;
  studentTag?: string;
  benefitsVi?: string;
  ingredients?: string[];
  instructions?: string[];
}

export interface AIMealItem {
  name: string;
  portion: string;
  caloriesApprox: number;
  proteinApprox?: string;
  keyNutrients: string;
  whyGoodForStudents: string;
  preparationTip?: string;
}

export interface AIMealPlan {
  title: string;
  goal: string;
  targetCalories: number;
  summary: string;
  breakfast: AIMealItem;
  lunch: AIMealItem;
  snack: AIMealItem;
  dinner: AIMealItem;
  hydrationAdvice: string;
  physicalExerciseTip: string;
  source?: string;
}

export interface StudentVisualCard {
  id: string;
  topic: 'running' | 'height' | 'posture' | 'energy' | 'water' | 'recess' | 'pe_test';
  topicLabel: string;
  catchphrase: string;
  tagline: string;
  summary: string;
  steps: string[];
  gradient: string;
  accentColor: string;
  iconName: string;
  studentQuote: string;
  relatableScenario: string;
  likesCount: number;
}

export interface StudentHack {
  id: string;
  question: string;
  relatableProblem: string;
  quickSolution: string;
  whyItWorks: string;
  icon: string;
  badgeTag: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressText: string;
  color: string;
}

export interface KeyPointItem {
  id: string;
  title: string;
  detail: string;
  tag: 'Cốt lõi' | 'Kỹ thuật' | 'An toàn' | 'Dinh dưỡng' | 'Mẹo nhớ' | 'Chiến thuật';
  importance: 'high' | 'medium' | 'normal';
}

export interface ActionStepItem {
  id: string;
  step: string;
  tip?: string;
  completed?: boolean;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface MindmapNode {
  topic: string;
  subtopics: string[];
}

export interface SummaryResult {
  title: string;
  quickDigest: string;
  studentTakeaway: string;
  keyPoints: KeyPointItem[];
  actionItems: ActionStepItem[];
  quizQuestions: QuizQuestionItem[];
  mindmapNodes?: MindmapNode[];
  originalWordCount: number;
  condensedWordCount: number;
  compressionPercentage: number;
  readingTimeMinutes: number;
  sourceType?: 'material' | 'custom' | 'exercise' | 'preset';
  sourceTitle?: string;
  sourceId?: string;
}

export type MaterialCategory = 'equipment' | 'nutrition' | 'guide' | 'practice';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: 'student' | 'teacher' | 'coach' | 'parent';
  roleNameVi: string;
  gradeOrSchool?: string;
  avatarColor: string;
  avatarEmoji: string;
  createdAt: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  category: MaterialCategory;
  categoryNameVi: string;
  description: string;
  quantity: string;
  status: 'available' | 'in_use' | 'need_restock' | 'ready';
  statusLabelVi: string;
  locationOrOrigin: string;
  imageUrl?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatarEmoji?: string;
  createdAt: string;
  updatedAt?: string;
}

export type QuizQuestionType = 'true_false' | 'multiple_choice' | 'fill_blank' | 'short_answer';

export interface PracticeQuestion {
  id: string;
  type: QuizQuestionType;
  typeLabelVi: string;
  question: string;
  options?: string[]; // For multiple_choice (4 items)
  correctOptionIndex?: number; // For multiple_choice (0..3)
  correctBoolean?: boolean; // For true_false
  correctTextAnswer?: string; // For fill_blank
  acceptableAnswers?: string[]; // For fill_blank
  modelAnswer?: string; // For short_answer
  keyConcepts?: string[]; // For short_answer
  explanation: string;
  studyTip?: string;
  curriculumReference?: string;
}

export interface PracticeQuizSet {
  id: string;
  topic: string;
  grade: string;
  subject?: string;
  description?: string;
  questions: PracticeQuestion[];
  createdAt: string;
  totalQuestions: number;
  userBestScore?: {
    score: number;
    total: number;
    completedAt: string;
  };
}

export type QaIntentCategory = 'technique_error' | 'symptom_safety' | 'exam_tip' | 'rule_concept' | 'nutrition_habit';

export interface QaSeedPair {
  id: string;
  studentQuestion: string; // Câu hỏi gợi mở mà học sinh thật sự có thể hỏi
  intentCategory: QaIntentCategory;
  intentLabelVi: string; // "Lỗi kỹ thuật", "Triệu chứng & An toàn", "Mẹo thi thực hành", "Quy tắc & Khái niệm", "Dinh dưỡng & Thể lực"
  shortAnswer: string; // Câu trả lời ngắn ban đầu (1-3 câu, súc tích)
  keywords: string[]; // Từ khóa gợi mở để chatbot bắt ý
  followUpPrompt?: string; // Câu hỏi gợi mở kích hoạt hội thoại ôn bài
  curriculumContext?: string; // Căn cứ bài học SGK
}

export interface QaSeedDataset {
  id: string;
  topic: string;
  grade: string;
  subject?: string;
  purpose: string; // "Q&A seed khởi tạo chuẩn bị cho chatbot hỗ trợ ôn bài ở buổi sau"
  createdAt: string;
  seeds: QaSeedPair[];
  totalSeeds: number;
}

export interface FlashcardItem {
  id: string;
  frontTitle: string;
  frontSubtitle?: string;
  frontCategoryTag: string;
  backDefinition: string;
  backClassification?: string;
  backExample?: string;
  backMemoryTip?: string;
  mastery?: 'unlearned' | 'learning' | 'mastered' | 'review_needed';
}

export interface FlashcardDeck {
  id: string;
  title: string;
  topic: string;
  grade: string;
  subject: string;
  description: string;
  colorTheme?: string;
  createdAt: string;
  cards: FlashcardItem[];
  userMastery?: {
    masteredCount: number;
    total: number;
    lastReviewedAt: string;
  };
}

export interface GroundedSourceItem {
  id: string;
  title: string;
  content: string;
  referenceTag: string;
}

export interface GroundedAnalysisPreview {
  summaryPoints: string[];
  keyTerms: { term: string; definition: string }[];
  commonErrors: string[];
  actionableTips: string[];
}

export interface GroundedStudyPack {
  qaSeeds: { question: string; answer: string; intent?: string }[];
  quizQuestions?: { question: string; answer: string; explanation?: string }[];
  flashcards?: { title: string; definition: string }[];
}

export interface GroundedContextPackage {
  topic: string;
  grade: string;
  subject?: string;
  sources: GroundedSourceItem[];
  analysisPreview: GroundedAnalysisPreview;
  studyPack: GroundedStudyPack;
}

export interface GroundedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isOutOfScope?: boolean;
  groundedSource?: 'sources' | 'analysisPreview' | 'studyPack' | 'out_of_scope';
  sourceCitation?: string;
  suggestedFollowUps?: string[];
}

export interface StudyPackSourceDoc {
  id: string;
  title: string;
  topic: string;
  grade: string;
  subject: string;
  content: string; // Nguồn học liệu gốc không bị thay đổi
  referenceTag: string; // Nguồn SGK hoặc tài liệu tham chiếu
}

export interface StudyPackSummary {
  overview: string;
  keyPoints: string[];
  keyTerms: { term: string; definition: string }[];
  commonErrors: string[];
  actionableTips: string[];
}

export interface StudyPackVersion {
  id: string;
  versionNumber: number; // 1, 2, 3...
  versionTag: string; // "v1", "v2", ...
  versionNote: string; // "Bản gốc khởi tạo", "Re-generated bởi Gemini AI", etc.
  createdAt: string;
  sourceDoc: StudyPackSourceDoc; // Bắt buộc lưu trữ nguồn gốc ban đầu
  summary: StudyPackSummary;
  quiz: PracticeQuestion[];
  flashcards: FlashcardItem[];
  qaSeeds: QaSeedPair[];
}




