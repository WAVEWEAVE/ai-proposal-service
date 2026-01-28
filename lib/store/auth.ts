/**
 * Zustand 인증 상태 관리
 * 전역 사용자 상태 및 인증 관련 함수를 관리합니다.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

/**
 * 사용자 타입
 */
interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Auth Store 타입
 */
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  reset: () => Promise<void>;
}

/**
 * Auth Store
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      /**
       * 사용자 설정
       */
      setUser: (user) => set({ user }),

      /**
       * 로딩 상태 설정
       */
      setLoading: (loading) => set({ isLoading: loading }),

      /**
       * 초기화 - 현재 세션 확인
       */
      initialize: async () => {
        try {
          set({ isLoading: true });
          const supabase = createClient();
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error) {
            // 세션 없음은 정상 상황이므로 오류 로그 제거
            if (error.message !== 'Auth session missing!') {
              console.error('[Auth Store] 사용자 조회 실패:', error);
            }
            set({ user: null, isLoading: false });
            return;
          }

          set({ user, isLoading: false });
          console.log('[Auth Store] 사용자 로드 완료:', user?.email);
        } catch (err) {
          console.error('[Auth Store] 초기화 실패:', err);
          set({ user: null, isLoading: false });
        }
      },

      /**
       * 로그아웃 - Supabase 세션 삭제 + 상태 초기화
       */
      reset: async () => {
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            console.error('[Auth Store] 로그아웃 실패:', error);
            throw error;
          }

          // 상태 초기화
          set({ user: null });
          console.log('[Auth Store] 로그아웃 완료');
        } catch (err) {
          console.error('[Auth Store] 로그아웃 중 오류:', err);
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // user만 localStorage에 저장
    }
  )
);
