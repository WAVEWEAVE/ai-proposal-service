/**
 * Supabase 인증 유틸리티 함수
 */

import { createClient } from './client';

/**
 * 로그아웃 함수
 * Supabase 세션을 제거하고 사용자를 로그아웃합니다.
 * 
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[로그아웃 오류]', error);
      return {
        success: false,
        error: '로그아웃 중 오류가 발생했습니다.',
      };
    }

    // 로컬 스토리지 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
    }

    console.log('[로그아웃 성공]');
    return { success: true };
  } catch (err) {
    console.error('[로그아웃 실패]', err);
    return {
      success: false,
      error: '예상치 못한 오류가 발생했습니다.',
    };
  }
}

/**
 * 현재 사용자 세션 가져오기
 * 
 * @returns Promise<User | null>
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[사용자 조회 오류]', error);
      return null;
    }

    return user;
  } catch (err) {
    console.error('[사용자 조회 실패]', err);
    return null;
  }
}

/**
 * 현재 세션 가져오기
 * 
 * @returns Promise<Session | null>
 */
export async function getSession() {
  try {
    const supabase = createClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[세션 조회 오류]', error);
      return null;
    }

    return session;
  } catch (err) {
    console.error('[세션 조회 실패]', err);
    return null;
  }
}
