# Pretendard 폰트 설치 가이드

PDF 생성 기능을 사용하려면 Pretendard 폰트 파일을 이 폴더에 추가해야 합니다.

## 📥 다운로드 방법

### 1. GitHub에서 다운로드

1. [Pretendard GitHub 릴리즈 페이지](https://github.com/orioncactus/pretendard/releases/latest) 방문
2. **Assets** 섹션에서 `Pretendard-X.X.X.zip` 다운로드
   - 최신 버전: v1.3.9
   - 직접 링크: https://github.com/orioncactus/pretendard/releases/download/v1.3.9/Pretendard-1.3.9.zip
3. 압축 해제

### 2. 필요한 폰트 파일 복사

압축을 풀면 여러 폴더가 나옵니다. 다음 파일들을 이 폴더(`public/fonts/`)에 복사하세요:

**경로**: `Pretendard-1.3.9/public/static/` 폴더에서

```
✅ 필수 파일:
- Pretendard-Regular.ttf      (일반 텍스트용)
- Pretendard-SemiBold.ttf     (강조 텍스트용)
- Pretendard-Bold.ttf          (볼드 텍스트용)
```

### 3. 최종 폴더 구조

```
public/
└── fonts/
    ├── Pretendard-Regular.ttf     ✅
    ├── Pretendard-SemiBold.ttf    ✅
    ├── Pretendard-Bold.ttf        ✅
    └── README.md                  (이 파일)
```

## ⚡ 빠른 다운로드 (PowerShell)

터미널에서 다음 명령어를 실행하여 자동으로 다운로드할 수 있습니다:

```powershell
# 1. 현재 위치로 이동
cd "c:\Users\qwer1\proposal service\proposal-service\public\fonts"

# 2. 압축 파일 다운로드
Invoke-WebRequest -Uri "https://github.com/orioncactus/pretendard/releases/download/v1.3.9/Pretendard-1.3.9.zip" -OutFile "Pretendard.zip"

# 3. 압축 해제
Expand-Archive -Path "Pretendard.zip" -DestinationPath "." -Force

# 4. 필요한 파일만 복사
Copy-Item "Pretendard-1.3.9/public/static/Pretendard-Regular.ttf" -Destination "."
Copy-Item "Pretendard-1.3.9/public/static/Pretendard-SemiBold.ttf" -Destination "."
Copy-Item "Pretendard-1.3.9/public/static/Pretendard-Bold.ttf" -Destination "."

# 5. 정리
Remove-Item "Pretendard.zip"
Remove-Item "Pretendard-1.3.9" -Recurse
```

## 🔍 설치 확인

폰트 파일이 제대로 설치되었는지 확인:

```powershell
Get-ChildItem "c:\Users\qwer1\proposal service\proposal-service\public\fonts" -Filter "*.ttf"
```

3개의 `.ttf` 파일이 표시되어야 합니다.

## 🚀 개발 서버 재시작

폰트 파일을 추가한 후:

1. 개발 서버 중지 (Ctrl+C)
2. 개발 서버 재시작: `npm run dev`

## ⚠️ 주의사항

- 폰트 파일이 없으면 PDF 생성 시 오류가 발생합니다
- 파일명이 정확히 일치해야 합니다 (대소문자 구분)
- `.ttf` 파일만 사용하세요 (`.otf`, `.woff` 등은 @react-pdf/renderer에서 지원하지 않음)

## 📝 라이센스

Pretendard는 SIL Open Font License 1.1 라이센스입니다.
상업적/비상업적 용도로 자유롭게 사용 가능합니다.

- 공식 홈페이지: https://cactus.tistory.com/306
- GitHub: https://github.com/orioncactus/pretendard
