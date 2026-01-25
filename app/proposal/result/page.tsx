/**
 * 제안서 생성 결과 페이지
 * AI가 생성한 제안서를 실시간 스트리밍으로 표시
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Copy, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { EXAMPLE_ANSWERS, EXAMPLE_PROPOSAL } from '@/components/proposal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * 제안서 결과 페이지 컴포넌트
 */
const ProposalResultPage = () => {
  const router = useRouter();
  const [proposalData, setProposalData] = useState<{
    answers: Record<string, string>;
    quickStart?: { expertise: string; industry: string };
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [proposalContent, setProposalContent] = useState('');

  /**
   * sessionStorage에서 제안서 데이터 로드
   */
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem('proposal-answers');
    const quickStart = sessionStorage.getItem('quick-start-data');

    if (!savedAnswers) {
      toast.error('제안서 데이터가 없습니다.');
      router.push('/proposal/new');
      return;
    }

    try {
      const answers = JSON.parse(savedAnswers);
      const quickStartData = quickStart ? JSON.parse(quickStart) : null;
      setProposalData({ answers, quickStart: quickStartData });
    } catch (error) {
      console.error('[데이터 로드 실패]', error);
      toast.error('데이터 로드에 실패했습니다.');
      router.push('/proposal/new');
    }
  }, [router]);

  /**
   * 예시 답변인지 확인하는 함수
   */
  const isExampleAnswers = (answers: Record<string, string>): boolean => {
    // 예시 답변과 비교 (최소 5개 이상 일치하면 예시로 간주)
    let matchCount = 0;
    const keys = Object.keys(EXAMPLE_ANSWERS);
    
    for (const key of keys) {
      if (answers[key] === EXAMPLE_ANSWERS[key]) {
        matchCount++;
      }
    }
    
    return matchCount >= 5;
  };

  /**
   * AI 제안서 생성 또는 캐싱된 예시 제안서 사용
   */
  useEffect(() => {
    if (!proposalData) return;

    // 예시 답변인지 확인
    if (isExampleAnswers(proposalData.answers)) {
      console.log('[예시 제안서 로드]', '캐싱된 제안서 사용 - API 호출 없음');
      toast.info('예시 제안서를 불러옵니다...');
      
      // 캐싱된 제안서를 타이핑 효과와 함께 표시
      let index = 0;
      const typingSpeed = 5; // ms per character
      
      const typeWriter = () => {
        if (index < EXAMPLE_PROPOSAL.length) {
          setProposalContent(EXAMPLE_PROPOSAL.substring(0, index + 1));
          index++;
          setTimeout(typeWriter, typingSpeed);
        } else {
          setIsGenerating(false);
          toast.success('제안서 생성 완료!');
        }
      };
      
      typeWriter();
      return;
    }

    // 일반 답변인 경우 AI API 호출
    const generateProposal = async () => {
      try {
        console.log('[AI 제안서 생성 시작]', proposalData);
        
        const response = await fetch('/api/generate-proposal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(proposalData),
        });

        console.log('[API 응답 상태]', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[API 응답 오류]', response.status, errorText);
          throw new Error(`API 요청 실패 (${response.status}): ${errorText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('스트림 읽기 실패');
        }

        let content = '';
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('[스트리밍 완료]', { 
              totalChunks: chunkCount, 
              contentLength: content.length,
              preview: content.substring(0, 200)
            });
            setIsGenerating(false);
            
            if (content.length === 0) {
              toast.error('AI 응답이 비어있습니다. 다시 시도해주세요.');
            } else {
              toast.success('제안서 생성 완료!');
            }
            break;
          }

          const chunk = decoder.decode(value);
          chunkCount++;
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const jsonStr = line.slice(2);
                const parsed = JSON.parse(jsonStr);
                if (parsed && typeof parsed === 'string') {
                  content += parsed;
                  setProposalContent(content);
                  
                  // 첫 청크 로깅
                  if (chunkCount === 1) {
                    console.log('[첫 번째 청크]', parsed);
                  }
                }
              } catch (e) {
                console.warn('[JSON 파싱 실패]', line.substring(0, 100));
              }
            }
          }
        }
      } catch (error) {
        console.error('[제안서 생성 오류]', error);
        toast.error('제안서 생성 중 오류가 발생했습니다.');
        setIsGenerating(false);
      }
    };

    generateProposal();
  }, [proposalData]);


  /**
   * 내용 복사
   */
  const handleCopy = () => {
    if (!proposalContent) return;

    navigator.clipboard.writeText(proposalContent);
    toast.success('제안서 내용이 복사되었습니다.');
  };

  // 로딩 중일 때
  if (!proposalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* 상단 네비게이션 */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                홈으로 돌아가기
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              {!isGenerating && proposalContent && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    복사
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 헤더 */}
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">AI 제안서</h1>
            </div>
            {proposalData.quickStart && (
              <p className="text-muted-foreground">
                {proposalData.quickStart.expertise} · {proposalData.quickStart.industry}
              </p>
            )}
          </div>

          {/* 제안서 내용 카드 */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isGenerating && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                {isGenerating ? '제안서 생성 중...' : '생성 완료'}
              </CardTitle>
              <CardDescription>
                {isGenerating
                  ? 'AI가 전문적인 제안서를 작성하고 있습니다.'
                  : '제안서가 성공적으로 생성되었습니다.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                {isGenerating && !proposalContent && (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      AI가 제안서를 작성하고 있습니다...
                    </p>
                  </div>
                )}

                {proposalContent && (
                  <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                    <style jsx global>{`
                      .prose {
                        line-height: 1.8;
                      }
                      .prose h1 {
                        font-size: 1.875rem;
                        font-weight: 700;
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                        color: #1a1a1a;
                      }
                      .prose h2 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                        color: #2d2d2d;
                      }
                      .prose p {
                        margin-bottom: 1.25rem;
                        line-height: 1.8;
                      }
                      .prose strong {
                        font-weight: 600;
                        color: #1a1a1a;
                      }
                      .prose ul {
                        margin-top: 1rem;
                        margin-bottom: 1.5rem;
                        padding-left: 1.5rem;
                      }
                      .prose li {
                        margin-bottom: 0.5rem;
                        line-height: 1.7;
                      }
                      .prose blockquote {
                        border-left: 3px solid #6366f1;
                        padding-left: 1rem;
                        margin: 1.5rem 0;
                        font-style: normal;
                      }
                    `}</style>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p style={{marginBottom: '1.25rem', lineHeight: '1.8'}} {...props} />,
                        h1: ({node, ...props}) => <h1 style={{fontSize: '1.875rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem'}} {...props} />,
                        h2: ({node, ...props}) => <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem'}} {...props} />,
                        strong: ({node, ...props}) => <strong style={{fontWeight: 600}} {...props} />,
                        ul: ({node, ...props}) => <ul style={{marginTop: '1rem', marginBottom: '1.5rem', paddingLeft: '1.5rem'}} {...props} />,
                        li: ({node, ...props}) => <li style={{marginBottom: '0.5rem', lineHeight: '1.7'}} {...props} />,
                      }}
                    >
                      {proposalContent}
                    </ReactMarkdown>
                    {isGenerating && (
                      <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse" />
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 하단 안내 */}
          {!isGenerating && proposalContent && (
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>💡 생성된 제안서를 이메일에 바로 붙여넣기 할 수 있습니다.</p>
              <p>📄 [복사] 버튼으로 클립보드에 복사 → 이메일 본문에 붙여넣기</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalResultPage;
