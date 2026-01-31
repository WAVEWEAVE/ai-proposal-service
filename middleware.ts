/**
 * Next.js 미들웨어 - 라우트 보호 및 인증 검증
 * /proposal 경로는 인증된 사용자만 접근 가능
 */

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Supabase 세션 갱신 및 사용자 정보 가져오기
  const { response, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // /proposal 경로 보호
  if (pathname.startsWith('/proposal')) {
    // 사용자가 로그인하지 않은 경우
    if (!user) {
      console.log('[미들웨어] 인증되지 않은 접근 차단:', pathname);
      
      // /login으로 리다이렉트 (원래 요청한 경로를 쿼리 파라미터로 전달)
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(loginUrl);
    }

    console.log('[미들웨어] 인증된 접근 허용:', { pathname, userId: user.id });
  }

  return response;
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 경로에서 미들웨어 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - public 폴더의 파일들 (.svg, .png 등)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
