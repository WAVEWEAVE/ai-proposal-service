/**
 * 주요 기능 섹션 컴포넌트
 * 서비스의 핵심 기능을 소개합니다.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Sparkles, Shield } from 'lucide-react';

/**
 * 주요 기능 목록
 */
const features = [
  {
    icon: MessageSquare,
    title: '단계별 질문 가이드',
    description: '17개의 체계적인 질문으로 논리적인 제안 구조를 설계합니다. 한 번에 하나씩, 부담 없이 진행하세요.',
    color: 'text-blue-600',
  },
  {
    icon: Sparkles,
    title: 'AI 자동 생성',
    description: 'Claude AI가 답변을 분석하여 전문적인 비즈니스 문체로 변환합니다. "보내도 되는 수준"의 고퀄리티를 보장합니다.',
    color: 'text-primary',
  },
  {
    icon: Sparkles,
    title: '원클릭 복사',
    description: '완성된 제안서를 클릭 한 번으로 복사하세요. 이메일, 슬랙, 노션 등 어디든 즉시 붙여넣어 업무 속도를 높입니다.',
    color: 'text-green-600',
  },
  {
    icon: Shield,
    title: '개인 히스토리 관리',
    description: '작성한 제안서를 안전하게 저장하고 관리합니다. 언제든지 불러와 수정하고 재사용하세요.',
    color: 'text-orange-600',
  },
];

/**
 * 주요 기능 섹션 컴포넌트
 */
export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            왜 Proposal Flow인가요?
          </h2>
          <p className="text-lg text-muted-foreground">
            프리랜서와 1인 기업가를 위해 설계된 강력한 기능들
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
