/**
 * 회원가입 페이지
 * 이메일/비밀번호를 사용하여 Supabase Auth로 계정을 생성합니다.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, User, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

/**
 * 회원가입 폼 데이터 타입
 */
interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

/**
 * 회원가입 페이지 컴포넌트
 */
const SignupPage = () => {
  const router = useRouter();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
   * 비밀번호 유효성 검사
   */
  const validatePassword = (): boolean => {
    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  /**
   * 회원가입 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 기본 유효성 검사
    if (!formData.fullName || !formData.email || !formData.password || !formData.passwordConfirm) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 이름 유효성 검사
    if (formData.fullName.trim().length < 2) {
      setError('이름은 최소 2자 이상 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    if (!validateEmail(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Supabase Auth 회원가입
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        console.error('[회원가입 오류]', signUpError);
        
        // 사용자 친화적 오류 메시지
        if (signUpError.message.includes('User already registered')) {
          setError('이미 가입된 이메일입니다. 로그인을 시도해주세요.');
        } else if (signUpError.message.includes('Password should be at least')) {
          setError('비밀번호는 최소 8자 이상이어야 합니다.');
        } else if (signUpError.message.includes('Invalid email')) {
          setError('유효하지 않은 이메일 형식입니다.');
        } else {
          setError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        return;
      }

      console.log('[회원가입 성공]', {
        email: formData.email,
        user: data.user,
        session: data.session,
      });

      // 자동 로그인 처리 (임시)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);

      setSuccess(true);

      // 이메일 확인이 필요한 경우 체크
      if (data.user && !data.session) {
        // 이메일 확인 필요
        console.log('[이메일 확인 필요]');
        // 이메일 확인 안내 메시지는 success 화면에서 처리
      }

      // 메인 페이지로 이동
      setTimeout(() => {
        router.push('/');
        router.refresh(); // 서버 컴포넌트 새로고침
      }, 2000); // 성공 메시지 보여주고 2초 후 이동
    } catch (err) {
      console.error('[회원가입 실패]', err);
      setError('예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 성공 화면
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <Card className="w-full max-w-md border-2 shadow-xl">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">회원가입 완료!</h2>
              <p className="text-muted-foreground">
                {formData.email}로 가입되었습니다.
                <br />
                잠시 후 대시보드로 이동합니다...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
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
              전문적인 제안서를 AI로 간편하게 작성하세요
            </p>
          </div>
        </div>

        {/* 회원가입 폼 */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>
              무료로 계정을 만들고 제안서 작성을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="fullName">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="홍길동"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

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
                    placeholder="최소 8자 이상"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 h-11"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  안전한 비밀번호를 위해 최소 8자 이상 입력해주세요
                </p>
              </div>

              {/* 비밀번호 확인 입력 */}
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.passwordConfirm}
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

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    계정 생성 중...
                  </>
                ) : (
                  <>
                    무료로 시작하기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
                >
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        
        {/* 푸터 */}
        <p className="text-center text-xs text-muted-foreground">
          가입하면{' '}
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

export default SignupPage;
