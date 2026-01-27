import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * OAuth 콜백 핸들러
 * 구글 등 소셜 로그인 후 리다이렉트되는 엔드포인트
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();  // 👈 여기에 await 추가!
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 세션 생성 성공 - 메인 페이지로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 발생 시 메인 페이지로
  return NextResponse.redirect(`${origin}/`);
}
