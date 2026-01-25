/**
 * Supabase 제안서 CRUD 유틸리티
 */

import { createClient } from './client';
import type { Proposal, ProposalStatus } from './types';

/**
 * CREATE: 제안서 생성
 */
export async function createProposal(data: {
  title: string;
  expertise: string;
  industry: string;
  answers: Record<string, string>;
  content?: string;
  status?: ProposalStatus;
}): Promise<{ data: Proposal | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[인증 오류]', userError);
      return { data: null, error: '로그인이 필요합니다.' };
    }

    // 제안서 생성
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        user_id: user.id,
        title: data.title,
        expertise: data.expertise,
        industry: data.industry,
        answers: data.answers,
        content: data.content || null,
        status: data.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('[제안서 생성 실패]', error);
      
      if (error.message.includes('JWT')) {
        return { data: null, error: '세션이 만료되었습니다. 다시 로그인해주세요.' };
      }
      
      return { data: null, error: '제안서 생성에 실패했습니다.' };
    }

    console.log('[제안서 생성 성공]', proposal.id);
    return { data: proposal, error: null };
  } catch (err) {
    console.error('[제안서 생성 예외]', err);
    return { data: null, error: '예상치 못한 오류가 발생했습니다.' };
  }
}

/**
 * READ: 내 제안서 목록 조회
 */
export async function getMyProposals(options?: {
  status?: ProposalStatus | 'all';
  searchKeyword?: string;
  limit?: number;
}): Promise<{ data: Proposal[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[인증 오류]', userError);
      return { data: null, error: '로그인이 필요합니다.' };
    }

    // 쿼리 빌더
    let query = supabase
      .from('proposals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 필터: 상태
    if (options?.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }

    // 필터: 검색 (제목)
    if (options?.searchKeyword && options.searchKeyword.trim()) {
      query = query.ilike('title', `%${options.searchKeyword}%`);
    }

    // 제한
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[제안서 조회 실패]', error);
      
      if (error.message.includes('JWT')) {
        return { data: null, error: '세션이 만료되었습니다. 다시 로그인해주세요.' };
      }
      
      return { data: null, error: '제안서를 불러오는데 실패했습니다.' };
    }

    console.log('[제안서 조회 성공]', data.length, '개');
    return { data, error: null };
  } catch (err) {
    console.error('[제안서 조회 예외]', err);
    
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return { data: null, error: '네트워크 연결을 확인해주세요.' };
    }
    
    return { data: null, error: '예상치 못한 오류가 발생했습니다.' };
  }
}

/**
 * READ: 단일 제안서 조회
 */
export async function getProposal(id: string): Promise<{ data: Proposal | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[인증 오류]', userError);
      return { data: null, error: '로그인이 필요합니다.' };
    }

    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('[제안서 조회 실패]', error);
      
      if (error.code === 'PGRST116') {
        return { data: null, error: '제안서를 찾을 수 없습니다.' };
      }
      
      if (error.message.includes('JWT')) {
        return { data: null, error: '세션이 만료되었습니다. 다시 로그인해주세요.' };
      }
      
      return { data: null, error: '제안서 조회에 실패했습니다.' };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[제안서 조회 예외]', err);
    return { data: null, error: '예상치 못한 오류가 발생했습니다.' };
  }
}

/**
 * UPDATE: 제안서 수정
 */
export async function updateProposal(
  id: string,
  updates: {
    title?: string;
    expertise?: string;
    industry?: string;
    answers?: Record<string, string>;
    content?: string;
    status?: ProposalStatus;
  }
): Promise<{ data: Proposal | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[인증 오류]', userError);
      return { data: null, error: '로그인이 필요합니다.' };
    }

    // 소유권 확인
    const { data: existing } = await supabase
      .from('proposals')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return { data: null, error: '제안서를 찾을 수 없습니다.' };
    }

    if (existing.user_id !== user.id) {
      return { data: null, error: '수정 권한이 없습니다.' };
    }

    // 업데이트
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[제안서 수정 실패]', error);
      
      if (error.message.includes('JWT')) {
        return { data: null, error: '세션이 만료되었습니다. 다시 로그인해주세요.' };
      }
      
      return { data: null, error: '제안서 수정에 실패했습니다.' };
    }

    console.log('[제안서 수정 성공]', id);
    return { data, error: null };
  } catch (err) {
    console.error('[제안서 수정 예외]', err);
    return { data: null, error: '예상치 못한 오류가 발생했습니다.' };
  }
}

/**
 * DELETE: 제안서 삭제
 */
export async function deleteProposal(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[인증 오류]', userError);
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // 소유권 확인
    const { data: existing } = await supabase
      .from('proposals')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return { success: false, error: '제안서를 찾을 수 없습니다.' };
    }

    if (existing.user_id !== user.id) {
      return { success: false, error: '삭제 권한이 없습니다.' };
    }

    // 삭제
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[제안서 삭제 실패]', error);
      
      if (error.message.includes('JWT')) {
        return { success: false, error: '세션이 만료되었습니다. 다시 로그인해주세요.' };
      }
      
      return { success: false, error: '제안서 삭제에 실패했습니다.' };
    }

    console.log('[제안서 삭제 성공]', id);
    return { success: true, error: null };
  } catch (err) {
    console.error('[제안서 삭제 예외]', err);
    return { success: false, error: '예상치 못한 오류가 발생했습니다.' };
  }
}
