/**
 * 생성된 제안서 미리보기 컴포넌트
 * AI가 생성한 제안서를 마크다운 형식으로 표시합니다.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProposalPreviewProps {
  content: string;
  title?: string;
}

/**
 * 제안서 미리보기 컴포넌트
 * 
 * @param content - 제안서 마크다운 내용
 * @param title - 제안서 제목
 */
export const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  content,
  title = '생성된 제안서',
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* 마크다운 렌더링 영역 */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
