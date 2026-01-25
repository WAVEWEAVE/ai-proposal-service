# SEO 이미지 준비 가이드

프로젝트의 SEO를 최적화하기 위해 다음 이미지들을 준비해주세요.

## 필수 이미지

### 1. Open Graph 이미지
- **파일명**: `og-image.png`
- **크기**: 1200 x 630px
- **용도**: 소셜 미디어(Facebook, LinkedIn, Twitter 등)에서 링크 공유 시 표시
- **내용**: 서비스 로고 + 핵심 메시지 ("17개 질문으로 AI 제안서 자동 생성")

### 2. Favicon
- **파일명**: `favicon.ico`
- **크기**: 32 x 32px (또는 16x16, 32x32, 48x48 멀티사이즈)
- **용도**: 브라우저 탭에 표시되는 아이콘

### 3. Apple Touch Icon
- **파일명**: `apple-touch-icon.png`
- **크기**: 180 x 180px
- **용도**: iOS 기기에서 홈 화면에 추가할 때 사용

### 4. Favicon (다양한 크기)
- **파일명**: `favicon-16x16.png`, `favicon-32x32.png`
- **크기**: 각각 16x16px, 32x32px
- **용도**: 다양한 환경에서 최적화된 파비콘 표시

## Web Manifest (선택사항)

PWA 지원을 위한 `site.webmanifest` 파일도 추가할 수 있습니다.

```json
{
  "name": "Proposal Flow",
  "short_name": "Proposal",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

## 이미지 생성 도구 추천

1. **Canva** (https://www.canva.com) - 무료, 템플릿 제공
2. **Figma** (https://www.figma.com) - 무료, 디자인 툴
3. **Favicon Generator** (https://realfavicongenerator.net) - Favicon 자동 생성

## 체크리스트

- [ ] og-image.png (1200 x 630px)
- [ ] favicon.ico (32 x 32px)
- [ ] apple-touch-icon.png (180 x 180px)
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] site.webmanifest (선택사항)

## 참고 사항

- 이미지는 모두 `public` 폴더에 위치해야 합니다
- 파일명은 정확히 일치해야 합니다 (대소문자 구분)
- OG 이미지는 텍스트가 명확하게 보이도록 제작하세요
- 브랜드 컬러를 일관되게 사용하세요
