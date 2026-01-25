/**
 * AI 스트리밍 결과 표시 컴포넌트
 * 실시간으로 생성되는 제안서를 표시합니다.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface AIStreamingResultProps {
  content: string;
  isStreaming: boolean;
  title?: string;
}

/**
 * AI 스트리밍 결과 컴포넌트
 * 
 * @param content - 현재까지 생성된 제안서 내용
 * @param isStreaming - 스트리밍 진행 중 여부
 * @param title - 제목
 */
export const AIStreamingResult: React.FC<AIStreamingResultProps> = ({
  content,
  isStreaming,
  title = 'AI가 제안서를 작성하고 있습니다...',
}) => {
  return (
    <Card className="h-full border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2">
          {isStreaming && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[600px] w-full rounded-md border p-6 bg-muted/30">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* 스트리밍 중인 내용 */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {content}
            </div>

            {/* 스트리밍 중 커서 표시 */}
            {isStreaming && (
              <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse" />
            )}

            {/* 로딩 스켈레톤 */}
            {isStreaming && content.length === 0 && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 진행 상태 메시지 */}
        {isStreaming && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            💡 잠시만 기다려주세요. 전문적인 제안서를 작성하고 있습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
