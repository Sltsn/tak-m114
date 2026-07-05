import { create } from 'zustand';

interface SimilarCase {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  diagnosis: string;
  status: 'çözüldü' | 'devam ediyor' | 'beklemede';
}

interface ProgressLog {
  status: string;
  note: string;
  date: Date;
}

interface AnalysisResult {
  id: string;
  imageUrl: string;
  diagnosis: string;
  solutions: string[];
  similarCases: SimilarCase[];
  isPublic: boolean;
  createdAt: Date;
  progressLog?: ProgressLog[];
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  isAnalyzing: boolean;
  analyzeImage: (file: File, isPublic: boolean) => Promise<void>;
  clearCurrentAnalysis: () => void;
  updatePlantStatus: (id: string, status: string, note: string) => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  currentAnalysis: null,
  history: [],
  isAnalyzing: false,

  analyzeImage: async (file, isPublic) => {
    set({ isAnalyzing: true });
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const result: AnalysisResult = {
      id: Date.now().toString(),
      imageUrl: URL.createObjectURL(file),
      diagnosis: 'Yaprak Yanıklığı (Fungal Enfeksiyon)',
      solutions: [
        'Enfekte yaprakları hemen budayın ve imha edin',
        'Bakır bazlı fungisit uygulayın (7-10 gün arayla 3 uygulama)',
        'Sulama sıklığını azaltın, yaprakları ıslatmaktan kaçının',
        'Hava sirkülasyonunu artırmak için bitkileri seyreltin',
      ],
      similarCases: [
        {
          id: '1',
          userId: 'u1',
          userName: 'Ahmet Yılmaz',
          userAvatar: '👨‍🌾',
          diagnosis: 'Yaprak Yanıklığı',
          status: 'çözüldü',
        },
        {
          id: '2',
          userId: 'u2',
          userName: 'Fatma Demir',
          userAvatar: '🌾',
          diagnosis: 'Yaprak Yanıklığı',
          status: 'devam ediyor',
        },
      ],
      isPublic,
      createdAt: new Date(),
    };

    set(state => ({
      currentAnalysis: result,
      history: [result, ...state.history],
      isAnalyzing: false,
    }));
  },

  clearCurrentAnalysis: () => set({ currentAnalysis: null }),

  updatePlantStatus: (id, status, note) => {
    set(state => ({
      history: state.history.map(item =>
        item.id === id
          ? { ...item, progressLog: [...(item.progressLog || []), { status, note, date: new Date() }] }
          : item
      ),
    }));
  },
}));
