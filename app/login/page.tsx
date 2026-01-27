/**
 * 로그인 페이지
 * 이메일/비밀번호를 사용하여 Supabase Auth로 로그인합니다.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

/**
 * 로그인 폼 데이터 타입
 */
interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 로그인 페이지 컴포넌트
 */
const LoginPage = () => {
  const router = useRouter();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * 입력 필드 변경 핸들러
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 초기화
    if (error) setError('');
  };

  /**
   * 이메일 유효성 검사
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * 로그인 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 기본 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    if (!validateEmail(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 비밀번호 공백 방지
    if (formData.password.trim() !== formData.password) {
      setError('비밀번호에 공백이 포함되어 있습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Supabase Auth 로그인
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('[로그인 오류]', signInError);
        
        // 사용자 친화적 오류 메시지
        if (signInError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.');
        } else {
          setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        return;
      }

      console.log('[로그인 성공]', {
        email: formData.email,
        user: data.user,
        session: data.session,
      });

      // 로그인 상태 저장 (임시 - Supabase 세션이 자동 관리함)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);

      // 메인 페이지로 이동
      router.push('/');
      router.refresh(); // 서버 컴포넌트 새로고침
    } catch (err) {
      console.error('[로그인 실패]', err);
      setError('예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 서비스 로고 및 소개 */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Proposal Flow</h1>
            <p className="text-muted-foreground text-sm">
              AI 기반 제안서 빌더로 영업의 심리적 장벽을 제거하세요
            </p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하여 제안서 작성을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    로그인
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* 회원가입 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                아직 계정이 없으신가요?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
                >
                  회원가입
                </Link>
              </p>
            </div>

            {/* 비밀번호 찾기 (선택사항) */}
            <div className="mt-4 text-center">
              <Link
                href="/reset-password"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <p className="text-center text-xs text-muted-foreground">
          로그인하면{' '}
          <Link href="/terms" className="underline underline-offset-2">
            이용약관
          </Link>{' '}
          및{' '}
          <Link href="/privacy" className="underline underline-offset-2">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
