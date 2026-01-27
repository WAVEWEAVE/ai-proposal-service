# Google 소셜 로그인 설정 가이드

구글 로그인 기능을 활성화하려면 Supabase에서 Google OAuth를 설정해야 합니다.

## 1. Google Cloud Console 설정

### 1단계: 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 2단계: OAuth 동의 화면 구성
1. 왼쪽 메뉴 → **API 및 서비스** → **OAuth 동의 화면**
2. User Type: **외부** 선택
3. 앱 정보 입력:
   - 앱 이름: `Proposal Flow`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처: 본인 이메일
4. 저장 후 계속

### 3단계: OAuth 클라이언트 ID 생성
1. 왼쪽 메뉴 → **사용자 인증 정보**
2. **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `Proposal Flow Web`
5. **승인된 리디렉션 URI** 추가:
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
   (YOUR_SUPABASE_PROJECT를 실제 Supabase 프로젝트 참조 ID로 변경)
6. 생성 클릭
7. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사 (나중에 사용)

---

## 2. Supabase 설정

### 1단계: Authentication 설정
1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴 → **Authentication** → **Providers**
4. **Google** 찾아서 클릭

### 2단계: Google OAuth 활성화
1. **Enable Sign in with Google** 토글 켜기
2. Google Cloud Console에서 복사한 정보 입력:
   - **Client ID**: 복사한 클라이언트 ID 붙여넣기
   - **Client Secret**: 복사한 클라이언트 보안 비밀 붙여넣기
3. **Save** 클릭

### 3단계: Redirect URL 확인
Supabase가 제공하는 **Callback URL**을 확인:
```
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

이 URL이 Google Cloud Console의 **승인된 리디렉션 URI**와 일치하는지 확인!

---

## 3. 로컬 개발 설정 (선택사항)

로컬 개발 환경에서도 테스트하려면:

### Google Cloud Console에 추가
승인된 리디렉션 URI에 추가:
```
http://localhost:3000/auth/callback
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

---

## 4. 테스트

1. 개발 서버 실행: `npm run dev`
2. 로그인 페이지(`/login`) 또는 회원가입 페이지(`/signup`) 접속
3. **"Google로 로그인"** 버튼 클릭
4. Google 계정 선택 및 권한 승인
5. 자동으로 메인 페이지(`/`)로 리다이렉트

---

## 5. 문제 해결

### "Redirect URI mismatch" 오류
- Google Cloud Console의 리디렉션 URI와 Supabase Callback URL이 정확히 일치하는지 확인
- URI 끝에 슬래시(`/`) 없는지 확인

### "Invalid client" 오류
- Supabase에 입력한 Client ID와 Secret이 정확한지 확인
- Google Cloud Console에서 OAuth 동의 화면이 완료되었는지 확인

### 로그인 후 리다이렉트 안 됨
- `app/auth/callback/route.ts` 파일이 존재하는지 확인
- 브라우저 콘솔에서 에러 로그 확인

---

## 참고 자료

- [Supabase Google OAuth 공식 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
