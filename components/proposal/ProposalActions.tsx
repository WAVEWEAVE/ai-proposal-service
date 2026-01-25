/**
 * 제안서 액션 버튼 컴포넌트
 * 다운로드, 수정, 복사 등의 액션을 제공합니다.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Edit, Copy, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ProposalActionsProps {
  onDownloadMarkdown?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  isGenerating?: boolean;
}

/**
 * 제안서 액션 버튼 컴포넌트
 * 
 * @param onDownloadMarkdown - 마크다운 다운로드 핸들러
 * @param onEdit - 수정 버튼 핸들러
 * @param onCopy - 복사 버튼 핸들러
 * @param isGenerating - 생성 중 여부
 */
export const ProposalActions: React.FC<ProposalActionsProps> = ({
  onDownloadMarkdown,
  onEdit,
  onCopy,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);

  // 복사 핸들러
  const handleCopy = async () => {
    if (onCopy) {
      await onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 수정 버튼 */}
      {onEdit && (
        <Button
          variant="outline"
          size="lg"
          onClick={onEdit}
          disabled={isGenerating}
        >
          <Edit className="w-4 h-4 mr-2" />
          답변 수정하기
        </Button>
      )}

      {/* 복사 버튼 */}
      {onCopy && (
        <Button
          variant="outline"
          size="lg"
          onClick={handleCopy}
          disabled={isGenerating}
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              복사 완료!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              내용 복사
            </>
          )}
        </Button>
      )}

      {/* 마크다운 다운로드 */}
      {onDownloadMarkdown && (
        <Button
          variant="outline"
          size="lg"
          onClick={onDownloadMarkdown}
          disabled={isGenerating}
        >
          <FileText className="w-4 h-4 mr-2" />
          마크다운 다운로드
        </Button>
      )}
    </div>
  );
};
