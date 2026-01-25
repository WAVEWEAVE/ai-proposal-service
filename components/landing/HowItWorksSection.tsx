/**
 * 사용 방법 섹션 컴포넌트
 * 7단계 제안서 작성 프로세스를 소개합니다.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

/**
 * 7단계 프로세스
 */
const steps = [
  {
    step: 1,
    title: '제안 대상 및 현황',
    description: '고객사와 해결할 문제를 명확히 정의합니다.',
    questions: 3,
  },
  {
    step: 2,
    title: '서비스 내용 및 프로세스',
    description: '제공할 서비스와 작업 순서를 구체화합니다.',
    questions: 3,
  },
  {
    step: 3,
    title: '전문성 및 실행 역량',
    description: '강점, 경험, 고객 평가를 공유합니다.',
    questions: 3,
  },
  {
    step: 4,
    title: '브랜드 스토리',
    description: '사업 시작 계기와 비전을 전달합니다.',
    questions: 3,
  },
  {
    step: 5,
    title: '기대 효과 및 목표',
    description: '프로젝트 완료 후 성과를 제시합니다.',
    questions: 2,
  },
  {
    step: 6,
    title: '서비스 비용 및 조건',
    description: '가격 구성과 협의 조건을 명시합니다.',
    questions: 2,
  },
  {
    step: 7,
    title: '마무리 및 연결',
    description: '연락 방법과 포트폴리오를 첨부합니다.',
    questions: 1,
  },
];

/**
 * 사용 방법 섹션 컴포넌트
 */
export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            어떻게 작동하나요?
          </h2>
          <p className="text-lg text-muted-foreground">
            7단계 17개 질문으로 완성되는 전문 제안서
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* 단계 번호 */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{step.step}</span>
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {step.questions}개 질문
                      </span>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {/* 완료 체크 (장식용) */}
                  <div className="hidden md:block flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-muted-foreground">
            💡 각 단계는 평균 1-2분이면 충분합니다
          </p>
          <p className="text-sm text-muted-foreground">
            질문 건너뛰기 가능 · 언제든지 저장하고 나중에 이어서 작성
          </p>
        </div>
      </div>
    </section>
  );
};
