/**
 * 메인 페이지 헤더 컴포넌트
 * 서비스 로고, 사용자 정보, 로그아웃 버튼을 표시합니다.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  user?: {
    email: string;
    name?: string;
  } | null;
  onLogout?: () => void;
}

/**
 * 헤더 컴포넌트
 * 
 * @param user - 현재 로그인한 사용자 정보 (null이면 비로그인 상태)
 * @param onLogout - 로그아웃 핸들러
 */
export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Proposal Flow</span>
        </Link>

        {/* 네비게이션 & 사용자 정보 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* 사용자 정보 */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name || '사용자'}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>

              {/* 모바일 사용자 아이콘 */}
              <div className="md:hidden">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* 로그아웃 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </>
          ) : (
            <>
              {/* 비로그인 상태 */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">시작하기</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
