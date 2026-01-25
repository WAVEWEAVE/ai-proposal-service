/**
 * Supabase Database Types
 * schema.sql에서 생성된 테이블 구조를 TypeScript 타입으로 정의
 */

export type ProposalStatus = 'draft' | 'completed';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  title: string;
  expertise: string;
  industry: string;
  answers: Record<string, string>;
  content: string | null;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      proposals: {
        Row: Proposal;
        Insert: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Proposal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
