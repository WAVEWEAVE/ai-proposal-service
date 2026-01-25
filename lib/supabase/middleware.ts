/**
 * Supabase 미들웨어 헬퍼
 * Next.js 미들웨어에서 Supabase 세션을 관리하기 위한 유틸리티
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * 미들웨어용 Supabase 클라이언트 생성 및 세션 갱신
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 세션 갱신 (쿠키 자동 업데이트)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabaseResponse;
}
