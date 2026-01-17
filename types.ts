
export type ErenMood = 'neutral' | 'intense' | 'dark' | 'epic';
export type AssistantMode = 'محقق' | 'أوتاكو' | 'صديق' | 'لعبة';
export type AppTheme = 'إيرين' | 'ساكورا' | 'ليل' | 'محيط';

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
  mood?: ErenMood;
}

export interface UserPrefs {
  theme: AppTheme;
  mode: AssistantMode;
  userName: string;
}

export enum AppStatus {
  GREETING = 'greeting',
  CHAT = 'chat'
}
